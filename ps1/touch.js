#!/usr/bin/env node

/*
 Create an executable file, touch.js, that updates the modified date of the file path passed on the first argument:

 $ ls -la
 total 0
 drwxr-xr-x  3 user      wheel  102 Jan  4 18:43 .
 drwxrwxrwt  8 root      wheel  272 Jan  4 18:43 ..
 -rw-r--r--  1 user      wheel    0 Jan  1 12:58 touch.js

 $ ./touch.js touch.js

 $ ls -la
 total 0
 drwxr-xr-x  3 user      wheel  102 Jan  4 18:44 .
 drwxrwxrwt  8 root      wheel  272 Jan  4 18:44 ..
 -rw-r--r--  1 user      wheel    0 Jan  4 18:44 touch.js
 Note: The modified date in the last line above has been updated.
 */

"use strict";

require('./helper');
let fs = require('fs').promise;
let path = require('path');

function* touch() {
    // Accept only one arg
    if (process.argv.length == 3) {
        let fName = process.argv[2];
        try {
            let fPath = path.dirname(fName);
            if (fPath != null && fPath != '.') {
                // with path, If path doesn't exist, return
                let stat = yield fs.stat(fPath);
                if (!stat.isDirectory()) return
            }
            yield touchFile(fName)
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.log('touch: ' + fName + ': No such file or directory');
            } else {
                console.log(err)
            }
        }
    }
}

function* touchFile(fileName) {
    let fd = yield fs.open(fileName, 'a');
    let ts = parseInt(new Date().getTime() / 1000);
    yield fs.futimes(fd, ts, ts);
}

module.exports = touch;
