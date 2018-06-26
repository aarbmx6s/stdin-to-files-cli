#!/usr/bin/env node

const readline = require('readline');
const worker = require('./../index.js');

function onError(error) {
    console.log(error);
}
function onComplete(data) {
    console.log('complete');
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
    });
}

readInput().then(worker.run).then(onComplete).catch(onError);