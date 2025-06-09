import { Request, Response } from 'express';
import { obtenerDB } from '../db';
import { RowDataPacket } from 'mysql2/promise';

export const obtenerMotes = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req as any).user?.id;

  if (!usuarioId) {
     res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const db = await obtenerDB();

    // Obtener nivel del usuario
    const [usuarios] = await db.execute(
      'SELECT nivel FROM usuarios WHERE id = ?',
      [usuarioId]
    );

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
       res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = (usuarios as any[])[0];
    const nivelUsuario = usuario.nivel;

    // Obtener todos los motes
    const [motes] = await db.execute(
      'SELECT id, nombre, descripcion, nivel_minimo FROM motes ORDER BY nivel_minimo ASC'
    );

    // Obtener motes desbloqueados por el usuario
    const [motesDesbloqueados] = await db.execute(
      'SELECT mote_id FROM motes_usuarios WHERE usuario_id = ?',
      [usuarioId]
    );
    const desbloqueadosIds = new Set((motesDesbloqueados as any[]).map(m => m.mote_id));

    // Preparar respuesta
    const motesFormateados = (motes as any[]).map(mote => ({
      ...mote,
      desbloqueado: nivelUsuario >= mote.nivel_minimo || desbloqueadosIds.has(mote.id)
    }));

    res.status(200).json(motesFormateados);
  } catch (err) {
    console.error('Error al obtener motes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const seleccionarMote = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req as any).user?.id;
  const moteId = req.params.id ? parseInt(req.params.id, 10) : null;

  if (!usuarioId) {
     res.status(401).json({ message: 'No autorizado' });
  }

  const db = await obtenerDB();

  // Si no se proporciona un ID de mote, quitar el mote
  if (moteId === null || isNaN(moteId)) {
    await db.execute('UPDATE usuarios SET mote_actual = NULL WHERE id = ?', [usuarioId]);
     res.status(200).json({ message: '✅ Mote quitado correctamente' });
  }

  // Obtener datos del usuario (nivel)
  const [usuariosResult] = await db.execute(
    'SELECT nivel FROM usuarios WHERE id = ?',
    [usuarioId]
  );
  const usuario = (usuariosResult as RowDataPacket[])[0];
  if (!usuario) {
     res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Obtener info del mote
  const [motesResult] = await db.execute(
    'SELECT id, nombre, nivel_minimo FROM motes WHERE id = ?',
    [moteId]
  );
  const mote = (motesResult as RowDataPacket[])[0];
  if (!mote) {
     res.status(404).json({ message: 'Mote no encontrado' });
  }

  if (usuario.nivel < mote.nivel_minimo) {
     res.status(403).json({ message: 'No tienes el nivel necesario para este mote' });
  }

  // ✅ Actualizar mote_actual (ahora con ID del mote, no nombre)
  await db.execute(
    'UPDATE usuarios SET mote_actual = ? WHERE id = ?',
    [mote.nombre, usuarioId]
  );

   res.status(200).json({ message: '✅ Mote actualizado correctamente', mote_actual: mote.nombre });
};


