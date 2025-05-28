import { obtenerDB } from '../db';
import { agregarExperiencia } from './experiencia-utils';

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

  // Sumar experiencia
  await agregarExperiencia(usuarioId, logro.experiencia);
}