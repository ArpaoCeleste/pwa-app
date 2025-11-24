const express = require('express');
let AuthAPI = require('./server/auth');
let StadiumAPI = require('./server/stadium');
let UsersAPI = require('./server/users');
let TicketsAPI = require('./server/tickets');
let GamesAPI = require('./server/games');

function init (io) {
    let api = express.Router();

    api.use('/auth', AuthAPI());
    api.use('/stadium', StadiumAPI());
    api.use('/users', UsersAPI(io));
    api.use('/tickets', TicketsAPI());
    api.use('/games', GamesAPI(io));

    return api;
}

module.exports = {
    init: init,
}