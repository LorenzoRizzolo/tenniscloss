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

<nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-[#c8e6c0] z-50 shadow-sm">
	<div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
		<a href="/" class="text-2xl font-bold text-[#2d4a22] hover:text-[#5a8a3c] transition">
			🎾 TENNIS CLOSS
		</a>

		<div class="hidden md:flex gap-6 items-center">
			<a href="/" class="text-[#4a6d35] hover:text-[#2d4a22] transition">Home</a>
			{#if isLoggedIn}
				{#if userRole === 'admin'}
					<a href="/admin" class="text-[#4a6d35] hover:text-[#2d4a22] transition">Admin</a>
				{/if}
				{#if userRole === 'gestore'}
					<a href="/gestore" class="text-[#4a6d35] hover:text-[#2d4a22] transition">Gestore</a>
				{/if}
				<a href="/dashboard" class="text-[#4a6d35] hover:text-[#2d4a22] transition">Dashboard</a>
				<a href="/calendar" class="text-[#4a6d35] hover:text-[#2d4a22] transition">📅 Calendario</a>
				<button
					onclick={logout}
					class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
				>
					Esci
				</button>
			{:else}
				<a
					href="/auth/login"
					class="px-4 py-2 bg-[#5a8a3c] text-white rounded hover:bg-[#4a7a2c] transition"
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
			class="md:hidden text-[#2d4a22] text-2xl"
		>
			☰
		</button>
	</div>

	{#if isMenuOpen}
		<div class="md:hidden bg-white border-t border-[#c8e6c0] px-4 py-4 space-y-3">
			<a href="/" class="block text-[#4a6d35] hover:text-[#2d4a22]">Home</a>
			{#if isLoggedIn}
				{#if userRole === 'admin'}
					<a href="/admin" class="block text-[#4a6d35] hover:text-[#2d4a22]">Admin</a>
				{/if}
				{#if userRole === 'gestore'}
					<a href="/gestore" class="block text-[#4a6d35] hover:text-[#2d4a22]">Gestore</a>
				{/if}
				<a href="/dashboard" class="block text-[#4a6d35] hover:text-[#2d4a22]">Dashboard</a>
				<a href="/calendar" class="block text-[#4a6d35] hover:text-[#2d4a22]">📅 Calendario</a>
				<button
					onclick={logout}
					class="w-full text-left px-4 py-2 bg-red-500 text-white rounded"
				>
					Esci
				</button>
			{:else}
				<a href="/auth/login" class="block text-[#4a6d35] hover:text-[#2d4a22]">Accedi</a>
				<a href="/auth/register" class="block text-[#4a6d35] hover:text-[#2d4a22]">Registrati</a>
			{/if}
		</div>
	{/if}
</nav>

<div class="h-16"></div>
