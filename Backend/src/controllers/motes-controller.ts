import { Request, Response } from 'express';
import { obtenerDB } from '../db';

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
