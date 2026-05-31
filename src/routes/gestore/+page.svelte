<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	import { translateStatus } from '$lib';

	let user = $state(null);
	let bookings = $state([]);
	let pendingUsers = $state([]);
	let isLoading = $state(true);
	let message = $state('');
	let isError = $state(false);

	onMount(async () => {
		const token = localStorage.getItem('authToken');
		const userData = localStorage.getItem('user');

		if (!token || !userData) {
			goto('/auth/login');
			return;
		}

		user = JSON.parse(userData);
		if (user.role !== 'gestore' && user.role !== 'admin') {
			goto('/dashboard');
			return;
		}

		fetchBookings();
		fetchPendingUsers();
	});

	async function fetchPendingUsers() {
		try {
			const response = await fetch('/api/admin/users', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				pendingUsers = (data.users || []).filter(u => u.role === 'utente' && !u.is_approved);
			}
		} catch (error) {
			console.error('Errore nel caricamento utenti:', error);
		}
	}

	async function approveUser(userId) {
		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				},
				body: JSON.stringify({ action: 'approve' })
			});

			const data = await response.json();

			if (response.ok) {
				message = 'Utente approvato con successo';
				isError = false;
				fetchPendingUsers();
			} else {
				isError = true;
				message = data.error || 'Errore approvazione utente';
			}
		} catch (error) {
			isError = true;
			message = 'Errore approvazione utente';
		}
	}

	async function rejectUser(userId) {
		if (!confirm('Sei sicuro di voler rifiutare questo utente? Verrà rimosso dal sistema.')) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				},
				body: JSON.stringify({ action: 'reject' })
			});

			const data = await response.json();

			if (response.ok) {
				message = 'Utente rifiutato e rimosso';
				isError = false;
				fetchPendingUsers();
			} else {
				isError = true;
				message = data.error || 'Errore rifiuto utente';
			}
		} catch (error) {
			isError = true;
			message = 'Errore rifiuto utente';
		}
	}

	async function fetchBookings() {
		try {
			const response = await fetch('/api/gestore/bookings', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				}
			});

			if (response.ok) {
				bookings = (await response.json()).bookings || [];
				console.log('Bookings loaded:', bookings);
			}
		} catch (error) {
			console.error('Errore nel caricamento delle prenotazioni:', error);
		} finally {
			isLoading = false;
		}
	}

	async function updateBooking(bookingId, newStatus) {
		isError = false;
		message = '';

		try {
			const response = await fetch(`/api/gestore/bookings/${bookingId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				},
				body: JSON.stringify({ status: newStatus })
			});

			const data = await response.json();

			if (response.ok) {
				message = `Booking ${newStatus}!`;
				fetchBookings();
			} else {
				isError = true;
				message = data.error || 'Failed to update booking';
			}
		} catch (error) {
			isError = true;
			message = 'Si è verificato un errore';
		}
	}

	function getStatusBadge(status) {
		const badges = {
			pending: 'bg-yellow-900/30 text-yellow-300',
			confirmed: 'bg-green-900/30 text-green-300',
			cancelled: 'bg-red-900/30 text-red-300',
			completed: 'bg-blue-900/30 text-blue-300'
		};
		return badges[status] || 'bg-slate-900/30 text-slate-300';
	}
</script>

<svelte:head>
	<title>Manager Dashboard - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		{#if user}
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-white mb-2">📋 Manager Dashboard</h1>
				<p class="text-slate-400">Manage and confirm bookings</p>
			</div>

			{#if message}
				<div
					class="mb-6 p-4 rounded {isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}"
				>
					{message}
				</div>
			{/if}

			<!-- Pending Users Section -->
			{#if pendingUsers.length > 0}
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
					<h2 class="text-2xl font-bold text-white mb-6">👥 Utenti in Attesa di Approvazione ({pendingUsers.length})</h2>
					<div class="overflow-x-auto">
						<table class="w-full text-left text-slate-300 text-sm">
							<thead class="border-b border-slate-700">
								<tr>
									<th class="pb-3">Nome</th>
									<th class="pb-3">Email</th>
									<th class="pb-3">Registrato il</th>
									<th class="pb-3">Azioni</th>
								</tr>
							</thead>
							<tbody>
								{#each pendingUsers as pendingUser}
									<tr class="border-b border-slate-700 hover:bg-slate-700/50">
										<td class="py-3">{pendingUser.name} {pendingUser.surname}</td>
										<td class="py-3">{pendingUser.email}</td>
										<td class="py-3">{new Date(pendingUser.created_at).toLocaleDateString('it-IT')}</td>
										<td class="py-3">
											<div class="flex gap-2">
												<button
													onclick={() => approveUser(pendingUser.id)}
													class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition"
												>
													✓ Approva
												</button>
												<button
													onclick={() => rejectUser(pendingUser.id)}
													class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition"
												>
													✗ Rifiuta
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
				<h2 class="text-2xl font-bold text-white mb-6">All Bookings</h2>

				{#if isLoading}
					<p class="text-slate-400">Loading...</p>
				{:else if bookings.length === 0}
					<p class="text-slate-400">No bookings</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-left text-slate-300 text-sm">
							<thead class="border-b border-slate-700">
								<tr>
									<th class="pb-3">Date</th>
									<th class="pb-3">Time</th>
									<th class="pb-3">User</th>
									<th class="pb-3">Duration</th>
									<th class="pb-3">Status</th>
									<th class="pb-3">Actions</th>
								</tr>
							</thead>
							<tbody>
								{#each bookings as booking}
									<tr class="border-b border-slate-700 hover:bg-slate-700/50">
										<td class="py-3">{booking.booking_date}</td>
										<td class="py-3">{booking.start_time} - {booking.end_time}</td>
										<td class="py-3">
											<div class="text-sm">
												<p class="font-bold">{booking.user_name} {booking.user_surname}</p>
												<p class="text-slate-400">{booking.user_email}</p>
											</div>
										</td>
										<td class="py-3">{booking.duration_minutes} min</td>
										<td class="py-3">
											<span class="px-2 py-1 rounded text-xs font-bold {getStatusBadge(booking.status)}">
												{translateStatus(booking.status)}
											</span>
										</td>
										<td class="py-3">
											<div class="flex gap-2">
												{#if booking.status === 'pending'}
													<button
														onclick={() => updateBooking(booking.id, 'confirmed')}
														class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
													>
														✓ conferma
													</button>
													<button
														onclick={() => updateBooking(booking.id, 'cancelled')}
														class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
													>
														✗ cancella
													</button>
												{/if}
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-white">Loading...</p>
		{/if}
	</div>
</main>

<Footer />
