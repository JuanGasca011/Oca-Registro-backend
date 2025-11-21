const db = require('../config/db.js'); 

class gestionTpOrdenMaterial {

    // Obtener todos los materiales asociados a un tipo de orden
    async consultarMaterialesPorTpOrden(idTpOrden) {
        try {
            const [resultados] = await db.query(`
                SELECT 
                    t.NOMBRE AS Nombre_TpOrden,
                    m.Nombre_material,
                    m.CODIGO_SAP
                FROM tpOrden_material tm
                INNER JOIN materiales m ON tm.ID_MATERIAL = m.ID_MATERIAL
                INNER JOIN tpOrden t ON tm.ID_tpOrden = t.ID_tpOrden
                WHERE tm.ID_tpOrden = ?
            `, [idTpOrden]);

            return resultados;
        } catch (error) {
            console.error('Error al consultar materiales de tpOrden:', error);
            throw error;
        }
    }

    // Agregar material a un tipo de orden
    async agregarMaterialATpOrden(idMaterial, idTpOrden) {
        try {
            const [resultado] = await db.query(`
                INSERT INTO tpOrden_material (ID_MATERIAL, ID_tpOrden)
                VALUES (?, ?)
            `, [idMaterial, idTpOrden]);

            return { 
                mensaje: "Material agregado correctamente al tipo de orden",
                insertId: resultado.insertId 
            };

        } catch (error) {
            console.error('Error al agregar material a tpOrden:', error);
            throw error;
        }
    }

    // Eliminar relación material - tipo de orden
    async eliminarRelacion(idTpOrdenMaterial) {
        try {
            if (!idTpOrdenMaterial) {
                throw new Error("ID de la relación es obligatorio");
            }

            const [resultado] = await db.query(`
                DELETE FROM tpOrden_material 
                WHERE ID_tpOrden_Material = ?
            `, [idTpOrdenMaterial]);

            if (resultado.affectedRows === 0) {
                throw new Error("Relación no encontrada o ya fue eliminada");
            }

            return { 
                mensaje: "Material desasociado correctamente del tipo de orden",
                eliminado: true
            };

        } catch (error) {
            console.error('Error al eliminar relación tpOrden-material:', error);
            throw error;
        }
    }
}

module.exports = gestionTpOrdenMaterial;
