<script context="module">
  import gql from 'graphql-tag';
  import { client } from '../../apollo';
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
  import _ from 'lodash'
  import { mutate } from 'svelte-apollo'
  import InputWithSelfRemove from './InputWithSelfRemove.svelte'

  import Paper, {Title, Subtitle, Content} from '@smui/paper'
  import Button, { Label } from '@smui/button'
  import Fab, { Icon } from '@smui/fab'
  import Switch from '@smui/switch'
  import Textfield, { Input } from '@smui/textfield'
  import FloatingLabel from '@smui/floating-label'
  import LineRipple from '@smui/line-ripple'
  import List, {Item, Text} from '@smui/list'
  import Checkbox from '@smui/checkbox'
  import FormField from '@smui/form-field'
  import IconButton from '@smui/icon-button'
  
  export let cache;
  let activeParent = _.head(cache.data.wl);

  $: list = [ activeParent, ..._.filter(cache.data.wl, x => x.name !== activeParent.name) ]

  function addItem() {
    cache.data.wl = [ ...cache.data.wl, {
      name: '',
      all: false,
      list: [],
    }]
  }

  function addSubItem() {
    const { name, all, list } = activeParent

    activeParent = {
      name,
      all,
      list: [ ...list, ''],
    }
  }

  function deleteSubItem(value) {
    const { name, all, list } = activeParent

    activeParent = {
      name,
      all,
      list: list.filter(x => x !== value),
    }
  }

  function setActive(name) {
    activeParent = _.find(list, { name })
  }

  async function save() {
    try {
      await mutate(client, {
        mutation: SAVE_WHITE_LIST,
        variables: { value: JSON.stringify(list) }
      });
    } catch(error) {
      console.error(error);
    }
  }
</script>

<section>
  <Fab on:click={addItem} mini>
    <Icon class="material-icons">add</Icon>
  </Fab>
</section>

<section class="split-view">
  <Paper square class="lhs">
    <Title>Media Sources list</Title>
    <Content>
      <List>
        {#each _.orderBy(list, ['name'], ['desc']) as item}
          <Item on:click={() => setActive(item.name)} selected={item.name === activeParent.name}>
            <Text>{item.name}</Text>
          </Item>
        {:else}
          <p>Not found</p>
        {/each}
      </List>
    </Content>
  </Paper>
  
  <Paper square class="rhs">
    <Title>Edit</Title>
    <Content>
      <div class="edit__rename">
        <Textfield>
          <Input bind:value={activeParent.name} />
          <FloatingLabel for="name-input">Media Source</FloatingLabel>
          <LineRipple />
        </Textfield>
      </div>
      
      <div class="edit__select-all">
        <FormField>
          <Checkbox bind:checked={activeParent.all} />
          <span slot="label">Select all</span>
        </FormField>
      </div>

      <div class="edit__list">
        {#each activeParent.list as item}
          <InputWithSelfRemove
            disabled={activeParent.all}
            bind:name={item}
            deleteItem={deleteSubItem}
          />
        {:else}
          <p>Not found</p>
        {/each}
      </div>
      
      <div class="edit__add-new">
        <IconButton
          disabled={activeParent.all}
          class="material-icons"
          on:click={addSubItem}>
          add
        </IconButton>
      </div>

      <footer class="edit__actions">
        <Button on:click={save} variant="raised">
          <Label>Save</Label>
        </Button>
      </footer>
    </Content>
  </Paper>
</section>

<style>
  section {
    margin-bottom: 20px;
  }

  .split-view {
    display: flex;
    flex-direction: row;
  }

  .edit__rename {
    margin-bottom: 50px;
  }

  .edit__select-all {
    margin-bottom: 10px;
  }

  .edit__list {
    padding-left: 10px;
  }

  .edit__actions {
    display: flex;
    flex-direction: row-reverse;
  }

  :global(.split-view .lhs) {
    min-width: 250px;
    margin-right: 30px;
  }

  :global(.split-view .rhs) {
    min-width: 500px;
  }
</style>