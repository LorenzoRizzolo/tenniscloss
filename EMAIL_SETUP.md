# 📧 Configurazione Email - Tennis Borgata Closs

## Sommario del Problema
L'errore `Error: Missing credentials for "PLAIN"` significa che il server non riesce a autenticarsi al server SMTP. Questo può accadere per due motivi:

1. **Credenziali non valide** - Email o password sbagliati
2. **Configurazione SMTP** - Host o porta sbagliati

## Soluzioni Consigliate

### Opzione 1: Gmail (Consigliato per Test)
**Vantaggi:** Gratuito, facile da configurare

**Passaggi:**
1. Vai a https://myaccount.google.com/security
2. Attiva "Verifica in due passaggi"
3. Vai a https://myaccount.google.com/apppasswords
4. Genera una "Password per app" per "Mail"
5. Aggiorna `.env.local`:

```env
EMAIL_USER=tua-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # La password generata (senza spazi)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Opzione 2: Aruba (Attuale Configurazione)
**La configurazione attuale usa Aruba:**

```env
EMAIL_USER=info@rizzolo.cloud
EMAIL_PASSWORD=Rizzolo.34
SMTP_HOST=smtps.aruba.it
SMTP_PORT=465
```

**Problema Frequente:** La password potrebbe scadere o essere errata

**Come Risolvere:**
1. Accedi a https://www.aruba.it/
2. Verifica le credenziali dell'account email
3. Resetta la password se necessario
4. Aggiorna `.env.local` con le credenziali corrette

### Opzione 3: SendGrid (Per Produzione)
**Vantaggi:** Professionale, affidabile per grandi volumi

```env
EMAIL_USER=apikey  # Fisso
EMAIL_PASSWORD=SG.xxxxx...  # La tua chiave API SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

## Come Testare la Configurazione

### 1. Verifica Variabili di Ambiente
```bash
cat .env.local | grep EMAIL
```

### 2. Test di Connessione Manuale
```bash
# Su macOS
openssl s_client -connect smtps.aruba.it:465

# Su Linux
telnet smtp.gmail.com 587
```

### 3. Verifica nel Codice
Nel file `src/lib/server/email.js`, il codice ora supporta:
- **Port 587**: TLS (per Gmail, Mailgun, ecc.)
- **Port 465**: SSL/SMTPS (per Aruba, ecc.)

La configurazione si adatta automaticamente.

## Errori Comuni e Soluzioni

| Errore | Causa | Soluzione |
|--------|-------|----------|
| `Error: Missing credentials for "PLAIN"` | Credenziali mancanti o errate | Verifica EMAIL_USER e EMAIL_PASSWORD |
| `Error: connect ECONNREFUSED` | Porta o host sbagliati | Controlla SMTP_HOST e SMTP_PORT |
| `Error: connect ETIMEDOUT` | Firewall o rete | Verifica la connettività di rete |
| `535 5.7.8 Error: authentication failed` | Password errata | Reimposta la password del servizio email |

## Per Sviluppo/Test

Se vuoi disabilitare temporaneamente gli email per test:

Modifica `src/lib/server/email.js`:
```javascript
export async function sendOTPEmail(email, otp, name) {
console.log(`📧 OTP per ${email}: ${otp}`);
return true; // Restituisci true senza inviare email
}
```

## Prossimi Passi

1. ✅ Verifica le credenziali nel `.env.local`
2. ✅ Testa la connessione SMTP
3. ✅ Avvia il dev server: `npm run dev`
4. ✅ Testa la registrazione con un account di prova
5. ✅ Controlla la console per vedere il codice OTP se le email non funzionano

---

**Nota:** Le email sono opzionali per il funzionamento del sito. Se preferisci, puoi:
- Visualizzare i codici OTP nella console del server
- Skippare la verifica email durante lo sviluppo
- Implementare un sistema di test per gli OTP

