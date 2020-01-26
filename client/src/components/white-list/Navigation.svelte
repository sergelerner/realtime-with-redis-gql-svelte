<script>
  import List, {Item, Text} from '@smui/list'

  export let list
  export let setActive
  export let activeItemName
</script>

<List>
  {#each list as item}
    <Item
      on:click={() => setActive(item.name)}
      selected={item.name === activeItemName}
    >
      <Text>{item.name}</Text>
    </Item>
  {:else}
    <p>Not found</p>
  {/each}
</List>