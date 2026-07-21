<script lang="ts">
	import { getToasts, toast } from '$lib/stores/toast.svelte';
	import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/svelte';

	const iconMap = {
		success: CircleCheck,
		error: CircleX,
		info: Info,
		warning: TriangleAlert
	} as const;
</script>

{#if getToasts().length > 0}
	<div class="toast-container" aria-live="polite" aria-atomic="false">
		{#each getToasts() as item (item.id)}
			<div class="toast toast--{item.type}" role="alert">
				<div class="toast__icon">
					<svelte:component this={iconMap[item.type]} size={18} strokeWidth={2.5} />
				</div>
				<div class="toast__body">
					<p class="toast__title">{item.title}</p>
					{#if item.message}
						<p class="toast__message">{item.message}</p>
					{/if}
				</div>
				<button
					type="button"
					class="toast__close"
					onclick={() => toast.remove(item.id)}
					aria-label="Tutup notifikasi"
				>
					<X size={14} strokeWidth={2.5} />
				</button>

				<div class="toast__progress" style="animation-duration: {item.duration}ms"></div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		max-width: 26rem;
		width: calc(100vw - 2.5rem);
		pointer-events: none;
	}

	.toast {
		pointer-events: auto;
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-radius: 0.875rem;
		border: 1px solid;
		background: white;
		box-shadow:
			0 8px 30px -4px rgba(0, 0, 0, 0.08),
			0 2px 8px -2px rgba(0, 0, 0, 0.04);
		overflow: hidden;
		animation: toast-slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
		backdrop-filter: blur(12px);
	}

	@keyframes toast-slide-in {
		from {
			opacity: 0;
			transform: translateX(100%) scale(0.95);
		}
		60% {
			opacity: 1;
			transform: translateX(-4%) scale(1);
		}
		to {
			transform: translateX(0) scale(1);
		}
	}

	/* ---- Success ---- */
	.toast--success {
		border-color: #d1fae5;
		background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
	}
	.toast--success .toast__icon {
		color: #16a34a;
		background: #dcfce7;
	}
	.toast--success .toast__progress {
		background: linear-gradient(90deg, #16a34a, #22c55e);
	}

	/* ---- Error ---- */
	.toast--error {
		border-color: #fecaca;
		background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
	}
	.toast--error .toast__icon {
		color: #dc2626;
		background: #fee2e2;
	}
	.toast--error .toast__progress {
		background: linear-gradient(90deg, #dc2626, #ef4444);
	}

	/* ---- Info ---- */
	.toast--info {
		border-color: #bfdbfe;
		background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
	}
	.toast--info .toast__icon {
		color: #2563eb;
		background: #dbeafe;
	}
	.toast--info .toast__progress {
		background: linear-gradient(90deg, #2563eb, #3b82f6);
	}

	/* ---- Warning ---- */
	.toast--warning {
		border-color: #fed7aa;
		background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
	}
	.toast--warning .toast__icon {
		color: #ea580c;
		background: #ffedd5;
	}
	.toast--warning .toast__progress {
		background: linear-gradient(90deg, #ea580c, #f97316);
	}

	/* ---- Shared parts ---- */
	.toast__icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.625rem;
	}

	.toast__body {
		flex: 1;
		min-width: 0;
		padding-top: 0.125rem;
	}

	.toast__title {
		font-size: 0.8125rem;
		font-weight: 700;
		color: #0f172a;
		line-height: 1.3;
		margin: 0;
	}

	.toast__message {
		font-size: 0.75rem;
		font-weight: 500;
		color: #64748b;
		line-height: 1.5;
		margin: 0.25rem 0 0;
	}

	.toast__close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.375rem;
		border: none;
		background: transparent;
		color: #94a3b8;
		cursor: pointer;
		transition: all 0.15s ease;
		margin-top: 0.125rem;
	}
	.toast__close:hover {
		background: #f1f5f9;
		color: #475569;
	}

	.toast__progress {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		width: 100%;
		border-radius: 0 0 0.875rem 0.875rem;
		animation: toast-progress-shrink linear forwards;
		transform-origin: left;
	}

	@keyframes toast-progress-shrink {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
</style>
