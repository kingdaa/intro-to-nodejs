#!/usr/bin/env node

/*
 Create an executable file, ls.js, that lists the files in a directory passed on the first argument:

 $ ./ls.js ./
 ls.js
 someDir
 Omit directories:

 $ ./ls.js ./
 ls.js
 Add a recursive option, -R:

 $ ./ls.js ./              # Parent directory w/o -R
 ls.js

 $ ./ls.js ./someDir       # Sub-directory w/o -R
 foo.js
 bar.js

 $ ./ls.js ./ -R           # Parent directory with -R
 ls.js
 someDir/foo.js
 someDir/bar.js
 */

"use strict";

require('./helper');
let co = require('co');
let fs = require('fs').promise;
let path = require('path');

let ls = co.wrap(function*(rootPath, isRecursive) {
    try {
        let stat = yield fs.stat(rootPath);
        if (!stat.isDirectory()) {
            console.log(rootPath);
        }
        else {
            let fileNames = yield fs.readdir(rootPath);
            for (let fileName of fileNames) {
                let fPath = path.join(rootPath, fileName);
                if (isRecursive) yield ls(fPath);
                else console.log(fPath);
            }
        }
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            console.log('ls: ' + rootPath + ': No such file or directory');
        } else {
            console.log(err)
        }
    }
});


function* main() {
    if (process.argv.length > 2) {
        let argRecur = false;
        let recurIndex = process.argv.indexOf('-R');
        if (recurIndex > -1) {
            argRecur = true;
            process.argv.splice(recurIndex, 1)
        }
        for (let dir of process.argv.slice(2, process.argv.length)) {
            yield ls(dir, argRecur);
        }
    }
}

module.exports = main;
