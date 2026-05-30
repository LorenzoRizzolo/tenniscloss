// place files you want to import through the `$lib` alias in this folder.

export function translateStatus(s) {

    let status = ''
    switch (s.toLowerCase()) {
        case 'pending':
            status = 'In sospeso';
            break;
        case 'confirmed':
            status = 'Confermato';
            break;
        case 'cancelled':
            status = 'Cancellato';
            break;
        default:
            return status;
    }

    return status.toUpperCase();
}