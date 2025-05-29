import { obtenerDB } from '../db';
import { agregarExperiencia } from './experiencia-utils';
import { RowDataPacket } from 'mysql2';

export async function desbloquearLogro(usuarioId: number, claveLogro: string) {
  const db = await obtenerDB();

  // Verificar si el usuario ya tiene el logro
  const [existe] = await db.query(
    `SELECT 1 FROM logros_usuarios lu
     JOIN logros l ON l.id = lu.logro_id
     WHERE lu.usuario_id = ? AND l.clave = ?`,
    [usuarioId, claveLogro]
  );

  if ((existe as any[]).length > 0) return; // Ya desbloqueado

  // Obtener el ID del logro y su experiencia
  const [rows] = await db.query(
    `SELECT id, experiencia FROM logros WHERE clave = ?`,
    [claveLogro]
  );

  if ((rows as any[]).length === 0) return;

  const logro = (rows as any)[0];

  // Insertar en logros_usuarios
  await db.query(
    `INSERT INTO logros_usuarios (usuario_id, logro_id, fecha_desbloqueo)
     VALUES (?, ?, NOW())`,
    [usuarioId, logro.id]
  );

  // Justo después de otorgar el logro
  const [logrosUsuario] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM logros_usuarios WHERE usuario_id = ?',
    [usuarioId]
  );
  
  const totalLogros = logrosUsuario[0].total;
  
  // Solo intenta desbloquear si ha llegado a 10 y aún no lo tiene
  if (totalLogros === 10) {
    await desbloquearLogro(usuarioId, 'COMPLETISTA');
  }

  if (totalLogros === 20) {
    await desbloquearLogro(usuarioId, 'MAESTRO_DEL_LOGRO');
  }

  // Sumar experiencia
  await agregarExperiencia(usuarioId, logro.experiencia);
}

export async function verificarAmistadYDesbloquear(usuarioId: number, seguidoId: number) {
  const db = await obtenerDB();

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT 1 FROM seguimientos s1
     JOIN seguimientos s2
       ON s1.seguidor_id = s2.seguido_id AND s1.seguido_id = s2.seguidor_id
     WHERE s1.seguidor_id = ? AND s1.seguido_id = ?`,
    [usuarioId, seguidoId]
  );

  // Si hay amistad mutua, desbloquea para ambos
  if (rows.length > 0) {
    await desbloquearLogro(usuarioId, 'AMISTAD_VERDADERA');
    await desbloquearLogro(seguidoId, 'AMISTAD_VERDADERA');
  }
}
