const db = require('../config/db.js');

class OrdenAsignadaController {

    // Consultar todas las órdenes asignadas
    async obtenerTodasOrdenesAsignadas() {
        try {
            const [resultados] = await db.query(`
                SELECT oa.ID_ORDEN_ASIGNADA, oa.ID_ORDEN_TRABAJO, oa.ID_USUARIO, 
                    oa.FECHA_ASIGNADA, oa.HORA_ASIGNADA, oa.CUADRILLA,
                    u.Nombre_Usuario, u.CODIGO, ot.NUMERO_ORDEN
                FROM orden_asignada oa
                JOIN usuarios u ON oa.ID_USUARIO = u.ID_USUARIO
                JOIN orden_trabajo ot ON oa.ID_ORDEN_TRABAJO = ot.ID_ORDEN_TRABAJO
            `);
            return resultados;
        } catch (error) {
            throw error;
        }
    }

    // Consultar por ID de asignación
    async obtenerPorId(id) {
        try {
            const [resultados] = await db.query(`
                SELECT oa.ID_ORDEN_ASIGNADA, oa.ID_ORDEN_TRABAJO, oa.ID_USUARIO, 
                    oa.FECHA_ASIGNADA, oa.HORA_ASIGNADA, oa.CUADRILLA,
                    u.Nombre_Usuario, u.CODIGO, ot.NUMERO_ORDEN
                FROM orden_asignada oa
                JOIN usuarios u ON oa.ID_USUARIO = u.ID_USUARIO
                JOIN orden_trabajo ot ON oa.ID_ORDEN_TRABAJO = ot.ID_ORDEN_TRABAJO
                WHERE oa.ID_ORDEN_ASIGNADA = ?
            `, [id]);
            return resultados[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Consultar por código de usuario
    async obtenerPorCodigoUsuario(codigoUsuario) {
        try {
            const [resultados] = await db.query(`
                SELECT oa.ID_ORDEN_ASIGNADA, oa.ID_ORDEN_TRABAJO, oa.ID_USUARIO, 
                    oa.FECHA_ASIGNADA, oa.HORA_ASIGNADA, oa.CUADRILLA,
                    u.Nombre_Usuario, u.CODIGO, ot.NUMERO_ORDEN
                FROM orden_asignada oa
                JOIN usuarios u ON oa.ID_USUARIO = u.ID_USUARIO
                JOIN orden_trabajo ot ON oa.ID_ORDEN_TRABAJO = ot.ID_ORDEN_TRABAJO
                WHERE u.CODIGO = ?
            `, [codigoUsuario]);
            return resultados;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = OrdenAsignadaController;