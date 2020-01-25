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
  :global(body) {
		height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
		align-items: center;
		background-image: linear-gradient(to right, #868f96 0%, #596164 100%);
		// background-image: linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%);
	}
	
	:global(.main) {
		width: 700px;
		height: 600px;
		padding: 50px !important;
		background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
	}
</style>

<Paper class="main" elevation="6">
  {#await $whiteListPreloading}
		<LinearProgress indeterminate />
	{:then preloaded}
		<WhiteList cache={preloaded} />
	{:catch error}
		<p>Error preloading articles: {error}</p>
	{/await}
</Paper>
