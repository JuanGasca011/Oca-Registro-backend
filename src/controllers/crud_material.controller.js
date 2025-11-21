  const db = require('../config/db.js');
  
  class GestionMaterial {
  
  async obtenerMaterialPorSAP(codigoSAP) {
        try {
            const [resultados] = await db.query(`
                SELECT *
                FROM materiales
                WHERE CODIGO_SAP = ?
            `, [codigoSAP]);
            return resultados[0] || null;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = GestionMaterial;
