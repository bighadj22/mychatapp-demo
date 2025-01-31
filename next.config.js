(() => {
  if (process.env.NODE_ENV === 'development') {
    require('@cloudflare/next-on-pages/next-dev').setupDevPlatform();
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = nextConfig;