const express = require('express');
const router = express.Router();

const CrudGenericoController = require('../controllers/crud_generico.controller');
const crudUsuarios = require('../controllers/crud_usuarios.controller');

const crudGenerico = new CrudGenericoController();
const usuariosController = new crudUsuarios();  

const tabla = 'usuarios';
const idCampo = 'ID_USUARIO';  

// 1. LISTAR TODOS LOS USUARIOS 
router.get('/', async (req, res) => {
    try {
        const usuarios = await usuariosController.ObtenerTodosUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error('Error en GET /usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para obtener UNO 
router.get('/:id', async (req, res) => {
    try {
        const usuario = await usuariosController.ObtenerUsuarioPorId(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Para crear un uusario
router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = await crudGenerico.crear(tabla, req.body); 
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const usuarioActualizado = await crudGenerico.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
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