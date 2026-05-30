<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Footer from '$components/Footer.svelte';

	let user = $state(null);
	let users = $state([]);
	let bookings = $state([]);
	let stats = $state({});
	let isLoading = $state(true);
	let showAddUserForm = $state(false);
	let newUserForm = $state({
		email: '',
		name: '',
		surname: '',
		role: 'utente'
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
				pendingBookings: bookings.filter(b => b.status === 'in sospeso').length,
				confirmedBookings: bookings.filter(b => b.status === 'confermato').length
			};
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			isLoading = false;
		}
	}

	async function addUser(e) {
		e.preventDefault();
		isError = false;
		message = '';

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
				message = 'User created successfully!';
				newUserForm = { email: '', name: '', surname: '', role: 'utente' };
				showAddUserForm = false;
				fetchData();
			} else {
				isError = true;
				message = data.error || 'Failed to create user';
			}
		} catch (error) {
			isError = true;
			message = 'Si è verificato un errore';
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Tennis Borgata Closs</title>
</svelte:head>

<Navbar />

<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		{#if user}
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-white mb-2">👑 Admin Dashboard</h1>
				<p class="text-slate-400">Manage the entire platform</p>
			</div>

			{#if message}
				<div
					class="mb-6 p-4 rounded {isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}"
				>
					{message}
				</div>
			{/if}

			<!-- Stats Grid -->
			<div class="grid md:grid-cols-4 gap-4 mb-8">
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">Total Users</p>
					<p class="text-4xl font-bold text-purple-400">{stats.totalUsers || 0}</p>
				</div>
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">Total Bookings</p>
					<p class="text-4xl font-bold text-blue-400">{stats.totalBookings || 0}</p>
				</div>
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">Pending</p>
					<p class="text-4xl font-bold text-yellow-400">{stats.pendingBookings || 0}</p>
				</div>
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
					<p class="text-slate-400 text-sm">Confirmed</p>
					<p class="text-4xl font-bold text-green-400">{stats.confirmedBookings || 0}</p>
				</div>
			</div>

			<!-- Add User Button -->
			<button
				onclick={() => (showAddUserForm = !showAddUserForm)}
				class="mb-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded hover:shadow-lg hover:shadow-purple-500/50 transition"
			>
				+ Add User
			</button>

			<!-- Add User Form -->
			{#if showAddUserForm}
				<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
					<h2 class="text-2xl font-bold text-white mb-6">Add New User</h2>
					<form onsubmit={addUser} class="grid md:grid-cols-2 gap-4">
						<div>
							<label class="block text-white text-sm font-bold mb-2">Email</label>
							<input
								type="email"
								bind:value={newUserForm.email}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
								placeholder="user@example.com"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">Role</label>
							<select
								bind:value={newUserForm.role}
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
							>
								<option value="utente">User</option>
								<option value="gestore">Manager</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">Name</label>
							<input
								type="text"
								bind:value={newUserForm.name}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
								placeholder="John"
							/>
						</div>
						<div>
							<label class="block text-white text-sm font-bold mb-2">Surname</label>
							<input
								type="text"
								bind:value={newUserForm.surname}
								required
								class="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
								placeholder="Doe"
							/>
						</div>
						<div class="md:col-span-2 flex gap-4">
							<button
								type="submit"
								class="flex-1 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
							>
								Add User
							</button>
							<button
								type="button"
								onclick={() => (showAddUserForm = false)}
								class="flex-1 py-2 bg-slate-700 text-white font-bold rounded hover:bg-slate-600"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Users Table -->
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
				<h2 class="text-2xl font-bold text-white mb-6">Users ({users.length})</h2>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-slate-300">
						<thead class="border-b border-slate-700">
							<tr>
								<th class="pb-3">Email</th>
								<th class="pb-3">Name</th>
								<th class="pb-3">Role</th>
								<th class="pb-3">Verified</th>
							</tr>
						</thead>
						<tbody>
							{#each users as user}
								<tr class="border-b border-slate-700 hover:bg-slate-700/50">
									<td class="py-3">{user.email}</td>
									<td class="py-3">{user.name} {user.surname}</td>
									<td class="py-3"><span class="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-sm">{user.role}</span></td>
									<td class="py-3">{user.is_verified ? '✓' : '✗'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Bookings Table -->
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
				<h2 class="text-2xl font-bold text-white mb-6">Recent Bookings ({bookings.length})</h2>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-slate-300 text-sm">
						<thead class="border-b border-slate-700">
							<tr>
								<th class="pb-3">Date</th>
								<th class="pb-3">Time</th>
								<th class="pb-3">User</th>
								<th class="pb-3">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each bookings.slice(0, 10) as booking}
								<tr class="border-b border-slate-700 hover:bg-slate-700/50">
									<td class="py-3">{booking.booking_date}</td>
									<td class="py-3">{booking.start_time} - {booking.end_time}</td>
									<td class="py-3">User</td>
									<td class="py-3"><span class="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">{booking.status}</span></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<p class="text-white">Loading...</p>
		{/if}
	</div>
</main>

<Footer />
