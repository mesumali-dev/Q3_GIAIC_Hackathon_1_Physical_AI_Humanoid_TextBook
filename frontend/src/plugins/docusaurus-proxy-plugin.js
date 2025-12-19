// src/plugins/docusaurus-proxy-plugin.js
module.exports = function proxyPlugin(context, options) {
  return {
    name: 'docusaurus-proxy-plugin',

    configureWebpack(config, isServer, utils) {
      if (!isServer) {
        // Configure webpack dev server proxy for API requests
        return {
          devServer: {
            proxy: {
              '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
              },
            },
          },
        };
      }
      return {};
    },
  };
};