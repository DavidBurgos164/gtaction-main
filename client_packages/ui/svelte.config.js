import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-static";

export default {
  kit: {
    adapter: adapter({
      fallback: "200.html", // may differ from host to host
    }),
  },

  preprocess: [vitePreprocess({})],
};
