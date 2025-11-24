const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const cookieParser = require('cookie-parser');
const VerifyToken = require('../middleware/Token');

function AuthRouter() {
  let router = express.Router(); // Use Router, não express()
  router.use(require('cookie-parser')());
  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/register").post(function (req, res, next) {
    const body = req.body;
    const { role } = body;

    if (!role || !Array.isArray(role.scope) || role.scope.length === 0) {
      return res.status(400).send({ auth: false, message: 'Invalid role or scope' });
    }

    //Authorize - Bearer fjbdfbdsjkfndskf
    //credentials: include
    Users.create(body)
      .then((result) => {
        const userObj = result.user.toObject();
        return Users.createToken(userObj);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(500).send(err);
        next();
      });
  });

  router.route("/login").post(function (req, res, next) {
    let body = req.body;

    return Users.findUser(body)
      .then((user) => {
        return Users.createToken(user);
      })
      .then((response) => {
        // The httpOnly: true setting means that the cookie can’t be read using JavaScript but can still be sent back to the server in HTTP requests
        res.cookie("token", response.token, {
          httpOnly: false,
          secure: false,              // em dev local HTTP
          sameSite: "lax",            // permite envio cross-origin para localhost:5173
          path: "/",                  // cookie disponível em todas as rotas
        });
        res.status(200);
        res.send(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send(err);
      });
  });

  router.use(cookieParser());
  router.use(VerifyToken);

  router.route("/logout").get(function (req, res, next) {
    res.cookie("token", req.cookies.token, { httpOnly: true, maxAge: 0 });
    res.status(200);
    res.send({ logout: true });
    next();
  });

  router.route("/me").get(function (req, res, next) {
    try {
      res.status(202).send({ auth: true, decoded: req.roleUser });
    } catch (err) {
      res.status(500).send(err);
      next();
    }
  });

  return router;
}

module.exports = AuthRouter;