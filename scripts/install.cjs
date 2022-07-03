#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

const args = process.argv.slice(2);
let destination = args[0];
if (!destination) {
  console.error(`require the destination folder to which copy the source`);
  process.exit(1);
}
const packageName = 'do-json-db';
// if (!(destination.endsWith(`/${packageName}`) || destination.endsWith(`/${packageName}/` || destination === packageName || destination === `${packageName}/`))) {
if (!destination.includes(packageName)) {
  destination = path.join(destination, packageName);
}


// from https://stackoverflow.com/a/26038979
function copyFileSync( source, target ) {
  var targetFile = target;
  if ( fs.existsSync( target ) ) {
    if ( fs.lstatSync( target ).isDirectory() ) {
      targetFile = path.join( target, path.basename( source ) );
      }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
  var files = [];
  console.log({target})
  if (!fs.existsSync(target) ) {
    fs.mkdirSync(target, {recursive: true});
  }
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource ).isDirectory()) {
        copyFolderRecursiveSync(curSource, path.join(target, file));
      } else {
        copyFileSync(curSource, target);
      }
    });
  }
}

if (fs.existsSync(destination)) {
  fs.rmSync(destination, {recursive: true});
}
copyFolderRecursiveSync(path.join(__dirname, '../src/'), destination)
