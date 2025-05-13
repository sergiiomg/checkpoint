import { db } from '../db';

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
        return "FINOOOOOOOOOOOOO";
    }
}

export { TestRepository };