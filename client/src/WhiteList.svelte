<script context="module">
  import gql from 'graphql-tag';
  import { client } from './apollo';
  import Textfield, { Input } from '@smui/textfield';
  import FloatingLabel from '@smui/floating-label';
  import LineRipple from '@smui/line-ripple';

  const ARTICLES = gql`
    {
      wl {
        name
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
        <Textfield>
          <Input value={wl.name} />
          <FloatingLabel for="name-input">Name</FloatingLabel>
          <LineRipple />
        </Textfield>
        
        {#each wl.list as item}
            <!-- {item} -->
        {/each}
      </li>
    {:else}
      <li>No wl found</li>
    {/each}
  {:catch error}
    <li>Error loading wl: {error}</li>
  {/await}
</ul>