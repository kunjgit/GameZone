import minify from 'rollup-plugin-babel-minify';

export default {
  input: './src/js/Game.js',
  plugins: [
    minify({ comments: false, sourceMap: false }),
  ],
  output: {
      format: 'iife',
      file: './assets/js/cube.js',
      indent: '\t',
      sourceMap: false,
  },
};
