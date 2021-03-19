const databaseConfig = {
  User: "qzhoeaprdhimqj",
  Password: "ef509df4a24b0be61494df191a7f5f6a28c52ece734233ae9b0f06c15e48c8fa",
  Database: "d6q2hcpo4sua12",
  Host: "ec2-3-222-127-167.compute-1.amazonaws.com",
  Port: 5432,
  URI:
    "postgres://qzhoeaprdhimqj:ef509df4a24b0be61494df191a7f5f6a28c52ece734233ae9b0f06c15e48c8fa@ec2-3-222-127-167.compute-1.amazonaws.com:5432/d6q2hcpo4sua12?ssl=true",
  Heroku_CLI:
    "heroku pg:psql postgresql-animated-67845 --app trojan-check-in-out-api",
};

const firebaseConfig = {
  apiKey: "AIzaSyAm-rbrRrhrSg9A74lnUXGKaaofy55zBqQ",
  authDomain: "csci310-1387c.firebaseapp.com",
  databaseURL: "https://csci310-1387c-default-rtdb.firebaseio.com",
  projectId: "csci310-1387c",
  storageBucket: "csci310-1387c.appspot.com",
  messagingSenderId: "940522807022",
  appId: "1:940522807022:web:44989ac76e90b93218ddff",
  measurementId: "G-L99D8T2967",
};

module.exports = { databaseConfig, firebaseConfig };
