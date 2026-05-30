<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';
	import { it } from '$lib/i18n.js';

	let user = $state(null);
	let users = $state([]);
	let bookings = $state([]);
	let stats = $state({});
	let isLoading = $state(true);
	let showAddUserForm = $state(false);
	let showPassword = $state(false);
	let showTempPassword = $state(false);
	let newUserForm = $state({
		email: '',
		name: '',
		surname: '',
		password: '',
		role: 'utente'
	});
	let message = $state('');
	let isError = $state(false);
	let createdPassword = $state('');

	onMount(async () => {
		const token = localStorage.getItem('authToken');
		const userData = localStorage.getItem('user');

		if (!token || !userData) {
			goto('/auth/login');
			return;
		}

		user = JSON.parse(userData);
		if (user.role !== 'admin') {
			goto('/dashboard');
			return;
		}

		await fetchData();
	});

	async function fetchData() {
		try {
			const headers = {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`
			};

			// Fetch users
			const usersRes = await fetch('/api/admin/users', { headers });
			if (usersRes.ok) {
				users = (await usersRes.json()).users || [];
			}

			// Fetch bookings
			const bookingsRes = await fetch('/api/admin/bookings', { headers });
			if (bookingsRes.ok) {
				bookings = (await bookingsRes.json()).bookings || [];
			}

			// Calculate stats
			stats = {
				totalUsers: users.length,
				totalBookings: bookings.length,
				pendingBookings: bookings.filter(b => b.status === 'pending').length,
				confirmedBookings: bookings.filter(b => b.status === 'confirmed').length
			};
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			isLoading = false;
		}
	}

	async function confirmBooking(bookingId) {
		try {
			const response = await fetch('/api/admin/bookings', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				},
				body: JSON.stringify({ bookingId, action: 'confirm' })
			});

			if (response.ok) {
				message = 'Prenotazione confermata ✓';
				isError = false;
				await fetchData();
			} else {
				isError = true;
				message = 'Errore nella conferma della prenotazione';
			}
		} catch (error) {
			console.error('Error confirming booking:', error);
			isError = true;
			message = 'Errore nella conferma della prenotazione';
		}
	}

	async function cancelBooking(bookingId) {
		if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
			return;
		}

		try {
			const response = await fetch('/api/admin/bookings', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				},
				body: JSON.stringify({ bookingId, action: 'cancel' })
			});

			if (response.ok) {
				message = 'Prenotazione cancellata ✓';
				isError = false;
				await fetchData();
			} else {
				isError = true;
				message = 'Errore nella cancellazione della prenotazione';
			}
		} catch (error) {
			console.error('Error cancelling booking:', error);
			isError = true;
			message = 'Errore nella cancellazione della prenotazione';
		}
	}

	async function addUser(e) {
		e.preventDefault();
		isError = false;
		message = '';

		// Validate form
		if (!newUserForm.email || !newUserForm.name || !newUserForm.surname) {
			isError = true;
			message = it.admin.required_fields;
			return;
		}

		try {
			const response = await fetch('/api/admin/create-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				},
				body: JSON.stringify(newUserForm)
			});

			const data = await response.json();

			if (response.ok) {
				createdPassword = data.user.tempPassword;
				message = `${it.admin.user_created} | ${it.admin.temp_password}: ${data.user.tempPassword}`;
				newUserForm = { email: '', name: '', surname: '', password: '', role: 'utente' };
				showAddUserForm = false;
				showPassword = false;
				showTempPassword = false;
				await fetchData();
			} else {
				isError = true;
				if (data.error === 'Email already exists') {
					message = it.errors.email_exists;
				} else if (data.error === 'Invalid email format') {
					message = it.errors.invalid_email;
				} else {
					message = data.error || it.admin.user_error;
				}
			}
		} catch (error) {
			console.error('Error:', error);
			isError = true;
			message = it.errors.internal_error;
		}
	}

	async function deleteUser(userId) {
		if (!confirm(it.admin.confirm_delete_user)) {
			return;
		}

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`
				}
			});

			if (response.ok) {
				message = it.admin.user_deleted;
				isError = false;
				await fetchData();
			} else {
				isError = true;
				const data = await response.json();
				message = data.error || it.admin.delete_user_error;
			}
		} catch (error) {
			console.error('Error deleting user:', error);
			isError = true;
			message = it.admin.delete_user_error;
		}
	}
</script>

