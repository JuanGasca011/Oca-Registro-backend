const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use('api/usuarios', require('./routes/usuarios.routes'));

app.use('api/materiales', require('./routes/materiales.routes'));

app.use('api/roles', require('./routes/roles.routes'));

app.use('api/actividades', require('./routes/actividad.routes'));

app.use('api/manoObra', require('./routes/manoObra.routes'));

app.use('api/clientes', require('./routes/clientes.routes'));

module.exports = app; 