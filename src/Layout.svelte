<script>
  import { layouts } from "./layout-manager.js";
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
</script>

<style>
  .container {
    display: flex;
    align-items: center;
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
  <div class="remove" on:click={remove}>x</div>
</div>
