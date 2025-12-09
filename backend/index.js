const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const config = require("./config");
const http = require("http"); // Mantido para referência, mas não usado diretamente para servir o Vercel
const socketIo = require("socket.io"); // Mantido para referência, mas não usado diretamente para servir o Vercel

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
  'https://pwa-app-lbb8.onrender.com/' // Adicionado o seu URL do Render
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
app.use(express.json()); // Permite ler body em formato JSON
app.use(express.urlencoded({ extended: true })); // Permite ler dados de formulário

// --- 2. Montagem de Rotas ---

// Monta todas as rotas da API em '/api'
// 🛑 Chamamos o init() sem 'io' para garantir que o Serverless App não falhe
// se o Socket.IO não estiver totalmente configurado para o Vercel.
app.use('/api', mainRouterInit()); 

// --- 3. Serviço de Ficheiros Estáticos e Fallback (CRÍTICO para o 404) ---

// Serve ficheiros estáticos a partir da pasta 'dist' (substitua por 'build' se for o caso)
// Assumimos que o frontend compilado está na pasta 'dist' na raiz do seu projeto Vercel.
app.use(express.static(path.join(__dirname, '..', 'dist'))); 

// Para todas as outras rotas (ex: /about, /home), devolve o index.html (SPA routing)
app.get('*', (req, res) => {
    // Apenas devolve o index.html se não for uma rota da API
    if (req.originalUrl.startsWith('/api/')) {
        // Se for um pedido API e chegou aqui, é 404 na API, não no frontend.
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html')); 
});


// 🛑 PONTO CRÍTICO: Exporta a aplicação Express para o Vercel.
module.exports = app;