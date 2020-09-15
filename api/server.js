const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const bcryptjs = require("bcryptjs");
const session = require("express-session");

const KnexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require("../users/auth-router.js");

const dbConnection = require("../database/connection");
const connection = require("../database/connection");

const server = express();

const sessionConfig = {
  name: "cookie",
  secret: process.env.SESSION_SECRET || "its a secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true,
  },
  store: new KnexSessionStore({
    knex: connection,
    tablename: "sessions",
    sidfieldname: "sid",
    cleanInterval: 1000 * 60 * 60,
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));

server.use("api/users", protected, userRouter);
server.use("api/auth", authRouter);

server.get("/", (req, res) => {
  const password = req.headers.password;
  const rounds = process.env.BCRYPT_ROUNDS || 4;
  const hash = bcryptjs.hashSync(password, rounds);
  res.json({ api: "up", password, hash });
});

function protected(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.status(401).json({ you: "cannont pass" });
  }
}

module.exports = server;
