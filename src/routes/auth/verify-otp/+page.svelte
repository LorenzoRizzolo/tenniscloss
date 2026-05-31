<script>
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	import { onMount } from 'svelte';

	let otp = $state('');
	let password = $state('');
	let passwordConfirm = $state('');
	let showPassword = $state(false);
	let showPasswordConfirm = $state(false);
	let isLoading = $state(false);
	let message = $state('');
	let isError = $state(false);
	let email = $state('');
	let name = $state('');
	let surname = $state('');

	onMount(() => {
		email = localStorage.getItem('pendingEmail') || '';
		name = localStorage.getItem('pendingNome') || '';
		surname = localStorage.getItem('pendingCognome') || '';

		if (!email) {
			goto('/auth/register');
		}
	});

	async function verifyOTP(e) {
		e.preventDefault();
		if (password !== passwordConfirm) {
			isError = true;
			message = "Le password non corrispondono";
			return;
		}

		isLoading = true;
		message = '';
		isError = false;

		try {
			const response = await fetch('/api/auth/verify-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, otp, password, name, surname })
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem('authToken', data.token);
				localStorage.setItem('user', JSON.stringify(data.user));
				
				// Save token in cookie too
				document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
				
				message = "Registrazione avvenuta con successo! Reindirizzamento...";
				setTimeout(() => goto('/auth/login'), 1500);
			} else {
				isError = true;
				if (Array.isArray(data.error)) {
					message = data.error.join(', ');
				} else {
					message = data.error || "Verifica non riuscita";
				}
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
	<title>Verifica OTP - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
	<div class="max-w-md mx-auto">
		<div class="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-lg">
			<h1 class="text-3xl font-bold text-white mb-6 text-center">🎾 Verifica OTP</h1>

			{#if message}
				<div
					class="mb-4 p-3 rounded {isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}"
				>
					{message}
				</div>
			{/if}

			<form onsubmit={verifyOTP} class="space-y-4">
				<div>
					<label for="otp" class="block text-white text-sm font-bold mb-2">Codice di Verifica</label>
					<input
						type="text"
						id="otp"
						bind:value={otp}
						maxlength="6"
						required
						class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none transition text-center text-2xl tracking-widest"
						placeholder="000000"
					/>
					<p class="text-slate-400 text-sm mt-2">Controlla la tua email per il codice a 6 cifre</p>
				</div>

				<div>
					<label for="password" class="block text-white text-sm font-bold mb-2">Password</label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							bind:value={password}
							required
							class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none transition pr-10"
							placeholder="Almeno 8 caratteri"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition"
							title={showPassword ? 'Nascondi' : 'Mostra'}
						>
							{#if showPassword}
								👁️
							{:else}
								👁️‍🗨️
							{/if}
						</button>
					</div>
					<!-- <p class="text-slate-400 text-xs mt-1">
						Deve contenere: maiuscola, minuscola, numero, carattere speciale (!@#$%^&*)
					</p> -->
				</div>

				<div>
					<label for="passwordConfirm" class="block text-white text-sm font-bold mb-2">
						Conferma Password
					</label>
					<div class="relative">
						<input
							type={showPasswordConfirm ? 'text' : 'password'}
							id="passwordConfirm"
							bind:value={passwordConfirm}
							required
							class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none transition pr-10"
							placeholder="Conferma password"
						/>
						<button
							type="button"
							onclick={() => (showPasswordConfirm = !showPasswordConfirm)}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition"
							title={showPasswordConfirm ? 'Nascondi' : 'Mostra'}
						>
							{#if showPasswordConfirm}
								👁️
							{:else}
								👁️‍🗨️
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading || !otp || !password || !passwordConfirm}
					class="w-full py-3 bg-gradient-to-r from-[#C5A94E] to-[#8FBC8F] text-white font-bold rounded hover:shadow-lg hover:shadow-[#C5A94E]/50 disabled:opacity-50 transition"
				>
					{isLoading ? "Verifica in corso..." : "Verifica e Completa Registrazione"}
				</button>
			</form>

			<p class="text-center text-slate-400 mt-6 text-sm">
				<a href="/auth/register" class="text-[#C5A94E] hover:text-[#8FBC8F]">Torna alla registrazione</a>
			</p>
		</div>
	</div>
</main>

<Footer />
