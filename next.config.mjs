/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*).html',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/meta-ads', destination: '/ads-expert-bangladesh', permanent: true },
      { source: '/graphic-design', destination: '/graphic-design-services-bangladesh', permanent: true },
      { source: '/wordpress-dev', destination: '/wordpress-web-design-bangladesh', permanent: true },
      { source: '/seo', destination: '/web-design-services-bangladesh', permanent: true },
      { source: '/ui-design', destination: '/web-design-services-bangladesh', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/meta-ads.html', destination: '/ads-expert-bangladesh', permanent: true },
      { source: '/graphic-design.html', destination: '/graphic-design-services-bangladesh', permanent: true },
      { source: '/wordpress-dev.html', destination: '/wordpress-web-design-bangladesh', permanent: true },
      { source: '/seo.html', destination: '/web-design-services-bangladesh', permanent: true },
      { source: '/ui-design.html', destination: '/web-design-services-bangladesh', permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/:slug.html', destination: '/api/page/:slug' },
      ]
    };
  },
};

export default nextConfig;
