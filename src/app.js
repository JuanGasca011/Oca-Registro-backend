const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/usuarios', require('./routes/usuarios.routes'));

app.use('/api/materiales', require('./routes/materiales.routes'));

app.use('/api/roles', require('./routes/roles.routes'));

app.use('/api/tpOrden', require('./routes/tpOrden.routes'));

app.use('/api/manoObra', require('./routes/manoObra.routes'));

app.use('/api/clientes', require('./routes/clientes.routes'));

app.use('/api/tpOrden_material/', require('./routes/tpOrden_Material.routes'));

app.use('/api/tpOrden_manoObra/', require('./routes/tpOrden_ManoObra.routes'));

app.use('/api/usuario_material', require('./routes/usuario_material.routes'));

app.use('/api/orden_asignada/', require('./routes/ordenAsignada.routes')); 

module.exports = app; 