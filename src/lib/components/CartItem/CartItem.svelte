<script lang="ts">
	import { enhance } from '$app/forms';
	let {
		id,
		name,
		price,
		imageUrl,
		count,
		checked,
		onToggle
	}: {
		id: number;
		name: string | null;
		price: number | null;
		imageUrl: string | null;
		count: number;
		checked: boolean;
		onToggle: () => void;
	} = $props();

	// Extract variant from product name (if applicable)
	let { variant, variantStart } = $derived.by(() => {
		let v = null,
			vStart = name?.length;
		if (name && name.includes('(') && name.includes(')')) {
			v = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
		}
		return { variant: v, variantStart: vStart };
	});

	// Compute total price for item
	let total = $derived((price ?? 0) * count);
</script>


<div
	class="grid w-full grid-cols-[20px_5rem_minmax(0,1fr)_120px_100px] items-center gap-3 py-4"
>
	<input
		type="checkbox"
		checked={checked}
		onchange={onToggle}
		class="h-5 w-5 border-2 border-solid border-gray-500 bg-transparent"
	/>

	<img src={imageUrl} alt={name ?? 'Product'} class="h-20 w-20 object-cover object-center" />

	<div class="min-w-0">
		<span class="text-lg font-medium">{name?.substring(0, variantStart)}</span>
		{#if variant}
			<span class="block text-sm font-light">{variant}</span>
		{/if}
	</div>

	<form method="POST" action="?/editCartEntry" use:enhance class="flex items-center gap-2">
		<input type="hidden" bind:value={id} name="id" />
		<input type="hidden" bind:value={count} name="count" />

		<button
			type="submit"
			class="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-gray-200 font-bold"
			onclick={() => (count > 1 ? (count -= 1) : (count = 0))}
		>
			-
		</button>
		<input
			type="text"
			inputmode="numeric"
			class="w-10 text-center text-lg"
			bind:value={count}
			oninput={(e) => {
				count = Number(e.currentTarget.value.replace(/\D/g, ''));

				if (count > 999) count = Number(e.currentTarget.value.substring(0, 3));

				const form = e.currentTarget.form;
				setTimeout(() => {
					form?.requestSubmit();
				}, 1);
			}}
		/>
		<button
			type="submit"
			class="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-gray-200 font-bold"
			onclick={() => (count += 1)}
		>
			+
		</button>
	</form>

	<div class="flex flex-col items-end whitespace-nowrap">
		<span class="text-lg font-medium">Php {total.toFixed(2)}</span>
		<span class="text-sm font-light">Php {(price ?? 0).toFixed(2)}</span>
	</div>
</div>
