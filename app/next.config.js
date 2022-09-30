module.exports = {
  experimental: {
    largePageDataBytes: 600 * 1000,
  },
  reactStrictMode: false,
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api' // development api
      : 'https://mega-pena.vercel.app/api' // production api
  }
}
