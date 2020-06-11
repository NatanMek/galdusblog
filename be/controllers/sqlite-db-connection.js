"use strict";

const sqlite3 = require('sqlite3').verbose();

var dbConnection = undefined; 

const getDBConnection = () => {
  if (!dbConnection) {
    dbConnection = new sqlite3.Database('../db/dbblog.db',  sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the blog database.');
      }
    });
  };
  return dbConnection;
};

module.exports.getDBConnection = getDBConnection;