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
				await fetchData();
			} else {
				isError = true;
				message = data.error || 'Errore approvazione utente';
			}
		} catch (error) {
			console.error('Error approving user:', error);
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
				await fetchData();
			} else {
				isError = true;
				message = data.error || 'Errore rifiuto utente';
			}
		} catch (error) {
			console.error('Error rejecting user:', error);
			isError = true;
			message = 'Errore rifiuto utente';
		}
	}

	async function addUser(e) {
		e.preventDefault();
		isError = false;
		message = '';

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
				const data = await response.json();
				isError = true;
				message = data.error || it.admin.user_delete_error;
			}
		} catch (error) {
			console.error('Error deleting user:', error);
			isError = true;
			message = it.admin.user_delete_error;
		}
	}
</script>

<svelte:head>
	<title>Admin - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-[#e8f5e0] via-[#f0f7ef] to-[#e0f0d8] py-12 px-4">
	<div class="max-w-6xl mx-auto">
		{#if user}
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-[#2d4a22] mb-2">🔑 Admin Dashboard</h1>
				<p class="text-[#4a6d35]">{it.admin.management}</p>
			</div>

			{#if message}
				<div
					class="mb-6 p-4 rounded {isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}"
				>
					{message}
				</div>
			{/if}

			<!-- Stats Cards -->
			<div class="grid md:grid-cols-4 gap-4 mb-8">
				<div class="bg-white border border-[#c8e6c0] rounded-lg p-6">
					<h3 class="text-[#4a6d35] text-sm font-bold mb-2">{it.admin.users}</h3>
					<p class="text-3xl font-bold text-[#2d4a22]">{stats.totalUsers || 0}</p>
				</div>
				<div class="bg-white border border-[#c8e6c0] rounded-lg p-6">
					<h3 class="text-[#4a6d35] text-sm font-bold mb-2">{it.admin.bookings}</h3>
					<p class="text-3xl font-bold text-[#2d4a22]">{stats.totalBookings || 0}</p>
				</div>
				<div class="bg-white border border-[#c8e6c0] rounded-lg p-6">
					<h3 class="text-[#4a6d35] text-sm font-bold mb-2">{it.admin.pending}</h3>
					<p class="text-3xl font-bold text-yellow-600">{stats.pendingBookings || 0}</p>
				</div>
				<div class="bg-white border border-[#c8e6c0] rounded-lg p-6">
					<h3 class="text-[#4a6d35] text-sm font-bold mb-2">{it.admin.confirmed}</h3>
					<p class="text-3xl font-bold text-green-600">{stats.confirmedBookings || 0}</p>
				</div>
			</div>

			<!-- Add User Button -->
			<button
				onclick={() => (showAddUserForm = !showAddUserForm)}
				class="mb-6 px-4 py-2 bg-[#5a8a3c] text-white font-bold rounded hover:bg-[#4a7a2c] transition"
			>
				+ {it.admin.add_user}
			</button>

			<!-- Add User Form -->
			{#if showAddUserForm}
				<div class="bg-white border border-[#c8e6c0] rounded-lg p-6 mb-8">
					<h2 class="text-2xl font-bold text-[#2d4a22] mb-6">{it.admin.create_user}</h2>
					<form onsubmit={addUser} class="space-y-4">
						<div class="grid md:grid-cols-2 gap-4">
							<div>
								<label class="block text-[#2d4a22] text-sm font-bold mb-2">{it.auth.name}</label>
								<input
									type="text"
									bind:value={newUserForm.name}
									required
									class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none"
								/>
							</div>
							<div>
								<label class="block text-[#2d4a22] text-sm font-bold mb-2">{it.auth.surname}</label>
								<input
									type="text"
									bind:value={newUserForm.surname}
									required
									class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none"
								/>
							</div>
							<div>
								<label class="block text-[#2d4a22] text-sm font-bold mb-2">{it.auth.email}</label>
								<input
									type="email"
									bind:value={newUserForm.email}
									required
									class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none"
								/>
							</div>
							<div>
								<label class="block text-[#2d4a22] text-sm font-bold mb-2">{it.admin.role}</label>
								<select
									bind:value={newUserForm.role}
									class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none"
								>
									<option value="utente">Utente</option>
									<option value="gestore">Gestore</option>
									<option value="admin">Admin</option>
								</select>
							</div>
							<div>
								<label class="block text-[#2d4a22] text-sm font-bold mb-2">{it.admin.password} (temporanea)</label>
								<div class="relative">
									<input
										type={showPassword ? 'text' : 'password'}
										bind:value={newUserForm.password}
										required
										class="w-full px-4 py-2 bg-white text-[#2d4a22] rounded border border-[#c8e6c0] focus:border-[#5a8a3c] outline-none pr-10"
									/>
									<button
										type="button"
										onclick={() => (showPassword = !showPassword)}
										class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4a6d35] hover:text-[#2d4a22] transition"
									>
										{#if showPassword}👁️{:else}👁️‍🗨️{/if}
									</button>
								</div>
							</div>
						</div>

						{#if createdPassword}
							<div class="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded">
								<p class="font-bold">Password temporanea: <span class="text-lg">{createdPassword}</span></p>
								<p class="text-sm mt-1">Comunicala all'utente: dovrà cambiarla al primo accesso</p>
							</div>
						{/if}

						<div class="flex gap-4">
							<button
								type="submit"
								class="flex-1 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
							>
								{it.admin.create_user}
							</button>
							<button
								type="button"
								onclick={() => (showAddUserForm = false)}
								class="flex-1 py-2 bg-[#f0f7ef] text-[#2d4a22] font-bold rounded hover:bg-[#e8f5e0] transition"
							>
								{it.dashboard.cancel}
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Users Table -->
			<div class="bg-white border border-[#c8e6c0] rounded-lg p-6 mb-8">
				<h2 class="text-2xl font-bold text-[#2d4a22] mb-6">{it.admin.users} ({users.length})</h2>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-[#4a6d35]">
						<thead class="border-b border-[#c8e6c0]">
							<tr>
								<th class="pb-3">{it.auth.email}</th>
								<th class="pb-3">{it.auth.name}</th>
								<th class="pb-3">{it.admin.role}</th>
								<th class="pb-3">{it.admin.verified}</th>
								<th class="pb-3">Approvato</th>
								<th class="pb-3">{it.admin.actions}</th>
							</tr>
						</thead>
						<tbody>
							{#each users as userItem}
								<tr class="border-b border-[#c8e6c0] hover:bg-[#e8f5e0]">
									<td class="py-3">{userItem.email}</td>
									<td class="py-3">{userItem.name} {userItem.surname}</td>
									<td class="py-3"><span class="px-2 py-1 bg-[#5a8a3c]/10 text-[#5a8a3c] rounded text-sm">{userItem.role}</span></td>
									<td class="py-3">{userItem.is_verified ? '✓' : '✗'}</td>
									<td class="py-3">
										{#if userItem.is_approved}
											<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ Approvato</span>
										{:else}
											<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">⏳ In attesa</span>
										{/if}
									</td>
									<td class="py-3">
										<div class="flex gap-2">
											{#if !userItem.is_approved}
												<button
													onclick={() => approveUser(userItem.id)}
													class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition"
													title="Approva utente"
												>
													✓ Approva
												</button>
												<button
													onclick={() => rejectUser(userItem.id)}
													class="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-bold transition"
													title="Rifiuta utente"
												>
													✗ Rifiuta
												</button>
											{/if}
											<button
												onclick={() => deleteUser(userItem.id)}
												class="px-2 py-1 bg-red-600 hover:bg-red-600 text-white rounded text-xs font-bold transition"
												title={it.admin.delete_user}
											>
												{it.admin.delete_user}
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Bookings Table -->
			<div class="bg-white border border-[#c8e6c0] rounded-lg p-6">
				<h2 class="text-2xl font-bold text-[#2d4a22] mb-6">⚙️ {it.admin.bookings} ({bookings.length})</h2>
				<p class="text-[#4a6d35] text-sm mb-4">Gestisci le prenotazioni: conferma o cancella</p>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-[#4a6d35] text-sm">
						<thead class="border-b border-[#c8e6c0]">
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
								<tr class="border-b border-[#c8e6c0] hover:bg-[#e8f5e0]">
									<td class="py-3">{booking.booking_date}</td>
									<td class="py-3">{booking.start_time} - {booking.end_time}</td>
									<td class="py-3">{booking.name} {booking.surname}</td>
									<td class="py-3">
										<span
											class="px-2 py-1 rounded text-xs {booking.status === 'confirmed'
												? 'bg-green-100 text-green-700'
												: booking.status === 'pending'
													? 'bg-yellow-100 text-yellow-700'
													: 'bg-red-100 text-red-700'}"
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
												class="px-3 py-1 bg-red-600 hover:bg-red-600 text-white rounded text-xs font-bold transition"
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
						<p class="text-[#4a6d35] text-center py-8">Nessuna prenotazione</p>
					{/if}
				</div>
			</div>
		{:else}
			<p class="text-[#2d4a22]">Caricamento...</p>
		{/if}
	</div>
</main>

<Footer />
