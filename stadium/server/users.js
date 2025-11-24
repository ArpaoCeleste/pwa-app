const bodyParser = require("body-parser");
const express = require("express");
const Members = require("../data/member");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/Token");
const cookieParser = require("cookie-parser");
const User = require("../data/users/users");

const UsersRouter = (io) => {
  let router = express.Router();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  router.use(cookieParser());
  router.use(VerifyToken);

  router
    .route("/all-users")
    .get(function (req, res, next) {
      const pageLimit = req.query.limit ? parseInt(req.query.limit) : 5;
      const pageSkip = req.query.skip ? pageLimit * parseInt(req.query.skip) : 0;
      req.pagination = {
        limit: pageLimit,
        skip: pageSkip,
      };

      Users.findAll(req.pagination)
        .then((users) => {
          const response = {
            auth: true,
            users: users.data,
            pagination: {
              pageSize: pageLimit,
              total: users.length,
            },
          };
          res.send(response);
          next();
        })
        .catch((err) => {
          console.log(err.message);
          next();
        });
    })

  router
    .route("/create-user")
    .post(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("Create user");
      let body = req.body;
      let { role } = body;

      console.log(role);

      // ...existing code...
      if (!role || !role.scope) {
        return res.status(400).send({ error: "Missing 'role' or 'role.scope' in request body" });
      }

      // Remove or modify this check to allow admins and other roles
      // Example: allow admin and nonMember
      if (!role.scope.includes(scopes.Admin) && !role.scope.includes(scopes.NonMember)) {
        return res.status(401).send({ auth: false, message: 'Only create Admin or NonMembers' });
      }

      Users.create(body)
        .then((user) => {
          io.sockets.emit('admin_notifications', {
            message: 'add new user',
            key: 'User'
          });
          console.log("Created!");
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  router
    .route("/perfil")
    .get(
      Users.autorize([scopes.NonMember, scopes.Member]),
      function (req, res, next) {
        console.log("get the perfil of user");
        let userId = req.userId;
        Users.findUserById(userId)
          .then((user) => {
            res.status(200).send({ data: user });
            next();
          })
          .catch((err) => {
            console.log('Perfil', err);
            res.status(500);
            next();
          });
      });

  router
    .route("/:userId")
    .put(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a member by id");
      let userId = req.params.userId;
      let body = req.body;

      Users.update(userId, body)
        .then((user) => {
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          console.log('Perfil', err);
          res.status(404).send({ error: err.toString() });
        });
    });

  router
    .route("/:userId/member")
    .post(Users.autorize([scopes.Admin]), function (req, res, next) {
      let body = req.body;
      let userId = req.params.userId;

      Members.create(body)
        .then((result) => {
          console.log(result)
          return Users.update(userId, { member: result.member._id });
        })
        .then((user) => {
          console.log("Created!");
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          console.log("Member already exists!");
          console.log(err);
          err.status = err.status || 500;
          res.status(401);
          next();
        });
    })

  router
    .route("/member")
    .get(
      Users.autorize([scopes.Admin, scopes.Member, scopes.NonMember]),
      function (req, res, next) {
        console.log("get all tickets");

        const pageLimit = req.query.limit ? parseInt(req.query.limit) : 5;
        const pageSkip = req.query.skip
          ? pageLimit * parseInt(req.query.skip)
          : 0;

        req.pagination = {
          limit: pageLimit,
          skip: pageSkip,
        };

        Members.findAll(req.pagination)
          .then((members) => {
            const response = {
              auth: true,
              members: members,
            };
            res.send(response);
            next();
          })
          .catch((err) => {
            console.log(err.message);
            next();
          });
      }
    );

  router
    .route("/member/:memberId")
    .put(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a member by id");
      let memberId = req.params.memberId;
      let body = req.body;

      Members.update(memberId, body)
        .then((member) => {
          res.status(200);
          res.send(member);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  router
    .route("/member/tax/:taxNumber")
    .get(
      Users.autorize([scopes.Admin, scopes.Member, scopes.NonMember]),
      (req, res, next) => {
        console.log("get the member by tax");

        let taxNumber = req.params.taxNumber;

        Members.findMemberByTaxNumber(taxNumber)
          .then((member) => {
            res.status(200).send(member);
            next();
          })
          .catch((err) => {
            console.log(err.message);
            res.status(404).send({ error: err.message });
            next(err);
          });
      }
    );


  return router;
};

module.exports = UsersRouter;
