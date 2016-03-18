#!/usr/bin/env node
"use strict";

require('./helper')
let fs = require('fs').promise
let path = require('path')
let argv = require('yargs').argv
let dir = argv.dir
let co = require('co')
let dash = require('lodash')

// let {dir} = require('yargs')
//     .default('dir', __dirname)
//     .argv

let ls = co.wrap(function*(rootPath) {
	try{
		let stat = yield fs.stat(rootPath)	
		if(!stat.isDirectory()){
		return [rootPath]
	}
	let lsPromises = []
	let fileNames = yield fs.readdir(rootPath)
	for (let fileName of fileNames) {
		let fPath = path.join(rootPath, fileName)
		let pro = ls(fPath)
		lsPromises.push(pro)
	}
	return yield Promise.all(lsPromises)
}
catch(err){
	return
}
})

function print(obj){
	if(typeof obj == 'string')
		console.log(obj);
	else if(Object.prototype.toString.call(obj).indexOf('Array') > -1){
		let fp = dash._.flatten(obj)
		for (let p of fp)
			print(p)
	}
	else return
}

function* main() {
	let filePaths = yield ls(dir)
	print(filePaths)
}

module.exports = main
