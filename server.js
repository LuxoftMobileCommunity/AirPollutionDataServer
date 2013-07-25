require("http").createServer( handleHTTPRequest ).listen( 1337, '192.168.1.3' );
var urlParser = require("url");
var getNodeData = require("./parser");


function handleHTTPRequest( request, response ) {

	var requestURL = urlParser.parse( "http://"+request.headers.host + request.url, true );
	var nodeNumber = requestURL.query.node;
	response.writeHead(200, {'Content-Type': 'text/plain'});
	var promise = getNodeData( nodeNumber ).then( function( data ) {

		response.end( data );

	} ).fail( function( error ) {

		response.end( error );

	} );
 	
}