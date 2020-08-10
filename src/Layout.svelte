<script>
  import { createEventDispatcher } from "svelte";
  import { layouts } from "./layout-manager.js";
  import Shortcut from "./Shortcut.svelte";

  export let layout, isCurrent;

  const dispatch = createEventDispatcher();

  const height = 80;
  const width = (window.screen.width / window.screen.height) * height;

  const screenStyle = "height: " + height + "px; width: " + width + "px;";
  const overlayStyle = `top: ${layout.top * height} px; left: ${layout.left *
    width}px; width: ${layout.width * width}px; height: ${layout.height *
    height}px;`;

  function onSelect(event) {
    layouts.snap(layout, () => dispatch("select", event.detail));
  }

  function remove() {
    layouts.remove(layout);
  }

  function updateShortcut(event) {
    const selectedShortcut = event.detail;
    if (!layout.shortcut || layout.shortcut !== selectedShortcut) {
      layouts.updateShortcut(layout, selectedShortcut);
    }
  }
</script>

<style>
  .container {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  .screen {
    background: var(--primary-color);
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    margin: 8px;
    overflow: hidden;
    position: relative;
  }
  .current {
    background: var(--underlay-color);
  }
  .overlay {
    background: var(--overlay-color);
    position: absolute;
  }
  .remove {
    cursor: pointer;
    padding: 8px;
  }
</style>

<div class="container" class:current={isCurrent}>
  <div class="screen" style={screenStyle} on:click={onSelect}>
    <div class="overlay" style={overlayStyle} />
  </div>
  <div>
    <Shortcut shortcutName={layout.shortcut} on:select={updateShortcut} />
    <button class="remove" on:click={remove}>x</button>
  </div>
</div>
