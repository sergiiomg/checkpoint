import { Request, Response } from "express";
import { LikeService } from "../services/likes-service";
import { obtenerDB } from "../db";

const likeService = new LikeService();

export const toggleLikeController = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req as any).user?.id;
  const { publicacionId } = req.params;

  if (!usuarioId || !publicacionId) {
     res.status(400).json({ message: "Faltan datos necesarios" });
  }

  try {
    const result = await likeService.toggleLike(usuarioId, parseInt(publicacionId));
     res.status(200).json(result); // { liked: true/false, totalLikes: X }
  } catch (error) {
    console.error("Error al hacer like:", error);
     res.status(500).json({ message: "Error interno del servidor" });
  }

  
};

// Obtener publicaciones que el usuario ha dado like
export const obtenerPublicacionesLikeadas = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req as any).user?.id;
  if (!usuarioId) res.status(401).json({ message: 'No autorizado' });

  try {
    const db = await obtenerDB();
    const [rows] = await db.execute(
      'SELECT publicacion_id FROM likes WHERE usuario_id = ?',
      [usuarioId]
    );

    const publicacionesLikeadas = (rows as any[]).map(row => row.publicacion_id);
    res.status(200).json(publicacionesLikeadas);
  } catch (err) {
    console.error('Error al obtener publicaciones likeadas:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


