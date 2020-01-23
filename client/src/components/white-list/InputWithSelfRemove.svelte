<svelte:options immutable={true}/>

<script>
  import { afterUpdate } from "svelte";
  import Textfield, { Input } from '@smui/textfield';
  import FloatingLabel from '@smui/floating-label';
  import LineRipple from '@smui/line-ripple';
  import IconButton, { Icon } from '@smui/icon-button';
  import flash from "../misc/flash.js";

  export let name;
  export let disabled;
  export let deleteItem;
  let redColor = '#F95052';
  let disabledColor = '#E8E8E8'

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
    justify-content: space-between;
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
  style="--red-color: {disabled ? disabledColor :redColor}"
>

  <Textfield fullwidth disabled={disabled} label="Site ID">
    <Input fullwidth bind:value={name} />
    <LineRipple />
  </Textfield>

  <div class="item-delete">
    <IconButton
      disabled={disabled}
      class="material-icons"
      on:click={() => deleteItem(name)}>
      <Icon class="material-icons">delete</Icon>
    </IconButton>
  </div>
</div>