<script lang="ts">
	import { registerAdmin } from '../_request';
	import Button from '../../../lib/components/ui/Button.svelte';
	import Input from '../../../lib/components/ui/Input.svelte';
	import {
		KeyRound,
		User,
		Loader2,
		Compass,
		AlertCircle,
		Sparkles,
		CheckCircle2
	} from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	let name = $state('');
	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	const handleRegister = async (e: Event) => {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';
		isLoading = true;

		try {
			const response = await registerAdmin({
				name: name.trim(),
				username: username.trim(),
				password: password
			});

			if (response) {
				successMessage = 'Registrasi berhasil! Mengalihkan ke halaman login...';
				setTimeout(() => {
					window.location.href = '/auth/login';
				}, 1500);
			} else {
				errorMessage = 'Registrasi gagal, silakan coba lagi.';
			}
		} catch (error) {
			console.error('Failed to register:', error);
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
				<h2 class="text-xl font-extrabold tracking-tight text-slate-900">Daftar Akun Admin</h2>
				<p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
					Silakan isi formulir di bawah ini
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

		{#if successMessage}
			<div
				class="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-2xl text-xs font-semibold"
				transition:fade={{ duration: 150 }}
			>
				<CheckCircle2 size={16} class="shrink-0 mt-0.5" />
				<div>{successMessage}</div>
			</div>
		{/if}

		<form onsubmit={handleRegister} class="space-y-4">
			<div class="space-y-1.5">
				<label for="name" class="block text-xs font-bold text-slate-500 uppercase tracking-wide"
					>Nama Lengkap</label
				>
				<div class="relative">
					<span
						class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none"
					>
						<Sparkles size={16} />
					</span>
					<Input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Masukkan nama lengkap Anda"
						class="pl-10 py-3 bg-slate-50/50"
						required
					/>
				</div>
			</div>

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
						placeholder="Pilih username unik"
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
						placeholder="Buat password minimal 6 karakter"
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
						Mendaftar...
					{:else}
						Daftar Akun Baru
					{/if}
				</Button>
			</div>
		</form>

		<div class="text-center pt-2 border-t border-slate-100">
			<p class="text-xs font-semibold text-slate-400">
				Sudah memiliki akun admin?
				<a href="/auth/login" class="text-blue-600 hover:text-blue-700 transition-colors"
					>Login disini</a
				>
			</p>
		</div>
	</div>
</div>
