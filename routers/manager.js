const Router = require('express-promise-router')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
var router = new Router();
var fs = require('fs');
var csv = require('fast-csv');

// connect to database
const {pool: pool} = require('../database/db');
var firebase = require("../firebase/firebaseSync.js");

// check testing_files/testing.csv for format
router.get('/', function(req, res) {
  res.send("Manager endpoint page. This is used to serve all APIs related to manager clients (upload CSV, view / edit history, etc.).");
});

// TODO, csv form
router.post('/process-csv', upload.single('place-csv'), function(req, res, next) {
  if(!req.is('multipart/form-data')) {
    res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
    return;
  }
  // if(!req.session.userid) {
  //   res.status(400).send("The client is not logged in.");
  //   return;
  // }
  // console.log(req.file, req.body);
  var dataRows = [];
  var nameRows = [];
  var first = true;
  csv.fromPath(req.file.path)
  .on('error', error => {
    res.status(422).send("The file you send is not processible.")
  })
  .on("data", function (data) {
    // console.log(data);
    if(first){
      first = false;
      nameRows.push(data);
    }else{
      dataRows.push(data); // push each row
    }
  })
  .on("end", async function () {
  fs.unlinkSync(req.file.path);   // remove temp file
    try {
      console.log('Upload CSV');
      var promises = []

      for(let i = 0; i < dataRows.length; i++){
        // let sql_str = "INSERT INTO place (id, place_name, abbreviation, place_address, picture, capacity, open_time, close_time) VALUES (DEFAULT, '"
        // + dataRows[i][0]+ "', '" + dataRows[i][1]+ "', '" + dataRows[i][2]+ "', '" + dataRows[i][3]+ "', " + dataRows[i][4]+ ", '" + dataRows[i][5]+ "','" + dataRows[i][6]+ "');";
        // let sql_str = `INSERT INTO place (place_name, abbreviation, place_address, picture, capacity, open_time, close_time) VALUES  ('${dataRows[i][0]}', '${dataRows[i][1]}', '${dataRows[i][2]}', '${dataRows[i][3]}', ${dataRows[i][4]}, '${dataRows[i][5]}', '${dataRows[i][6]}')`
        // sql_str += `on CONFLICT (place_name) DO NOTHING;`
        let sql_str = 'UPDATE place SET capacity=' + dataRows[i][4] + " where place_name='" + dataRows[i][0] + "' and current_numbers <=" + dataRows[i][4] + " RETURNING place.capacity;"
        console.log(sql_str);
        // pool.query(sql_str, (err, val) => {
        //   if (err) throw err;
        // });
        const promise = await pool.query(sql_str);
        promises.push(promise);
      }
      Promise.all(promises).then( () =>{
        let update_all_succeed = true
        var message = ""
        for(let i = 0; i < promises.length; ++i){
          if(promises[i].rowCount == 0){
            update_all_succeed = false;
            message += "Building " + dataRows[i][0] + " cannot be updated;\n"
          }
        }
        if(update_all_succeed){
          res.sendStatus(200);
        }else{
          res.status(400).send(message);
        }
        firebase.syncAllLocations();
      });
     } catch (err) {
      // console.log(err);
      res.status(400).send("Cannot insert");
      return;
    }
    // res.sendStatus(200);
    // return;
  });

});

