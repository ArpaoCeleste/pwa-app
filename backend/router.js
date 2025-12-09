const express = require('express');
let AuthAPI = require('./server/auth');
let StadiumAPI = require('./server/stadium');
let UsersAPI = require('./server/users');
let TicketsAPI = require('./server/tickets');
let GamesAPI = require('./server/games');

/**
 * Inicializa e monta os sub-routers da API.
 * @param {object} [io] - Instância do Socket.IO (opcional).
 * @returns {express.Router} O router Express configurado.
 */
function init (io) {
    // Cria uma nova instância de Router para ser o router principal
    let api = express.Router();

    // Monta os sub-routers em seus respectivos caminhos.
    // Presume-se que AuthAPI(), StadiumAPI(), etc., devolvam instâncias de express.Router().
    api.use('/auth', AuthAPI());
    api.use('/stadium', StadiumAPI());
    // Se UsersAPI e GamesAPI esperarem 'io', injetamos aqui:
    api.use('/users', UsersAPI(io));
    api.use('/tickets', TicketsAPI());
    api.use('/games', GamesAPI(io));

    // Opcional: Rota de saúde para a raiz da API
    api.get('/', (req, res) => {
        res.status(200).json({ message: 'API Gateway Operacional', version: '1.0' });
    });

    return api;
}

// 🛑 CORREÇÃO: Exportar a função 'init' diretamente.
// Isto permite que o backend/index.js chame require('./router')(io)
module.exports = init;