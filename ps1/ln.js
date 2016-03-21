#!/usr/bin/env node

/*
 Create an executable file, ls.js, that creates a symbolic link to the path passed on the first argument to the path passed on the second argument:

 $ ln ln.js foo.js             # Creates a symlink to 'ln.js' called 'foo.js'

 $ ./ln.js ln.js foo.js        # Creates a symlink to 'ln.js' called 'foo.js'
 */

"use strict";

require('./helper');
let fs = require('fs').promise;

function* ln() {
    // Must take 2 args: [fileName] [linkName]
    if (process.argv.length == 4) {
        let fileName = process.argv[2];
        let linkName = process.argv[3];
        try {
            let stat = yield fs.stat(fileName);
            yield fs.symlink(fileName, linkName);
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = ln;
