<script>
	import ApolloClient from 'apollo-client';
	import { client } from './apollo';
  import { setClient } from 'svelte-apollo';
  import WhiteList, { preload as whiteListPreload } from './WhiteList.svelte';

  const whiteListPreloading = whiteListPreload();

	setClient(client);
</script>

<style>
	section {
		padding: 40px;
	}

	h2 {
		color: purple;
	}
</style>

<section>
	<h2>Will see....</h2>

  {#await whiteListPreloading}
		<p>Preloading articles....</p>
	{:then preloaded}
		<WhiteList {...preloaded} />
	{:catch error}
		<p>Error preloading articles: {error}</p>
	{/await}
</section>
