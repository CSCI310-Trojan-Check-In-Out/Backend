var express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
var router = express.Router();
var fs = require('fs');
var csv = require('fast-csv');

// connect to database
const {pool: pool} = require('../database/db');


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
    //     res.status(400).send("The client is not logged in.");
    //     return;
    // }
    console.log(req.file, req.body);
    var dataRows = [];
    var nameRows = [];
    var first = false;
    csv.fromPath(req.file.path)
      .on("data", function (data) {
        console.log(data);
        if(first){
          first = false;
          nameRows.push(data);
        }else{
          dataRows.push(data); // push each row
        }
      })
      .on("end", function () {
        fs.unlinkSync(req.file.path);   // remove temp file
      });

      try {
        console.log('Upload CSV');
        for(let i = 0; i < dataRows.length; i++){
          let sql_str = "INSERT INTO place (id, place_name, abbreviation, place_address, picture, capacity) VALUES (DEFAULT, '" + dataRows[0]+ "' ,'" + dataRows[1]+ "','" + dataRows[2]+ "', '" + dataRows[3]+ "'," + dataRows[4]+ ") RETURNING id;";

          pool.query('DELETE from place where id=' + placeId, (err, val) => {
            if (err) throw err;
          });
          console.log('Fetching ID');
          pool.query('SELECT LAST_INSERT_ID();', (err, val) => {
            if (err) throw err;
            console.log(JSON.stringify(val.rows));

          });
        }
        res.sendStatus(200);
        return;
      } catch (err) {
        res.status(400).send("Cannot insert");
        return;
      }

    res.send(req.body);
});

// TO test
// inputs place_name, abbreviation, place_address, picture, capacity, open_time, close_time
// return placeId
router.post('/add-place', upload.none(), function(req, res) {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }
    // if(!req.session.userid) {
    //     res.status(400).send("The client is not logged in.");
    //     return;
    // }
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
	var placeId = 0;
	// TODO create a row in sql.
  //let sql_str = "INSERT INTO place (id, place_name, abbreviation, place_address, picture, capacity, current_numbers, open_time, close_time) VALUES (DEFAULT, '" + place_name + "', '" + abbreviation + "','" + place_address + "','" + picture + "'," + capacity + ", 0 ,'" + open_time + "','" + close_time + "') RETURNING id;";
  //let sql_str = "INSERT INTO place (id, place_name) VALUES (DEFAULT, 'asdf');";
  let sql_str = "INSERT INTO place (id, place_name, abbreviation, place_address, picture, capacity, current_numbers) VALUES (DEFAULT, 'Julie place' ,'JP','Mars', 'some_url',30, 0 ) RETURNING id;";

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

//
router.post('/remove-place', function(req, res) {
    if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
        return;
    }
    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

	let placeId = req.body.placeId;
	if(placeID === undefined){
        res.status(400).send("Missing form data.");
        return;
	}

	// TODO remove it from sql
    try {
        console.log('Remove place');
        pool.query('DELETE from place where id=' + placeId, (err, val) => {
            if (err) throw err;
        });
        console.log('Fetching ID');
        pool.query('SELECT LAST_INSERT_ID();', (err, val) => {
            if (err) throw err;
            console.log(JSON.stringify(val.rows));
	    res.sendStatus(200);
        });
	return;
    } catch (err) {
       	res.status(400).send("Cannot insert");
        return;
     }
});


// inputs:userid, placeId, capacity
// return: 200 or 400 with error message
router.post('/update-capacity', function(req, res) {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }
    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

    let placeId = req.body.placeId;
    let capacity = reqbody.capacity;

    if(placeId === undefined ||
        capacity === undefined) {
        res.status(40).send("Missing form data.");
        return;
    }

	if(sql_status){
		res.sendStatus(200);
	}else{
		res.status(400).send("Failed to update.");
	}
});

// return: string
router.post('/get-qr-code', function(req, res) {
	if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
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
	// TODO: check if the placeId Exists

	// TODO: grep QR-code from database
	var qrCode;
	if(qrCode === undefined){
        res.status(400).send("Cannot get QR Code for this building");
        return;
	}else{
		res.send(qrCode);
	}

});


// TODO
// inputs: at least one from placeId, studentId, timeStamp, major
// return: json
router.post('/search-visit-history', function(req, res) {
    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

    if(placeId === undefined &&
		studentId === undefined &&
		timeStamp === undefined &&
		major === undefined){
        res.status(400).send("Missing form data.");
        return;
    }
	// TODO: preprocess timeStamp


	var searchResult = "TODO: Place Holder... Replaced by Json";
	// TODO searchResult from sql

	if(searchResult === undefined){
        res.send("Result Not Found");
        return;
	}else{
		res.send(searchResult);
	}

});

// return: json
router.post('/list-all-buildings', function(req, res) {
	if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
        return;
    }
    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }


	var allBuildingList = "TODO: Building List... Replaced by Json";
	// TODO searchResult from sql

	if(allBuildingList === undefined){
        res.send("No Building.");
        return;
	}else{
		res.send(allBuildingList);
	}

});

// inputs: placeId
// return: json
router.post('/list-current-students', function(req, res) {
	if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
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

    var studentList = "TODO: Student List... Replaced by Json";
	// TODO studentList from sql

    try {
        console.log('Remove place');
        pool.query('DELETE from place where id=' + placeId, (err, val) => {
            if (err) throw err;
        });
        console.log('Fetching ID');
        pool.query('SELECT LAST_INSERT_ID();', (err, val) => {
            if (err) throw err;
            console.log(JSON.stringify(val.rows));
	    res.sendStatus(200);
        });
	return;
    } catch (err) {
       	res.status(400).send("Cannot insert");
        return;
     }
	if(studentList === undefined){
        res.send("No Students.");
        return;
	}else{
		res.send(studentList);
	}
});


// inputs: studentId
// return: 200 or 400 with error message
router.post('/view-profile', function(req, res) {
	if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
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

	let sql_status = true;// TODO: get students profile from db, and their visit history.
	if(sql_status){
		res.send("TODO: Send back json");
	}else{
		res.status(400).send("Failed to load student profile.");
	}
});

module.exports = router;
