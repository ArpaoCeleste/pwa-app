const bodyParser = require("body-parser");
const express = require("express");
const Stadium = require("../data/stadium");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/Token");
const cookieParser = require("cookie-parser");

const StadiumRouter = () => {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(VerifyToken);

  router
    .route("/create-stadium")
    .post(Users.autorize([scopes.Admin]), function (req, res, next) {
      let body = req.body;

      Stadium.create(body)
        .then((stadium) => {
          res.status(201).send({ message: "Stadium created!", stadium });
        })
        .catch((err) => {
          console.log("Erro ao criar estádio:", err);
          if (err.code === 11000) {
            res.status(409).send({ error: "Stadium with this photo already exists!" });
          } else {
            res.status(500).send({ error: err.message || err });
          }
          next();
        });
    });

  router
    .route("/:stadiumId")
    .get(function (req, res, next) {
      console.log("get a stadium by id");
      let stadiumId = req.params.stadiumId;
      Stadium.find(stadiumId)
        .then((stadium) => {
          res.status(200);
          res.send(stadium);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a stadium by id");
      let stadiumId = req.params.stadiumId;
      let body = req.body;

      Stadium.update(stadiumId, body)
        .then((player) => {
          res.status(200);
          res.send(player);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  return router;
};

module.exports = StadiumRouter;
