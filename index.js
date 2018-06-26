const fs = require('fs');

function onComplete(data) {
    return new Promise(resolve => {
        console.log('stdin-to-files-cli:');
        data.outs.forEach(f => console.log(' ' + f));
        resolve(data);
    });
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

module.exports.run = function (input) {
    return checkArguments({ input, argv:process.argv }).then(wrapData).then(saveToFiles).then(onComplete);
};