// routes/materialAsignado.routes.js
const express = require('express');

const router = express.Router();

const GestionMaterialAsignado = require('../controllers/usuario_material.controller')

const controller = new GestionMaterialAsignado();

router.post('/', async (req, res) => {
    try {
        const resultado = await controller.asignarMaterialAUsuario(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/usuario/:id', async (req, res) => {
    try {
        const resultado = await controller.obtenerMaterialesAsignadosPorUsuario(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Consultar por CÓDIGO de usuario (el que más usan en almacén)
router.get('/codigo/:codigo', async (req, res) => {
    try {
        const resultado = await controller.obtenerMaterialesPorCodigo(req.params.codigo);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});
module.exports = router;