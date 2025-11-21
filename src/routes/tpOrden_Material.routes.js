const express = require('express');
const router = express.Router();

const TpOrdenMaterialController = require('../controllers/crud_tpOrden_materiales.controller');
const tpOrdenMaterialController = new TpOrdenMaterialController();

// Obtener materiales asociados a un tipo de orden
router.get('/:idTpOrden', async (req, res) => {
    try {
        const materiales = await tpOrdenMaterialController.consultarMaterialesPorTpOrden(req.params.idTpOrden);
        res.json(materiales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar material a un tipo de orden
router.post('/', async (req, res) => {
    try {
        const { idMaterial, idTpOrden } = req.body;

        const resultado = await tpOrdenMaterialController.agregarMaterialATpOrden(
            parseInt(idMaterial),
            parseInt(idTpOrden)
        );

        res.status(201).json(resultado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar relación
router.delete('/:idRelacion', async (req, res) => {
    try {
        const idRelacion = parseInt(req.params.idRelacion);
        if (!idRelacion || isNaN(idRelacion)) {
            return res.status(400).json({
                error: "ID de relación inválido o no proporcionado"
            });
        }
        const resultado = await tpOrdenMaterialController.eliminarRelacion(idRelacion);
        res.status(200).json(resultado); 
    } catch (error) {
        if (error.message.includes("no encontrada") || error.message.includes("obligatorio")) {
            return res.status(404).json({ error: error.message });
        }
    }
});

module.exports = router;
