'use  strict';

var database = {};
var mysql = require('mysql');
var request = require('request');
var logger = require('../config/loggers').logger;
var vaultCredAddr = process.env.VAULT_CRED_ADDR;
var vaultLeaseAddr = process.env.VAULT_LEASE_ADDR;
var lease = process.env.VAULT_LEASE;
var padding = process.env.VAULT_LEASE_PADDING;
var token = process.env.VAULT_TOKEN;
var renewals;
var pool;
var connectionInfo = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
};

function createPool() {

  getCreds(function (creds, error) {

    if (error) {

      logger.error(error);

    } else {

      renewals = 0;
      connectionInfo.user = creds.data.username;
      connectionInfo.password = creds.data.password;

      if (pool) {
        pool.end();
      }

      pool = mysql.createPool(connectionInfo);
      logger.info('using db user: ' + creds.data.username + " with lease: " + creds.lease_id);
      renewOrRefresh(creds);
    }
  });
}

function getCreds(cb) {

  logger.info('fetching credentials');

  var options = {
    url: vaultCredAddr,
    headers: {
      'X-Vault-Token': token
    }
  };

  request(options, function (error, response, body) {

    if (error || response.statusCode != 200) {

      cb(null, error);

    } else {

      cb(JSON.parse(body));
    }

  });
}

function renewLease(creds) {

    var options = {
    method: 'PUT',
    url: vaultLeaseAddr + creds.lease_id,
    headers: {
      'X-Vault-Token': token
    }
  };

  request(options, function (error, response, body) {

    if (error || response.statusCode != 200) {

      //todo: handle error

    } else {
      var newCreds = JSON.parse(body);
      renewals++;
      logger.info('renewed lease. count: ' + renewals + ' .new lease time: ' + newCreds.lease_duration);
      renewOrRefresh(newCreds);
    }

  });
}

function renewOrRefresh(creds) {

  if (creds.lease_duration >= parseInt(lease) + parseInt(padding)) {
    setTimeout(renewLease, 1000 * lease, creds);
  } else {
    logger.info('available lease time is not long enough (' + creds.lease_duration + 's)- getting new creds');
    createPool();
  }
}

function getConnection(cb) {
  pool.getConnection(cb);
};

createPool();
database.getConnection = getConnection;

module.exports = database;