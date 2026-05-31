<script>
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';

	let email = $state('');
	let name = $state('');
	let surname = $state('');
	let isLoading = $state(false);
	let message = $state('');
	let isError = $state(false);

	async function requestOTP(e) {
		e.preventDefault();
		isLoading = true;
		message = '';
		isError = false;

		try {
			const response = await fetch('/api/auth/request-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, name, surname })
			});

			const data = await response.json();

			if (response.ok) {
				message = data.message;
				localStorage.setItem('pendingEmail', email);
				localStorage.setItem('pendingNome', name);
				localStorage.setItem('pendingCognome', surname);
				setTimeout(() => goto('/auth/verify-otp'), 1500);
			} else {
				isError = true;
				message = data.error || "Errore nell'invio del codice OTP";
			}
		} catch (error) {
			isError = true;
			message = 'Si è verificato un errore. Riprova più tardi.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Registrazione - Tennis Borgata Closs</title>
	<meta name="description" content="Registrazione per Tennis Borgata Closs per iniziare a prenotare i campi da tennis" />
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
	<div class="max-w-md mx-auto">
		<div class="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-lg">
			<h1 class="text-3xl font-bold text-white mb-6 text-center">🎾 Registrazione</h1>

			{#if message}
				<div
					class="mb-4 p-3 rounded {isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}"
				>
					{message}
				</div>
			{/if}

			<form onsubmit={requestOTP} class="space-y-4">
				<div>
					<label for="name" class="block text-white text-sm font-bold mb-2">Nome</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						required
						class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none transition"
						placeholder="Il tuo nome"
					/>
				</div>

				<div>
					<label for="surname" class="block text-white text-sm font-bold mb-2">Cognome</label>
					<input
						type="text"
						id="surname"
						bind:value={surname}
						required
						class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none transition"
						placeholder="Il tuo cognome"
					/>
				</div>

				<div>
					<label for="email" class="block text-white text-sm font-bold mb-2">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none transition"
						placeholder="tua@email.com"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-3 bg-gradient-to-r from-[#C5A94E] to-[#8FBC8F] text-white font-bold rounded hover:shadow-lg hover:shadow-[#C5A94E]/50 disabled:opacity-50 transition"
				>
					{isLoading ? "Invio in corso..." : "Invia Codice di Verifica"}
				</button>
			</form>

			<p class="text-center text-slate-400 mt-6">
				Già registrato?
				<a href="/auth/login" class="text-[#C5A94E] hover:text-[#8FBC8F] font-bold">Accedi</a>
			</p>
		</div>
	</div>
</main>

<Footer />
