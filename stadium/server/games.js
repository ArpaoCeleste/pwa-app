const bodyParser = require("body-parser");
const express = require("express");
const Games = require("../data/games");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/Token");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const GamesRouter = (io) => {
  let router = express.Router();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  router.use(cookieParser());
  router.use(VerifyToken);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  });

  const upload = multer({ storage });

  router
    .route("/create-games")
    .post(Users.autorize([scopes.Admin]), upload.single("image"), function (req, res, next) {
      let body = req.body;

      body.team = {
        visitor: body.visitor,
        home: body.home,
      };
      delete body.visitor;
      delete body.home;

      if (req.file) {
        body.image = req.file.filename;

      }

      Games.create(body)
        .then((game) => {
          console.log("Created!");
          io.sockets.emit('admin_notifications', {
            message: 'add new game',
            key: 'Game'
          });
          res.status(200).send(game); // tudo numa linha
        })
        .catch((err) => {
          console.log("Game already exists!");
          console.log(err);
          res.status(401).send({ message: "Erro ao criar jogo", error: err });
        });

    })


  router
    .route("/all-games")
    .get(
      function (req, res, next) {

        const pageLimit = req.query.limit ? parseInt(req.query.limit) : 5;
        const pageSkip = req.query.skip
          ? pageLimit * parseInt(req.query.skip)
          : 0;

        req.pagination = {
          limit: pageLimit,
          skip: pageSkip,
        };

        Games.findAll(req.pagination)
          .then((games) => {
            const response = {
              auth: true,
              games: games.data,
            };
            res.send(response);
            next();
          })
          .catch((err) => {
            console.log(err.message);
            res.status(500).send({ auth: false, message: err.message });
          });

      }
    );

  router
    .route("/:gamesId")
    .get(function (req, res, next) {
      console.log("get a game by id");
      let gamesId = req.params.gamesId;
      Games.findById(gamesId)
        .then((game) => {
          res.status(200);
          res.send(game);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(VerifyToken, Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a stadium by id");
      let gamesId = req.params.gamesId;
      let body = req.body;

      Games.update(gamesId, body)
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

module.exports = GamesRouter;
