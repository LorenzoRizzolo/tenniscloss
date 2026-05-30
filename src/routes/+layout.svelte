<script>
	import '../app.css';
	
	let { children } = $props();
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#1e293b" />
	
	<!-- SEO -->
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://tennisborgatacloss.it" />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "LocalBusiness",
			"name": "Tennis Borgata Closs",
			"description": "Premium tennis court booking platform",
			"url": "https://tennisborgatacloss.it",
			"contactPoint": {
				"@type": "ContactPoint",
				"contactType": "Customer Service",
				"email": "privacy@tennisborgatacloss.it"
			}
		}
	</script>
</svelte:head>

<div class="min-h-screen flex flex-col">
	{@render children()}
</div>
