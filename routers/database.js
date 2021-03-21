const Router = require("express-promise-router");
var router = new Router();
var fs = require("fs");

const { pool: pool } = require("../database/db");
const { databaseConfig } = require("../config");
const { execute } = require("@getvim/execute");
const firebase = require("../firebase/firebaseSync");
const dotenv = require("dotenv");
dotenv.config();
const host = databaseConfig.Host;
const username = databaseConfig.User;
const database = databaseConfig.Database;
const password = databaseConfig.Password;
const fileName = `./database/database-backup.tar`;

router.get("/exportBackup", async (req, res) => {
  console.log("Waiting for dumping...");
  execute(
    `export PGPASSWORD=\'${password}\'; pg_dump -h ${host} -U ${username} -d ${database} -f ${fileName} -F t`
  )
    .then(async () => {
      console.log("Dumped");
    })
    .catch((err) => {
      console.log(err);
    });
  res.sendStatus(200);
});

router.get("/importBackup", async (req, res) => {
  console.log("Waiting for retoring...");
  execute(
    `export PGPASSWORD=\'${password}\'; pg_restore --data-only -h ${host} -U ${username} -d ${database} ${fileName}`
  )
    .then(async () => {
      console.log("Restored");
    })
    .catch((err) => {
      console.log(err);
    });
  res.sendStatus(200);
});

router.get("/importSample", async (req, res) => {
  console.log("Waiting for importing...");
  var sql = fs.readFileSync("./database/sample.sql").toString();
  await pool
    .query(sql)
    .then(async () => {
      console.log("Imported");
    })
    .catch((err) => {
      console.log(err);
    });
  firebase.syncAllLocations();

  res.sendStatus(200);
});

router.get("/deleteAll", async (req, res) => {
  console.log("Waiting for deleting...");
  var sql = fs.readFileSync("./database/delete.sql").toString();
  await pool
    .query(sql)
    .then(async () => {
      console.log("Deleted");
    })
    .catch((err) => {
      console.log(err);
    });
  firebase.deleteAll();
  res.sendStatus(200);
});

router.get("/recreateTable", async (req, res) => {
  console.log("Waiting for creating...");
  var sql = fs.readFileSync("./database/database.sql").toString();
  await pool
    .query(sql)
    .then(async () => {
      console.log("Created");
    })
    .catch((err) => {
      console.log(err);
    });
  res.sendStatus(200);
});

module.exports = router;
