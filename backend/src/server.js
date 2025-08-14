require('dotenv').config();
const express = require('express');
const router = require('./routes');
const registerSwaggerForDevEnv = require('./config/swagger');
const usePublicDir = require('./config/staticFiles');

const app = express();

registerSwaggerForDevEnv(app);

app.use(express.static(usePublicDir()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(2699);
