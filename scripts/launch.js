const cp = require('child_process');
const path = require('path');
const electron = require('../node_modules/electron-prebuilt-compile/node_modules/electron/index');
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
// Cut off the 'node' and 'script' parts.
let args = process.argv.slice(2);
// Loop over the arguments.
for (let i = 0; i < args.length; i++) {
    // Check if it doesn't start with a flag thingy.
    if (!args[i].startsWith('--') && !args[i].startsWith('-')) {
        // We found a non-flag positional argument. Shove it to the front. We
        // assume this is Electron's 'path to app' argument.
        args = [args[i]].concat(args.slice(0, i)).concat(args.slice(i + 1));
        break;
    }
}
args = [
    path.resolve(__dirname, '../node_modules/electron-prebuilt-compile/lib/es6-init')
].concat(args);
const child = cp.spawn(_interopRequireDefault(electron).default, args, {
    stdio: 'inherit'
});
process.on('SIGINT', () => {
    console.log('Got SIGINT! Relaying...');
    child.kill('SIGINT');
});
process.on('SIGTERM', () => {
    console.log('Got SIGTERM! Relaying...');
    child.kill('SIGTERM');
});
child.on('close', (code, signal) => {
    console.log('Child died, setting exit code...');
    if (code != null) {
        process.exitCode = code;
    }
});
