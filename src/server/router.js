
var url = require("url");

function route(handle,pathname,request,response) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request,response);
    } else {
        console.log("No request handler found for " + pathname);
        response.write("No request handler found for " + pathname);
        response.end();
    }
}

exports.route = route;