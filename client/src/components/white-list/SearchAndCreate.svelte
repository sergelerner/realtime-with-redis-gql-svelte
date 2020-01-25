<script>
  import Autocomplete from '../autocomplete/Autocomplete.svelte'
  import Fab, { Icon } from '@smui/fab'

  export let list
  export let addItem
</script>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>

<section class="header">
  <Autocomplete items={list}></Autocomplete>
  <Fab on:click={addItem} mini color="primary">
    <Icon class="material-icons">add</Icon>
  </Fab>
</section>