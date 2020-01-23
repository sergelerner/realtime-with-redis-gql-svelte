<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono">

<script>
	import Paper, {Content} from '@smui/paper'
	import LinearProgress from '@smui/linear-progress';

	import ApolloClient from 'apollo-client'
	import { client } from './apollo'
  import { setClient } from 'svelte-apollo'
  import WhiteList, { preload as whiteListPreload } from './components/white-list/WhiteList.svelte'

  const whiteListPreloading = whiteListPreload()

	setClient(client)
</script>

<style type="text/scss">
	@import "@material/typography/mdc-typography";
	@import "./styles/variables";

  :global(body) {
		height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
		align-items: center;
		background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
	}
	
	:global(.white-list) {
		width: 800px;
		height: 700px;
		padding: 50px !important;
	}

	h2 {
		@include mdc-typography("headline4");
		margin-bottom: $space-xl;
	}
</style>

<Paper class="white-list" elevation="6">
	<h2>White List!</h2>

  {#await $whiteListPreloading}
		<LinearProgress indeterminate />
	{:then preloaded}
		<WhiteList cache={preloaded} />
	{:catch error}
		<p>Error preloading articles: {error}</p>
	{/await}
</Paper>
