const express = require('express');

const router = express.Router();

const CrudGenericoController = require('../controllers/crud_generico.controller');


const crudGenerico = new CrudGenericoController();

const tabla = 'mano_obra';

const idCampo = 'ID_MANO_OBRA';

router.get('/', async (req, res) => {
    try {
        const mano_obras = await crudGenerico.ObtenerTodos(tabla);
        res.json(mano_obras);
    } catch {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const mano_obra = await crudGenerico.ObtenerUno(tabla, idCampo, req.params.id);
        res.json(mano_obra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post('/', async (req, res) => {
    try {
        const nuevaMano_Obra = await crudGenerico.crear(tabla, req.body);
        res.status(201).json(nuevaMano_Obra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const mano_obra_Actualizada = await crudGenerico.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(mano_obra_Actualizada);
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