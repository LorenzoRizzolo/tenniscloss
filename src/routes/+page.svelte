<script>
	import { onMount } from 'svelte';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';

	onMount(() => {
		// Initialize animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -100px 0px'
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-in');
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
	});
</script>

<svelte:head>
	<title>Tennis Borgata Closs - Prenota il Tuo Campo da Tennis</title>
	<meta name="description" content="Prenota il tuo campo da tennis presso Tennis Borgata Closs. Prenotazioni online facili con gestione professionale." />
	<meta name="keywords" content="tennis, prenotazione, campo, sport, borgata closs" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta property="og:title" content="Tennis Borgata Closs - Prenota il Tuo Campo da Tennis" />
	<meta property="og:description" content="Prenota il tuo campo da tennis online facilmente" />
	<meta property="og:type" content="website" />
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
	<!-- Hero Section with 3D effect -->
	<section class="relative h-screen flex items-center justify-center overflow-hidden">
		<div class="absolute inset-0 bg-[url('/noise.svg')] opacity-5"></div>
		<div class="absolute inset-0">
			<div
				class="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
			></div>
			<div
				class="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
			></div>
			<div
				class="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
			></div>
		</div>

		<div class="relative z-10 text-center px-4">
			<h1 class="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter">
				🎾 TENNIS BORGATA CLOSS
			</h1>
			<p class="text-xl md:text-2xl text-slate-300 mb-8 font-light">
				L'esperienza di prenotazione del campo da tennis
			</p>
			<div class="flex gap-4 justify-center flex-wrap">
				<a
					href="/auth/register"
					class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
				>
					Inizia Ora
				</a>
				<a
					href="/auth/login"
					class="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
				>
					Accedi
				</a>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<!-- <section class="py-20 px-4 md:px-8 max-w-6xl mx-auto">
		<h2 class="text-4xl md:text-5xl font-bold text-white text-center mb-16">Why Choose Us?</h2>
		<div class="grid md:grid-cols-3 gap-8">
			<div data-animate class="p-8 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500 transition opacity-0" style="animation: fadeInUp 0.6s ease-out forwards;">
				<div class="text-4xl mb-4">⚡</div>
				<h3 class="text-xl font-bold text-white mb-3">Instant Booking</h3>
				<p class="text-slate-400">Book your court instantly with our simple and intuitive interface</p>
			</div>
			<div data-animate class="p-8 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500 transition opacity-0" style="animation: fadeInUp 0.6s ease-out 0.1s forwards;">
				<div class="text-4xl mb-4">🔒</div>
				<h3 class="text-xl font-bold text-white mb-3">Secure & Safe</h3>
				<p class="text-slate-400">Your data is protected with enterprise-grade security</p>
			</div>
			<div data-animate class="p-8 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500 transition opacity-0" style="animation: fadeInUp 0.6s ease-out 0.2s forwards;">
				<div class="text-4xl mb-4">📱</div>
				<h3 class="text-xl font-bold text-white mb-3">Mobile Ready</h3>
				<p class="text-slate-400">Access your bookings anytime, anywhere on any device</p>
			</div>
		</div>
	</section> -->

	<!-- Pricing Section -->
	<section class="py-20 px-4 md:px-8 max-w-6xl mx-auto">
		<h2 class="text-4xl md:text-5xl font-bold text-white text-center mb-16">Limiti di Prenotazione</h2>
		<div class="bg-gradient-to-r from-purple-600 to-pink-600 p-12 rounded-2xl text-center">
			<p class="text-white text-lg mb-4">Massima prenotazione giornaliera</p>
			<p class="text-6xl font-bold text-white mb-4">2 ORE</p>
			<p class="text-white text-opacity-90">Al giorno per garantire accesso equo a tutti i giocatori</p>
		</div>
	</section>

	<!-- GDPR Notice -->
	<section class="py-12 px-4 md:px-8 bg-slate-800 border-t border-slate-700">
		<div class="max-w-4xl mx-auto">
			<p class="text-slate-300 text-sm text-center">
				🔐 Siamo conformi al GDPR e rispettiamo la tua privacy. Tutti i dati personali sono gestiti in modo sicuro. Utilizzando questa piattaforma, accetti la nostra Politica sulla Privacy e la Politica sui Cookie.
				<a href="/privacy" class="text-purple-400 hover:text-purple-300"> Scopri di più</a>
			</p>
		</div>
	</section>
</main>

<Footer />

<style>
	@keyframes blob {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-blob) {
		animation: blob 7s infinite;
	}

	:global(.animation-delay-2000) {
		animation-delay: 2s;
	}

	:global(.animation-delay-4000) {
		animation-delay: 4s;
	}

	:global(.animate-in) {
		animation: fadeInUp 0.6s ease-out forwards;
	}
</style>
