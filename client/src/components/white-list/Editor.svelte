<script>
  import Textfield, { Input } from '@smui/textfield'
  import FloatingLabel from '@smui/floating-label'
  import LineRipple from '@smui/line-ripple'
  import Checkbox from '@smui/checkbox'
  import FormField from '@smui/form-field'
  import Button, { Label } from '@smui/button'
  import IconButton from '@smui/icon-button'

  import InputWithSelfRemove from './InputWithSelfRemove.svelte'

  export let activeItem
  export let deleteSubItem
  export let addSubItem
  export let deleteItem
  export let saveItem
  export let searchedSubItemName

</script>

<section>
  <article>
    <div class="rename">
      <Textfield fullwidth bind:value={activeItem.name} label="Media Source">
        <LineRipple />
      </Textfield>
    </div>

    <div class="select-all">
      <FormField>
        <Checkbox bind:checked={activeItem.all} />
        <span slot="label">Select all</span>
      </FormField>
    </div>

    <div class="list">
      {#each activeItem.list as item}
        <InputWithSelfRemove
          disabled={activeItem.all}
          bind:name={item}
          deleteItem={deleteSubItem}
          searchedSubItemName={searchedSubItemName}
        />
      {:else}
        {#if activeItem.all}
          <p>All Site IDs</p>
        {:else}
          <p>Add Site ID</p>
        {/if}
      {/each}
    </div>


    {#if !activeItem.all}
      <div class="edit__add-new">
        <IconButton
          disabled={activeItem.all}
          class="material-icons"
          on:click={addSubItem}>
          add
        </IconButton>
      </div>
    {/if}
  </article>

  <footer class="actions">
    <Button on:click={saveItem} variant="raised">
      <Label>Save</Label>
    </Button>

    <Button on:click={deleteItem} variant="raised">
      <Label>Delete</Label>
    </Button>
  </footer>
</section>

<style type="text/scss">
  @import "@material/typography/mdc-typography";
  @import "../../styles/variables";

  section {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p {
    @include mdc-typography("caption");
  }
  
  .rename {
    margin-bottom: $space-xl;
  }

  .select-all {
    margin-bottom: $space-s;
  }

  .list {
    padding-left: $space-s;
    max-height: 210px;
    overflow: auto;
  }

  .actions {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 50px;
    padding: $space-s;
  }
</style>