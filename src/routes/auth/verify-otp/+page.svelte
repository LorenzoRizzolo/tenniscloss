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

<main class="min-h-screen bg-gradient-to-br from-[#e8f5e0] via-[#f0f7ef] to-[#e0f0d8] py-20 px-4">
	<div class="max-w-md mx-auto">
		<div class="bg-white border border-[#c8e6c0] rounded-lg p-8 shadow-lg">
			<h1 class="text-3xl font-bold text-[#2d4a22] mb-6 text-center">🎾 Verifica OTP</h1>

			{#if message}
				<div
					class="mb-4 p-3 rounded {isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}"
				>
					{message}
				</div>
			{/if}

			<form onsubmit={verifyOTP} class="space-y-4">
				<div>
					<label for="otp" class="block text-[#2d4a22] text-sm font-bold mb-2">Codice di Verifica</label>
					<input
						type="text"
						id="otp"
						bind:value={otp}
						maxlength="6"
						required
						class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none transition text-center text-2xl tracking-widest"
						placeholder="000000"
					/>
					<p class="text-[#4a6d35] text-sm mt-2">Controlla la tua email per il codice a 6 cifre</p>
				</div>

				<div>
					<label for="password" class="block text-[#2d4a22] text-sm font-bold mb-2">Password</label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							bind:value={password}
							required
							class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none transition pr-10"
							placeholder="Almeno 8 caratteri"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4a6d35] hover:text-[#2d4a22] transition"
							title={showPassword ? 'Nascondi' : 'Mostra'}
						>
							{#if showPassword}
								👁️
							{:else}
								👁️‍🗨️
							{/if}
						</button>
					</div>
				</div>

				<div>
					<label for="passwordConfirm" class="block text-[#2d4a22] text-sm font-bold mb-2">
						Conferma Password
					</label>
					<div class="relative">
						<input
							type={showPasswordConfirm ? 'text' : 'password'}
							id="passwordConfirm"
							bind:value={passwordConfirm}
							required
							class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none transition pr-10"
							placeholder="Conferma password"
						/>
						<button
							type="button"
							onclick={() => (showPasswordConfirm = !showPasswordConfirm)}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4a6d35] hover:text-[#2d4a22] transition"
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
					class="w-full py-3 bg-gradient-to-r from-[#5a8a3c] to-[#8FBC8F] text-white font-bold rounded hover:shadow-lg hover:shadow-[#5a8a3c]/40 disabled:opacity-50 transition"
				>
					{isLoading ? "Verifica in corso..." : "Verifica e Completa Registrazione"}
				</button>
			</form>

			<p class="text-center text-[#4a6d35] mt-6 text-sm">
				<a href="/auth/register" class="text-[#5a8a3c] hover:text-[#8FBC8F]">Torna alla registrazione</a>
			</p>
		</div>
	</div>
</main>

<Footer />
