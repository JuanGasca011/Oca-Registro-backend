const db = require('../config/db.js');

class TpOrdenManoObraController {

    // Consultar mano de obra asociada a un tipo de orden
    async consultarManoObraPorTpOrden(idTpOrden) {
        try {
            const [resultados] = await db.query(`
                SELECT 
                    t.NOMBRE AS Nombre_TpOrden,
                    mo.NOMBRE_Mano,
                    mo.CANTIDAD_PUNTOS,
                    mo.Valor_Mano_Obra,
                    mot.ID_mano_obra_tpOrden
                FROM mano_obra_tpOrden mot
                INNER JOIN tpOrden t ON mot.ID_tpOrden = t.ID_tpOrden
                INNER JOIN mano_obra mo ON mot.ID_MANO_OBRA = mo.ID_MANO_OBRA
                WHERE mot.ID_tpOrden = ?
            `, [idTpOrden]);

            return resultados;

        } catch (error) {
            console.error("Error al consultar mano de obra:", error);
            throw new Error("Error al consultar mano de obra por tipo de orden");
        }
    }


    // Agregar mano de obra a un tipo de orden
    async agregarManoObraATpOrden(idManoObra, idTpOrden) {
        try {
            const [result] = await db.query(`
                INSERT INTO mano_obra_tpOrden (ID_tpOrden, ID_MANO_OBRA)
                VALUES (?, ?)
            `, [idTpOrden, idManoObra]);

            return {
                mensaje: "Mano de obra agregada correctamente",
                id: result.insertId
            };

        } catch (error) {
            console.error("Error al agregar mano de obra:", error);
            throw new Error("No se pudo agregar la mano de obra al tipo de orden");
        }
    }


    // Eliminar relación
    async eliminarRelacion(idRelacion) {
        try {
            const [result] = await db.query(`
                DELETE FROM mano_obra_tpOrden 
                WHERE ID_mano_obra_tpOrden = ?
            `, [idRelacion]);

            if (result.affectedRows === 0) {
                throw new Error("Relación no encontrada");
            }

            return { mensaje: "Relación eliminada correctamente" };

        } catch (error) {
            console.error("Error al eliminar relación:", error);
            throw error;
        }
    }

}
module.exports = TpOrdenManoObraController;
