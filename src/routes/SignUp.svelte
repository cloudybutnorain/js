<script>

  import Input from '../lib/Input.svelte';
  import Supabase from '../lib/supabase.js';
  import SubmitButton from '../lib/SubmitButton.svelte';

  let email;
  let passwordOne = "";
  let passwordTwo = "";

  let errorText = "";
  let thinking = false;

  let supa = new Supabase();

  function validate() {

    if (passwordOne !== passwordTwo) {
      throw new Error("Password entries do not match");
    }

    if (passwordOne.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    return
  }

  async function signUp() {
    thinking = true;
    try {
      validate();
      await supa.SignUp(email, passwordOne);
    } catch (e) {
      errorText = e.message;
      thinking = false;
    }
  }

</script>

<main class="w-screen h-screen flex justify-center items-center bg-[#F7F7EB]">
  <div class="w-80 flex flex-col justify-center items-start bg-white shadow-md rounded p-8">
    <div class="mx-auto py-8">
      <div class="text-3xl font-semibold text-[#D08606]">ecstatic ᵕ̈</div>
    </div>
    <form class="w-full" on:submit|preventDefault={signUp}>
      <Input label="Email Address" bind:value={email} bind:error={errorText}/>
      <Input label="Password" type="password" bind:value={passwordOne} bind:error={errorText}/>
      <Input label="Password (One More Time)" type="password" bind:value={passwordTwo} bind:error={errorText}/>
      <div class="mt-6 flex flex-col items-end">
        {#if errorText}
        <div class="text-red-5 text-xs italic mb-2">{errorText}</div>
        {/if}
        <SubmitButton thinking={thinking}>Sign Up</SubmitButton>
      </div>
    </form>
    <div class="text-xs mx-auto mt-6">
      Already have an account? <a href="#/signin">Sign in!</a>
    </div>
  </div>
</main>
