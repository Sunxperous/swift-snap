<script>
  import { layouts } from "./layout-manager.js";
  import { onDestroy } from "svelte";
  import { determineScreenOfWindow } from "./snap.js";
  import { Rect } from "./rect";
  import Add from "./Add.svelte";
  import Layout from "./Layout.svelte";

  const browser = chrome;

  let l,
    hasCurrent = false;
  const unsubscribe = layouts.subscribe(data => {
    l = data;
  });

  onDestroy(unsubscribe);

  $: {
    windowSize; // Dependent on this.
    hasCurrent = false;
    l = l.map(checkCurrent);
  }

  let screen = new Rect(0, 0, 0, 0),
    windowSize = new Rect(-1, -1, -1, -1);

  function refresh() {
    browser.system.display.getInfo(async displays => {
      const currWindow = await browser.windows.getCurrent();
      screen = determineScreenOfWindow(currWindow, displays);
      windowSize = Rect.fromObj(currWindow);
    });
  }

  function checkCurrent(layout) {
    layout.isCurrent = false;
    if (windowSize.equals(Rect.calculateWindow(layout, screen))) {
      layout.isCurrent = true;
      hasCurrent = true;
    }
    return layout;
  }

  browser.runtime.onConnect.addListener(port => {
    if (port.name === "snap-shortcut") {
      port.onMessage.addListener(msg => {
        if (msg === "snap") {
          refresh();
        }
      });
    }
  });

  refresh();
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  h1 {
    font-size: 1.4rem;
    margin: 8px;
  }
  ol {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;
    list-style-type: none;
    margin-bottom: 8px;
  }
  li {
    align-items: center;
    display: flex;
  }
  .branding {
    align-items: center;
    display: flex;
    margin-top: 8px;
  }
</style>

<main>
  <section>
    <ol>
      {#each l as layout (layout)}
        <li>
          <Layout {layout} isCurrent={layout.isCurrent} on:select={refresh} />
        </li>
      {/each}
    </ol>
  </section>
  <section>
    <Add disabled={hasCurrent} />
    <button on:click={layouts.reset}>Reset</button>
  </section>
  <section class="branding">
    <img src="icons/swift-snap-48.png" alt="Swift Snap logo." />
    <h1>Swift Snap</h1>
  </section>
</main>
