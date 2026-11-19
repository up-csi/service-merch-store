<script lang="ts">
	import { enhance } from '$app/forms';
	import CartItem from '$lib/components/CartItem/CartItem.svelte';
	import MayaIcon from '$lib/assets/maya.svg';
    import GCashIcon from '$lib/assets/gcash.svg';
	import CashIcon from '$lib/assets/cash.svg';

	let { data } = $props();

	const cartItems = $derived(data.cartItems);

	let selectedIds = $state<number[]>([]);

	let paymentMethod = $state<'cash' | 'maya' | 'gcash' | null>(null);

	const allSelected = $derived(
		cartItems.length > 0 && selectedIds.length === cartItems.length
	);

	function toggleSelectAll() {
		selectedIds = allSelected ? [] : cartItems.map((item) => item.id);
	}

	function toggleItem(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((item) => item !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	const selectedItems = $derived(
		cartItems.filter((item) => selectedIds.includes(item.id))
	);

	const totalCount = $derived(
		selectedItems.reduce((sum, item) => sum + item.count, 0)
	);

	const totalPrice = $derived(
		selectedItems.reduce((sum, item) => sum + item.price * item.count, 0)
	);

	const canCheckout = $derived(selectedIds.length > 0 && paymentMethod !== null);

	function formatPHP(amount: number) {
		return `₱ ${amount.toLocaleString('en-PH', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;
	}

	const paymentOptions = [
		{ id: 'cash', label: 'Cash', icon: CashIcon },
		{ id: 'maya', label: 'Maya', icon: MayaIcon },
        { id: 'gcash', label: 'GCash', icon: GCashIcon }
	] as const;

	$effect(() => {
		const currentIds = new Set(cartItems.map((item) => item.id));
		const remainingIds = selectedIds.filter((id) => currentIds.has(id));

		if (remainingIds.length !== selectedIds.length) {
			selectedIds = remainingIds;
		}
	});
</script>

<div class="mx-auto max-w-6xl px-6 py-10">
	<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">

		<div class="lg:col-span-7">
			<h1 class="mb-6 text-2xl font-normal tracking-wide text-neutral-900 uppercase">
				Your Cart
			</h1>

			<div class="flex items-center gap-4 border-b border-neutral-200 pb-3">
				<label class="flex cursor-pointer items-center gap-2.5 text-sm tracking-wider text-neutral-500 uppercase select-none">
					<input
						type="checkbox"
						checked={allSelected}
						onchange={toggleSelectAll}
						class="h-5 w-5 shrink-0 rounded-sm border-2 border-solid border-gray-500 bg-transparent text-neutral-900 focus:ring-0"
					/>
					<span>Select All</span>
				</label>

				{#if selectedIds.length > 0}
					<span class="h-4 w-px bg-neutral-300"></span>

					<form
						method="POST"
						action="?/deleteCartEntries"
						use:enhance={() => {
							return async ({ update }) => {
								selectedIds = [];
								await update();
							};
						}}
					>
						<input type="hidden" name="cartIDs" value={selectedIds.join(',')} />
						<button
							type="submit"
							class="flex cursor-pointer items-center gap-2.5 text-sm tracking-wider text-neutral-500 uppercase transition hover:text-red-600"
						>
							<svg
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
								/>
							</svg>
							<span>Delete</span>
						</button>
					</form>
				{/if}
			</div>

			{#if cartItems.length === 0}
				<p class="py-12 text-center text-sm text-neutral-500">Your cart is empty.</p>
			{:else}
				<div class="divide-y divide-neutral-200">
					{#each cartItems as item (item.id)}
						{@const isSelected = selectedIds.includes(item.id)}
						<div class="transition-colors {isSelected ? 'bg-neutral-200/75' : 'bg-white'}">
							<CartItem
								id={item.id}
								name={item.name}
								price={item.price}
								imageUrl={item.image}
								count={item.count}
								checked={isSelected}
								onToggle={() => toggleItem(item.id)}
							/>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="lg:col-span-5">
			<div class="border border-neutral-100 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
				<h2 class="mb-6 text-2xl font-normal text-neutral-900">
					Order Summary
				</h2>

				<div class="flex items-baseline justify-between">
					<div>
						<p class="text-lg font-normal text-neutral-900">Total</p>
						<p class="mt-0.5 text-xs text-neutral-500">
							{totalCount} {totalCount === 1 ? 'item' : 'items'}
						</p>
					</div>
					<p class="text-lg font-normal text-neutral-900">
						{formatPHP(totalPrice)}
					</p>
				</div>

				<hr class="my-8 border-neutral-200" />

				<div class="mb-8">
					<p class="mb-4 text-sm text-neutral-600">Choose a payment method</p>

					<div class="grid grid-cols-3 gap-3">
						{#each paymentOptions as option (option.id)}
							{@const isActive = paymentMethod === option.id}
							<button
								type="button"
								onclick={() => (paymentMethod = isActive ? null : option.id)}
								class="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 border transition-colors {isActive
									? 'border-neutral-300 bg-neutral-200'
									: 'border-neutral-300 bg-white hover:bg-neutral-50'}"
							>
								<img
									src={option.icon}
									alt={option.label}
									class="h-7 w-19 object-contain"
								/>
								<span class="text-[11px] text-neutral-600">{option.label}</span>
							</button>
						{/each}
					</div>
				</div>

				<button
					type="button"
					disabled={!canCheckout}
					onclick={() => {
						console.log({ selectedIds, paymentMethod, totalPrice });
					}}
					class="w-full rounded-full py-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed {canCheckout
						? 'bg-neutral-900 text-white hover:bg-neutral-800'
						: 'bg-neutral-300 text-neutral-500'}"
				>
					Proceed to checkout
				</button>
			</div>
		</div>

	</div>
</div>