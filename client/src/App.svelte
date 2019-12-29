<script>
	import ApolloClient from 'apollo-client';
	import { client } from './apollo';
  import { setClient } from 'svelte-apollo';
  import WhiteList, { preload as whiteListPreload } from './WhiteList.svelte';

  const whiteListPreloading = whiteListPreload();

  console.log('whiteListPreloading', whiteListPreloading)

	setClient(client);
</script>

<style>
	section {
		padding: 40px;
	}

	h2 {
		color: purple;
		margin-bottom: 20px;
		font-size: 24px;
	}
</style>

<section>
	<h2>White List!</h2>

  {#await $whiteListPreloading}
		<p>Preloading articles....</p>
	{:then preloaded}
		<WhiteList cache={preloaded} />
	{:catch error}
		<p>Error preloading articles: {error}</p>
	{/await}
</section>
