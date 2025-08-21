/**
 * Welcome to the Divortio Worker script.
 * This is the modern entry point for a high-performance static site on Cloudflare.
 *
 * This script leverages an asset binding, which is the most efficient
 * way to serve a directory of static files. The `ASSETS` binding is configured in
 * your `wrangler.toml` to point to the `public` directory.
 */

export default {
    /**
     * This is the main function that handles every request to your site.
     * @param {Request} request - The incoming request object.
     * @param {object} env - An object containing your environment variables and bindings.
     * @param {object} ctx - The execution context of the request.
     * @returns {Response} - The response to send back to the browser.
     */
    async fetch(request, env, ctx) {
        // This single line is all that's needed.
        // It passes the incoming request to Cloudflare's highly optimized
        // static asset handler, which will find and serve the correct file
        // (e.g., /index.html, /animation.js, /assets/images/icons/favicon.svg)
        // from the `public` directory with the best possible performance and caching.
        return env.ASSETS.fetch(request);
    },
};
