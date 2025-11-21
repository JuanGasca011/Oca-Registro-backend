const db = require('../config/db.js');


class gestionCliente {

    async consultarClientes() {
        try {
            const [resultados] = await db.query(`
            SELECT 
                c.ID_CLIENTE, 
                c.NOMBRE,
                c.DIRECCION,
                c.TELEFONO, 
                cu.NUMERO_CUENTA
                FROM clientes c
                LEFT JOIN cuenta cu ON c.ID_CLIENTE = cu.ID_CLIENTE
        `);
            return resultados;
        } catch (error) {
            console.error('Error al obtener los clientes con sus respectivas cuentas:', error);
            throw error;
        }
    }

    async consultarCliente(id) {
        try {
            const [resultados] = await db.query(`
            SELECT 
                c.ID_CLIENTE, 
                c.NOMBRE,
                c.DIRECCION,
                c.TELEFONO, 
                cu.NUMERO_CUENTA
                FROM clientes c
                LEFT JOIN cuenta cu ON c.ID_CLIENTE = cu.ID_CLIENTE
                where c.ID_CLIENTE = ?
        `, [id])
            return resultados[0] || null;
        } catch (error) {
            throw error
        }
    }

    async consultarClientePorCuenta(numeroCuenta) {
    try {
        const [resultados] = await db.query(`
            SELECT 
                c.ID_CLIENTE, 
                c.NOMBRE,
                c.DIRECCION,
                c.TELEFONO, 
                cu.NUMERO_CUENTA
            FROM clientes c
            LEFT JOIN cuenta cu ON c.ID_CLIENTE = cu.ID_CLIENTE
            WHERE cu.NUMERO_CUENTA = ?
        `, [numeroCuenta]);

        return resultados[0] || null;
    } catch (error) {
        throw error;
    }
}

}



module.exports = gestionCliente; 