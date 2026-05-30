<script>
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
</script>

<svelte:head>
	<title>GDPR Policy - Tennis Borgata Closs</title>
	<meta name="description" content="GDPR Policy and data rights for Tennis Borgata Closs" />
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
	<div class="max-w-3xl mx-auto">
		<div class="bg-slate-800 border border-slate-700 rounded-lg p-8">
			<h1 class="text-4xl font-bold text-white mb-8">📋 GDPR Compliance</h1>

			<div class="space-y-6 text-slate-300">
				<section>
					<h2 class="text-2xl font-bold text-white mb-3">Your Rights Under GDPR</h2>
					<p>Under the General Data Protection Regulation (GDPR), you have the following rights:</p>
				</section>

				<section>
					<h3 class="text-xl font-bold text-white mb-2">1. Right to Access</h3>
					<p>
						You have the right to request and obtain a copy of the personal data we hold about you.
					</p>
				</section>

				<section>
					<h3 class="text-xl font-bold text-white mb-2">2. Right to Rectification</h3>
					<p>
						You have the right to correct any inaccurate or incomplete personal data we hold about
						you.
					</p>
				</section>

				<section>
					<h3 class="text-xl font-bold text-white mb-2">3. Right to Erasure</h3>
					<p>
						You have the right to request the deletion of your personal data in certain circumstances,
						subject to legal obligations.
					</p>
				</section>

				<section>
					<h3 class="text-xl font-bold text-white mb-2">4. Right to Data Portability</h3>
					<p>
						You have the right to receive your personal data in a structured, commonly used format and
						to transmit it to another organization.
					</p>
				</section>

				<section>
					<h3 class="text-xl font-bold text-white mb-2">5. Right to Object</h3>
					<p>
						You have the right to object to the processing of your personal data in certain
						circumstances.
					</p>
				</section>

				<section>
					<h3 class="text-xl font-bold text-white mb-2">6. Right to Withdraw Consent</h3>
					<p>
						If we process your data based on consent, you have the right to withdraw that consent at
						any time.
					</p>
				</section>

				<section class="bg-purple-900/30 p-4 rounded border border-purple-700 mt-6">
					<h3 class="text-xl font-bold text-white mb-2">Request Your Rights</h3>
					<p>
						To exercise any of these rights, please send a written request to:
						<br />
						📧 <strong>privacy@tennisborgatacloss.it</strong>
					</p>
					<p class="mt-3 text-sm">We will respond within 30 days of receiving your request.</p>
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
