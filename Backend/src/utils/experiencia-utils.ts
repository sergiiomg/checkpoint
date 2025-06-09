import { obtenerDB } from '../db';
import { RowDataPacket } from 'mysql2';

export async function agregarExperiencia(usuarioId: number, cantidad: number) {
  const db = await obtenerDB();

  const [usuarios] = await db.query<RowDataPacket[]>(
    'SELECT nivel, experiencia FROM usuarios WHERE id = ?',
    [usuarioId]
  );
  if (usuarios.length === 0) return;

  let { nivel, experiencia } = usuarios[0];

  experiencia += cantidad;

  while (true) {
    const [niveles] = await db.query<RowDataPacket[]>(
      'SELECT experiencia_necesaria FROM niveles WHERE nivel = ?',
      [nivel]
    );

    if (niveles.length === 0) break;

    const xpNecesaria = niveles[0].experiencia_necesaria;

    if (experiencia >= xpNecesaria) {
      experiencia -= xpNecesaria;
      nivel += 1;
    } else {
      break;
    }
  }

  await db.query(
    'UPDATE usuarios SET nivel = ?, experiencia = ? WHERE id = ?',
    [nivel, experiencia, usuarioId]
  );
}
