// controllers/motes-controller.ts
import { Request, Response } from 'express';
import { obtenerDB } from '../db';
import { RowDataPacket } from 'mysql2';
import { registrarAccionDiaria } from '../utils/registrarActividadDiaria';

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

export async function seleccionarMote(req: Request, res: Response) {
  const usuarioId = (req as any).user?.id;
  const { moteId } = req.body;

  if (!usuarioId || !moteId) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const db = await obtenerDB();

    // Verificar que el mote está desbloqueado por el usuario
    const [mote] = await db.query(
      `SELECT 1 FROM motes_usuarios WHERE usuario_id = ? AND mote_id = ?`,
      [usuarioId, moteId]
    );

    if ((mote as any[]).length === 0) {
      return res.status(403).json({ error: 'Este mote no está desbloqueado' });
    }

    // Actualizar el mote actual
    await db.query(
      `UPDATE usuarios SET mote_actual = ? WHERE id = ?`,
      [moteId, usuarioId]
    );

    // Registrar acción diaria
    await registrarAccionDiaria(usuarioId, 'MOTE');

    res.status(200).json({ mensaje: 'Mote seleccionado correctamente' });
  } catch (err) {
    console.error('Error al seleccionar mote:', err);
    res.status(500).json({ error: 'Error interno al seleccionar mote' });
  }
}

