const express = require('express');

const router = express.Router();

const CrudGenericoController = require('../controllers/crud_generico.controller');
const crudGenerico = new CrudGenericoController();



const GestionMaterial = require('../controllers/crud_material.controller');
const consultarMaterial = new GestionMaterial(); 

const tabla = 'materiales';

const idCampo = 'ID_MATERIAL';

router.get('/', async (req, res) => {
    try {
        const materiales = await crudGenerico.ObtenerTodos(tabla);
        res.json(materiales);
    } catch {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const material = await crudGenerico.ObtenerUno(tabla, idCampo, req.params.id);
        res.json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// consultar  Materiales por codigo de sap

router.get('/sap/:codigoSAP', async (req, res) => {
    try {
        const { codigoSAP } = req.params;
        const material = await consultarMaterial.obtenerMaterialPorSAP(codigoSAP); 
        if (!material) return res.status(404).json({ mensaje: "Material no encontrado" });
        res.json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const nuevoMaterial = await crudGenerico.crear(tabla, req.body);
        res.status(201).json(nuevoMaterial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const materialActualizado = await crudGenerico.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(materialActualizado);
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