<script context="module">
  import gql from 'graphql-tag';
  import { client } from './apollo';

  const WHITE_LIST = gql`
    {
      wl {
        name
        all
        list
      }
    }
  `;

  const SAVE_WHITE_LIST = gql`
    mutation($value: String!) {
      wl(input: $value) {
        name
        all
        list
      }
    }
  `;
  
  export async function preload() {
    return await client.query({ query: WHITE_LIST })
  }
</script>

<script>
  import { restore, mutate } from 'svelte-apollo';
  import Textfield, { Input } from '@smui/textfield';
  import FloatingLabel from '@smui/floating-label';
  import LineRipple from '@smui/line-ripple';
  import Switch from '@smui/switch';
  import Button, { Label } from '@smui/button';
  
  export let cache;
  
  restore(client, WHITE_LIST, cache.data);

  let list = cache.data.wl.map(item => item)

  async function save() {
    try {
      await mutate(client, {
        mutation: SAVE_WHITE_LIST,
        variables: { value: JSON.stringify(list) }
      });
      restore(client, AUTHOR_LIST, list);
    } catch(error) {
      console.error(error);
    }
  }
</script>

<style>
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }

  .item-switch {
    margin-right: 20px;
  }

  :global(label) {
    top: 12px !important;
  }
</style>

<ul>
  {#each list as wl}
    <li class="item">
      <div class="item-switch">
        <Switch bind:checked={wl.all} />
      </div>

      <div class="item-input">
        <Textfield>
          <Input bind:value={wl.name} />
          <FloatingLabel for="name-input">Name</FloatingLabel>
          <LineRipple />
        </Textfield>
      </div>
    </li>
  {:else}
    <li>No wl found</li>
  {/each}
</ul>

<Button on:click={save} variant="raised">
  <Label>Save</Label>
</Button>