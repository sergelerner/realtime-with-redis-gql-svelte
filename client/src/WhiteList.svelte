<script context="module">
  import gql from 'graphql-tag';
  import { client } from './apollo';
  import { subscribe } from 'svelte-apollo';

  const SAVE_WHITE_LIST = gql`
    mutation($value: String!) {
      wl(input: $value) {
        name
        all
        list
      }
    }
  `;

  const SUBSCRIBE_WHITE_LIST = gql`
    subscription {
      wl {
        name
        all
        list
      }
    }
  `;
  
  export function preload() {
    return subscribe(client, {
      query: SUBSCRIBE_WHITE_LIST,
    });
  }
</script>

<script>
  import { mutate } from 'svelte-apollo';
  import WhiteListItem from './WhiteListItem.svelte'
  import Button, { Label } from '@smui/button';
  import Fab, { Icon } from '@smui/fab';
  
  export let cache;

  function addItem() {
    cache.data.wl = [ ...cache.data.wl, {
      name: '',
      all: false,
      list: [],
    }]
  }

  function deleteItem(name) {
    cache.data.wl = cache.data.wl.filter(x => x.name !== name)
  }

  async function save() {
    try {
      await mutate(client, {
        mutation: SAVE_WHITE_LIST,
        variables: { value: JSON.stringify(cache.data.wl) }
      });
    } catch(error) {
      console.error(error);
    }
  }
</script>

<section>
  <Fab on:click={addItem} mini>
    <Icon class="material-icons">+</Icon>
  </Fab>
</section>

<section>
  {#each cache.data.wl as wl}
    <WhiteListItem
      bind:all={wl.all}
      bind:name={wl.name}
      deleteItem={deleteItem}
    />
  {:else}
    <p>No wl found</p>
  {/each}
</section>

<section>
  <Button on:click={save} variant="raised">
    <Label>Save</Label>
  </Button>
</section>

<style>
  section {
    margin-bottom: 20px;
  }
</style>