// inputs place_name, abbreviation, place_address, picture, capacity, open_time, close_time
// return placeId
router.post('/add-place', upload.none(), function(req, res) {
  if(!req.is('multipart/form-data')) {
    res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
    return;
  }
  if(!req.session.userid) {
      res.status(400).send("The client is not logged in.");
      return;
  }

  let place_name = req.body.place_name;
  let abbreviation = req.body.abbreviation;
  let place_address = req.body.place_address;
  let picture = req.body.picture;
  let capacity = req.body.capacity;
  let open_time = req.body.open_time;
  let close_time = req.body.close_time;


  if(place_name === undefined ||
    abbreviation === undefined ||
    place_address === undefined ||
    picture === undefined ||
    capacity === undefined ||
    open_time === undefined ||
    close_time === undefined){
      res.status(400).send("Missing form data.");
      return;
  }
  // TODO create a row in sql.
  let sql_str = "INSERT INTO place (id, place_name, abbreviation, place_address, picture, capacity, current_numbers, open_time, close_time) VALUES (DEFAULT, '" + place_name + "', '" + abbreviation + "','" + place_address + "','" + picture + "'," + capacity + ", 0 ,'" + open_time + "','" + close_time + "') ON CONFLICT (place_name) DO NOTHING RETURNING id;";
  //let sql_str = "INSERT INTO place (id, place_name) VALUES (DEFAULT, 'asdf');";
  //let sql_str = "INSERT INTO place (id, place_name, abbreviation, place_address, picture, capacity, current_numbers) VALUES (DEFAULT, 'Julie place' ,'JP','Mars', 'some_url',30, 0 ) RETURNING id;";
  try {
    console.log('Adding place');
    pool.query(sql_str, (err, val) => {
      if (err) throw err;
      console.log(JSON.stringify(val.rows));
      res.status(200).json(val.rows);
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send("cannot insert");
    return;
  }
});

// inputs: placeId
router.post('/remove-place',  upload.none(), function(req, res) {
  if(!req.is('multipart/form-data')) {
    res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
    return;
  }
  if(!req.session.userid) {
      res.status(400).send("The client is not logged in.");
      return;
  }

  let placeId = req.body.placeId;
  if(placeId === undefined){
    res.status(400).send("Missing form data.");
    return;
  }

  try {
    console.log('Remove place');
    pool.query('DELETE from place where id=' + placeId + ';', (err, val) => {
      if (err) throw err;
    });
    res.sendStatus(200);
    return;
  } catch (err) {
    res.status(400).send("Failed to remove");
    return;
  }
});


// inputs: placeId, capacity
// return: 200 or 400 with error message
router.post('/update-capacity', upload.none(), async function(req, res) {
if(!req.is('multipart/form-data')) {
  res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
  return;
}
if(!req.session.userid) {
  res.status(400).send("The client is not logged in.");
  return;
}

let placeId = req.body.placeId;
let capacity = req.body.capacity;

if(placeId === undefined ||
  capacity === undefined) {
    res.status(404).send("Missing form data.");
    return;
  }

  try {
    console.log('Update place');
    pool.query('UPDATE place SET capacity=' + capacity + 'where id=' + placeId + ' and current_numbers <=' + capacity + 'RETURNING place.capacity;', (err, val) => {
      if (err) throw err;
      // TODO firebase
      let updated_capacity = val.rows.length;
      if(updated_capacity !== 0){
        firebase.updateMaximumCapacity(placeId, capacity);
        res.send("Capacity Updated.");
      }else{
        pool.query('SELECT place_name FROM place where id=' + placeId + ";", (err, val) => {
          if (err) throw err;
          var message = "Building " + val.rows[0]['place_name'] + " cannot be updated;\n"
          res.status(400).send(message)
        });
      }
    });
    return;
  } catch (err) {
    var message = "Cannot perform update at this time;\n"
    res.status(400).send(message);
    return;
  }
});

// return: string
router.post('/get-qr-code', upload.none(), function(req, res) {
  if(!req.is('multipart/form-data')) {
    res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
    return;
  }
  if(!req.session.userid) {
    res.status(400).send("The client is not logged in.");
    return;
  }

  let placeId = req.body.placeId;
  if(placeId === undefined) {
    res.status(400).send("Missing form data.");
    return;
  }

  try {
    console.log('Get QR Code');
    pool.query('Select qr_code_token from place where id=' + placeId + ';', (err, val) => {
      if (err) throw err;
      res.send(val);
      return;
    });
  } catch (err) {
    res.status(400).send("Cannot get QR Code for this building");
    return;
  }

});


// TODO
// inputs: at least one from placeId, studentId, enter_time, leave_time, major
// return: json
router.post('/search-visit-history', upload.none(), function(req, res) {
// if(!req.is('multipart/form-data')) {
//   res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
//   return;
// }
// if(!req.session.userid) {
//   res.status(400).send("The client is not logged in.");
//   return;
// }

let buildingName = req.body.buildingName;
let studentId = req.body.studentId;
let timeStamp = req.body.timeStamp;
let major = req.body.major;
let username = req.body.username;
let enter_time = req.body.enter_time;
let leave_time = req.body.leave_time;

let msg = 'Select *, visit_history.id as history_id from account, visit_history, place where account.id=visit_history.account_id AND visit_history.place_id=place.id';
  if(buildingName !== undefined){
    msg += " AND place.place_name ilike '%" +  buildingName + "%'";
  }
  if (studentId !== undefined){
    msg += " AND account.usc_id='" +  studentId + "'";
  }
  if(major !== undefined){
    msg += " AND account.major ilike '%" +  major + "%'"
  }
  if(username !== undefined){
    msg += " AND account.username ilike '%" +  username + "%'"
  }
  if(enter_time !== undefined){
    msg += " AND visit_history.enter_time>='" +  enter_time  + "'";
  }
  if(leave_time !== undefined){
    msg += " AND (visit_history.leave_time<='" +  leave_time + "' or visit_history.leave_time IS NULL)";
  }

  if(username === undefined && buildingName === undefined && studentId === undefined && enter_time === undefined && leave_time === undefined && major === undefined){
    res.status(400).send("Missing form data.");
    return;
  }

  // TODO: preprocess timeStamp
  msg += " ORDER BY last_name"
  msg += ";"

  try {
    console.log('Building Listings');

    pool.query(msg, (err, val) => {
      if (err) throw err;
      res.send(val.rows);
      return;
    });
  } catch (err) {
    res.status(400).send("Cannot get QR Code for this building");
    return;
  }


});

// return: json
router.post('/list-all-buildings', function(req, res) {
  // if(!req.is('multipart/form-data')) {
  //   res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
  //   return;
  // }
  // if(!req.session.userid) {
  //   res.status(400).send("The client is not logged in.");
  //   return;
  // }
  //
  try {
    console.log('Building Listings');
    pool.query('Select * from place;', (err, val) => {
      if (err) throw err;
      res.send(val.rows);
      return;
    });
  } catch (err) {
    res.status(400).send("Get Building List Failed");
    return;
  }

});

// inputs: placeId
// return: json
router.post('/list-current-students', upload.none(), function(req, res) {
  if(!req.is('multipart/form-data')) {
    res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
    return;
  }
  if(!req.session.userid) {
    res.status(400).send("The client is not logged in.");
    return;
  }

  let placeId = req.body.placeId;
  if(placeId === undefined){
    res.status(400).send("Missing placeId.");
    return;
  }

  try {
    console.log('Listing all the students in this place');
    pool.query('Select * from account, visit_history, place where account.id=visit_history.account_id AND leave_time IS NULL AND place.id = ' +  placeId + ' AND visit_history.place_id=' +  placeId +' ;', (err, val) => {
      if (err) throw err;
      res.send(val.rows);
      return;
    });
  } catch (err) {
    res.status(400).send("Get Students List for a place Failed");
    return;
  }

});


// inputs: studentId
// return: 200 or 400 with error message
router.post('/view-profile', upload.none(),function(req, res) {
  if(!req.is('multipart/form-data')) {
    res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
    return;
  }
  if(!req.session.userid) {
    res.status(400).send("The client is not logged in.");
    return;
  }

  let studentId = req.body.studentId;

  if(studentId === undefined) {
    res.status(400).send("Missing studentId.");
    return;
  }

  try {
    console.log('Listing all the students in this place');
    pool.query('Select * from account, visit_history, place where account.id=visit_history.account_id AND account_id= ' + studentId + ' AND visit_history.place_id=place.id;', (err, val) => {
      if (err) throw err;
      res.send(val.rows);
      return;
    });
  } catch (err) {
    res.status(400).send("Get Stuednt Profile Failed");
    return;
  }
});

module.exports = router;
