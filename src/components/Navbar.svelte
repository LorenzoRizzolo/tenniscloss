<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let isMenuOpen = $state(false);
	let isLoggedIn = $state(false);
	let userRole = $state(null);

	onMount(() => {
		const token = localStorage.getItem('authToken');
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		isLoggedIn = !!token;
		userRole = user.role;
	});

	function logout() {
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		window.location.href = '/';
	}
</script>

<nav class="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 z-50">
	<div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
		<a href="/" class="text-2xl font-bold text-white hover:text-[#C5A94E] transition">
			🎾 TENNIS CLOSS
		</a>

		<div class="hidden md:flex gap-6 items-center">
			<a href="/" class="text-slate-300 hover:text-white transition">Home</a>
			{#if isLoggedIn}
				{#if userRole === 'admin'}
					<a href="/admin" class="text-slate-300 hover:text-white transition">Admin</a>
				{/if}
				{#if userRole === 'gestore' || userRole === 'admin'}
					<a href="/gestore" class="text-slate-300 hover:text-white transition">Gestore</a>
				{/if}
				{#if userRole != 'admin'}
					<a href="/dashboard" class="text-slate-300 hover:text-white transition">Dashboard</a>
				{/if}
				<a href="/calendar" class="text-slate-300 hover:text-white transition">📅 Calendario</a>
				<button
					onclick={logout}
					class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
				>
					Esci
				</button>
			{:else}
				<a
					href="/auth/login"
					class="px-4 py-2 bg-[#C5A94E] text-white rounded hover:bg-[#8FBC8F] transition"
				>
					Accedi
				</a>
				<a
					href="/auth/register"
					class="px-4 py-2 bg-[#8FBC8F] text-white rounded hover:bg-[#7AAD7A] transition"
				>
					Registrati
				</a>
			{/if}
		</div>

		<button
			onclick={() => (isMenuOpen = !isMenuOpen)}
			class="md:hidden text-white text-2xl"
		>
			☰
		</button>
	</div>

	{#if isMenuOpen}
		<div class="md:hidden bg-slate-800 px-4 py-4 space-y-3">
			<a href="/" class="block text-slate-300 hover:text-white">Home</a>
			{#if isLoggedIn}
				{#if userRole === 'admin'}
					<a href="/admin" class="block text-slate-300 hover:text-white">Admin</a>
				{/if}
				{#if userRole === 'gestore'}
					<a href="/gestore" class="block text-slate-300 hover:text-white">Gestore</a>
				{/if}
				<a href="/dashboard" class="block text-slate-300 hover:text-white">Dashboard</a>
				<a href="/calendar" class="block text-slate-300 hover:text-white">📅 Calendario</a>
				<button
					onclick={logout}
					class="w-full text-left px-4 py-2 bg-red-600 text-white rounded"
				>
					Esci
				</button>
			{:else}
				<a href="/auth/login" class="block text-slate-300 hover:text-white">Accedi</a>
				<a href="/auth/register" class="block text-slate-300 hover:text-white">Registrati</a>
			{/if}
		</div>
	{/if}
</nav>

<div class="h-16"></div>
