<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	import { it } from '$lib/i18n.js';

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
	let durationMinutes = $state(0);
	let isBookingValid = $state(false);
	const MAX_BOOKING_HOURS = 2;

	// Generate time slots (00:00, 00:30, 01:00, etc.)
	let timeSlots = $state([]);
	let availableStartTimes = $state([]);
	let availableEndTimes = $state([]);
	let selectedDateBookings = $state([]);

	function generateTimeSlots() {
		const slots = [];
		for (let hour = 6; hour < 24; hour++) {
			for (let min of [0, 30]) {
				const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
				slots.push(time);
			}
		}
		timeSlots = slots;
	}

	function isTimeSlotOccupied(time) {
		const [slotHours, slotMins] = time.split(':').map(Number);
		const slotTimeInMinutes = slotHours * 60 + slotMins;

		return selectedDateBookings.some((booking) => {
			const [startHours, startMins] = booking.start_time.split(':').map(Number);
			const [endHours, endMins] = booking.end_time.split(':').map(Number);

			const startTimeInMinutes = startHours * 60 + startMins;
			const endTimeInMinutes = endHours * 60 + endMins;

			return slotTimeInMinutes >= startTimeInMinutes && slotTimeInMinutes < endTimeInMinutes;
		});
	}

	function getAvailableTimes() {
		availableStartTimes = timeSlots.filter((time) => !isTimeSlotOccupied(time));
		availableEndTimes = timeSlots.filter(
			(time) =>
				!isTimeSlotOccupied(time) &&
				(bookingForm.startTime === '' ||
					time > bookingForm.startTime)
		);
	}

	async function fetchBookingsForDate(date) {
		if (!date) {
			selectedDateBookings = [];
			getAvailableTimes();
			return;
		}

		try {
			const response = await fetch(`/api/calendar/bookings?date=${date}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				selectedDateBookings = data.bookings || [];
			} else {
				selectedDateBookings = [];
			}
		} catch (error) {
			console.error('Error fetching bookings for date:', error);
			selectedDateBookings = [];
		}

		getAvailableTimes();
	}

	function calculateDuration() {
		if (!bookingForm.startTime || !bookingForm.endTime) {
			durationMinutes = 0;
			isBookingValid = false;
			return;
		}

		const [startHours, startMins] = bookingForm.startTime.split(':').map(Number);
		const [endHours, endMins] = bookingForm.endTime.split(':').map(Number);

		const startTotalMins = startHours * 60 + startMins;
		const endTotalMins = endHours * 60 + endMins;

		if (endTotalMins <= startTotalMins) {
			durationMinutes = 0;
			isBookingValid = false;
			return;
		}

		durationMinutes = endTotalMins - startTotalMins;
		isBookingValid = durationMinutes <= MAX_BOOKING_HOURS * 60;
	}

	onMount(async () => {
		generateTimeSlots();
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

		// Client-side validation
		if (durationMinutes > MAX_BOOKING_HOURS * 60) {
			isError = true;
			message = `⚠️ ${it.dashboard.error_max_duration}: ${Math.round(durationMinutes / 60 * 10) / 10} ore`;
			return;
		}

		if (durationMinutes === 0) {
			isError = true;
			message = it.dashboard.error_end_after_start;
			return;
		}

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
				message = it.dashboard.booking_created;
				bookingForm = { bookingDate: '', startTime: '', endTime: '', notes: '' };
				durationMinutes = 0;
				showBookingForm = false;
				fetchBookings();
			} else {
				isError = true;
				message = data.error || it.dashboard.booking_error;
			}
		} catch (error) {
			isError = true;
			message = it.errors.server_error;
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
				<h1 class="text-4xl font-bold text-white mb-2">🎾 {it.dashboard.welcome}, {user.name}!</h1>
				<p class="text-slate-400">{it.dashboard.manage_bookings}</p>
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
				class="mb-8 px-6 py-3 bg-gradient-to-r from-[#C5A94E] to-[#8FBC8F] text-white font-bold rounded hover:shadow-lg hover:shadow-[#C5A94E]/50 transition"
			>
				{it.dashboard.new_booking}
			</button>

			<!-- Booking Form -->
			{#if showBookingForm}
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
					<h2 class="text-2xl font-bold text-white mb-6">{it.dashboard.create_booking}</h2>
					<form onsubmit={createBooking} class="grid md:grid-cols-2 gap-4">
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.dashboard.date}</label>
							<input
								type="date"
								bind:value={bookingForm.bookingDate}
								onchange={() => fetchBookingsForDate(bookingForm.bookingDate)}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none"
							/>
						</div>
						<br>
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.dashboard.start_time}</label>
							<select
								bind:value={bookingForm.startTime}
								onchange={() => {
									calculateDuration();
									getAvailableTimes();
								}}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none cursor-pointer"
							>
								<option value="">{it.dashboard.select_time}</option>
								{#each availableStartTimes as time}
									<option value={time}>{time}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.dashboard.end_time}</label>
							<select
								bind:value={bookingForm.endTime}
								onchange={calculateDuration}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none cursor-pointer"
							>
								<option value="">{it.dashboard.select_time}</option>
								{#each availableEndTimes as time}
									<option value={time}>{time}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.dashboard.notes}</label>
							<input
								type="text"
								bind:value={bookingForm.notes}
								placeholder={it.dashboard.notes_placeholder}
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-[#C5A94E] outline-none"
							/>
						</div>

						<!-- Duration Info -->
						{#if durationMinutes > 0}
							<div class="md:col-span-2 p-3 rounded {durationMinutes > MAX_BOOKING_HOURS * 60 ? 'bg-red-900/30 text-red-300 border border-red-600' : 'bg-blue-900/30 text-blue-300 border border-blue-600'}">
								<p class="font-bold">
									{it.dashboard.duration_info}: {Math.floor(durationMinutes / 60)}{it.dashboard.hours_short} {durationMinutes % 60}{it.dashboard.min_short}
									{#if durationMinutes > MAX_BOOKING_HOURS * 60}
										<span class="text-red-400 ml-2">{it.dashboard.duration_max_error}</span>
									{:else}
										<span class="text-green-400 ml-2">{it.dashboard.duration_valid}</span>
									{/if}
								</p>
								{#if durationMinutes > MAX_BOOKING_HOURS * 60}
									<p class="text-sm mt-1">{it.dashboard.duration_reduce}</p>
								{/if}
							</div>
						{/if}

						<div class="md:col-span-2 flex gap-4">
							<button
								type="submit"
								disabled={durationMinutes === 0 || durationMinutes > MAX_BOOKING_HOURS * 60}
								class="flex-1 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600"
							>
								{it.dashboard.confirm_button}
							</button>
							<button
								type="button"
								onclick={() => (showBookingForm = false)}
								class="flex-1 py-2 bg-slate-700 text-white font-bold rounded hover:bg-slate-600 transition"
							>
								{it.dashboard.cancel}
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Bookings List -->
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
				<h2 class="text-2xl font-bold text-white mb-6">{it.dashboard.my_bookings}</h2>
				{#if isLoading}
					<p class="text-slate-400">{it.calendar.loading}</p>
				{:else if bookings.length === 0}
					<p class="text-slate-400">{it.dashboard.no_bookings}</p>
				{:else}
					<div class="space-y-4">
						{#each bookings as booking}
							<div class="bg-slate-700 rounded-lg p-4 flex justify-between items-center">
								<div>
									<p class="text-white font-bold">📅 {booking.booking_date}</p>
									<p class="text-slate-300">⏰ {booking.start_time} - {booking.end_time}</p>
									<p class="text-slate-400 text-sm mt-1">{it.dashboard.duration}: {booking.duration_minutes} {it.dashboard.minutes}</p>
									{#if booking.notes}
										<p class="text-slate-400 text-sm">{it.dashboard.notes}: {booking.notes}</p>
									{/if}
								</div>
								<div class="text-right">
									<div class="px-3 py-1 rounded text-sm font-bold {getStatusBadge(booking.status)}">
										{it.dashboard[booking.status] || booking.status.toUpperCase()}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-white">{it.calendar.loading}</p>
		{/if}
	</div>
</main>

<Footer />
