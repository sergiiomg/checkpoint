export interface Usuario {
    id: number;
    nombre_usuario: string;
    email: string;
    contrasena_hash: string;
    nivel: number;
    experiencia: number;
    mote_actual: string;
    foto_perfil_url?: string;
    banner_url?: string;
    fecha_registro: number;
    seguidores_count?: number;
    seguidos_count?: number;
}

export const DEFAULT_PROFILE_IMAGE = '/images/defaults/perfil-default.png';
export const DEFAULT_BANNER_IMAGE = '/images/defaults/banner-default.png';