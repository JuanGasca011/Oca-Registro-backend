const express = require('express');

const router = express.Router();

const CrudGenericoController = require('../controllers/crud_generico.controller');


const crudGenerico = new CrudGenericoController();

const tabla = 'rol';

const idCampo = 'ID_ROL';

router.get('/', async (req, res) => {
    try {
        const roles = await crudGenerico.ObtenerTodos(tabla);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const rol = await crudGenerico.ObtenerUno(tabla, idCampo, req.params.id);
        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoRol = await crudGenerico.crear(tabla, req.body);
        res.status(201).json(nuevoRol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const rolActualizado = await crudGenerico.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(rolActualizado);
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