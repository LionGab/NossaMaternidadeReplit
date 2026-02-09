/**
 * Admin Configuration
 * IDs de administradores autorizados
 *
 * IMPORTANTE: Adicione aqui os IDs do Supabase dos admins
 * Para encontrar seu ID: Supabase Dashboard > Authentication > Users
 */

// IDs dos administradores (Supabase Auth User IDs)
export const ADMIN_USER_IDS: string[] = [
  // Adicione o ID da Nathalia Valente aqui
  // Exemplo: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
];

// Email dos administradores (fallback se ID não estiver configurado)
export const ADMIN_EMAILS: string[] = [
  "admin@nossamaternidade.com.br",
  "nathalia@nossamamaternidade.com.br",
  "nath@nossamamaternidade.com.br",
  // Adicione outros emails de admin aqui
];

/**
 * Verifica se um usuário é administrador
 */
export function isUserAdmin(userId?: string | null, email?: string | null): boolean {
  // Verificar por ID primeiro (mais seguro)
  if (userId && ADMIN_USER_IDS.length > 0) {
    if (ADMIN_USER_IDS.includes(userId)) {
      return true;
    }
  }

  // Fallback para email (menos seguro, mas útil em dev)
  if (email && ADMIN_EMAILS.length > 0) {
    const normalizedEmail = email.toLowerCase().trim();
    if (ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalizedEmail)) {
      return true;
    }
  }

  return false;
}
