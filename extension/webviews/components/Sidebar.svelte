<script lang="ts">
	import { onMount } from 'svelte';

	let accessToken = '';
	let todos: Array<{ text: string; completed: boolean }> = [];
	let text = '';
	let loading = true;
	let user: { name: string; id: string } | null = null;

	onMount(async () => {
		// const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		// let photos = await res.json();
		// console.log('photos', photos);

		window.addEventListener('message', async (event) => {
			const message = event.data; // The json data that the extension sent
			console.log({ message });
			switch (message.type) {
				case 'new-todo':
					todos = [{ text: message.value, completed: false }, ...todos];
					break;
				case 'token':
					accessToken = message.value;
					const response = await fetch(`${apiBaseUrl}/me`, {
						headers: {
							authorization: `Bearer ${accessToken}`,
						},
					});
					const data = await response.json();
					user = data.user;
					console.log('userr', user);
					loading = false;
			}
		});

		tsvscode.postMessage({ type: 'get-token', value: undefined });
	});

	// function handleClick() {
	// 	todos = [{ text, completed: false }, ...todos];
	// 	console.log(todos);
	// }
</script>

{#if loading}
	<div>Loading...</div>
{:else if user}
	<pre>{JSON.stringify(user,null,2)}</pre>
{:else}
	<div>No user is logged in</div>
{/if}

<form
	on:submit|preventDefault={() => {
		console.log('form submitted');
		todos = [{ text, completed: false }, ...todos];
		text = '';
	}}
>
	<input type="text" bind:value={text} />
	<!-- <button on:click={handleClick}>Add Todo</button> -->
	<!-- <p>{text}</p> -->

	<!-- <ul>
		{#each todos as todo}
			<li>{todo}</li>
		{/each}
	</ul> -->
	<!-- {counter}
	<button on:click={() => counter++}>increment</button> -->
</form>
<ul>
	{#each todos as { text, completed } (text)}
		<li
			class:completed
			on:click={() => {
				console.log('clicked', text);
				completed = !completed;
			}}
		>
			{text}
		</li>
	{/each}
</ul>
<!-- svelte-ignore missing-declaration -->
<button
	on:click={() => {
		tsvscode.postMessage({
			type: 'onInfo',
			value: 'info message',
		});
	}}>click me</button
>

<!-- svelte-ignore missing-declaration -->
<button
	on:click={() => {
		tsvscode.postMessage({
			type: 'onError',
			value: 'error message',
		});
	}}>click me for error</button
>

<!-- <pre>{JSON.stringify(todos, null, 2)}</pre> -->
<style>
	div {
		color: pink;
	}
	button {
		background-color: rgb(43, 76, 226);
	}
	.completed {
		text-decoration: line-through;
	}
</style>
