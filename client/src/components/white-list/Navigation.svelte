<script>
  import _ from 'lodash'
  import { afterUpdate } from "svelte";
  import List, {Item, Text} from '@smui/list'

  export let list
  export let setActive
  export let activeItemName

  let nodes = []

  afterUpdate(() => {
    const activeIndex = _.findIndex(list, x => x.name === activeItemName);
    const activeNode = nodes[activeIndex]
    activeNode.scrollIntoView()
  })

</script>

<List>
  {#each list as item, index}
    <div bind:this={nodes[index]}>
      <Item
        on:click={() => setActive(item.name)}
        selected={item.name === activeItemName}
      >
        <Text>{item.name}</Text>
      </Item>
    </div>
  {:else}
    <p>Not found</p>
  {/each}
</List>