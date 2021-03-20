/* -------------------------------------------------------------------------- */
/*                                   set up                                   */
/* -------------------------------------------------------------------------- */

var admin = require("firebase-admin");
var serviceAccount = require("../firebaseServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci310-1387c-default-rtdb.firebaseio.com",
});
const realTimeDb = admin.database();
/* -------------------------------------------------------------------------- */
/*                                   methods                                  */
/* -------------------------------------------------------------------------- */

const userCheckin = (buildingId, userId) => {
  const ref = realTimeDb.ref(`buildings/${buildingId}/checkin`);
  ref.child(userId).set("true");
};

const userCheckout = (buildingId, userId) => {
  const ref = realTimeDb.ref(`buildings/${buildingId}/checkin`);
  ref.child(userId).remove();
};

const updateMaximumCapacity = (buildingId, maximumCapacity) => {
    const ref = realTimeDb.ref(`buildings/${buildingId}/capacity`);
    ref.set(maximumCapacity);
}

module.exports = { userCheckin, userCheckout, updateMaximumCapacity };

/* -------------------------------------------------------------------------- */
/*                                    usage                                   */
/* -------------------------------------------------------------------------- */

