export const environment = {
  production: false,
  supabase: {
    url: 'https://wvzrilklvpaqzvehwyya.supabase.co',
    // Publishable key (sb_publishable_...) del sistema nuevo de API keys. Es
    // pública por diseño (respeta RLS) y se commitea, igual que la anon legacy
    // anterior. Sustituye a la anon JWT para poder desactivar las claves legacy.
    key: 'sb_publishable_SuCdevWBR8vZ-8IKgQ4Pgg_uuFC7bDG'
  }
};
