'use  strict';

var database = {};
var mysql = require('mysql');
var connectionInfo = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

var pool = mysql.createPool(connectionInfo);
 
function getConnection(cb) {
    pool.getConnection(cb);
};

database.getConnection = getConnection;

module.exports = database;