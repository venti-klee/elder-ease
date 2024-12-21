const { defineConfig } = require('@vue/cli-service');
const { join } = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    static: {
      directory: join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    client: {
      // overlay: false, // 禁用错误和警告覆盖层
    },
  },
});