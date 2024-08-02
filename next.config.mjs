
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ensure polyfill is added to the client-side bundle
    if (!isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['main.js'] && !entries['main.js'].includes('./promiseWithResolversPolyfill.js')) {
          entries['main.js'].unshift('./promiseWithResolversPolyfill.js');
        }
        return entries;
      };
    }

    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
