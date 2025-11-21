const express = require('express');

const router = express.Router();

const CrudGenericoController = require('../controllers/crud_generico.controller');

const crudGenerico = new CrudGenericoController();

const tabla = 'tpOrden';

const idCampo = 'ID_tpOrden';

router.get('/', async (req, res) => {
    try {
        const actividades = await crudGenerico.ObtenerTodos(tabla);
        res.json(actividades);
    } catch {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const actividad = await crudGenerico.ObtenerUno(tabla, idCampo, req.params.id);
        res.json(actividad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaActividad = await crudGenerico.crear(tabla, req.body);
        res.status(201).json(nuevaActividad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const actividadActualizada = await crudGenerico.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(actividadActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await crudGenerico.eliminar(tabla, idCampo, req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 