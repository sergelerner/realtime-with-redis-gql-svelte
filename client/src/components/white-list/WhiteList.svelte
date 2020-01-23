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
  
  import Header from './Header.svelte'
  import Navigation from './Navigation.svelte'
  import ItemEditor from './ItemEditor.svelte'

  export let cache;
  let activeParent = _.head(cache.data.wl);

  console.log('cache.data.wl', cache.data.wl)

  $: list = [ activeParent, ..._.filter(cache.data.wl, x => x.name !== activeParent.name) ]
  $: autocompleteList = _.map(list, x => x.name)

  function addItem() {
    const newItem = {
      name: '...',
      all: false,
      list: [],
    }
    activeParent = newItem
    list = [ ...list, newItem]
  }

  function addSubItem() {
    const { name, all, list } = activeParent

    activeParent = {
      name,
      all,
      list: [ ...list, ''],
    }
  }

  function deleteItem(value) {
    const newList = _.filter(list, x => x.name !== activeParent.name)
    const newActiveParent = _.flow(
      list => _.orderBy(list, ['name'], ['asc']),
      list => _.head(list),
    )(newList)

    cache.data.wl = newList
    activeParent = newActiveParent
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

<Header
  list={autocompleteList}
  addItem={addItem}
/>

<section class="split-view">
  <div class="lhs">
    <Navigation
      list={_.orderBy(list, ['name'], ['asc'])}
      setActive={setActive}
      activeItemName={activeParent.name}
    />
  </div>
  
  <div class="rhs">
    <ItemEditor
      bind:activeItem={activeParent}
      deleteSubItem={deleteSubItem}
      addSubItem={addSubItem}
      deleteItem={deleteItem}
      saveItem={save}
    />
  </div>
</section>

<style>
  .split-view {
    display: flex;
    flex-direction: row;
  }

  .lhs {
    min-width: 250px;
    margin-right: 50px;
  }

  .rhs {
    min-width: 500px;
  }
</style>