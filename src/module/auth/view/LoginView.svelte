<script lang="ts">
	import { loginAdmin } from '../_request';
	import Button from '../../../lib/components/ui/Button.svelte';
	import Input from '../../../lib/components/ui/Input.svelte';
	import { KeyRound, User, Loader2, Compass, AlertCircle } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	const handleLogin = async (e: Event) => {
		e.preventDefault();
		errorMessage = '';
		isLoading = true;

		try {
			const response = await loginAdmin({
				username: username.trim(),
				password: password
			});

			if (response && response.data?.access_token) {
				const token = response.data.access_token;
				localStorage.setItem('token', token);
				document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;

				window.location.href = '/dashboard';
			} else {
				errorMessage = response.message || 'Login gagal, silakan coba lagi.';
			}
		} catch (error) {
			console.error('Failed to login:', error);
			errorMessage =
				error instanceof Error
					? error.message
					: 'Terjadi kesalahan sistem, silakan coba lagi nanti.';
		} finally {
			isLoading = false;
		}
	};
</script>

<div
	class="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden px-4"
	in:fade={{ duration: 300 }}
>
	<div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
	<div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

	<div
		class="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100 p-8 space-y-6 relative z-10"
		in:fly={{ y: 20, duration: 400, delay: 100 }}
	>
		<div class="flex flex-col items-center text-center space-y-2">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20"
			>
				<Compass size={24} strokeWidth={2.5} />
			</div>
			<div class="space-y-1">
				<h2 class="text-xl font-extrabold tracking-tight text-slate-900">Portal Admin Cipicung</h2>
				<p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
					Silakan login untuk masuk
				</p>
			</div>
		</div>

		{#if errorMessage}
			<div
				class="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-semibold"
				transition:fade={{ duration: 150 }}
			>
				<AlertCircle size={16} class="shrink-0 mt-0.5" />
				<div>{errorMessage}</div>
			</div>
		{/if}

		<form onsubmit={handleLogin} class="space-y-4">
			<div class="space-y-1.5">
				<label for="username" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Username</label
				>
				<div class="relative">
					<span
						class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none"
					>
						<User size={16} />
					</span>
					<Input
						id="username"
						type="text"
						bind:value={username}
						placeholder="Masukkan username Anda"
						class="pl-10 py-3 bg-slate-50/50"
						required
					/>
				</div>
			</div>

			<div class="space-y-1.5">
				<label for="password" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Password</label
				>
				<div class="relative">
					<span
						class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none"
					>
						<KeyRound size={16} />
					</span>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						class="pl-10 py-3 bg-slate-50/50"
						required
					/>
				</div>
			</div>

			<div class="pt-2">
				<Button
					type="submit"
					class="w-full py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
					disabled={isLoading}
				>
					{#if isLoading}
						<Loader2 size={16} class="animate-spin" />
						Memproses...
					{:else}
						Masuk Ke Dashboard
					{/if}
				</Button>
			</div>
		</form>

		<div class="text-center pt-2 border-t border-slate-100">
			<p class="text-xs font-semibold text-slate-400">
				Belum memiliki akun admin?
				<a href="/auth/register" class="text-blue-600 hover:text-blue-700 transition-colors"
					>Daftar disini</a
				>
			</p>
		</div>
	</div>
</div>
