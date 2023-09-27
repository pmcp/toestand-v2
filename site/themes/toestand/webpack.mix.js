const mix = require('laravel-mix')
require('laravel-mix-purgecss');


const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally'); // 👈 merge .js files together into single file


mix.webpackConfig({
  module: {
    rules: [{
      test: /\.scss/,
      loader: "import-glob-loader" // 👈 use glob syntax to import components .scss files
    }]
  },
  plugins: [
    new MergeIntoSingleFilePlugin({ // 👈 merge util.js and components .js files in a single frontend.js file
      files: {
        "js/frontend.js": [
          "node_modules/codyhouse-framework/main/assets/js/util.js",
          "resources/js/components/**/*.js"
        ]
      },
      transform: {
        'js/frontend.js': code => require("uglify-js").minify(code).code
      }
    }),
  ]
});

mix
  .js('resources/js/app.js', 'js')
  .minify('js/app.js')
  .sass('resources/sass/style.scss', 'css')
  .sass( 'resources/sass/style-fallback.scss', 'css') // style fallback
  // .purgeCss()
//  .options({
//    postCss: [
//      require('postcss-css-variables'),
//      require('postcss-calc')
//    ]
//  })
  // .options({
  //   postCss: [require('postcss-css-variables')()]
  // })
  // .purgeCss()
  .browserSync({
    proxy: 'toestand.test',
    files: ['./**/*', '../../content/**/*'],
  })
  .options({
    processCssUrls: false,
  })
  .config.fileLoaderDirs.fonts = '../fonts'