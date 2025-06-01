// controllers/motes-controller.ts
import { Request, Response } from 'express';
import { obtenerDB } from '../db';
import { RowDataPacket } from 'mysql2';
import { registrarAccionDiaria } from '../utils/registrarActividadDiaria';

export async function obtenerTodosLosMotesConEstado(req: Request, res: Response) {
  const usuarioId = (req as any).user?.id;

  try {
    const db = await obtenerDB();

    // Obtener mote actual
    const [usuarioRow] = await db.query(`SELECT mote_actual FROM usuarios WHERE id = ?`, [usuarioId]);
    const moteActual = (usuarioRow as any)[0]?.mote_actual;

    // Obtener todos los motes con estado
    const [motes] = await db.query(`
      SELECT m.id, m.nombre, m.descripcion ,m.nivel_minimo,
        CASE
          WHEN mu.usuario_id IS NOT NULL AND m.id = ? THEN 'Aplicado'
          WHEN mu.usuario_id IS NOT NULL THEN 'Aplicar'
          ELSE 'Bloqueado'
        END AS estado
      FROM motes m
      LEFT JOIN motes_usuarios mu ON m.id = mu.mote_id AND mu.usuario_id = ?
    `, [moteActual, usuarioId]);

    res.status(200).json(motes);
  } catch (err) {
    console.error('Error al obtener motes con estado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function seleccionarMote(req: Request, res: Response): Promise<void> {
  const usuarioId = (req as any).user?.id;
  const { moteId } = req.body;

  if (!usuarioId || !moteId) {
    res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const db = await obtenerDB();

    // Verificar que el mote está desbloqueado por el usuario
    const [mote] = await db.query(
      `SELECT 1 FROM motes_usuarios WHERE usuario_id = ? AND mote_id = ?`,
      [usuarioId, moteId]
    );

    if ((mote as any[]).length === 0) {
      res.status(403).json({ error: 'Este mote no está desbloqueado' });
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

