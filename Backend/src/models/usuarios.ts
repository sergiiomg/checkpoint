export interface Usuario{
    id: number;
    nombre: string;
    email: string;
    contrasena_hash: string;
    nivel: number;
    experiencia: number;
    mote_actual: string;
    foto_perfil_url?: string;
    banner_url?: string;
    fecha_registro: number;
}

export const DEFAULT_PROFILE_IMAGE = '/images/defaults/perfil-default.png';
export const DEFAULT_BANNER_IMAGE = '/images/defaults/banner-default.png';