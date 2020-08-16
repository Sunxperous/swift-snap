<script>
  import { createEventDispatcher } from "svelte";
  import { layouts } from "./layout-manager.js";
  import { Rect } from "./rect";
  import Shortcut from "./Shortcut.svelte";

  export let layout, isCurrent;

  const dispatch = createEventDispatcher();

  const height = 60;
  const width = Math.round(
    (window.screen.width / window.screen.height) * height
  );

  const screenStyle = "height: " + height + "px; width: " + width + "px;";
  const overlayRect = new Rect(
    Math.round(layout.top * height),
    Math.round(layout.left * width),
    Math.round(layout.width * width),
    Math.round(layout.height * height)
  );
  const overlayStyle = `top: ${overlayRect.top}px; left: ${overlayRect.left}px;
  width: ${overlayRect.width}px; height: ${overlayRect.height}px;`;

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
    padding: 4px;
  }
  .screen {
    background: var(--primary-color);
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    margin-bottom: 1px;
    overflow: hidden;
    position: relative;
  }
  .current {
    background-color: var(--underlay-color);
  }
  .overlay {
    background: var(--overlay-color);
    position: absolute;
  }
  .container:hover .remove {
    visibility: visible;
  }
  .remove {
    background: var(--background-color);
    background-image: url("/icons/close-24.svg");
    background-size: contain;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    height: 20px;
    padding: 0;
    position: absolute;
    right: 4px;
    top: 4px;
    visibility: hidden;
    width: 20px;
  }
</style>

<div class="container" class:current={isCurrent}>
  <div class="screen" style={screenStyle} on:click={onSelect}>
    <div class="overlay" style={overlayStyle} />
    <button class="remove" on:click|stopPropagation={remove} />
  </div>
  <div>
    <Shortcut shortcutName={layout.shortcut} on:select={updateShortcut} />
  </div>
</div>
