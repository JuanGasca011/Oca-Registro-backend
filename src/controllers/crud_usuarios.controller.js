const db = require('../config/db.js');

class crudUsuarios {
    async ObtenerTodosUsuarios() {
        try {
            const [resultados] = await db.query(`
                SELECT 
                u.ID_USUARIO,
                u.Nombre_Usuario,
                u.CorreoOca,
                u.ESTADO,
                u.CODIGO,        
                r.NOMBRE AS NombreRol
            FROM usuarios u
            LEFT JOIN rol r ON u.ID_ROL = r.ID_ROL
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
                u.ID_USUARIO,
                u.Nombre_Usuario,
                u.CorreoOca,
                u.ESTADO,
                u.CODIGO,
                r.NOMBRE AS NombreRol
            FROM usuarios u
            LEFT JOIN rol r ON u.ID_ROL = r.ID_ROL
            WHERE u.ID_USUARIO = ?
                                    `, [id]);
            return resultados[0] || null;
        } catch (error) {
            throw error;
        }
    }


    async ObtenerUsuarioPorCodigo(codigo) {
        try {
            const [resultados] = await db.query(`
                        SELECT 
                u.ID_USUARIO,
                u.Nombre_Usuario,
                u.CorreoOca,
                u.ESTADO,
                u.CODIGO,
                r.NOMBRE AS NombreRol
            FROM usuarios u
            LEFT JOIN rol r ON u.ID_ROL = r.ID_ROL
            WHERE UPPER(u.CODIGO) = UPPER(?)
            `, [codigo]);

            return resultados[0] || null;

        } catch (error) {
            throw error;
        }
    }

}





module.exports = crudUsuarios;
