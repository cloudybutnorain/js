<script>

  import Sidebar from '../lib/Sidebar.svelte';
  import Footer from '../lib/Footer.svelte';

  import { SITELESS_COLOR } from '../lib/const.js'

  export let siteid = "";
  export let selected;
  export let title;
  export let color = SITELESS_COLOR;

</script>

<svelte:head>
  <title>Distant - {title}</title>
</svelte:head>
<main class="w-screen h-screen flex">
  <!-- this doesn't work, need some way of enforcing fixed width?? -->
  <div class="h-full w-80">
    <Sidebar siteid={siteid} selected={selected} color={color}/>
  </div>
  <div class="h-full w-full flex flex-col justify-between items-center bg-white shadow-xl rounded-sm">
    <div class="w-[768px] py-8 flex flex-col justify-start">
      <div class="text-4xl text-bold my-6">{title}</div>
      <slot>page content goes here</slot>
    </div>
    <Footer color={color}/>
  </div>
</main>
