<script>
  import { layouts } from "./layouts.js";
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
</style>

<button on:click={layouts.add}>Add current layout</button>
