#!/usr/bin/env node

const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const argv = require('yargs').argv

const port = argv.port || argv.p || 8998;
const target = argv._[0] || 'http://localhost';
const rewriteHost = url.parse(target).host;
const rewriteReferer = argv.referer || target;


const proxy = httpProxy.createProxyServer({});

const server = http.createServer(function(req, res) {
    if (rewriteHost)
        req.headers.host = rewriteHost;


    if (rewriteReferer)
        req.headers.referer = rewriteReferer;

    logRequest(req);

    proxy.web(req, res, {
        target: target
    });
});


server.on('listening', function() {
    console.log('Target:', target)
    console.log('Listening on port', port);
    console.log('-------------------------');
})

server.listen({
    port: port
});

/*
 * ---------------- Functions -----------------
 */

function logRequest(req) {
    const now = new Date();
    const nowString = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/') + ' ' + [now.getHours(), now.getMinutes(), now.getSeconds()].join(':') + '.' + now.getMilliseconds();

    console.log(nowString, req.method, req.url);
}
