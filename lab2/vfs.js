#!/usr/bin/env node
"use strict";

require('./helper')

let fs = require('fs').promise
let path = require('path');
let express = require('express')
let morgan = require('morgan')
let trycatch = require('trycatch')
let wrap = require('co-express')
// let bodyParser = require('body-parser')
let bodyParser = require('simple-bodyparser')
var mime = require('mime-types')

function* main() {
    let app = express()
    app.use(morgan('dev'))
    app.use((req, res, next) => {
        trycatch(next, e => {
            console.log(e.stack)
            res.writeHead(500)
            res.end(e.stack)
        })
    }) 
    let port = 8000
    // app.listen.promise(port)
    // app.get('*', wrap(routeHandlerName))
    // app.all('*', (req, res) => res.end('hello\n'))
    app.get('*', wrap(read))
    app.put('*', bodyParser(), wrap(create))
    // app.post('*', bodyParser.raw(), wrap(update))
    app.post('*', bodyParser(), wrap(update)) 
    app.delete('*', wrap(remove))
    app.listen(port)
    console.log(`LISTENING @ http://127.0.0.1:${port}`) 
}


function* read(req, res) {
    let filePath = path.join(__dirname, 'files', req.url)
    let data = yield fs.readFile(filePath) 
    let stat = yield fs.stat(filePath)
    res.set('Content-Length', stat["size"].toString());
    res.set('Content-Type', mime.lookup(filePath));
    res.end(data)
}

function* create(req, res) {
    let filePath = path.join(__dirname, 'files', req.url)
    let fileDir = path.dirname(req.url)
    try{
        let fstat = fs.stat(fileDir)
    }
    catch(err){
        if(err.code == 'ENOENT'){
            yield fs.mkdir(fileDir)
        }
    }
    let data = yield fs.open(filePath, "wx")
    if(req.body){
        yield fs.writeFile(filePath, req.body)
    }
    res.end()
}

function* update(req, res) {
    let filePath = path.join(__dirname, 'files', req.url)
    let data = yield fs.writeFile(filePath, req.body)
    res.end()
}

function* remove(req, res) {
    let filePath = path.join(__dirname, 'files', req.url)
    console.log(filePath)
    try{
        let fstat = yield fs.stat(filePath)
        if(fstat.isDirectory()){
            let data = yield fs.rmdir(filePath) 
        }
        else{
            let data = yield fs.unlink(filePath)
        }
    }
    catch(err){
        console.log(err)
    }
    res.end()
}

module.exports = main