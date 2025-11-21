// Importamos la conexión a la base de datos desde el archivo db.js.
// Esto nos permite ejecutar consultas SQL.
const db = require('../config/db.js');

// Creamos una clase para manejar toda la lógica relacionada
// con la asignación de material a usuarios.
class GestionMaterialAsignado {

    // Método principal: recibe un objeto con los datos necesarios
    // y realiza el proceso de asignación de material.
    async asignarMaterialAUsuario(data) {

        // Desestructuramos los datos que esperamos recibir.
        const {
            idMaterial,
            idUsuario,
            cantidadTotal,
            observaciones,
            nombreAlmacenista
        } = data;

        // Validamos que no falten datos necesarios.
        if (!idMaterial || !idUsuario || !cantidadTotal || !nombreAlmacenista) {
            throw new Error("Faltan campos obligatorios: idMaterial, idUsuario, cantidadTotal y nombreAlmacenista");
        }

        // Verificamos que la cantidad asignada sea mayor que 0.
        if (cantidadTotal <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }

        // Obtenemos una conexión activa desde el pool.
        const connection = await db.getConnection();

        // Iniciamos una transacción para asegurar la integridad de datos.
        await connection.beginTransaction();

        try {

            // 1. VERIFICAR STOCK DISPONIBLE
            // Usamos FOR UPDATE para bloquear la fila y evitar que otro
            // proceso modifique el stock al mismo tiempo.
            const [stock] = await connection.query(
                `SELECT Cantidad_Disponible, Nombre_material 
                FROM materiales 
                WHERE ID_MATERIAL = ? FOR UPDATE`,
                [idMaterial]
            );

            // Si el material no existe en la base de datos:
            if (stock.length === 0) {
                throw new Error("Material no encontrado");
            }

            // Guardamos el stock disponible y el nombre del material.
            const disponible = stock[0].Cantidad_Disponible;
            const nombreMaterial = stock[0].Nombre_material;

            // Validamos que haya stock suficiente.
            if (disponible < cantidadTotal) {
                throw new Error(`Stock insuficiente. Disponible: ${disponible} ${nombreMaterial}, solicitado: ${cantidadTotal}`);
            }

            
            // 2. INSERTAR EN LA TABLA DE MATERIAL ASIGNADO
            // Guardamos la asignación junto con fecha, almacenista y observaciones.

            const [resultado] = await connection.query(
                `INSERT INTO material_asignado 
                (ID_MATERIAL, ID_USUARIO, CANTIDAD_TOTAL, FECHA, OBSERVACIONES, nombreAlmacenista)
                VALUES (?, ?, ?, NOW(), ?, ?)`,
                [idMaterial, idUsuario, cantidadTotal, observaciones, nombreAlmacenista]
            );

            // 3. DESCONTAR LA CANTIDAD ASIGNADA DEL INVENTARIO
            await connection.query(
                `UPDATE materiales 
                SET Cantidad_Disponible = Cantidad_Disponible - ? 
                WHERE ID_MATERIAL = ?`,
                [cantidadTotal, idMaterial]
            );

            // Si todo va bien, confirmamos la transacción.
            await connection.commit();

            // Retornamos un mensaje detallado.
            return {
                mensaje: "Material asignado correctamente al usuario",
                asignacionId: resultado.insertId,   // ID del registro creado
                material: nombreMaterial,           // Nombre del material asignado
                cantidadAsignada: cantidadTotal,    // Cantidad entregada
                stockRestante: disponible - cantidadTotal // Stock actualizado
            };

        } catch (error) {
            // Si ocurre algún error, revertimos la transacción.
            await connection.rollback();
            console.error("Error al asignar material:", error);
            throw error;

        } finally {
            // Liberamos la conexión para que pueda ser reutilizada por otro proceso.
            connection.release();
        }
    }


async obtenerMaterialesAsignadosPorUsuario(idUsuario) {
    // Validamos que venga el ID del usuario, si no, lanzamos error inmediatamente
    if (!idUsuario) throw new Error("Falta el ID del usuario");

    // Tomamos una conexión del pool de base de datos (db es un pool creado con mysql2/promise)
    const connection = await db.getConnection();

    try {
        // Consulta principal: trae todos los materiales asignados al usuario
        const [rows] = await connection.query(`
            SELECT 
                ma.ID_MATERIAL_ASIGNADO as idAsignacion,     
                ma.ID_MATERIAL,                             
                m.Nombre_material,                           
                m.CODIGO_SAP as codigo,                     
                ma.CANTIDAD_TOTAL as cantidad,              
                DATE_FORMAT(ma.FECHA, '%d/%m/%Y %H:%i') as fecha, 
                ma.OBSERVACIONES as observaciones,           
                ma.nombreAlmacenista                         
            FROM material_asignado ma
            JOIN materiales m ON ma.ID_MATERIAL = m.ID_MATERIAL  
            WHERE ma.ID_USUARIO = ?                               
            ORDER BY ma.FECHA DESC                                
        `, [idUsuario]);

        // Si no tiene materiales asignados, devolvemos mensaje claro y array vacío
        if (rows.length === 0) {
            return { 
                mensaje: "Este usuario no tiene materiales asignados", 
                materiales: [] 
            };
        }

        // Consulta rápida solo para traer el nombre y código del trabajador (una sola vez)
        // No lo incluimos en la consulta anterior para no repetir estos datos en cada fila
        const [infoUsuario] = await connection.query(
            `SELECT Nombre_Usuario as usuario, CODIGO as codigoUsuario 
            FROM usuarios WHERE ID_USUARIO = ?`, 
            [idUsuario]
        );

        // Respuesta final estructurada, lista para enviar al frontend
        return {
            mensaje: "Materiales asignados encontrados",
            total: rows.length,                    // Cantidad total de asignaciones
            usuario: infoUsuario[0].usuario,       // Nombre completo del empleado
            codigoUsuario: infoUsuario[0].codigoUsuario,  // Código de empleado (ej: 001234)
            materiales: rows                       // Array con todos los materiales asignados
        };

    } catch (error) {
        throw new Error("Error al consultar: " + error.message);
    } finally {
        // SIEMPRE liberamos la conexión al pool, haya error o no
        // Esto evita que se agoten las conexiones disponibles
        connection.release();
    }
}


async obtenerMaterialesPorCodigo(codigo) {
    // Validación: el código del empleado es obligatorio
    if (!codigo) throw new Error("Falta el código del usuario");

    // Tomamos una conexión del pool
    const connection = await db.getConnection();

    try {
        // Primero buscamos el ID_USUARIO usando el código visible del trabajador
        const [usuario] = await connection.query(
            "SELECT ID_USUARIO FROM usuarios WHERE CODIGO = ?", 
            [codigo]
        );

        // Si no existe ese código, lanzamos error claro
        if (usuario.length === 0) {
            throw new Error("Usuario no encontrado con ese código");
        }

        // Reutilizamos la función principal pasándole el ID encontrado
        // Así no duplicamos lógica y siempre devolvemos el mismo formato
        return await this.obtenerMaterialesAsignadosPorUsuario(usuario[0].ID_USUARIO);

    } catch (error) {
        // Propagamos el error tal cual (puede venir de arriba o de este método)
        throw error;
    } finally {
        // Siempre devolvemos la conexión al pool
        connection.release();
    }
}
}
module.exports = GestionMaterialAsignado;
