const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function UserService(UserModel) {
  let service = {
    create,
    createToken,
    verifyToken,
    findUser,
    autorize,
    update,
    findAll,
    findUserById
  };

  function create(user) {
    return createPassword(user).then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Not saved the user");
      }

      let newUserWithPassword = {
        ...user,
        password: hashPassword,
      };

      let newUser = UserModel(newUserWithPassword);
      return save(newUser);
    });
  }

  function createToken(user) {
    let token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role && user.role.scope ? user.role.scope : []
      },
      config.secret,
      { expiresIn: config.expiresPassword }
    );
    return { auth: true, token };
  }


  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject();
        }
        return resolve(decoded);
      });
    });
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      console.log('Tentando salvar o modelo...');

      model.save(function (err) {
        if (err) {
          console.log('Erro ao salvar:', err);
          reject("There is a problema with register");
        }
        console.log('Usuário salvo com sucesso');
        resolve({
          message: 'User saved',
          user: model,
        });
      });
    });
  }


  function update(id, user) {
    console.log('user', user);
    return new Promise(function (resolve, reject) {
      console.log('user', user);
      UserModel.findByIdAndUpdate(id, user, function (err, userUpdated) {
        if (err) reject('Dont updated User');
        resolve(userUpdated);
      });
    });
  }

  function findUser({ name, password, isQrCode }) {
    return new Promise(function (resolve, reject) {
      UserModel.findOne({ name }, function (err, user) {
        if (err) reject(err);
        if (!user) {
          reject("This data is wrong");
        }
        resolve(user);
      });
    }).then((user) => {
      if (isQrCode) {
        return user.password === password ? Promise.resolve(user) :
          Promise.reject("User not valid");
      }
      return comparePassword(password, user.password).then((match) => {
        if (!match) return Promise.reject("User not valid");
        return Promise.resolve(user);
      });
    });
  }

  function findAll(pagination) {
    const { limit, skip } = pagination;

    return new Promise(function (resolve, reject) {
      UserModel.find({}, {}, { skip, limit }, function (err, users) {
        if (err) reject(err);
        resolve(users);
      });
    }).then(async (users) => {
      const totalPlayers = await UserModel.count();
      return Promise.resolve({
        data: users,
        pagination: {
          pageSize: limit,
          page: Math.floor(skip / limit),
          hasMore: skip + limit < totalPlayers,
          total: totalPlayers,
        },
      });
    });
  }

  function createPassword(user) {
    return bcrypt.hash(user.password, config.saltRounds);
  }

  //devolver se a password é ou não a mesma
  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  function autorize(scopes) {
    return (request, response, next) => {
      const { roleUser } = request;
      console.log("roleUser:", roleUser);
      const userScopes = Array.isArray(roleUser) ? roleUser : (roleUser ? [roleUser] : []);
      const hasAutorization = scopes.some(scope => userScopes.includes(scope));

      if (roleUser && hasAutorization) {
        next();
      } else {
        response.status(403).json({ message: "Forbidden" });
      }
    };
  }

  function findUserById(id) {
  return new Promise((resolve, reject) => {
    UserModel.findById(id, (err, user) => {

      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject("User not found");
      }
      resolve(user);
    });
  });
}
  return service;
}

module.exports = UserService;
