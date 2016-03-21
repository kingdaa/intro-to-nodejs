#!/usr/bin/env node

/*
 Create an executable file, mkdir.js, that creates a directory at the path passed on the first argument:

 $ ls ./                       # Note someDir does not exist
 rm.js

 $ ./mkdir.js ./someDir        # Create someDir

 $ ls ./                       # Note someDir exist
 rm.js
 someDir
 Hint: Use String.prototype.split to split the argument on / and iteratively use fs.mkdir.

 Optional: Add recursive functionality:

 $ ls ./                           # Note foo does not exist
 rm.js

 $ ./mkdir.js ./foo/bar/someDir    # Create someDir

 $ ls ./                           # Note foo exist
 rm.js
 foo

 $ ls ./foo                        # Note bar exist
 bar

 $ ls ./foo/bar                    # Note someDir exist
 someDir
 */

"use strict";

require('./helper');
let fs = require('fs').promise;
let co = require('co');

//TODO support absolute path
let mkdir = co.wrap(function*(dir) {
    try {
        if (dir.indexOf('./') == 0) dir = dir.slice(2);
        let paths = dir.split('/');
        for (let i = 1; i <= paths.length; i++) {
            let curPath = paths.slice(0, i).join('/');
            console.log(curPath);
            yield fs.mkdir(curPath)
        }
    }
    catch (err) {
        if (err.code === 'EEXIST') {
            console.log('mkdir: ' + dir + ': File exists');
        } else {
            console.log(err)
        }
    }
});

function* main() {
    if (process.argv.length > 2) {
        for (let dir of process.argv.slice(2, process.argv.length)) {
            yield mkdir(dir);
        }
    }
}

module.exports = main;
