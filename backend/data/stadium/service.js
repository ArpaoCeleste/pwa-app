function StadiumService(StadiumModel) {
  let service = {
    create,
    find,
    update,
  };

  function create(stadium) {
    let newStadium = StadiumModel(stadium);
    return save(newStadium);
  }

  function save(model) {
  return new Promise(function (resolve, reject) {
    model.save(function (err) {
      if (err) return reject(err); // Retorne o erro real!
      resolve({
        message: "Game Created",
        game: model,
      });
    });
  });
}

  function find(id) {
    return new Promise(function (resolve, reject) {
      StadiumModel.findById(id, function (err, player) {
        if (err) reject(err);

        resolve(player);
      });
    });
  }

  function update(id, stadium) {
    return new Promise(function (resolve, reject) {
        StadiumModel.findByIdAndUpdate(
        id,
        stadium,
        function (err, stadiumUpdated) {
          if (err) console.log(err);
          resolve(stadiumUpdated);
        }
      );
    });
  }

  return service;
}

module.exports = StadiumService;
