// controllers/motes-controller.ts
import { Request, Response } from 'express';
import { obtenerDB } from '../db';
import { RowDataPacket } from 'mysql2';

export async function obtenerMotesDesbloqueados(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const db = await obtenerDB();

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT m.id, m.nombre, m.nivel_minimo, mu.fecha_desbloqueo
       FROM motes_usuarios mu
       JOIN motes m ON mu.mote_id = m.id
       WHERE mu.usuarios_id = ?`,
      [id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error obteniendo motes desbloqueados:', error);
    res.status(500).json({ error: 'Error al obtener los motes desbloqueados' });
  }
}
