<script>
	import Counter from "./Counter.svelte";
	import welcome from "$lib/images/svelte-welcome.webp";
	import welcome_fallback from "$lib/images/svelte-welcome.png";
	let yes = false;
</script>

<svelte:head>
	<title>Home</title>
	<meta
		name="description"
		content="Svelte demo app"
	/>
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source
					srcset={welcome}
					type="image/webp"
				/>
				<img
					src={welcome_fallback}
					alt="Welcome"
				/>
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<button
		type="button"
		class="btn bg-gradient-to-br variant-gradient-primary-secondary">Button</button
	>

	<label>
		<input
			type="checkbox"
			bind:checked={yes}
		/>
		Yes! Send me regular email spam
	</label>
	{#if yes}
		<p>Has checkeado</p>
	{:else}
		<p>No has checkeadp</p>
	{/if}
	<button disabled={!yes}> Subscribe </button>
	<button>testeo</button>
	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
