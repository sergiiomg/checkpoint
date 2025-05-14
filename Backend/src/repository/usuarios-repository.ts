import { DB_CONFIG} from '../config';
import mysql from 'mysql2/promise';
import { obtenerDB } from '../db';
import { Usuario } from '../models/usuarios';
import { db } from '../db';

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

     async obtenerPorNombreUsuario(nombre_usuario: string): Promise<Usuario | null>{
        const conexion = await obtenerDB();

        const [filas] = await conexion.execute(
            'SELECT * FROM usuarios WHERE nombre_usuario = ?',
            [nombre_usuario]
        );

        const resultados = filas as Usuario[];
        return resultados.length > 0 ? resultados[0] : null;
     }

     async obtenerUsuarioPorId(id: number): Promise<Usuario | null>{
        const [rows] = await db!.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        const usuarios = rows as Usuario[];

        if(usuarios.length === 0) return null;

        return usuarios[0];
     }
}

export { UsuariosRepository }