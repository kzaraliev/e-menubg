const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Google profile images
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      // Twitter/X profile images
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },
      // Unsplash images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Logos World
      {
        protocol: 'https',
        hostname: 'logos-world.net',
        port: '',
        pathname: '/**',
      },
      // Your specific S3 bucket
      {
        protocol: 'https',
        hostname: 'e-menu-images-production.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Support for any S3 bucket in eu-north-1 region
      {
        protocol: 'https',
        hostname: '*.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
