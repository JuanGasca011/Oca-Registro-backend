const express = require('express');
const router = express.Router();

const TpOrdenManoObraController = require('../controllers/crud_manoObra_tpOrden.controller'); 

const controller = new TpOrdenManoObraController();

// Obtener mano de obra asociada a un tipo de orden
router.get('/:idTpOrden', async (req, res) => {
    try {
        const manoObra = await controller.consultarManoObraPorTpOrden(req.params.idTpOrden);
        res.json(manoObra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar mano de obra a un tipo de orden
router.post('/', async (req, res) => {
    try {
        const { idManoObra, idTpOrden } = req.body;

        const resultado = await controller.agregarManoObraATpOrden(
            parseInt(idManoObra),
            parseInt(idTpOrden)
        );

        res.status(201).json(resultado);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar relación
router.delete('/:idRelacion', async (req, res) => {
    try {
        const idRelacion = parseInt(req.params.idRelacion);

        if (!idRelacion || isNaN(idRelacion)) {
            return res.status(400).json({
                error: "ID de relación inválido"
            });
        }

        const resultado = await controller.eliminarRelacion(idRelacion);
        res.json(resultado);

    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
