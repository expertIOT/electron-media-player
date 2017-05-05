/*tslint:disable:no-require-imports*/
import * as path from 'path';
import {ipcRenderer} from 'electron';
import * as $ from 'jquery';

// Export jQuery to window for Bootstrap.
window['$'] = window['jQuery'] = $;

$('<link rel="stylesheet" />')
.attr('href', path.resolve(
    __dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
))
.appendTo('head');
$('<link rel="stylesheet" />')
.attr('href', path.resolve(
    __dirname, '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
))
.appendTo('head');
$('<script><script/>')
.attr('src', path.resolve(
    __dirname, '../../node_modules/bootstrap/dist/js/bootstrap.min.js'
))
.appendTo('head');

$().ready(() => {
    require('./app');
    ipcRenderer.send('app-ready');
});
