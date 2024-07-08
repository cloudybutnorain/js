<script>
  import Page from '../lib/Page.svelte';
  import SiteRow from '../lib/SiteRow.svelte';

  import Supabase from '../lib/supabase.js';

  import { SITELESS_COLOR } from "../lib/const.js";

  let supa = new Supabase();

  let sitesPromise = supa.GetSites();
</script>

<Page title="Your Sites" selected="sites" color={SITELESS_COLOR}>
  {#await sitesPromise}
    ...THINKING...
  {:then sites}
    {#if (sites.length == 0)}
      <div class="mt-2 w-full h-full flex justify-center items-center">
        <div class="flex flex-col justify-between items-center bg-{SITELESS_COLOR}-1 shadow-md rounded p-8">
          <div class="mb-1">You haven't created any sites yet!</div>
          <div class="mb-1">Click <a class="underline" href="#/create">here</a> to get started, or <a class="underline" target="_blank" href="https://docs.cbnr.xyz/pages/creating.html">here</a> for the docs.</div>
        </div>
      </div>
    {:else}
      <div class="mt-2 grid grid-cols-3 gap-4">
        {#each sites as site}
          <SiteRow site={site} />
        {/each}
      </div>
    {/if}
  {:catch err}
    Error rendering page: {err}
  {/await}
</Page>
