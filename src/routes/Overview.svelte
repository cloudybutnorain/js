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
        "zoneid": site["pull_zone_id"],
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
<Page title="Traffic Overview" selected="overview" siteid={res["site"]["id"]} nickname={res["site"]["nickname"]} color={res["site"]["color"]}>
  <div class="mb-8">
    <Controller siteid={res["site"]["id"]} store={res["store"]} color={res["site"]["color"]}/>
  </div>
  <!-- negative margin so left edge lines up, still deciding if I like it -->
  <div class="-ml-9">
    <Chart variety="timeseries" params={res["store"]} groupby="StatusCategory" color={res["site"]["color"]}/>
  </div>
</Page>
{:catch err}
Error rendering page: {err}
{/await}
