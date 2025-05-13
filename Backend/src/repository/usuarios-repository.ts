import { DB_CONFIG} from '../config';
import mysql from 'mysql2/promise';

class UsuariosRepository{
    private connection;

    constructor(){
        this.connection = mysql.createPool({
            host: DB_CONFIG.host,
            user: 'root',
            password: '',
            database: DB_CONFIG.database

        })
    }

    /**
     * Inserta un nuevo usuario en la base de datos
     * @param nombre_usuario - El nombre de usuario
     * @param email - El correo electrónico del usuario
     * @param contrasena_hash - La contraseña crifrada del usuario
     * @returns El nuevo usuario creado
     */

     async crearUsuario(nombre_usuario: string, email: string, contrasena_hash: string){
        const [result] = await this.connection.execute(
            `INSERT INTO usuarios (nombre_usuario, email, contrasena_hash, nivel, experiencia, fecha_registro)
            VALUES (?, ?, ?, 1, 0, ?)`,
            [nombre_usuario, email, contrasena_hash, Date.now()]
        );

        const insertResult = result as mysql.ResultSetHeader;

        return {
            id: insertResult.insertId,
            nombre_usuario,
            email,
            nivel: 1,
            experiencia: 0,
            foto_perfil_url: null,
            banner_url: null,
            fecha_registro: Date.now()
        };
     }
}

export { UsuariosRepository }