<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	

	let user = $state(null);
	let currentDate = $state(null);
	let selectedDate = $state('');
	let timeSlots = $state([]);
	let bookings = $state([]);
	let isLoading = $state(true);

	// Time slots every 30 minutes from 06:00 to 23:30
	function generateTimeSlots() {
		const slots = [];
		for (let hour = 6; hour < 24; hour++) {
			for (let minute of [0, 30]) {
				slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
			}
		}
		return slots;
	}

	onMount(async () => {
		const token = localStorage.getItem('authToken');
		const userData = localStorage.getItem('user');

		if (!token || !userData) {
			goto('/auth/login');
			return;
		}

		// Initialize dates using local timezone (not UTC)
		const today = new Date();
		currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		selectedDate = currentDate.toISOString().split('T')[0];

		user = JSON.parse(userData);
		timeSlots = generateTimeSlots();
		await fetchBookings();
	});

	async function fetchBookings() {
		try {
			const dateStr = dateToString(currentDate);
			const headers = {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`
			};

			const response = await fetch(`/api/calendar/bookings?date=${dateStr}`, { headers });
			if (response.ok) {
				bookings = (await response.json()).bookings || [];
			}
		} catch (error) {
			console.error('Error fetching bookings:', error);
		} finally {
			isLoading = false;
		}
	}

	function previousDay() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
		selectedDate = dateToString(currentDate);
		isLoading = true;
		fetchBookings();
	}

	function nextDay() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
		selectedDate = dateToString(currentDate);
		isLoading = true;
		fetchBookings();
	}

	function jumpToDate() {
		// Parse date string to local date (avoiding UTC offset)
		const [year, month, day] = selectedDate.split('-').map(Number);
		currentDate = new Date(year, month - 1, day);
		isLoading = true;
		fetchBookings();
	}

	// Helper to convert local Date to YYYY-MM-DD format
	function dateToString(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function getSlotStatus(slot) {
		// Convert slot time to minutes
		const [slotHours, slotMins] = slot.split(':').map(Number);
		const slotTimeInMinutes = slotHours * 60 + slotMins;

		// Check if slot is within any booking
		const booking = bookings.find((b) => {
			const [startHours, startMins] = b.start_time.split(':').map(Number);
			const [endHours, endMins] = b.end_time.split(':').map(Number);

			const startTimeInMinutes = startHours * 60 + startMins;
			const endTimeInMinutes = endHours * 60 + endMins;

			// Slot is booked if it falls within the booking duration
			return slotTimeInMinutes >= startTimeInMinutes && slotTimeInMinutes < endTimeInMinutes;
		});

		if (booking) {
			return {
				status: 'booked',
				userName: `${booking.name} ${booking.surname}`,
				duration: booking.duration_minutes,
				bookingStatus: booking.status
			};
		}
		return { status: 'free' };
	}

	function formatDate(date) {
		const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
		const months = [
			'Gennaio',
			'Febbraio',
			'Marzo',
			'Aprile',
			'Maggio',
			'Giugno',
			'Luglio',
			'Agosto',
			'Settembre',
			'Ottobre',
			'Novembre',
			'Dicembre'
		];
		return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
	}
</script>

<svelte:head>
	<title>Calendario - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-[#e8f5e0] via-[#f0f7ef] to-[#e0f0d8] py-12 px-4">
	<div class="max-w-4xl mx-auto">
		{#if user}
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-[#2d4a22] mb-2">📅 Calendario Prenotazioni</h1>
				<p class="text-[#4a6d35]">Visualizza le disponibilità dei campi</p>
			</div>

			<!-- Date Navigation -->
			<div class="bg-white border border-[#c8e6c0] rounded-lg p-6 mb-8 shadow-sm">
				<div class="flex items-center justify-between mb-6 gap-4">
					<button
						onclick={previousDay}
						class="px-6 py-2 bg-[#f0f7ef] hover:bg-[#e8f5e0] text-[#2d4a22] font-bold rounded transition"
					>
						← Giorno Precedente
					</button>
					<h2 class="text-2xl font-bold text-[#2d4a22]">{formatDate(currentDate)}</h2>
					<button
						onclick={nextDay}
						class="px-6 py-2 bg-[#f0f7ef] hover:bg-[#e8f5e0] text-[#2d4a22] font-bold rounded transition"
					>
						Giorno Successivo →
					</button>
				</div>
				
				<!-- Date Picker -->
				<div class="flex gap-3 items-center justify-center">
					<label for="datePicker" class="text-[#4a6d35] font-bold">Salta a data:</label>
					<input
						id="datePicker"
						type="date"
						bind:value={selectedDate}
						class="px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0]"
					/>
					<button
						onclick={jumpToDate}
						class="px-6 py-2 bg-[#5a8a3c] hover:bg-[#4a7a2c] text-white font-bold rounded transition"
					>
						✓ Vai
					</button>
				</div>
			</div>

			<!-- Time Slots Grid -->
			{#if isLoading}
				<div class="text-center text-[#2d4a22]">Caricamento...</div>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
					{#each timeSlots as slot}
						{@const slotStatus = getSlotStatus(slot)}
						{#if slotStatus.status === 'free'}
							<div
								class="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg p-4 cursor-pointer transition transform hover:scale-105"
							>
								<p class="text-white font-bold text-lg">{slot}</p>
								<p class="text-green-100 text-sm">Disponibile ✓</p>
							</div>
						{:else}
							<div
								class="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-4 opacity-70"
								title={`Prenotato da ${slotStatus.userName}`}
							>
								<p class="text-white font-bold text-lg">{slot}</p>
								<p class="text-red-100 text-sm truncate">{slotStatus.userName}</p>
								<p class="text-red-200 text-xs">{slotStatus.duration} min</p>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		{:else}
			<p class="text-[#2d4a22]">Caricamento...</p>
		{/if}
	</div>
</main>

<Footer />
