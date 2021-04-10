/* -------------------------------------------------------------------------- */
/*                                   set up                                   */
/* -------------------------------------------------------------------------- */

var admin = require("firebase-admin");
const { pool: pool } = require("../database/db");
var serviceAccount = require("../firebaseServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci310-1387c-default-rtdb.firebaseio.com",
});
const realTimeDb = admin.database();
/* -------------------------------------------------------------------------- */
/*                                   methods                                  */
/* -------------------------------------------------------------------------- */

/*
userInfo = {
  id: "1223",
  usc_id: "123456788",
  first_name: "Nate",
  last_name: "Huang",
  full_name: "Nate Huang",
  major: "computer",
  email: "huan773@usc.edu",
  picture: "google.com/image",
  is_admin: 1,
  is_deleted: 0,
};
*/
const userCheckin = (buildingId, userId, userInfo) => {
  const ref = realTimeDb.ref(`buildings/${buildingId}/checkin`);
  ref.child("user" + userId).set(userInfo);
};

const userCheckout = (buildingId, userId) => {
  const ref = realTimeDb.ref(`buildings/${buildingId}/checkin`);
  ref.child("user" + userId).remove();
};

const updateMaximumCapacity = (buildingId, maximumCapacity) => {
  const ref = realTimeDb.ref(`buildings/${buildingId}/capacity`);
  ref.set(maximumCapacity);
};

const updateCurrentNumbers = (buildingId) => {
  const ref = realTimeDb.ref(`buildings/${buildingId}/current_numbers`);
  ref.set(ref + 1);
};

const deleteAll = () => {
  const ref = realTimeDb.ref(`buildings`);
  ref.remove();
};

const syncAllLocations = async () => {
  // console.log("syncAllLocations in firebase.");
  await pool
    .query("select * from place")
    .then(async (res) => {
      res.rows.forEach((location) => {
        updateMaximumCapacity(location.id, location.capacity);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const syncAllCheckins = async () => {
  await pool
    .query("select * from visit_history where leave_time is null")
    .then(async (res) => {
      res.rows.forEach(async (record) => {
        let command = "select * from account where id = " + record.account_id;
        await pool
          .query(command)
          .then(async (res) => {
            res.rows.forEach(async (userInfo) => {
              userCheckin(record.place_id, record.account_id, userInfo);
            });
          });
      });
      res.rows.forEach(async (record) => {
        let command = "select * from place where id = " + record.place_id;
        await pool
          .query(command)
          .then(async (res) => {
            res.rows.forEach(async (userInfo) => {
              updateCurrentNumbers(record.place_id);
            });
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  userCheckin,
  userCheckout,
  updateMaximumCapacity,
  deleteAll,
  syncAllLocations,
  syncAllCheckins,
};

/* -------------------------------------------------------------------------- */
/*                                    usage                                   */
/* -------------------------------------------------------------------------- */
