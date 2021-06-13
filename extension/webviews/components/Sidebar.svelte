<script lang="ts">
	import { onMount } from 'svelte';
	import type { User } from '../types';
	import Todos from './Todos.svelte';

	let accessToken = '';
	let loading = true;
	let user: User | null = null;

	onMount(async () => {
		window.addEventListener('message', async (event) => {
			const message = event.data; // The json data that the extension sent
			console.log({ message });
			switch (message.type) {
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
</script>

{#if loading}
	<div>Loading...</div>
{:else if user}
	<!-- <pre>{JSON.stringify(user,null,2)}</pre> -->
	<Todos {user} />
	<button
		class="button-red"
		on:click={() => {
			console.log('logout');
			accessToken = '';
			user = null;
			tsvscode.postMessage({ type: 'logout', value: undefined });
		}}>Logout</button
	>
{:else}
	<button
		class="button-blue"
		on:click={() => {
			tsvscode.postMessage({ type: 'authenticate', value: undefined });
		}}>Login with Github</button
	>
{/if}

<style>
	.button-red {
		background: rgb(97, 0, 0);
	}
	.button-blue {
		background-color: blueviolet;
	}
</style>
