<script>
  import { createEventDispatcher } from "svelte";
  import { shortcuts } from "./shortcut-manager.js";
  export let shortcutName;

  const dispatch = createEventDispatcher();

  function handleSelect(event) {
    dispatch('select', shortcutName);
  }
</script>

<style>
  pre {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
</style>

<select bind:value={shortcutName} on:change={handleSelect}>
  <option value={""}>No shortcut selected</option>
  {#each Object.entries($shortcuts) as [name, shortcut] (name)}
    <option value={name}>{shortcut}</option>
  {/each}
</select>
