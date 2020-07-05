<script>
  import { layouts } from "./layout-manager.js";
  import { onDestroy } from "svelte";
  import Add from "./Add.svelte";
  import Layout from "./Layout.svelte";

  let l;
  const unsubscribe = layouts.subscribe(data => {
    l = data;
  });

  onDestroy(unsubscribe);
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
  h2 {
    margin: 8px 0;
  }
  ol {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
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
    <h2>Saved layouts</h2>
    <ol>
      {#each l as layout (layout)}
        <li>
          <Layout {layout} />
        </li>
      {/each}
    </ol>
  </section>
  <section>
    <Add />
    <button on:click={layouts.clear}>Clear all</button>
  </section>
  <section class="branding">
    <img src="icons/swift-snap-48.png" alt="Swift Snap logo." />
    <h1>Swift Snap</h1>
  </section>
</main>
