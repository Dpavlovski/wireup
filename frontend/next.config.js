// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     /* config options here */
//     experimental: {
//         allowedDevOrigins: [
//             "http://localhost:3000",
//             "http://0.0.0.0:3000",
//             "http://localhost:5000",
//             "http://dimiserver.duckdns.org",
//             "http://dimiserver.duckdns.org:8101",
//             "http://dimiserver.duckdns.org:3000",
//             "http://test.thewireup.com"
//         ],
//     },
//     webpack: (config) => {
//         config.watchOptions = {
//             poll: 1000,
//             aggregateTimeout: 300,
//         };
//         return config;
//     },
//     devIndicators: {
//         autoPrerender: false,
//     }
// }
//
// module.exports = nextConfig