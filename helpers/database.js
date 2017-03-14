'use  strict';

var database = {};
var mysql = require('mysql');
var request = require('request');
var logger = require('../config/loggers').logger;
var vaultCredAddr = process.env.VAULT_CRED_ADDR;
var vaultLeaseAddr = process.env.VAULT_LEASE_ADDR;
var preLease = process.env.VAULT_PRE_LEASE;
var token = process.env.VAULT_TOKEN;
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

      connectionInfo.user = creds.data.username;
      connectionInfo.password = creds.data.password;

      if (pool) {
        pool.end();
      }

      pool = mysql.createPool(connectionInfo);
      logger.info('using db user: ' + creds.data.username + "with lease: " + creds.lease_id);
      logger.info('can renew credentials: ' + creds.renewable);
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

  logger.info('renewing lease');

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
      logger.info('renewed creds. can renew again:' + newCreds.renewable);
      logger.info('new lease time: ' + newCreds.lease_duration);
      renewOrRefresh(newCreds);
    }

  });
}

function renewOrRefresh(creds) {

  var timeout = 1000 * (creds.lease_duration - preLease);

  if (creds.renewable) {
    setTimeout(renewLease, timeout, creds);
  } else {
    setTimeout(createPool, timeout);
  }
}

function getConnection(cb) {
  pool.getConnection(cb);
};

createPool();
database.getConnection = getConnection;

module.exports = database;