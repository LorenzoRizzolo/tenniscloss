// Italian translations for Tennis Borgata Closs
export const it = {
	// Navigation
	navbar: {
		home: 'Home',
		login: 'Accedi',
		register: 'Registrati',
		admin: 'Admin',
		manager: 'Gestore',
		dashboard: 'Dashboard',
		logout: 'Esci'
	},

	// Footer
	footer: {
		copyright: '© 2024 Tennis Borgata Closs - Powered by',
		developedBy: 'Sviluppato da Rizzolo.cloud'
	},

	// Home page
	home: {
		title: 'Tennis Borgata Closs',
		subtitle: 'Prenota il tuo campo da tennis in pochi secondi',
		cta_booking: 'Prenota Ora',
		cta_learn: 'Scopri di Più',
		feature_easy: 'Prenotazione Facile',
		feature_easy_desc: 'Interfaccia intuitiva per prenotare il tuo slot',
		feature_secure: 'Sicuro',
		feature_secure_desc: 'Pagamenti sicuri e dati protetti',
		feature_fast: 'Veloce',
		feature_fast_desc: 'Conferma immediata della prenotazione',
		feature_otp: 'Verifica OTP',
		feature_otp_desc: 'Registrazione sicura tramite codice email',
		booking_limit: 'Limite di 2 ore al giorno per prenotazione',
		about: 'Su di noi',
		about_text: 'Offriamo il miglior servizio di prenotazione di campi da tennis'
	},

	// Registration
	auth: {
		register: 'Registrazione',
		name: 'Nome',
		surname: 'Cognome',
		email: 'Email',
		password: 'Password',
		password_confirm: 'Conferma Password',
		login: 'Accedi',
		register_button: 'Registrati',
		have_account: 'Hai già un account?',
		no_account: 'Non hai un account?',
		register_here: 'Registrati qui',
		otp_code: 'Codice OTP',
		otp_sent: 'Codice OTP inviato a',
		otp_verify: 'Verifica OTP',
		password_strength: 'Forza password',
		password_weak: 'Debole',
		password_medium: 'Media',
		password_strong: 'Forte',
		password_requirements: 'Almeno 8 caratteri, maiuscola, minuscola, numero e carattere speciale (!@#$%^&*)',
		passwords_match: 'Le password non corrispondono',
		verification_code: 'Codice di verifica',
		create_password: 'Crea una password',
		success: 'Successo!',
		error: 'Errore',
		redirecting: 'Reindirizzamento in corso...'
	},

	// Dashboard
	dashboard: {
		welcome: 'Benvenuto',
		my_bookings: 'Le mie prenotazioni',
		new_booking: '+ Nuova Prenotazione',
		create_booking: 'Crea Nuova Prenotazione',
		date: 'Data',
		start_time: 'Inizio',
		end_time: 'Fine',
		notes: 'Note (opzionale)',
		notes_placeholder: 'Aggiungi note speciali...',
		create_button: 'Conferma Prenotazione',
		confirm_button: 'Conferma Prenotazione',
		cancel: 'Annulla',
		booking_created: 'Prenotazione creata con successo! In attesa della conferma del gestore.',
		booking_error: 'Impossibile creare la prenotazione',
		booking_limit_error: 'Hai raggiunto il limite di 2 ore al giorno',
		conflict_error: 'Questo orario è già prenotato',
		no_bookings: 'Nessuna prenotazione ancora. Crea una per iniziare!',
		status: 'Stato',
		pending: 'In Attesa',
		confirmed: 'Confermato',
		cancelled: 'Cancellato',
		cancel_booking_btn: 'Cancella',
		cancel_booking_confirm: 'Sei sicuro di voler cancellare questa prenotazione?',
		booking_cancelled_msg: 'Prenotazione cancellata ✓',
		cancel_booking_error: "Errore nella cancellazione della prenotazione",
		completed: 'Completato',
		actions: 'Azioni',
		duration: 'Durata',
		minutes: 'minuti',
		select_time: '-- Seleziona orario --',
		hours_short: 'h',
		min_short: 'min',
		duration_info: '⏱️ Durata',
		duration_valid: '✓ Valido',
		duration_max_error: '❌ Supera il limite di 2 ore!',
		duration_reduce: 'Riduci la durata a massimo 2 ore (120 minuti)',
		error_end_after_start: 'L\'ora di fine deve essere successiva all\'ora di inizio',
		error_max_duration: 'La prenotazione non può superare 2 ore. Durata attuale',
		manage_bookings: 'Gestisci le tue prenotazioni del campo da tennis'
	},

	// Admin
	admin: {
		admin_dashboard: 'Dashboard Admin',
		statistics: 'Statistiche',
		total_users: 'Utenti Totali',
		total_bookings: 'Prenotazioni Totali',
		pending_bookings: 'Prenotazioni in Attesa',
		confirmed_bookings: 'Prenotazioni Confermate',
		add_user: '+ Aggiungi Utente',
		users: 'Utenti',
		bookings: 'Prenotazioni',
		role: 'Ruolo',
		admin_role: 'Admin',
		manager_role: 'Gestore',
		user_role: 'Utente',
		user_created: 'Utente creato con successo!',
		user_error: 'Errore nella creazione dell\'utente',
		required_fields: 'Tutti i campi sono obbligatori',
		temp_password: 'Password temporanea',
		delete_user: '🗑️ Elimina',
		user_deleted: 'Utente eliminato con successo!',
		delete_user_error: 'Errore nell\'eliminazione dell\'utente',
		confirm_delete_user: 'Sei sicuro di voler eliminare questo utente? Questa azione è irreversibile!',
		verified: 'Verificato',
		actions: 'Azioni',
		edit_user: '✏️ Modifica',
		edit_user_title: 'Modifica Utente',
		user_updated: 'Utente modificato con successo!',
		edit_user_error: "Errore nella modifica dell'utente",
		save_changes: '💾 Salva Modifiche'
	},

	// Manager
	manager: {
		manager_dashboard: 'Dashboard Gestore',
		pending_bookings: 'Prenotazioni in Attesa di Conferma',
		booking_id: 'ID Prenotazione',
		user: 'Utente',
		confirm: '✓ Conferma',
		cancel: '✗ Annulla',
		confirmed: 'Prenotazione confermata!',
		cancelled: 'Prenotazione cancellata!',
		booking_confirmed: 'Prenotazione confermata',
		booking_cancelled: 'Prenotazione cancellata'
	},

	// Calendar
	calendar: {
		title: 'Calendario Prenotazioni',
		subtitle: 'Visualizza le disponibilità dei campi',
		previous_day: '← Giorno Precedente',
		next_day: 'Giorno Successivo →',
		jump_to_date: 'Salta a data',
		go_button: '✓ Vai',
		available: 'Disponibile ✓',
		loading: 'Caricamento...',
		booked_by: 'Prenotato da'
	},

	// Privacy & GDPR
	privacy: {
		privacy_policy: 'Politica sulla Privacy',
		gdpr: 'Conformità GDPR',
		data_rights: 'I Tuoi Diritti sui Dati',
		access_data: 'Accesso ai Dati',
		delete_account: 'Elimina Account',
		export_data: 'Esporta Dati',
		contact_us: 'Contattaci'
	},

	// Error messages
	errors: {
		internal_error: 'Errore interno del server',
		invalid_email: 'Email non valida',
		invalid_password: 'Password non valida',
		email_required: 'Email richiesta',
		password_required: 'Password richiesta',
		otp_invalid: 'Codice OTP non valido o scaduto',
		email_exists: 'Email già registrata',
		unauthorized: 'Non autorizzato',
		not_found: 'Non trovato',
		server_error: 'Errore del server. Riprova più tardi.'
	},

	// Success messages
	success: {
		otp_sent: 'Codice OTP inviato con successo',
		account_created: 'Account creato con successo!',
		login_success: 'Accesso effettuato con successo!',
		booking_created: 'Prenotazione creata con successo!',
		updated: 'Aggiornato con successo!'
	}
};
