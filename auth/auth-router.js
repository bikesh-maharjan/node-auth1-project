const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  const userInfo = req.body;
  const isValid = validateUser(userInfo);

  if (isValid) {
    // hash the password before saving the user to the database
    const rounds = process.env.BCRYPT_ROUNDS || 4;
    const hash = bcryptjs.hashSync(userInfo.password, rounds);
    userInfo.password = hash; // overriding the infor with hash

    Users.add(userInfo)
      .then((inserted) => {
        res.status(201).json({ data: inserted });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "Invalid information, plese verify and try again",
    });
  }
});

router.post("/login", (req, res) => {
  const creds = req.body;
  const isValid = validateCredentials(creds);

  if (isValid) {
    Users.getBy({ username: creds.username }) //returns back an array
      .then(([user]) => {
        if (user && bcryptjs.compareSync(creds.password, user.password)) {
          req.session.username = user.username;
          req.session.role = user.role;
          //   req.session.isLoggedIn = true;
          res.status(200).json({ message: `welcome${creds.username}` });
        } else {
          // no users by that username
          res.status(401).json({ message: "you cannont pass" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "Invalid information, plese verify and try again",
    });
  }
});

function validateUser(user) {
  // has username, password and role
  return user.username && user.password && user.role ? true : false;
}

function validateCredentials(creds) {
  // has username, password and role
  return creds.username && creds.password ? true : false;
}

module.exports = router;
