const express = require('express');
const router = express.Router();
const OrdenAsignadaController = require('../controllers/crud_orden_notificada.controller'); 
const ordenAsignadaController = new OrdenAsignadaController();

// Obtener todas las órdenes asignadas
router.get('/', async (req, res) => {
    try {
        const ordenes = await ordenAsignadaController.obtenerTodasOrdenesAsignadas();
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una asignación por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const asignacion = await ordenAsignadaController.obtenerPorId(id);
        if (!asignacion) return res.status(404).json({ message: 'Asignación no encontrada' });
        res.json(asignacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener asignaciones por código de usuario
router.get('/usuario/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const asignaciones = await ordenAsignadaController.obtenerPorCodigoUsuario(codigo);
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;