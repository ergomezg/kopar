/**
 * Utility to format currency values using dot (.) as thousands separator and without decimals.
 * Example: 250000 -> "$250.000" or "COP $250.000"
 */
export function formatAmount(amount: number, currencyPrefix = '$'): string {
  const rounded = Math.round(amount);
  const formattedNumber = rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${currencyPrefix}${formattedNumber}`;
}

export function formatNumberOnly(amount: number): string {
  const rounded = Math.round(amount);
  return rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formats any date string (YYYY-MM-DD or ISO) into standard DD/MM/AAAA format.
 * Example: '2026-08-12' -> '12/08/2026'
 */
export function formatDateDDMMAAAA(dateStr: string): string {
  if (!dateStr) return '';
  // Check if already in DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  
  // Format YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const yyyy = parts[0];
    const mm = parts[1].padStart(2, '0');
    const dd = parts[2].split('T')[0].padStart(2, '0');
    return `${dd}/${mm}/${yyyy}`;
  }

  // Fallback parsing
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return dateStr;
}

/**
 * Returns a human-friendly relative date in Spanish according to the rules:
 * - If today -> "Hoy"
 * - If yesterday -> "Ayer"
 * - If before yesterday -> date in DD/MM/AAAA format (e.g. "12/08/2026")
 */
export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return formatDateDDMMAAAA(dateStr);
  
  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  
  return formatDateDDMMAAAA(dateStr);
}

/**
 * Formats user full name to "Nombre + Inicial del apellido"
 * Example: "Carlos Gómez" -> "Carlos G."
 * Example: "Mateo Hernández" -> "Mateo H."
 * Example: "Sofía Ramírez" -> "Sofía R."
 * Example: "Valentina Muñoz" -> "Valentina M."
 * Example: "Carlos" -> "Carlos"
 */
export function formatDisplayName(fullName?: string): string {
  if (!fullName) return 'Usuario';
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length <= 1) return trimmed;
  const firstName = parts[0];
  const lastNameInitial = parts[1].charAt(0).toUpperCase();
  return `${firstName} ${lastNameInitial}.`;
}


