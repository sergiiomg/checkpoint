import { obtenerDB } from '../db';
import { RowDataPacket } from 'mysql2';

export async function desbloquearMotes(usuarioId: number, nivelActual: number): Promise<void> {
  const db = await obtenerDB();

  // Obtener todos los motes desbloqueables por el nivel actual
  const [motes] = await db.query<RowDataPacket[]>(
    `SELECT id FROM motes WHERE nivel_minimo = ?`,
    [nivelActual]
  );

  if (motes.length === 0) return;

  for (const mote of motes) {
    // Comprobar si ya lo tiene
    const [existe] = await db.query<RowDataPacket[]>(
      `SELECT 1 FROM motes_usuarios WHERE usuario_id = ? AND mote_id = ?`,
      [usuarioId, mote.id]
    );

    if (existe.length === 0) {
      // Insertar
      await db.query(
        `INSERT INTO motes_usuarios (usuario_id, mote_id, fecha_desbloqueo)
         VALUES (?, ?, NOW())`,
        [usuarioId, mote.id]
      );
    }
  }
}
