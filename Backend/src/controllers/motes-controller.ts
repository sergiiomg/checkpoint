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
  const moteId = parseInt(req.params.id, 10);

  if (!usuarioId) {
    res.status(401).json({ message: 'No autorizado' });
    return;
  }

  if (isNaN(moteId)) {
    res.status(400).json({ message: 'ID de mote inválido' });
    return;
  }

  try {
    const db = await obtenerDB();

    // Obtener datos del usuario (nivel)
    const [usuariosResult] = await db.execute(
      'SELECT nivel FROM usuarios WHERE id = ?',
      [usuarioId]
    );
    const usuarios = usuariosResult as RowDataPacket[];
    const usuario = usuarios[0];
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Obtener info del mote
    const [motesResult] = await db.execute(
      'SELECT nombre, nivel_minimo FROM motes WHERE id = ?',
      [moteId]
    );
    const motes = motesResult as RowDataPacket[];
    const mote = motes[0];
    if (!mote) {
      res.status(404).json({ message: 'Mote no encontrado' });
      return;
    }

    // Verificar si el usuario tiene desbloqueado el mote
    if (usuario.nivel < mote.nivel_minimo) {
      res.status(403).json({ message: 'No tienes el nivel necesario para este mote' });
      return;
    }

    // Actualizar mote_actual en la tabla usuarios
    await db.execute(
      'UPDATE usuarios SET mote_actual = ? WHERE id = ?',
      [moteId, usuarioId]
    );

    res.status(200).json({ message: '✅ Mote actualizado correctamente', mote_actual: mote.nombre });
  } catch (error) {
    console.error('❌ Error al seleccionar mote:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};