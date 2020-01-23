<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono">

<script>
	import ApolloClient from 'apollo-client';
	import { client } from './apollo';
  import { setClient } from 'svelte-apollo';
  import WhiteList, { preload as whiteListPreload } from './components/white-list/WhiteList.svelte';

  const whiteListPreloading = whiteListPreload();

	setClient(client);
</script>

<style type="text/scss">
	@import "@material/typography/mdc-typography";
	@import "./styles/variables";

  :global(body) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

	section {
		padding: 40px;
	}

	h2 {
		@include mdc-typography("headline4");
		margin-bottom: $space-xl;
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
