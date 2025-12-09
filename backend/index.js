const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const config = require("./config");
const port = process.env.PORT || 5000;
const hostname = ("RENDER" in process.env) ? "0.0.0.0" : "localhost"; 

mongoose.connect(process.env.MONGO_URI || config.db)
.then(() => console.log('Connection successful!'))
.catch((err) => console.error(err));

let router = require('./router');

var app = express();

const customFrontendUrl = process.env.FRONTEND_URL || '';

const allowedOrigins = [
customFrontendUrl,
'https://pwa-app-sigma-lovat.vercel.app/',
].filter(Boolean);

const isAllowedOrigin = (origin) =>
!origin || allowedOrigins.includes(origin);

const corsOptions = {
  origin(origin, callback) {
 if (isAllowedOrigin(origin)) {
return callback(null, true);
} return callback(new Error('Not allowed by CORS'));
},
credentials: true,
optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// 🛑 Novo Middleware: Permite que o Express leia o corpo das requisições JSON
app.use(express.json());

// 🛑 Novo Middleware: Permite que o Express leia dados de formulário
app.use(express.urlencoded({ extended: true }));

// 🛑 Configuração das rotas (assumindo que 'router' contém suas rotas Express)
app.use('/', router); 

// 🛑 PONTO CRÍTICO: Exporta a aplicação Express para o Vercel.
module.exports = app;