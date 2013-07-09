var getNodeData = require( "./parser" );
var Q = require( "q" );
io = require( "socket.io").listen( require( "http" ).createServer( null ).listen( 1337, 'localhost') );


setInterval( function() {

console.dir( io.sockets.manager.rooms );
for (var room in io.sockets.manager.rooms ) {

	if( room == '' ) continue;
	pushData( room.slice( 1 ) );
}



}, 10000 );

io.sockets.on( "connection", function( socket ) {

	console.log( "connection" );

	// register
	socket.on( "register", function( nodeNumber ) {

		debugger;		
		var currentRoom;
		currentRoom = getCurrentRoom( socket );
		if( currentRoom ) 
		{
			socket.leave( currentRoom );
		}
		socket.join( nodeNumber );
		currentRoom = getCurrentRoom( socket );
		console.log( "socket registered for node : " + nodeNumber );
		getData.apply( socket, [ nodeNumber ] );

	})


})


function getCurrentRoom( socket ) {

	var rooms = io.sockets.manager.rooms;
	for( var room in io.sockets.manager.rooms ) {

		if( room == '' ) continue;
		if( rooms[room].indexOf( socket.id) != -1 ) return room.slice( 1 );
	}
	return null;

}

function getData( nodeNumber ) {


	var socket = this;
	console.log( "getting data for node : " + nodeNumber );
	getNodeData( nodeNumber ).then( function( nodeData ) {

		socket.emit( "nodeData", createNodeData( nodeNumber, nodeData ) );
		console.log( "data ready for node : " + nodeNumber );

	}, function( fail ) {

		socket.emit( "message", fail);
		console.error( "error getting data for node : " + nodeNumber );
	} );

}

function pushData( nodeNumber ) {

	console.log( "prepare to push data to node : " + nodeNumber );
	getNodeData( nodeNumber ).then( function( nodeData ) {

		io.sockets.in(nodeNumber).emit( "nodeData", createNodeData( nodeNumber, nodeData) );
		console.log( "data pushed to node : " + nodeNumber );

	}, function( fail ) {

		socket.emit( "message", fail);
		console.error( "error getting data for node : " + nodeNumber );
	} );
}

function createNodeData( nodeNumber, nodeData ) {

	return { nodeNumber: nodeNumber, date:new Date(), nodeData:nodeData }


}
