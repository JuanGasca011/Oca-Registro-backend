const db = require('../config/db.js');

class crudUsuarios {
    async ObtenerTodosUsuarios() {
        try {
            const [resultados] = await db.query(`
                SELECT 
                    u.IDUSUARIO,
                    u.NombreUsuario,
                    u.CorreoOca,
                    u.estado,
                    u.codigo,
                    u.idRol,
                    r.NombreRol,
                    r.estadoRol
                FROM Usuarios u
                LEFT JOIN Roles r ON u.idRol = r.idRol
            `);
            return resultados;
        } catch (error) {
            console.error('Error al obtener usuarios con roles:', error);
            throw error;
        }
    }
    async ObtenerUsuarioPorId(id) {
        try {
            const [resultados] = await db.query(`
                SELECT 
                    u.IDUSUARIO,
                    u.NombreUsuario,
                    u.CorreoOca,
                    u.ContraUsuario,
                    u.estado,
                    u.codigo,
                    u.idRol,
                    r.NombreRol,
                    r.estadoRol
                FROM Usuarios u
                LEFT JOIN Roles r ON u.idRol = r.idRol
                WHERE u.IDUSUARIO = ?
            `, [id]);
            return resultados[0] || null; 
        } catch (error) {
            throw error;
        }
    }
}

module.exports = crudUsuarios;
