#!/usr/bin/env node

/*
 Optional: grep

 Create an executable file, grep.js, that .......:

 $ grep require grep.js        # Print all lines containing 'require' in grep.js
 let fs = require('fs').promise

 $ ./grep.js require grep.js   # Print all lines containing 'require' in grep.js
 let fs = require('fs').promise
 */

"use strict";

require('./helper');
let fs = require('fs').promise;

function* grep() {
    if (process.argv.length >= 4) {
        let keyword = process.argv[2];
        let fileList = process.argv.slice(3, process.argv.length);
        try {
            let matchLines = [];
            for (let file of fileList) {
                let stat = yield fs.stat(file);
                if (stat.isDirectory()) {
                    console.log('grep: ' + file + ': Is a directory');
                    throw new Error('isDir');
                }
                let content = yield fs.readFile(file, 'utf8');
                let lines = content.split('\n');
                for (let line of lines) {
                    if (line.indexOf(keyword) > -1) matchLines.push(file + ": " + line);
                }
            }
            let results = yield Promise.all(matchLines);
            for (let resLine of results) {
                console.log(resLine);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = grep;
