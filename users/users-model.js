const db = require("../database/connection.js");

module.exports = {
  find,
  add,
  getBy,
};

function find() {
  return db("users");
}

function add(filter) {
  return db("users").insert(user);
}

function getBy(user) {
  return db("users").where(filter).orderBy("id");
}
