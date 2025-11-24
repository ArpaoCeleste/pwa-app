function GameService(GameModel) {
  let service = {
    create,
    findAll,
    findTicketsByDate,
    update,
    removeById,
    findById,
  };

  function create(game) {
    let newGame = GameModel(game);
    return save(newGame);
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      model.save(function (err) {
        if (err) {
          console.error("Erro real do Mongo:", err);
          return reject(err);
        }

        resolve({
          message: "Game Created",
          game: model,
        });
      });
    });
  }

  function findAll(pagination) {
    const { limit, skip } = pagination;

    return new Promise(function (resolve, reject) {
      GameModel.find({}, {}, { skip, limit }, function (err, games) {
        if (err) reject(err);

        resolve(games);
      });
    }).then(async (games) => {
      const totalGames = await GameModel.count();

      return Promise.resolve({
        data: games,
        pagination: {
          pageSize: limit,
          page: Math.floor(skip / limit),
          hasMore: skip + limit < totalGames,
          total: totalGames,
        },
      });
    });
  }

  function findTicketsByDate(date) {
    return new Promise(function (resolve, reject) {
      GameModel.find({ date }, function (err, game) {
        if (err) reject(err);
        //object of all users

        if (!member) {
          reject("Game does not found");
        }
        resolve(game);
      });
    });
  }

  function update(id, ticket) {
    return new Promise(function (resolve, reject) {
      GameModel.findByIdAndUpdate(id, ticket, function (err, gameUpdated) {
        if (err) reject('Dont updated Game');
        resolve(gameUpdated);
      });
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      GameModel.findByIdAndRemove(id, function (err) {
        if (err)
          reject({
            message: "Does not possible remove",
          });

        resolve();
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      GameModel.findById(id, function (err, game) {
        if (err || !game) reject("Game not found");
        else resolve(game);
      });
    });
  }

  return service;
}

module.exports = GameService;
