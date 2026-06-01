// place files you want to import through the $lib alias in this folder.

export function translateStatus(s) {
    const map = {
        pending: 'In attesa',
        confirmed: 'Confermato',
        cancelled: 'Cancellato',
        completed: 'Completato'
    };
    return (map[s.toLowerCase()] || s).toUpperCase();
}

// Converte una data YYYY-MM-DD in DD-MM-YYYY
export function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
}

// Formatta una data ISO/timestamp in DD-MM-YYYY
export function formatTimestampDisplay(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}