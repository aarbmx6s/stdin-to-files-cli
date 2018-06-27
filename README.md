# stdin-to-files-cli
npm package is for reading data from a process stream (stdin) and saving data into files.

# installation

`npm install stdin-to-files-cli -g`

# usage
example with [Browserify](http://browserify.org/) and [google-closure-compiler](https://www.npmjs.com/package/google-closure-compiler) (Windows):

`browserify js/index.js | google-closure-compiler | stdin-to-files-cli -b "(()=>{" -a "})()" -o a/a.js b/b.js`

where<br>
**-o** - output files separated by space<br>
**-b** - the string which will be appended before data (optional)<br>
**-a** - the string which will be appended after data (optional)<br>