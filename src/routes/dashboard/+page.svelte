<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';

	let user = $state(null);
	let bookings = $state([]);
	let isLoading = $state(true);
	let showBookingForm = $state(false);
	let bookingForm = $state({
		bookingDate: '',
		startTime: '',
		endTime: '',
		notes: ''
	});
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
		fetchBookings();
	});

	async function fetchBookings() {
		try {
			const response = await fetch('/api/bookings', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				bookings = data.bookings || [];
			}
		} catch (error) {
			console.error('Errore nel caricamento delle prenotazioni:', error);
		} finally {
			isLoading = false;
		}
	}

	async function createBooking(e) {
		e.preventDefault();
		isError = false;
		message = '';

		try {
			const response = await fetch('/api/bookings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				},
				body: JSON.stringify(bookingForm)
			});

			const data = await response.json();

			if (response.ok) {
				message = 'Prenotazione creata con successo! In attesa della conferma del gestore.';
				bookingForm = { bookingDate: '', startTime: '', endTime: '', notes: '' };
				showBookingForm = false;
				fetchBookings();
			} else {
				isError = true;
				message = data.error || 'Impossibile creare la prenotazione';
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
	<title>Dashboard - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		{#if user}
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-white mb-2">🎾 Welcome, {user.name}!</h1>
				<p class="text-slate-400">Manage your tennis court bookings</p>
			</div>

			{#if message}
				<div
					class="mb-6 p-4 rounded {isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}"
				>
					{message}
				</div>
			{/if}

			<!-- New Booking Button -->
			<button
				onclick={() => (showBookingForm = !showBookingForm)}
				class="mb-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded hover:shadow-lg hover:shadow-purple-500/50 transition"
			>
				+ New Booking
			</button>

			<!-- Booking Form -->
			{#if showBookingForm}
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
					<h2 class="text-2xl font-bold text-white mb-6">Create New Booking</h2>
					<form onsubmit={createBooking} class="grid md:grid-cols-2 gap-4">
						<div>
							<label class="block text-white text-sm font-bold mb-2">Date</label>
							<input
								type="date"
								bind:value={bookingForm.bookingDate}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">Start Time</label>
							<input
								type="time"
								bind:value={bookingForm.startTime}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">End Time</label>
							<input
								type="time"
								bind:value={bookingForm.endTime}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">Notes (optional)</label>
							<input
								type="text"
								bind:value={bookingForm.notes}
								placeholder="Add any special requests..."
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
							/>
						</div>
						<div class="md:col-span-2 flex gap-4">
							<button
								type="submit"
								class="flex-1 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
							>
								Create Booking
							</button>
							<button
								type="button"
								onclick={() => (showBookingForm = false)}
								class="flex-1 py-2 bg-slate-700 text-white font-bold rounded hover:bg-slate-600 transition"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Bookings List -->
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
				<h2 class="text-2xl font-bold text-white mb-6">Your Bookings</h2>
				{#if isLoading}
					<p class="text-slate-400">Loading...</p>
				{:else if bookings.length === 0}
					<p class="text-slate-400">No bookings yet. Create one to get started!</p>
				{:else}
					<div class="space-y-4">
						{#each bookings as booking}
							<div class="bg-slate-700 rounded-lg p-4 flex justify-between items-center">
								<div>
									<p class="text-white font-bold">📅 {booking.booking_date}</p>
									<p class="text-slate-300">⏰ {booking.start_time} - {booking.end_time}</p>
									<p class="text-slate-400 text-sm mt-1">Duration: {booking.duration_minutes} minutes</p>
									{#if booking.notes}
										<p class="text-slate-400 text-sm">Note: {booking.notes}</p>
									{/if}
								</div>
								<div class="text-right">
									<div class="px-3 py-1 rounded text-sm font-bold {getStatusBadge(booking.status)}">
										{booking.status.toUpperCase()}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-white">Loading...</p>
		{/if}
	</div>
</main>

<Footer />
