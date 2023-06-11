var expect       = require("chai").expect;
var RelateUrl    = require("../../lib");
var shallowMerge = require("../../lib/util/object").shallowMerge;

var outputTypes = [RelateUrl.ABSOLUTE, RelateUrl.PATH_RELATIVE, RelateUrl.ROOT_RELATIVE, RelateUrl.SHORTEST];



function eachSite(data, callback)
{
	/*if (data.sites)
	{*/
		data.sites.every( function(site, i)
		{
			var cancel = callback( site, getRunner(data.tests,i) );
			
			return !(cancel === false);
		});
	/*}
	else if (data.site)
	{
		callback( data.site, getRunner(data.tests) );
	}*/
}



function getRunner(data, siteIndex)
{
	return function(expectedResult, callback)
	{
		traverse(data, siteIndex, expectedResult, callback);
	}
}



function processData(data, testEachOutputType, customOptions)
{
	var count = 0;
	
	(testEachOutputType ? outputTypes : [0]).forEach( function(outputType)
	{
		eachSite(data, function(site, eachTest)
		{
			var instance,options;
			
			options = (testEachOutputType) ? {output:outputType} : {};
			options = shallowMerge(options, customOptions);
			
			instance = new RelateUrl(site, options);
			
			count++;
			
			eachTest(instance.options.output, function(href, expectedResult)
			{
				var result = instance.relate(href);
				
				//console.log(href);
				//console.log(result);
				
				expect(result).to.equal(expectedResult);
				
				//console.log("==========");
				
				count++;
			});
		});
	});
	
	return count;
}



function traverse(obj, siteIndex, expectedResult, callback)
{
	var cancel = false;
	
	if (obj instanceof Array)
	{
		obj.every( function(nestedObj)
		{
			cancel = traverse(nestedObj, siteIndex, expectedResult, callback) === false;
			
			return !cancel;
		});
	}
	else if (obj instanceof Object)
	{
		if (obj.hasOwnProperty("href"))
		{
			expectedResult = /*(siteIndex >== 0) ?*/ obj.expected[siteIndex][expectedResult] /*: obj[expectedResult]*/;
			
			cancel = callback(obj.href, expectedResult) === false;
		}
		else
		{
			for (var i in obj)
			{
				if ( obj.hasOwnProperty(i) )
				{
					cancel = traverse(obj[i], siteIndex, expectedResult, callback) === false;
					
					if (cancel) break;
				}
			}
		}
	}
	
	return !cancel;
}



module.exports =
{
	process: processData
};
