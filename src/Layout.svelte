<script>
  import { layouts } from "./layout-manager.js";
  import Shortcut from "./Shortcut.svelte";
  export let layout;

  let height = 80;
  let width = (window.screen.width / window.screen.height) * height;

  let screenStyle = "height: " + height + "px; width: " + width + "px;";
  let overlayStyle = `top: ${layout.top * height} px; left: ${layout.left *
    width}px; width: ${layout.width * width}px; height: ${layout.height *
    height}px;`;

  function remove() {
    layouts.remove(layout);
  }

  function updateShortcut(event) {
    let selectedShortcut = event.detail;
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
    cursor: pointer;
    display: inline-flex;
    margin: 8px;
    overflow: hidden;
    position: relative;
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

<div class="container">
  <div class="screen" style={screenStyle} on:click={layouts.snap(layout)}>
    <div class="overlay" style={overlayStyle} />
  </div>
  <div>
    <Shortcut shortcutName={layout.shortcut} on:select={updateShortcut} />
    <button class="remove" on:click={remove}>x</button>
  </div>
</div>
