import { obtenerDB } from "../db";

export class LikeRepository {
  async findLike(usuarioId: number, publicacionId: number): Promise<boolean> {
    const db = await obtenerDB();
    const [rows] = await db.execute(
      "SELECT 1 FROM likes WHERE usuario_id = ? AND publicacion_id = ? LIMIT 1",
      [usuarioId, publicacionId]
    );
    return (rows as any[]).length > 0;
  }

  async createLike(usuarioId: number, publicacionId: number): Promise<void> {
    const db = await obtenerDB();
    await db.execute(
      "INSERT INTO likes (usuario_id, publicacion_id) VALUES (?, ?)",
      [usuarioId, publicacionId]
    );
  }

  async deleteLike(usuarioId: number, publicacionId: number): Promise<void> {
    const db = await obtenerDB();
    await db.execute(
      "DELETE FROM likes WHERE usuario_id = ? AND publicacion_id = ?",
      [usuarioId, publicacionId]
    );
  }

  async countLikes(publicacionId: number): Promise<number> {
    const db = await obtenerDB();
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM likes WHERE publicacion_id = ?",
      [publicacionId]
    );
    return (rows as any)[0].count;
  }
}
