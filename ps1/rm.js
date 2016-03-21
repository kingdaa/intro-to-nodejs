#!/usr/bin/env node

/*
 Create an executable file, rm.js, that deletes the file or directory of the file path passed on the first argument:

 File Example:

 $ ls ./                       # Note helloworld.txt exists
 rm.js
 helloworld.txt

 $ ./rm.js ./helloworld.txt    # Delete helloworld.txt

 $ ls ./                       # Note helloworld.txt has been deleted
 rm.js
 Directory Example:

 $ ls ./                       # Note someDir exists
 rm.js
 someDir

 $ ./rm.js ./someDir           # Delete someDir

 $ ls ./                       # Note someDir has been deleted
 rm.js
 Hint: Use your recursive ls.js implementation and fs.unlink to delete files first, then delete all the directories.
 */

"use strict";

require('./helper');
let fs = require('fs').promise;
let path = require('path');
let co = require('co');

function* main() {
    if (process.argv.length > 2) {
        for (let p of process.argv.slice(2, process.argv.length)) {
            yield rm(p);
        }
    }
}

let rm = co.wrap(function*(p) {
    try {
        let stat = yield fs.stat(p);
        if (!stat.isDirectory()) {
            yield fs.unlink(p)
        }
        else {
            let fileNames = yield fs.readdir(p);
            for (let fileName of fileNames) {
                let fPath = path.join(p, fileName);
                yield rm(fPath);
            }
            yield fs.rmdir(p)
        }
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            console.log('rm: ' + p + ': No such file or directory');
        } else {
            console.log(err)
        }
    }
});

module.exports = main;
