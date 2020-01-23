<script>
  import Textfield from '@smui/textfield'
  import Icon from '@smui/textfield/icon'
  import LineRipple from '@smui/line-ripple'
  import List, {Item, Text} from '@smui/list'

  const regExpEscape = (s) => {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")
  }

  export let name= '';
  export let value= '';
  export let placeholder = '';
  export let required= false;
  export let disabled= false;

  // autocomplete props
  export let items= [];
  export let isOpen= false;
  export let results= [];
  export let search= '';
  export let isLoading= false;
  export let arrowCounter= 0;

  let className= '';
  let isAsync= false;
  let minChar= 2;
  let maxItems= 10;
  let fromStart= true; // Default type ahead
  let list;
  let input;
	
  async function onChange (event) {
    // Is the data given by an outside ajax request?
    if (isAsync) {
      isLoading = true;
    } else if (search.length >= Number(minChar)) {
      filterResults()
      isOpen = true;
    }
  }

  function filterResults () {
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

    const height = results.length > maxItems ? maxItems : results.length
    list.style.height = `${height * 2.25}rem`
  }

  function onKeyDown (event) {
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

  function close (index = -1) {
    console.log('close.....', index)
    isOpen = false; 
    arrowCounter = -1;
    input.blur();
    if (index > -1) {
      value = results[index].value;
      key = results[index].key;
    } else if (!value) {
      search = ''
    }
  }

  function onupdate ({ changed, current }) {
    if (isAsync && changed.items && current.items.length) {
      items = current.items;
      isLoading = false;
      isOpen = true;
      filterResults();
    }
	}
</script>

<style>
  .autocomplete {
    position: relative;
    margin-bottom: 50px;
    width: 100%;
  }

  :global(.full-width-input) {
    width: 100%;
  }
</style>

<svelte:window on:click="{()=>close()}" />

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

  <List class="autocomplete-results{!isOpen ? ' hide-results' : ''}" bind:this={list}>
		{#each results as result, i}
				<Item on:click="{()=>close(i)}" class="autocomplete-result{ i === arrowCounter ? ' is-active' : '' }">
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