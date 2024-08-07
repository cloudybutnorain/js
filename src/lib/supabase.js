import { createClient } from '@supabase/supabase-js';

// needed for the redirect after login, could live somewhere else though
import { push } from 'svelte-spa-router';

export default class Supabase {

  // basic singleton pattern, works best if we only have one of these
  constructor() {

    if (Supabase.instance) {
      return Supabase.instance;
    }

    Supabase.instance = this;

    let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    this.caching = true;
    this.cache = new Map();

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  // not perfect, since the site can still be updated from outside the webapp,
  // eg last-updated field from git pushes. Still, worth something, and since
  // it's dumped on even a page reload, it's essentially session-lifetime
  async InvalidateCache() {
    console.log(`Getting rid of all cached SITE supabase rows...`);

    this.cache = new Map();

    return;
  }

  async SignUp(email, pw) {

    console.log(`Attempting to sign up user with email ${email}...`);

    let { data, error } = await this.client.auth.signUp({
      "email": email,
      "password": pw,
    });

    if (error) {
      throw new Error(`${error["name"]}: ${error["message"]}`);
    }

    console.log(`Successfully signed up user: ${JSON.stringify(data)}`);

    push(`/signupok?email=${encodeURIComponent(email)}`);

    return;
  }

  async SignIn(email, pw) {

    console.log(`Attempting to sign in user with email ${email}...`);

    let { data, error } = await this.client.auth.signInWithPassword({
      "email": email,
      "password": pw,
    });

    if (error) {
      throw new Error(`${error["name"]}: ${error["message"]}`);
    }

    console.log(`Successfully signed in as user: ${JSON.stringify(data)}`);

    push("/sites");

    return;
  }

  // signs out the currently-logged-in user
  async SignOut() {

    console.log("Signing out the current user...");

    let { error } = await this.client.auth.signOut();

    if (error) {
      throw new Error(`Sign out was unsuccessful: ${error["message"]}`);
    }

    console.log("Sign out was successful, reloading...");

    // reload the page so they see the effects of their actions
    location.reload();

    return;
  }

  // gets the current JWT for the currently-logged-in user
  async GetAccessToken() {

    console.log("Calling getSession to access the current JWT...");

    let { data, error } = await this.client.auth.getSession();

    if (error) {
      throw new Error(`Error occurred in getSession: ${error["message"]}`)
    } else if (!data["session"]) {
      throw new Error("No session in getSession response, maybe not logged in?")
    } else if (!data["session"]["access_token"]) {
      throw new Error("No access_token in getSession response, maybe not logged in?")
    }

    return data["session"]["access_token"];
  }

  // throws out the current token and gets a fresh one (with updated metadata) from supabase
  async RefreshAccessToken() {

    console.log("Calling refreshSession to retrieve a new JWT...");

    let { data, error } = await this.client.auth.refreshSession();

    if (error) {
      throw new Error(`Error occurred in refreshSession: ${error["message"]}`)
    } else if (!data["session"]) {
      throw new Error("No session in refreshSession response, maybe not logged in?")
    } else if (!data["session"]["access_token"]) {
      throw new Error("No access_token in refreshSession response, maybe not logged in?")
    }

    this.InvalidateCache();

    return;
  }

  // gets the data for a single site ID
  async GetSite(site) {

    console.log(`Getting from supabase the data for site ID ${site}...`);

    if ((this.caching) && this.cache.has(site)) {
      console.log(`Found data for site ID ${site} in cache, returning that...`);
      return this.cache.get(site);
    }

    let { data, error } = await this.client.from('site').select().eq('id', site).single();

    if (error) {
      throw new Error(`Couldn't get data from supabase: ${error["message"]}`);
    }

    if (this.caching) {
      this.cache.set(site, data);
    }

    return data;
  }

  // sets the indicated fields of the SITE row with the given id
  // note custom_hostname isn't here, that's entirely handled by backed
  async UpdateSite(site, nickname, index_path, github_repo, color) {

    console.log(`Updating in supabase site row with ID ${site}...`);

    let update = {
      "nickname": nickname,
      "index_path": index_path,
      "github_repo": github_repo,
      "color": color,
    }

    let { error } = await this.client.from('site').update(update).eq('id', site);

    if (error) {
      throw new Error(`Couldn't update data in supabase: ${error["message"]}`);
    }

    this.InvalidateCache();

    return;
  }

  // gets the list of sites created by the currently-logged-in user
  async GetSites() {

    console.log("Getting from supabase the list of sites...");

    let { data, error } = await this.client.from('site').select().order('created_at');

    if (error) {
      throw new Error(`Couldn't get data from supabase: ${error["message"]}`);
    }

    data.forEach((site) => {
      if (this.caching) {
        this.cache.set(site["id"], site);
      }
    });

    return data;
  }

  // returns whether the user appears to be logged in or not -- does not throw
  async IsSignedIn() {

    console.log("Validating currently-logged-in user...")

    let { data, error } = await this.client.auth.getSession();

    if (error) {
      console.log(`Error occurred in getSession: ${error["message"]}`);
      return false;
    } else if (!data["session"]) {
      console.log("No user seems to be logged in!");
      return false;
    } else {
      console.log(`All good, logged in as ${data["session"]["user"]["email"]}!`)
      return true;
    }
  }
}
