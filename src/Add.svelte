<script>
  import { layouts } from "./layout-manager.js";
  export let disabled;
</script>

<style>
  button {
    background: transparent;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    color: var(--primary-color);
    cursor: pointer;
    padding: 4px 16px;
  }
  button[disabled] {
    opacity: 50%;
  }
</style>

<button {disabled} on:click={layouts.add}>Add current layout</button>
