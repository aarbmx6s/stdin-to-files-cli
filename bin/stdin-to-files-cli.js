#!/usr/bin/env node

const readline = require('readline');
const worker = require('./../index.js');

function onError(error) {
    console.log(error);
}
function onComplete(data) {
    //-
}
function readInput() {
    return new Promise((resolve, reject) => {
        let rli = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        let input = '';

        rli.on('line', l => {
            input += l + '\r\n';
        });
        rli.on('close', () => {
            resolve(input);
        });

        console.log('The stdin-to-files-cli waiting for input via stdin.');
    });
}

readInput().then(worker.run).then(onComplete).catch(onError);