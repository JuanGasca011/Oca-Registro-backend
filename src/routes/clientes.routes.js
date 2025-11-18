const express = require('express');

const router = express.Router();

const CrudGenericoController = require('../controllers/crud_generico.controller');


const crudGenerico = new CrudGenericoController();

const tabla = 'clientes';

const idCampo = 'ID_CLIENTE';

router.get('/', async (req, res) => {
    try {
        const clientes = await crudGenerico.ObtenerTodos(tabla);
        res.json(clientes);
    } catch {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const cliente = await crudGenerico.ObtenerUno(tabla, idCampo, req.params.id);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoCliente = await crudGenerico.crear(tabla.req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const clienteActualizado = await crudGenerico.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(clienteActualizado);
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