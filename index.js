const fs = require('fs');
const readline = require('readline');

function onError(error) {
    console.log(error);
}
function onComplete(data) {
    console.log('stdin-to-files:');
    data.outs.forEach(f => console.log(' ' + f));
}
function saveToFile(data, file) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (error) => {
            if ( error ) reject(error);
            else resolve(true);
        });
    });
}
function saveToFiles(data) {
    return new Promise((resolve, reject) => {
        Promise.all(data.outs.map(f => saveToFile(data.wrapped, f))).then(() => resolve(data)).catch(reject);
    });
}
function wrapData(data) {
    return new Promise((resolve, reject) => {
        data.wrapped = data.before + data.input + data.after;
        resolve(data);
    });
}
function readInput(data) {
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
            data.input = input;
            resolve(data);
        });
    });
}
function checkArguments(data) {
    return new Promise((resolve, reject) => {
        let argv = data.argv;
        let currentOption = null;
        let before = '';
        let after = '';
        let outs = [];

        for ( let i = 0, l = argv.length; i < l; i++ ) {
            if ( currentOption === 'before' ) {
                before = argv[i];
                currentOption = null;
                continue;
            }
            if ( currentOption === 'after' ) {
                after = argv[i];
                currentOption = null;
                continue;
            }
            if ( currentOption === 'out' ) {
                outs.push(argv[i]);
                continue;
            }
            if ( argv[i] === '-b' ) {
                currentOption = 'before';
                continue;
            }
            if ( argv[i] === '-a' ) {
                currentOption = 'after';
                continue;
            }
            if ( argv[i] === '-o' ) {
                currentOption = 'out';
                continue;
            }
        }

        if ( outs.length === 0 ) {
            reject(new Error('Output files not specified. Use -o fileA fileB fileC'));
        }
        else {
            data.before = before;
            data.after = after;
            data.outs = outs;

            resolve(data);
        }
    });
}

checkArguments({ argv:process.argv }).then(readInput).then(wrapData).then(saveToFiles).then(onComplete).catch(onError);