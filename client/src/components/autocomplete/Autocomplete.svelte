<script>
  import Textfield from '@smui/textfield'
  import Icon from '@smui/textfield/icon'
  import LineRipple from '@smui/line-ripple'
  import List, {Item, Text} from '@smui/list'

  const regExpEscape = (s) => {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")
  }

  export let name = '';
  export let value = '';
  export let placeholder = '';
  export let required = false;
  export let disabled = false;

  // autocomplete props
  export let items = [];
  export let isOpen = false;
  export let results = [];
  export let search = '';
  export let isLoading = false;
  export let arrowCounter = 0;
  export let highlight;

  let isAsync = false;
  let minChar = 2;
  let maxItems = 10;
  let fromStart = false; // Default type ahead
  let input;
	
  async function onChange(event) {
    // Is the data given by an outside ajax request?
    if (isAsync) {
      isLoading = true;
    } else if (search.length >= Number(minChar)) {
      filterResults()
      isOpen = true;
    }
  }

  function filterResults() {
    results = items.filter(item => {
      if (typeof item !== 'string') {
        item = item.key || '' // Silent fail
      }
      return fromStart 
        ? item.toUpperCase().startsWith(search.toUpperCase())
        : item.toUpperCase().includes(search.toUpperCase())
    })
    .map(item => {
      const text = typeof item !== 'string' ? item.key : item
      return {
        key: text,
        value: item.value || item,
        label: search.trim() === '' ? text : text.replace(RegExp(regExpEscape(search.trim()), 'i'), "<span>$&</span>")
      }
    });
  }

  function onKeyDown(event) {
    if (event.keyCode === 40 && arrowCounter < results.length) {
      // ArrowDown
      arrowCounter =  arrowCounter + 1 
    } else if (event.keyCode === 38 && arrowCounter > 0) {
      // ArrowUp
      arrowCounter =  arrowCounter - 1;
    } else if (event.keyCode === 13) {
      // Enter
      event.preventDefault()
      if (arrowCounter === -1) {
        arrowCounter = 0 // Default select first item of list
      }
      close(arrowCounter)
    } else if (event.keyCode === 27) {
      // Escape
      event.preventDefault()
      close()
    }
  }

  function close(index = -1) {
    if (index === -1) {
      isOpen = false
      arrowCounter = -1
      results = []

      return
    }

    const currentResult = results[index]
    const { value = null } = currentResult

    highlight(value)

    isOpen = false; 
    arrowCounter = -1;
    results = []
    search = value
  }
</script>

<style>
  .autocomplete {
    position: relative;
    width: 100%;
  }

  :global(.full-width-input) {
    width: 100%;
  }

  :global(.autocomplete-results.open) {
    position: absolute;
    background: white;
    z-index: 2;
    width: 100%;
    max-height: 160px;
    overflow: auto;
  }
</style>

<svelte:window on:click={()=>close()} />

<div on:click="{(event)=>event.stopPropagation()}" class="autocomplete">
  <Textfield
    class="full-width-input"
    withLeadingIcon
    label="Search"
    {name}
    {placeholder}
    {required}
    {disabled}
    bind:value={search}
    on:input={(event)=>onChange(event)}
    on:focus
    on:blur
    on:keydown={(event)=>onKeyDown(event)}
    bind:this={input}>
    <Icon class="material-icons">search</Icon>
    <LineRipple />
  </Textfield>

  <List class="autocomplete-results {isOpen ? ' open' : ''}">
		{#each results as result, i}
				<Item
          on:click="{()=>close(i)}"
          class="autocomplete-result"
          selected={i === arrowCounter}
        >
          <Text>{@html result.label}</Text>
				</Item>
		{/each}
  </List>

  {#if isLoading}
    <slot>
      <p class="fallback">Loading data...</p>
    </slot>
  {/if}
</div>