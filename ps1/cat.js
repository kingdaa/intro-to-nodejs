/*
 Create an executable file, cat.js, that prints to process.stdout the contents of the file path passed on the first argument:

 $ cat ./helloworld.txt    # These outputs should be the same
 hello world

 $ ./cat ./helloworld.txt  # These outputs should be the same
 hello world
 */

"use strict";

require('./helper');
let fs = require('fs').promise;

function* cat() {
    if (process.argv.length > 2) {
        for (let fileName of process.argv.slice(2, process.argv.length)) {
            try {
                let stat = yield fs.stat(fileName);
                let isFile = stat.isFile();
                if (isFile) {
                    let content = yield fs.readFile(fileName, 'utf8');
                    console.log(content);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = cat;