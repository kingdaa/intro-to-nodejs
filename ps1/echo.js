#!/usr/bin/env node

/*
 Create an executable file, echo.js, that prints the first argument to process.stdout:
 $ ./echo 'hello world'
 hello world

 $ ./echo 'node is fun'
 node is fun
 */

"use strict";

require('./helper');
let fs = require('fs').promise;

function* echo() {
    if (process.argv.length > 2) {
        // Merge all argvs to output
        let output = process.argv.slice(2, process.argv.length).join(' ');
        console.log(output);
    }
}

module.exports = echo;
