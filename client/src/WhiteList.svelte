<script context="module">
  import gql from 'graphql-tag';
  import { client } from './apollo';

  const ARTICLES = gql`
    {
      wl {
        all
        list
      }
    }
  `;
  
  export async function preload() {
    return {
      cache: await client.query({ query: ARTICLES })
    };
  }
</script>

<script>
  import { restore, query } from 'svelte-apollo';
  
  export let cache;
  restore(client, ARTICLES, cache.data);

  const wl = query(client, { query: ARTICLES });
</script>

<ul>
  {#await $wl}
    <li>Loading...</li>
  {:then result}
    {#each result.data.wl as wl}
      <li>
        {wl.all}
        {#each wl.list as item}
            {item}
        {/each}
      </li>
    {:else}
      <li>No wl found</li>
    {/each}
  {:catch error}
    <li>Error loading wl: {error}</li>
  {/await}
</ul>