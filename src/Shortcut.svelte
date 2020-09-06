<script>
  import { createEventDispatcher } from "svelte";
  import { shortcuts } from "./shortcut-manager.js";
  export let shortcutName;

  const browser = chrome;

  const dispatch = createEventDispatcher();

  function handleSelect(event) {
    dispatch("select", shortcutName);
  }
</script>

<style>
  select {
    background-color: inherit;
    color: inherit;
    cursor: pointer;
  }
  option {
    background-color: var(--background-color);
    padding: 0;
  }
</style>

<select bind:value={shortcutName} on:change={handleSelect}>
  <option value={''}>No shortcut selected</option>
  {#each Object.entries($shortcuts) as [name, shortcut] (name)}
    {#if name !== "move-next-display" && shortcut !== ''}
      <option value={name}>{shortcut}</option>
    {/if}
  {/each}
</select>
