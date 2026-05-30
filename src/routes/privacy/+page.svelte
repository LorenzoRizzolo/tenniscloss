<script>
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
</script>

<svelte:head>
	<title>Privacy Policy - Tennis Borgata Closs</title>
	<meta name="description" content="Privacy Policy for Tennis Borgata Closs" />
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
	<div class="max-w-3xl mx-auto">
		<div class="bg-slate-800 border border-slate-700 rounded-lg p-8">
			<h1 class="text-4xl font-bold text-white mb-8">🔒 Privacy Policy</h1>

			<div class="space-y-6 text-slate-300">
				<section>
					<h2 class="text-2xl font-bold text-white mb-3">1. Introduction</h2>
					<p>
						Tennis Borgata Closs ("we", "us", or "our") operates the Tennis Borgata Closs website.
						This page informs you of our policies regarding the collection, use, and disclosure of
						personal data when you use our service and the choices you have associated with that data.
					</p>
				</section>

				<section>
					<h2 class="text-2xl font-bold text-white mb-3">2. Data Collection</h2>
					<p>We collect the following personal data:</p>
					<ul class="list-disc pl-5 mt-2 space-y-1">
						<li>Name and surname</li>
						<li>Email address</li>
						<li>Booking information</li>
						<li>Usage data and analytics</li>
					</ul>
				</section>

				<section>
					<h2 class="text-2xl font-bold text-white mb-3">3. Use of Data</h2>
					<p>We use the collected data for various purposes:</p>
					<ul class="list-disc pl-5 mt-2 space-y-1">
						<li>To provide and maintain our service</li>
						<li>To notify you about changes to our service</li>
						<li>To allow you to participate in interactive features</li>
						<li>To provide customer support</li>
						<li>To gather analysis or valuable information</li>
						<li>To monitor the usage of our service</li>
					</ul>
				</section>

				<section>
					<h2 class="text-2xl font-bold text-white mb-3">4. Security of Data</h2>
					<p>
						The security of your data is important to us but remember that no method of transmission
						over the Internet or method of electronic storage is 100% secure. While we strive to use
						commercially acceptable means to protect your Personal Data, we cannot guarantee its
						absolute security.
					</p>
				</section>

				<section>
					<h2 class="text-2xl font-bold text-white mb-3">5. Contact Us</h2>
					<p>
						If you have any questions about this Privacy Policy, please contact us at:
						<br />
						📧 <strong>privacy@tennisborgatacloss.it</strong>
					</p>
				</section>

				<section class="pt-6 border-t border-slate-700">
					<p class="text-sm text-slate-400">
						Last updated: {new Date().toLocaleDateString()}
					</p>
				</section>
			</div>
		</div>
	</div>
</main>

<Footer />
