module.exports = {
  esbuild: {
    jsx: 'automatic'
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
};
