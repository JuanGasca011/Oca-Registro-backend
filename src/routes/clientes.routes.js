const express = require('express');

const router = express.Router();

const CrudConsultaCliente = require('../controllers/crud_clientes.controller');
const crudCliente = new CrudConsultaCliente();


const tabla = 'clientes';

const idCampo = 'ID_CLIENTE';

router.get('/', async (req, res) => {
    try {
        const clientes = await crudCliente.consultarClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const cliente = await crudCliente.consultarCliente(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.get('/cuenta/:numero', async (req, res) => {
    try {
        const { numero } = req.params;
        const cliente = await crudCliente.consultarClientePorCuenta(numero);
        if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado" });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router; 