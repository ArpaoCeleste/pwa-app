const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");
const socketIo = require("socket.io");
const cors = require("cors");
const config = require("./config");

const port = process.env.PORT || 5000;
const hostname = ("RENDER" in process.env) ? "0.0.0.0" : "localhost"; 

// Importa a função init do Router
const mainRouterInit = require('./router'); 

var app = express();

mongoose.connect(process.env.MONGO_URI || config.db)
.then(() => console.log('Connection successful!'))
.catch((err) => console.error(err));

// --- 1. Configurações de Middleware ---

const customFrontendUrl = process.env.FRONTEND_URL || '';
const allowedOrigins = [
  customFrontendUrl,
  'https://pwa-app-sigma-lovat.vercel.app/', // URL do seu Frontend Vercel
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

const server = http.createServer(app); 
const io = socketIo(server, {
    cors: corsOptions
});

// --- 3. Montagem de Rotas (APENAS API) ---

// Monta todas as rotas da API em '/api'
app.use('/api', mainRouterInit(io)); 

// 🟢 ROTA DE SAÚDE DA RAIZ (Para confirmar que o Render está vivo)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend API está funcional.', status: 'OK' });
});

// --- 4. INICIAR O SERVIDOR NO RENDER ---

server.listen(port, hostname, () => {
    console.log(`Servidor Express/Socket.IO a ouvir em http://${hostname}:${port}`);
});

// Nota: O erro 'ENOENT' deve desaparecer após remover as referências aos ficheiros estáticos (dist).