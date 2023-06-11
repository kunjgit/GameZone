var expect    = require("chai").expect;
var data      = require("./data/options");
var process   = require("./util").process;
var RelateUrl = require("../lib");

var urlCount = 0;



describe("API variations", function()
{
	describe("of arguments", function()
	{
		var data =
		{
			site: "http://www.domain.com/asdf/",
			href: "http://www.domain.com/asdf/asdf",
			expect_site: "asdf",
			expect_options_site: "/asdf/asdf",
			options: {site:"http://www.domain.com/asdf2/"}
		};
		
		describe("in reusable instances", function()
		{
			it("should support: new RelateUrl(from,options).relate(from,to,options)", function(done)
			{
				var result = new RelateUrl(data.site, data.options).relate(data.site, data.href, data.options);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl(from,options).relate(from,to)", function(done)
			{
				var result = new RelateUrl(data.site, data.options).relate(data.site, data.href);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl(from,options).relate(to,options)", function(done)
			{
				var result = new RelateUrl(data.site, data.options).relate(data.href, data.options);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should support: new RelateUrl(from,options).relate(to)", function(done)
			{
				var result = new RelateUrl(data.site, data.options).relate(data.href);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should support: new RelateUrl(from).relate(from,to,options)", function(done)
			{
				var result = new RelateUrl(data.site).relate(data.site, data.href, data.options);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl(from).relate(from,to)", function(done)
			{
				var result = new RelateUrl(data.site).relate(data.site, data.href);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl(from).relate(to,options)", function(done)
			{
				var result = new RelateUrl(data.site).relate(data.href, data.options);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should support: new RelateUrl(from).relate(to)", function(done)
			{
				var result = new RelateUrl(data.site).relate(data.href);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl(null,options).relate(from,to,options)", function(done)
			{
				var result = new RelateUrl(null, data.options).relate(data.site, data.href, data.options);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl(null,options).relate(from,to)", function(done)
			{
				var result = new RelateUrl(null, data.options).relate(data.site, data.href);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl(null,options).relate(to,options)", function(done)
			{
				var result = new RelateUrl(null, data.options).relate(data.href, data.options);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should support: new RelateUrl(null,options).relate(to)", function(done)
			{
				var result = new RelateUrl(null, data.options).relate(data.href);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should support: new RelateUrl().relate(from,to,options)", function(done)
			{
				var result = new RelateUrl().relate(data.site, data.href, data.options);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: new RelateUrl().relate(from,to)", function(done)
			{
				var result = new RelateUrl().relate(data.href, data.options);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should support: new RelateUrl().relate(to,options)", function(done)
			{
				var result = new RelateUrl().relate(data.href, data.options);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should not support: new RelateUrl(from,options).relate(options)", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl(data.site,data.options).relate(data.options) }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl(from,options).relate()", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl(data.site,data.options).relate() }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl(null,options).relate(options)", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl(null,data.options).relate(data.options) }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl(null,options).relate()", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl(null,data.options).relate() }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl(from).relate(options)", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl(data.site).relate(data.options) }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl(from).relate()", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl(data.site).relate() }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl().relate(to)", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl().relate(data.href) }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl().relate(options)", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl().relate(data.options) }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: new RelateUrl().relate()", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl().relate() }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
		});
		
		describe("in single-use instances", function()
		{
			it("should support: RelateUrl.relate(from,to,options)", function(done)
			{
				var result = RelateUrl.relate(data.site, data.href, data.options);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: RelateUrl.relate(from,to)", function(done)
			{
				var result = RelateUrl.relate(data.site, data.href);
				expect(result).to.equal(data.expect_site);
				done();
			});
			
			it("should support: RelateUrl.relate(to,options)", function(done)
			{
				var result = RelateUrl.relate(data.href, data.options);
				expect(result).to.equal(data.expect_options_site);
				done();
			});
			
			it("should not support: RelateUrl.relate(from)", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl.relate(data.site) }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: RelateUrl.relate(options)", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl.relate(data.options) }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
			
			it("should not support: RelateUrl.relate()", function(done)
			{
				var result,error;
				
				try{ result=new RelateUrl.relate() }
				catch(err){ error=err }
				
				expect(result).to.be.undefined;
				expect(error).to.be.an.instanceof(Error);
				done();
			});
		});
	});
		
	describe("of options", function()
	{
		after( function()
		{
			console.log("        (Processed "+urlCount+" URLs)");
		});
		
		
		
		it("should work with reusable instances", function(done)
		{
			var data,urls,instance;
			
			data =
			{
				site:                   "http://www.domain.com/asdf/",
				href:                   "http://www.domain.com/asdf/asdf",
				expected_ABSOLUTE:      "http://www.domain.com/asdf/asdf",
				expected_ROOT_RELATIVE: "/asdf/asdf",
				expected_SHORTEST:      "asdf"
			};
			
			// Test 1
			instance = new RelateUrl(data.site);
			
			urls =
			[
				instance.relate(data.href, {output:RelateUrl.ABSOLUTE}),
				instance.relate(data.site, data.href, {output:RelateUrl.ROOT_RELATIVE}),
				instance.relate(data.href),
				instance.relate(data.site, data.href)
			];
			
			expect(urls[0]).to.equal(data.expected_ABSOLUTE);
			expect(urls[1]).to.equal(data.expected_ROOT_RELATIVE);
			expect(urls[2]).to.equal(data.expected_SHORTEST);
			expect(urls[3]).to.equal(data.expected_SHORTEST);
			
			// Test 2
			instance = new RelateUrl(data.site, {output:RelateUrl.ROOT_RELATIVE});
			
			urls =
			[
				instance.relate(data.href, {output:RelateUrl.ABSOLUTE}),
				instance.relate(data.site, data.href, {output:RelateUrl.SHORTEST}),
				instance.relate(data.href),
				instance.relate(data.site, data.href)
			];
			
			expect(urls[0]).to.equal(data.expected_ABSOLUTE);
			expect(urls[1]).to.equal(data.expected_SHORTEST);
			expect(urls[2]).to.equal(data.expected_ROOT_RELATIVE);
			expect(urls[3]).to.equal(data.expected_ROOT_RELATIVE);
			
			urlCount += 6;	// including sites
			
			done();
		});
		
		
		
		it("should work with single-use instances", function(done)
		{
			var data =
			{
				site:                   "http://www.domain.com/asdf/",
				href:                   "http://www.domain.com/asdf/asdf",
				expected_ABSOLUTE:      "http://www.domain.com/asdf/asdf",
				expected_ROOT_RELATIVE: "/asdf/asdf",
				expected_SHORTEST:      "asdf"
			};
			
			var urls =
			[
				RelateUrl.relate(data.site, data.href, {output:RelateUrl.ABSOLUTE}),
				RelateUrl.relate(data.site, data.href, {output:RelateUrl.ROOT_RELATIVE}),
				RelateUrl.relate(data.site, data.href),
				RelateUrl.relate(data.site, data.href)
			];
			
			expect(urls[0]).to.equal(data.expected_ABSOLUTE);
			expect(urls[1]).to.equal(data.expected_ROOT_RELATIVE);
			expect(urls[2]).to.equal(data.expected_SHORTEST);
			expect(urls[3]).to.equal(data.expected_SHORTEST);
			
			urlCount += 8;	// including sites
			
			done();
		});
		
		
		
		it("should support options.defaultPorts", function(done)
		{
			urlCount += process( data["options.defaultPorts"], true,
			{
				defaultPorts: {sftp:22, ssh:22}
			});
			
			done();
		});
		
		
		
		it("should support options.directoryIndexes", function(done)
		{
			urlCount += process( data["options.directoryIndexes"], true,
			{
				directoryIndexes: ["default.html"]
			});
			
			done();
		});
		
		
		
		it("should support options.ignore_www = true", function(done)
		{
			urlCount += process( data["options.ignore_www"], true,
			{
				ignore_www: true
			});
			
			done();
		});
		
		
		
		it("should support options.rejectedSchemes", function(done)
		{
			urlCount += process( data["options.rejectedSchemes"], true,
			{
				rejectedSchemes: ["dunno"]
			});
			
			done();
		});
		
		
		
		it("should support options.removeAuth = true", function(done)
		{
			urlCount += process( data["options.removeAuth"], true,
			{
				removeAuth: true
			});
			
			done();
		});
		
		
		
		it("should support options.removeDirectoryIndexes = false", function(done)
		{
			urlCount += process( data["options.removeDirectoryIndexes"], true,
			{
				removeDirectoryIndexes: false
			});
			
			done();
		});
		
		
		
		it("should support options.removeEmptyQueries = true", function(done)
		{
			urlCount += process( data["options.removeEmptyQueries"], true,
			{
				removeEmptyQueries: true
			});
			
			done();
		});
		
		
		
		it("should support options.removeRootTrailingSlash = false", function(done)
		{
			urlCount += process( data["options.removeRootTrailingSlash"], true,
			{
				removeRootTrailingSlash: false
			});
			
			done();
		});
		
		
		
		it("should support options.schemeRelative = false", function(done)
		{
			urlCount += process( data["options.schemeRelative"], true,
			{
				schemeRelative: false
			});
			
			done();
		});
		
		
		
		it.skip("should support options.slashesDenoteHost = false", function(done)
		{
			urlCount += process( data["options.slashesDenoteHost"], true,
			{
				slashesDenoteHost: false
			});
			
			done();
		});
	});
});
