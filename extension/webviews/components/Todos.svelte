<script lang="ts">
	import { onMount } from 'svelte';
	import type { User } from '../types';

	export let user: User;

	let todos: Array<{ text: string; completed: boolean }> = [];
	let text = '';

	onMount(async () => {
		window.addEventListener('message', async (event) => {
			const message = event.data; // The json data that the extension sent
			console.log({ message });
			switch (message.type) {
				case 'new-todo':
					todos = [{ text: message.value, completed: false }, ...todos];
					break;
			}
		});
	});
</script>

<div>Hello: {user.name}</div>

<form
	on:submit|preventDefault={() => {
		console.log('form submitted');
		todos = [{ text, completed: false }, ...todos];
		text = '';
	}}
>
	<input type="text" bind:value={text} />
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

<style>
	.completed {
		text-decoration: line-through;
	}
</style>
