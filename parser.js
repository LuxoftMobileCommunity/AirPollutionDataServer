var request = require("request");
var jsdom = require("jsdom");
var Q = require("q");

var url = "http://monitoring.krakow.pios.gov.pl/iseo/aktualne_stacja.php?stacja=";


module.exports = parseNodeData;

function parseNodeData( nodeNumber )
{

	var defer = Q.defer();
	request( url+"00"+nodeNumber, function( error, response, body )
	{

		if( error ) {

			defer.reject( error );
			return;
		}

		jsdom.env( { html:body, scripts: ['http://code.jquery.com/jquery-1.5.min.js']}, function( error, window)
		{

			if( error ) {

				defer.reject( error );
				return;
			}

			$  = window.jQuery;
			var rows = $("table").eq(0).children("tr").slice(2);
			var arr = [];
			$(rows).each( function()
			{
				arr.push( createRowData( this ) );
			})
			defer.resolve( arr );
		})	
	})
	return defer.promise;

}

function createRowData( row )
{

	var rowData = {};
	var cells = $($(row).children( "td" ));
	rowData.param = cells.eq(0).text();
	rowData.unit = cells.eq(1).text();
	rowData.hours = [];
	for( var i = 0; i<24; i ++ )
	{
		rowData.hours[i] = { hour:i+1, value:cells.eq(i+3).text()}
	}
	return rowData;
}