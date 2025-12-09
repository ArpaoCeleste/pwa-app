const express = require("express");
const http = require("http"); // Necessário para criar o servidor HTTP e Socket.IO
const mongoose = require("mongoose");
const path = require("path");
const socketIo = require("socket.io"); // Necessário para Socket.IO
const cors = require("cors");
const config = require("./config");
// A variável port DEVE ser lida do ambiente Render, se não for 5000
const port = process.env.PORT || 5000; 
const hostname = ("RENDER" in process.env) ? "0.0.0.0" : "localhost"; 

// Importa a função init do Router, que devolve a instância Express.Router
const mainRouterInit = require('./router'); 

var app = express();

mongoose.connect(process.env.MONGO_URI || config.db)
.then(() => console.log('Connection successful!'))
.catch((err) => console.error(err));

// --- 1. Configurações de Middleware ---

// Lógica CORS (mantida a sua implementação)
const customFrontendUrl = process.env.FRONTEND_URL || '';
const allowedOrigins = [
  customFrontendUrl,
  'https://pwa-app-sigma-lovat.vercel.app/',
  'https://pwa-app-lbb8.onrender.com/' 
].filter(Boolean);

const isAllowedOrigin = (origin) =>
!origin || allowedOrigins.includes(origin);

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true); 
    }
    return callback(new Error('Not allowed by CORS')); 
},
  credentials: true, 
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 2. Inicialização do Servidor HTTP e Socket.IO ---

// Cria o servidor HTTP que será usado pelo Express e Socket.IO
const server = http.createServer(app); 

// Inicializa o Socket.IO no servidor HTTP criado
const io = socketIo(server, {
    cors: corsOptions // Garante que o Socket.IO respeita as regras CORS
});

// --- 3. Montagem de Rotas ---

// Monta todas as rotas da API em '/api'
// 🛑 Passamos a instância 'io' para o router, onde for necessário
app.use('/api', mainRouterInit(io)); 

// --- 4. Serviço de Ficheiros Estáticos e Fallback (CRÍTICO para o 404) ---

// Serve ficheiros estáticos a partir da pasta 'dist' (Substitua se necessário)
app.use(express.static(path.join(__dirname, '..', 'dist'))); 

// Para todas as outras rotas (SPA routing)
app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')); 
});


// 🛑 PONTO CRÍTICO: INICIAR O SERVIDOR NO RENDER
// O Render exige que você chame server.listen() para detetar a porta.

server.listen(port, hostname, () => {
    console.log(`Servidor Express/Socket.IO a ouvir em http://${hostname}:${port}`);
});


// Removemos o module.exports = app; pois o servidor está a ser iniciado com server.listen()
// Caso precise de usar esta função num ambiente Serverless (como Vercel), terá de voltar a exportar 'app' 
// e remover 'server.listen'.