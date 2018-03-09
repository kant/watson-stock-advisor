/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const Cloudant = require('cloudant');
const utils = require('./utils.js');
const config = require('../../config.js');

const cloudant = Cloudant({
  account  : config.CLOUDANT.account,
  key      : config.CLOUDANT.key,
  password : config.CLOUDANT.password
});
const db = cloudant.db.use(config.CLOUDANT.db_name);

/**
 * Searches for docs with the given value for the given key
 * @param {*} key
 * @param {*} value
 */
function getBy(key, value) {
  return new Promise((resolve, reject) => {
    var selector = {};
    selector[key] = value;
    db.find({selector: selector}, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

class DB {

  /**
   * Retrieves all data in the cloudant DB
   * @returns {promise} - A promise representing the query to the DB
   */
  search() {
    return new Promise((resolve, reject) => {
      db.list({ include_docs: true }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  /**
   * Inserts (or updates, if exists) the doc into the DB
   * @returns {promise} - A promise representing the query to the DB
   */
  insertOrUpdate(doc) {
    console.log('updating: ', doc);
    return new Promise((resolve, reject) => {
      db.insert(doc, function(err, body, header) {
        if (err) {
          console.log('insertion failed: ' + err.message);
          reject(err);
        } else {
          resolve(body, header);
        }
      });
    });
  }

  /**
   * Deletes the doc from the DB
   * @returns {promise} - A promise representing the query to the DB
   */
  delete(doc) {
    console.log('deleting: ', doc);
    return new Promise((resolve, reject) => {
      db.destroy(doc._id, doc._rev, function(err, data) {
        if (err) {
          console.log('deletion failed: ' + err.message);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Finds the entry with a company of the given name
   * @param {string} name
   */
  getByCompanyName(name) {
    return getBy('company', name);
  }
}

module.exports = new DB();
