<script>
	import { onMount } from 'svelte';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';

	onMount(() => {
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

<main class="min-h-screen bg-gradient-to-br from-[#e8f5e0] via-[#f0f7ef] to-[#e0f0d8]">
	<!-- Hero Section -->
	<section class="relative h-screen flex items-center justify-center overflow-hidden">
		<div class="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]"></div>
		<div class="absolute inset-0">
			<div
				class="absolute top-0 -left-40 w-80 h-80 bg-[#8FBC8F] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
			></div>
			<div
				class="absolute top-0 -right-40 w-80 h-80 bg-[#c5e0b0] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
			></div>
			<div
				class="absolute -bottom-8 left-20 w-80 h-80 bg-[#5a8a3c] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
			></div>
		</div>

		<div class="relative z-10 text-center px-4">
			<h1 class="text-6xl md:text-8xl font-bold text-[#2d4a22] mb-6 tracking-tighter drop-shadow-sm">
				🎾 TENNIS BORGATA CLOSS
			</h1>
			<p class="text-xl md:text-2xl text-[#4a6d35] mb-8 font-light">
				L'esperienza di prenotazione del campo da tennis
			</p>
			<div class="flex gap-4 justify-center flex-wrap">
				<a
					href="/auth/register"
					class="px-8 py-3 bg-gradient-to-r from-[#5a8a3c] to-[#8FBC8F] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#5a8a3c]/40 transition transform hover:scale-105"
				>
					Inizia Ora
				</a>
				<a
					href="/auth/login"
					class="px-8 py-3 bg-white text-[#2d4a22] border-2 border-[#8FBC8F] font-bold rounded-lg hover:bg-[#f0f7ef] transition"
				>
					Accedi
				</a>
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section class="py-20 px-4 md:px-8 max-w-6xl mx-auto">
		<h2 class="text-4xl md:text-5xl font-bold text-[#2d4a22] text-center mb-16">Limiti di Prenotazione</h2>
		<div class="bg-gradient-to-r from-[#5a8a3c] to-[#8FBC8F] p-12 rounded-2xl text-center shadow-xl">
			<p class="text-white text-lg mb-4">Massima prenotazione giornaliera</p>
			<p class="text-6xl font-bold text-white mb-4">2 ORE</p>
			<p class="text-white/90">Al giorno per garantire accesso equo a tutti i giocatori</p>
		</div>
	</section>

	<!-- GDPR Notice -->
	<section class="py-12 px-4 md:px-8 bg-white/60 border-t border-[#c8e6c0]">
		<div class="max-w-4xl mx-auto">
			<p class="text-[#4a6d35] text-sm text-center">
				🔐 Siamo conformi al GDPR e rispettiamo la tua privacy. Tutti i dati personali sono gestiti in modo sicuro. Utilizzando questa piattaforma, accetti la nostra Politica sulla Privacy e la Politica sui Cookie.
				<a href="/privacy" class="text-[#5a8a3c] hover:text-[#8FBC8F] font-semibold"> Scopri di più</a>
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
