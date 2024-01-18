<script>
	const cardClass = "card variant-filled-surface card-hover variant-glass-secondary p-4 cursor-pointer text-black";
	const items = [
		{
			label: "Item 1",
			image: "https://i.imgur.com/YHCbgYD.png",
		},
		{
			label: "Item 2",
			image: "https://i.imgur.com/YHCbgYD.png",
		},
		{
			label: "Item 3",
			image: "https://i.imgur.com/YHCbgYD.png",
		},
		{
			label: "Item 4",
			image: "https://i.imgur.com/YHCbgYD.png",
		},
	];
</script>

<svelte:head>
	<title>home</title>
	<meta
		name="description"
		content="Home"
	/>
</svelte:head>

<div class="w-100 flex flex-col gap-16">
	<div class="flex justify-evenly">
		{#each items as _item}
			<div class={cardClass}>
				<img
					class="card-image"
					src={_item.image}
					alt={_item.label}
				/>
				<span class="font-bold text-2xl card-text">{_item.label}</span>
			</div>
		{/each}
	</div>

	<div class="flex justify-evenly">
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-warning-success">Button</button
		>
		<button
			type="button"
			class="btn variant-filled-success">Button</button
		>
		<button
			type="button"
			class="btn variant-soft-surface">Button</button
		>
	</div>
</div>

<style>
	.card-image {
		opacity: 0.55;
	}
	.card-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
</style>
