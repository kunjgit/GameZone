var expect    = require("chai").expect;
var data      = require("./data/variations");
var process   = require("./util").process;
var RelateUrl = require("../lib");

var urlCount = 0;



describe("URL variations", function()
{
	after( function()
	{
		console.log("      (Processed "+urlCount+" URLs)");
	});
	
	
	
	it("should be accurately processed with RelateUrl.ABSOLUTE", function(done)
	{
		urlCount += process(data, false, {output:RelateUrl.ABSOLUTE});
		
		done();
	});
	
	
	
	it("should be accurately processed with RelateUrl.PATH_RELATIVE", function(done)
	{
		urlCount += process(data, false, {output:RelateUrl.PATH_RELATIVE});
		
		done();
	});
	
	
	
	it("should be accurately processed with RelateUrl.ROOT_RELATIVE", function(done)
	{
		urlCount += process(data, false, {output:RelateUrl.ROOT_RELATIVE});
		
		done();
	});
	
	
	
	it("should be accurately processed with RelateUrl.SHORTEST", function(done)
	{
		urlCount += process(data, false, {output:RelateUrl.SHORTEST});
		
		done();
	});
	
	
	
	/*it.only("quick test", function(done)
	{
		console.log( RelateUrl.relate("http://user:pass@www.domain.com/", "?", {output:RelateUrl.PATH_RELATIVE}) );
		
		//console.log( decodeURIComponent(escape(RelateUrl.relate("http://www.webserver.com/", "http://例子.测试"))) );
		
		//require("../lib/util").devlog( require("url").parse("http://user:pass/") );
		
		//console.log( instance.relate(null) );
		
		done();
	});*/
	
	
	
	// https://gist.github.com/dperini/729294
	/*var re_weburl = new RegExp(
	  "^" +
	    // protocol identifier
	    "(?:(?:https?|ftp)://)" +
	    // user:pass authentication
	    "(?:\\S+(?::\\S*)?@)?" +
	    "(?:" +
	      // IP address exclusion
	      // private & local networks
	      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
	      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
	      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
	      // IP address dotted notation octets
	      // excludes loopback network 0.0.0.0
	      // excludes reserved space >= 224.0.0.0
	      // excludes network & broacast addresses
	      // (first & last IP address of each class)
	      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
	      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
	      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
	    "|" +
	      // host name
	      "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
	      // domain name
	      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
	      // TLD identifier
	      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
	    ")" +
	    // port number
	    "(?::\\d{2,5})?" +
	    // resource path
	    "(?:/[^\\s]*)?" +
	  "$", "i"
	);
	
	console.log( re_weburl.test("/asdf/") )*/
});