<svelte:head>
	<title>{it.admin.admin_dashboard} - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		{#if user}
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-white mb-2">👑 {it.admin.admin_dashboard}</h1>
				<p class="text-slate-400">{it.admin.admin_dashboard}</p>
			</div>

			{#if message}
				<div
					class="mb-6 p-4 rounded {isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}"
				>
					{#if !isError && createdPassword}
						<div class="flex items-center justify-between gap-4">
							<span>{message.split(' | ')[0]}</span>
							<div class="relative inline-flex items-center bg-slate-700/50 px-3 py-1 rounded">
								<span class="text-sm mr-2">
									{showTempPassword ? createdPassword : '••••••••'}
								</span>
								<button
									type="button"
									onclick={() => (showTempPassword = !showTempPassword)}
									class="text-green-300 hover:text-green-200 transition"
									title={showTempPassword ? 'Nascondi' : 'Mostra'}
								>
									{#if showTempPassword}
										👁️
									{:else}
										👁️‍🗨️
									{/if}
								</button>
								<button
									type="button"
									onclick={() => {
										navigator.clipboard.writeText(createdPassword);
									}}
									class="ml-2 text-green-300 hover:text-green-200 transition"
									title="Copia negli appunti"
								>
									📋
								</button>
							</div>
						</div>
					{:else}
						{message}
					{/if}
				</div>
			{/if}

			<!-- Stats Grid -->
			<div class="grid md:grid-cols-4 gap-4 mb-8">
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">{it.admin.total_users}</p>
					<p class="text-4xl font-bold text-purple-400">{stats.totalUsers || 0}</p>
				</div>
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">{it.admin.total_bookings}</p>
					<p class="text-4xl font-bold text-blue-400">{stats.totalBookings || 0}</p>
				</div>
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">{it.admin.pending_bookings}</p>
					<p class="text-4xl font-bold text-yellow-400">{stats.pendingBookings || 0}</p>
				</div>
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">{it.admin.confirmed_bookings}</p>
					<p class="text-4xl font-bold text-green-400">{stats.confirmedBookings || 0}</p>
				</div>
			</div>

			<!-- Add User Button -->
			<button
				onclick={() => (showAddUserForm = !showAddUserForm)}
				class="mb-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded hover:shadow-lg hover:shadow-purple-500/50 transition"
			>
				{it.admin.add_user}
			</button>

			<!-- Add User Form -->
			{#if showAddUserForm}
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
					<h2 class="text-2xl font-bold text-white mb-6">{it.admin.add_user}</h2>
					<form onsubmit={addUser} class="grid md:grid-cols-2 gap-4">
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.auth.email}</label>
							<input
								type="email"
								bind:value={newUserForm.email}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
								placeholder="user@example.com"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.admin.role}</label>
							<select
								bind:value={newUserForm.role}
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
							>
								<option value="utente">{it.admin.user_role}</option>
								<option value="gestore">{it.admin.manager_role}</option>
								<option value="admin">{it.admin.admin_role}</option>
							</select>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.auth.name}</label>
							<input
								type="text"
								bind:value={newUserForm.name}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
								placeholder="John"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.auth.surname}</label>
							<input
								type="text"
								bind:value={newUserForm.surname}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
								placeholder="Doe"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">{it.auth.password}</label>
							<div class="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									bind:value={newUserForm.password}
									class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 pr-10"
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
						<div class="md:col-span-2 flex gap-4">
							<button
								type="submit"
								class="flex-1 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
							>
								{it.admin.add_user}
							</button>
							<button
								type="button"
								onclick={() => (showAddUserForm = false)}
								class="flex-1 py-2 bg-slate-700 text-white font-bold rounded hover:bg-slate-600"
							>
								{it.dashboard.cancel}
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Users Table -->
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
				<h2 class="text-2xl font-bold text-white mb-6">{it.admin.users} ({users.length})</h2>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-slate-300">
						<thead class="border-b border-slate-700">
							<tr>
								<th class="pb-3">{it.auth.email}</th>
								<th class="pb-3">{it.auth.name}</th>
								<th class="pb-3">{it.admin.role}</th>
								<th class="pb-3">{it.admin.verified}</th>
								<th class="pb-3">{it.admin.actions}</th>
							</tr>
						</thead>
						<tbody>
							{#each users as userItem}
								<tr class="border-b border-slate-700 hover:bg-slate-700/50">
									<td class="py-3">{userItem.email}</td>
									<td class="py-3">{userItem.name} {userItem.surname}</td>
									<td class="py-3"><span class="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-sm">{userItem.role}</span></td>
									<td class="py-3">{userItem.is_verified ? '✓' : '✗'}</td>
									<td class="py-3">
										<button
											onclick={() => deleteUser(userItem.id)}
											class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition"
											title={it.admin.delete_user}
										>
											{it.admin.delete_user}
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Bookings Table -->
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
				<h2 class="text-2xl font-bold text-white mb-6">⚙️ {it.admin.bookings} ({bookings.length})</h2>
				<p class="text-slate-400 text-sm mb-4">Gestisci le prenotazioni: conferma o cancella</p>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-slate-300 text-sm">
						<thead class="border-b border-slate-700">
							<tr>
								<th class="pb-3">{it.dashboard.date}</th>
								<th class="pb-3">{it.dashboard.start_time}</th>
								<th class="pb-3">{it.admin.users}</th>
								<th class="pb-3">{it.dashboard.status}</th>
								<th class="pb-3">Azioni</th>
							</tr>
						</thead>
						<tbody>
							{#each bookings as booking}
								<tr class="border-b border-slate-700 hover:bg-slate-700/50">
									<td class="py-3">{booking.booking_date}</td>
									<td class="py-3">{booking.start_time} - {booking.end_time}</td>
									<td class="py-3">{booking.name} {booking.surname}</td>
									<td class="py-3">
										<span
											class="px-2 py-1 rounded text-xs {booking.status === 'confirmed'
												? 'bg-green-900/30 text-green-300'
												: booking.status === 'pending'
													? 'bg-yellow-900/30 text-yellow-300'
													: 'bg-red-900/30 text-red-300'}"
										>
											{booking.status === 'confirmed'
												? '✓ Confermato'
												: booking.status === 'pending'
													? '⏳ In Sospeso'
													: '✗ Cancellato'}
										</span>
									</td>
									<td class="py-3 flex gap-2">
										{#if booking.status === 'pending'}
											<button
												onclick={() => confirmBooking(booking.id)}
												class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition"
											>
												✓ Conferma
											</button>
										{/if}
										{#if booking.status !== 'cancelled'}
											<button
												onclick={() => cancelBooking(booking.id)}
												class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition"
											>
												✗ Cancella
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					{#if bookings.length === 0}
						<p class="text-slate-400 text-center py-8">Nessuna prenotazione</p>
					{/if}
				</div>
			</div>
		{:else}
			<p class="text-white">Caricamento...</p>
		{/if}
	</div>
</main>

<Footer />
