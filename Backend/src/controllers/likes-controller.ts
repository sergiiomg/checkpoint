import { Request, Response } from "express";
import { LikeService } from "../services/likes-service";

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
