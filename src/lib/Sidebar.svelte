<script>

  import Logo from '../lib/Logo.svelte'
  import SidebarItem from '../lib/SidebarItem.svelte'

  import { push } from 'svelte-spa-router'

  import Supabase from './supabase.js';

  export let siteid = "";
  export let selected = "";
  export let color;

  let supa = new Supabase();

</script>

<div class="w-full h-full px-4 py-2 bg-{color}-0">
  <div class="w-full h-full">
    <div class="w-full h-full flex flex-col justify-between">
      <div class="w-full pt-2">
        <div class="w-fit mx-auto mb-4"><Logo/></div>
        <SidebarItem color={color} text="Create" icon="plus" action={() => push(`/create`)} active={selected == "create"} enabled={true}/>
        <div class="px-2 py-2 mb-1"><hr class="border-none outline outline-[0.5px] outline-{color}-10"/></div>
        <!-- TODO, find a way to make this one stand out without always marking it as "active" (maybe bold?) -->
        <SidebarItem color={color} text="Sites" action={() => push(`/sites`)} icon="window" active={selected == "sites"} enabled={true}/>
        <div class="px-2 py-2 mb-1"><hr class="border-none outline outline-[0.5px] outline-{color}-10"/></div>
        <SidebarItem color={color} text="Overview" icon="chart-bar" action={() => push(`/site/${siteid}/overview`)} active={selected == "overview"} enabled={siteid != ""}/>
        <SidebarItem color={color} text="Clients" icon="users" action={() => push(`/site/${siteid}/clients`)} active={selected == "clients"} enabled={siteid != ""}/>
        <SidebarItem color={color} text="Pages" icon="newspaper" active={selected == "pages"} enabled={false}/>
        <SidebarItem color={color} text="Errors" icon="exclamation-triangle" active={selected == "errors"} enabled={false}/>
        <div class="px-2 py-2 mb-1"><hr class="border-none outline outline-[0.5px] outline-{color}-10"/></div>
        <SidebarItem color={color} text="Monitoring" icon="envelope" active={selected == "monitoring"} enabled={false}/>
        <SidebarItem color={color} text="Settings" icon="cog" action={() => push(`/site/${siteid}/settings`)} active={selected == "settings"} enabled={siteid != ""}/>
      </div>
      <div class="w-full">
        <SidebarItem color={color} text="Support" icon="information-circle" action={() => window.location.href = "mailto:brandon@willett.io"} active={false} enabled={true}/>
        <SidebarItem color={color} text="My Account" icon="user-circle" active={false} enabled={false}/>
        <SidebarItem color={color} text="Sign Out" icon="x-circle" action={() => supa.SignOut()} active={false} enabled={true}/>
      </div>
    </div>
  </div>
</div>
