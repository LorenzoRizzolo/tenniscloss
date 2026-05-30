import { verifyToken } from '$lib/server/auth.js';

export async function load({ request, cookies }) {
	const token = cookies.get('authToken');

	if (!token) {
		return {
			user: null
		};
	}

	const user = verifyToken(token);
	return { user };
}
