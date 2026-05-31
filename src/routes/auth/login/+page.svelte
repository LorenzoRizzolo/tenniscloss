<script>
import { goto } from '$app/navigation';
import Navbar from '$components/Navbar.svelte';
import Footer from '$components/Footer.svelte';

let email = $state('');
let password = $state('');
let showPassword = $state(false);
let isLoading = $state(false);
let message = $state('');
let isError = $state(false);

async function login(e) {
e.preventDefault();
isLoading = true;
message = '';
isError = false;

try {
const response = await fetch('/api/auth/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password })
});

const data = await response.json();

if (response.ok) {
localStorage.setItem('authToken', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
message = 'Accesso effettuato! Reindirizzamento in corso...';

const role = data.user.role;
setTimeout(() => {
if (role === 'admin') {
goto('/admin');
} else if (role === 'gestore') {
goto('/gestore');
} else {
goto('/dashboard');
}
}, 1000);
} else {
isError = true;
message = data.error || 'Email o password non valida';
}
} catch (error) {
isError = true;
message = 'Errore. Riprova più tardi.';
} finally {
isLoading = false;
}
}
</script>

<svelte:head>
<title>Accedi - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
<div class="max-w-md mx-auto">
<div class="bg-slate-800 border border-slate-700 rounded-lg p-8">
<h1 class="text-3xl font-bold text-white mb-6 text-center">Accedi</h1>

{#if message}
<div
class="mb-4 p-3 rounded {isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}"
>
{message}
</div>
{/if}

<form onsubmit={login} class="space-y-4">
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

<div>
<label for="password" class="block text-white text-sm font-bold mb-2">Password</label>
<div class="relative">
<input
type={showPassword ? 'text' : 'password'}
id="password"
bind:value={password}
required
class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none transition pr-10"
placeholder="••••••••"
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
</div>

<button
type="submit"
disabled={isLoading}
class="w-full py-2 bg-gradient-to-r from-[#C5A94E] to-[#8FBC8F] text-white font-bold rounded hover:shadow-lg hover:shadow-[#C5A94E]/50 transition disabled:opacity-50"
>
{isLoading ? 'Accesso in corso...' : 'Accedi'}
</button>
</form>

<p class="text-center text-slate-300 mt-6">
Non hai un account?
<a href="/auth/register" class="text-[#C5A94E] hover:text-[#8FBC8F]">Registrati qui</a>
</p>
</div>
</div>
</main>

<Footer />

<style>
:global(body) {
margin: 0;
padding: 0;
}
</style>
