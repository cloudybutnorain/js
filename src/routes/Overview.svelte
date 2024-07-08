<script>

  import dayjs from 'dayjs';
  import { writable } from "svelte/store";

  import Chart from '../lib/Chart.svelte';
  import Controller from '../lib/Controller.svelte';
  import Page from '../lib/Page.svelte';
  import Supabase from '../lib/supabase.js';

  // this is how the component gets query params from svelte-spa-router
  export let params = {};

  let supa = new Supabase();

  // just returns a pair of (site, paramstore) since both are needed below
  let promise = supa.GetSite(params["id"]).then((site) => {
    return {
      "site": site,
      // store used to contain params sent to CBNR backend to query data
      // like hostname, time range, group bys, etc, it is set by the Controller
      // and subscribed to by Chart. Should eventually be a QueryParamStore?
      "store": writable({
        "hostname": site["custom_hostname"] ? site["custom_hostname"] : site["hostname"],
        "start": dayjs().startOf('day').unix(),
        "end": dayjs().endOf('day').unix(),
        "bots": false,
      }),
    }
  });

</script>

{#await promise}
...
{:then res}
<Page title={res["site"]["nickname"]} selected="overview" siteid={res["site"]["id"]} color={res["site"]["color"]}>
  <div class="mb-4 w-full flex items-center">
    <div class="mr-4 grow-0">Today's Traffic</div>
    <hr class="grow border-gray-12/20"/>
  </div>
  <div class="mb-4 grid grid-cols-3 gap-4">
    <div class="h-24 bg-{res["site"]["color"]}-2 rounded shadow-md"></div>
    <div class="h-24 bg-{res["site"]["color"]}-2 rounded shadow-md"></div>
    <div class="h-24 bg-{res["site"]["color"]}-2 rounded shadow-md"></div>
  </div>
  <div class="mb-4 w-full flex items-center">
    <div class="mr-4 grow-0">Recent Deployments</div>
    <hr class="grow border-gray-12/20"/>
  </div>
  <div class="w-full flex flex-col">
    <div class="h-12 mb-4 bg-{res["site"]["color"]}-2 rounded-sm shadow"></div>
    <div class="h-12 mb-4 bg-{res["site"]["color"]}-2 rounded-sm shadow"></div>
    <div class="h-12 mb-4 bg-{res["site"]["color"]}-2 rounded-sm shadow"></div>
    <div class="h-12 mb-4 bg-{res["site"]["color"]}-2 rounded-sm shadow"></div>
  </div>
</Page>
{:catch err}
Error rendering page: {err}
{/await}
