<svelte:options immutable={true}/>

<script>
  import { afterUpdate } from "svelte";
  import Textfield, { Input } from '@smui/textfield';
  import FloatingLabel from '@smui/floating-label';
  import LineRipple from '@smui/line-ripple';
  import Switch from '@smui/switch';
  import IconButton, { Icon } from '@smui/icon-button';
  import flash from "./flash.js";

  export let all;
  export let name;
  export let deleteItem;
  let redColor = "#F95052";

  let item;

  afterUpdate(() => {
	  flash(item);
	});

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

  :global(.item-delete button i) {
    color: var(--red-color)
  }
</style>

<div
  class="item"
  bind:this={item}
  style="--red-color: {redColor}"
>
  <div class="item-switch">
    <Switch bind:checked={all} />
  </div>

  <div class="item-input">
    <Textfield>
      <Input bind:value={name} />
      <FloatingLabel for="name-input">Name</FloatingLabel>
      <LineRipple />
    </Textfield>
  </div>

  <div class="item-delete">
    <IconButton
      class="material-icons"
      on:click={() => deleteItem(name)}>
      <Icon class="material-icons">delete</Icon>
    </IconButton>
  </div>
</div>