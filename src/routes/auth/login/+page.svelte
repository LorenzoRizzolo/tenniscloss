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

<main class="min-h-screen bg-gradient-to-br from-[#e8f5e0] via-[#f0f7ef] to-[#e0f0d8] py-12 px-4">
<div class="max-w-md mx-auto">
<div class="bg-white border border-[#c8e6c0] rounded-lg p-8 shadow-lg">
<h1 class="text-3xl font-bold text-[#2d4a22] mb-6 text-center">Accedi</h1>

{#if message}
<div
class="mb-4 p-3 rounded {isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}"
>
{message}
</div>
{/if}

<form onsubmit={login} class="space-y-4">
<div>
<label for="email" class="block text-[#2d4a22] text-sm font-bold mb-2">Email</label>
<input
type="email"
id="email"
bind:value={email}
required
class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none transition"
placeholder="tua@email.com"
/>
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
placeholder="••••••••"
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

<button
type="submit"
disabled={isLoading}
class="w-full py-2 bg-gradient-to-r from-[#5a8a3c] to-[#8FBC8F] text-white font-bold rounded hover:shadow-lg hover:shadow-[#5a8a3c]/40 transition disabled:opacity-50"
>
{isLoading ? 'Accesso in corso...' : 'Accedi'}
</button>
</form>

<p class="text-center text-[#4a6d35] mt-6">
Non hai un account?
<a href="/auth/register" class="text-[#5a8a3c] hover:text-[#8FBC8F] font-semibold">Registrati qui</a>
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
