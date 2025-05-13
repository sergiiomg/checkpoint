import { db } from '../db';
import { Usuario } from '../models/usuarios';

class TestRepository{
    //Declaraciones para cliente DB

    constructor(){
        //Inicializaciones para cliente DB
    }

    async connect(): Promise<void> {
        console.log('Connected to DB');
    }

    async disconnect(): Promise<void> {
        console.log('DB connection closed');
    }

    async getTestResponse() {
        if (!db) {
            throw new Error("No hay conexión a la base de datos");
        }

        const [rows] = await db.execute('SELECT * FROM usuarios');
        return rows;
    }
}

export { TestRepository };