const db = require("../database/connection.js");

module.exports = {
  get,
  add,
  getBy,
};

function get() {
  return db("users");
}

function add(filter) {
  return db("users").insert(user);
}

function getBy(user) {
  return db("users").where(filter).orderBy("id");
}
