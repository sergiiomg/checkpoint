import { obtenerDB } from '../db';
import { desbloquearLogro } from './logros';
import { RowDataPacket } from 'mysql2';

export async function registrarAccionDiaria(
  usuarioId: number,
  accion: 'PUBLICAR' | 'COMENTAR' | 'LIKE' | 'SEGUIR' | 'MOTE'
) {
  const db = await obtenerDB();
  const hoy = new Date().toISOString().split('T')[0];

  try {
    await db.query(
      'INSERT IGNORE INTO acciones_diarias (usuario_id, fecha, accion) VALUES (?, ?, ?)',
      [usuarioId, hoy, accion]
    );

    const [acciones] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(DISTINCT accion) AS total FROM acciones_diarias WHERE usuario_id = ? AND fecha = ?',
      [usuarioId, hoy]
    );

    if (acciones[0].total === 5) {
      await desbloquearLogro(usuarioId, 'DIA_PRODUCTIVO');
    }
  } catch (error) {
    console.error('Error registrando acción diaria:', error);
  }
}
