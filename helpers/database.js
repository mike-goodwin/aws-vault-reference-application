'use  strict';

var database = {};
var mysql = require('mysql');
var request = require('request');
var logger = require('../config/loggers').logger;
var vaultCredAddr = process.env.VAULT_CRED_ADDR;
var vaultLeaseAddr = process.env.VAULT_LEASE_ADDR;
var preLease = process.env.VAULT_PRE_LEASE;
var token = process.env.VAULT_TOKEN;
var connectionPool;
var connectionInfo = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
};

function recyclePool() {

}

function refreshPool() {

}

function createPool() {

  getCreds(function (creds, error) {

    if (error) {

      logger.error(error);

    } else {

      connectionInfo.user = creds.data.username;
      connectionInfo.password = creds.data.password;
      pool = mysql.createPool(connectionInfo);

    }
  });
}

function getCreds(cb) {

  var options = {
    url: vaultCredAddr,
    headers: {
      'X-Vault-Token': token
    }
  };

  request(options, function (error, response, body) {

    if (error || response != 200) {

      cb(JSON.parse(body));

    } else {

      cb(null, error);
    }

  });
}

function renewLease() {

}

function getConnection(cb) {
  pool.getConnection(cb);
};

createPool();
database.getConnection = getConnection;

module.exports = database;