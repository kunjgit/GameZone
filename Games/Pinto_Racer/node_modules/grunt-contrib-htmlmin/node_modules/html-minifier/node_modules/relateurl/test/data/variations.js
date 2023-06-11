// more url sample ideas: http://mathiasbynens.be/demo/url-regex
module.exports =
{
	"sites":
	[
		"http://user:pass@www.domain.com/./../test/../tes.ter/index.html",
		"http://user:pass@www.domain.com/tes.ter/tes.ter.html",
		//"http://user:pass@www.domain.com/./../test/../tes.ter/index.html?va r1= +dir&var2=text&var3#anchor",	// MUST test this one (may have already below)
		"http://user:pass@www.domain.com/test/?va r1= +dir&var2=text&var3#anchor",
		//"http://user:pass@www.domain.com/test/tes.ter.html?va r1= +dir&var2=text&var3#anchor"	// would be good to test this too
	],
	"tests":
	{
		"all parts, removing from right":
		[
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#",
						"pathRelative": "#",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#",
						"shortest":     "#"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3",
						"pathRelative": "",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3",
						"shortest":     ""
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text",
						"pathRelative": "../test/?va%20r1=++dir&var2=text",
						"rootRelative": "/test/?va%20r1=++dir&var2=text",
						"shortest":     "/test/?va%20r1=++dir&var2=text"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text",
						"pathRelative": "../test/?va%20r1=++dir&var2=text",
						"rootRelative": "/test/?va%20r1=++dir&var2=text",
						"shortest":     "/test/?va%20r1=++dir&var2=text"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text",
						"pathRelative": "?va%20r1=++dir&var2=text",
						"rootRelative": "/test/?va%20r1=++dir&var2=text",
						"shortest":     "?va%20r1=++dir&var2=text"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text",
						"pathRelative": "../test/?va%20r1=++dir&var2=text",
						"rootRelative": "/test/?va%20r1=++dir&var2=text",
						"shortest":     "/test/?va%20r1=++dir&var2=text"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text",
						"pathRelative": "../test/?va%20r1=++dir&var2=text",
						"rootRelative": "/test/?va%20r1=++dir&var2=text",
						"shortest":     "/test/?va%20r1=++dir&var2=text"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text",
						"pathRelative": "?va%20r1=++dir&var2=text",
						"rootRelative": "/test/?va%20r1=++dir&var2=text",
						"shortest":     "?va%20r1=++dir&var2=text"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2",
						"pathRelative": "../test/?va%20r1=++dir&var2",
						"rootRelative": "/test/?va%20r1=++dir&var2",
						"shortest":     "/test/?va%20r1=++dir&var2"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2",
						"pathRelative": "../test/?va%20r1=++dir&var2",
						"rootRelative": "/test/?va%20r1=++dir&var2",
						"shortest":     "/test/?va%20r1=++dir&var2"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2",
						"pathRelative": "?va%20r1=++dir&var2",
						"rootRelative": "/test/?va%20r1=++dir&var2",
						"shortest":     "?va%20r1=++dir&var2"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2",
						"pathRelative": "../test/?va%20r1=++dir&var2",
						"rootRelative": "/test/?va%20r1=++dir&var2",
						"shortest":     "/test/?va%20r1=++dir&var2"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2",
						"pathRelative": "../test/?va%20r1=++dir&var2",
						"rootRelative": "/test/?va%20r1=++dir&var2",
						"shortest":     "/test/?va%20r1=++dir&var2"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2",
						"pathRelative": "?va%20r1=++dir&var2",
						"rootRelative": "/test/?va%20r1=++dir&var2",
						"shortest":     "?va%20r1=++dir&var2"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir",
						"pathRelative": "../test/?va%20r1=++dir",
						"rootRelative": "/test/?va%20r1=++dir",
						"shortest":     "/test/?va%20r1=++dir"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir",
						"pathRelative": "../test/?va%20r1=++dir",
						"rootRelative": "/test/?va%20r1=++dir",
						"shortest":     "/test/?va%20r1=++dir"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir",
						"pathRelative": "?va%20r1=++dir",
						"rootRelative": "/test/?va%20r1=++dir",
						"shortest":     "?va%20r1=++dir"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir",
						"pathRelative": "../test/?va%20r1=++dir",
						"rootRelative": "/test/?va%20r1=++dir",
						"shortest":     "/test/?va%20r1=++dir"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir",
						"pathRelative": "../test/?va%20r1=++dir",
						"rootRelative": "/test/?va%20r1=++dir",
						"shortest":     "/test/?va%20r1=++dir"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir",
						"pathRelative": "?va%20r1=++dir",
						"rootRelative": "/test/?va%20r1=++dir",
						"shortest":     "?va%20r1=++dir"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1=",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1",
						"pathRelative": "../test/?va%20r1",
						"rootRelative": "/test/?va%20r1",
						"shortest":     "/test/?va%20r1"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1",
						"pathRelative": "../test/?va%20r1",
						"rootRelative": "/test/?va%20r1",
						"shortest":     "/test/?va%20r1"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1",
						"pathRelative": "?va%20r1",
						"rootRelative": "/test/?va%20r1",
						"shortest":     "?va%20r1"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1",
						"pathRelative": "../test/?va%20r1",
						"rootRelative": "/test/?va%20r1",
						"shortest":     "/test/?va%20r1"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1",
						"pathRelative": "../test/?va%20r1",
						"rootRelative": "/test/?va%20r1",
						"shortest":     "/test/?va%20r1"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1",
						"pathRelative": "?va%20r1",
						"rootRelative": "/test/?va%20r1",
						"shortest":     "?va%20r1"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/index",
						"pathRelative": "../test/index",
						"rootRelative": "/test/index",
						"shortest":     "/test/index"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/index",
						"pathRelative": "../test/index",
						"rootRelative": "/test/index",
						"shortest":     "/test/index"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/index",
						"pathRelative": "index",
						"rootRelative": "/test/index",
						"shortest":     "index"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/tes.ter/",
						"pathRelative": "../test/tes.ter/",
						"rootRelative": "/test/tes.ter/",
						"shortest":     "/test/tes.ter/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/tes.ter/",
						"pathRelative": "../test/tes.ter/",
						"rootRelative": "/test/tes.ter/",
						"shortest":     "/test/tes.ter/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/tes.ter/",
						"pathRelative": "tes.ter/",
						"rootRelative": "/test/tes.ter/",
						"shortest":     "tes.ter/"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/tes.ter/",
						"pathRelative": "../test/tes.ter/",
						"rootRelative": "/test/tes.ter/",
						"shortest":     "/test/tes.ter/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/tes.ter/",
						"pathRelative": "../test/tes.ter/",
						"rootRelative": "/test/tes.ter/",
						"shortest":     "/test/tes.ter/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/tes.ter/",
						"pathRelative": "tes.ter/",
						"rootRelative": "/test/tes.ter/",
						"shortest":     "tes.ter/"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test//",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain./",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.",
						"pathRelative": "//user:pass@www.domain.",
						"rootRelative": "//user:pass@www.domain.",
						"shortest":     "//user:pass@www.domain."
					},
					{
						"absolute":     "http://user:pass@www.domain.",
						"pathRelative": "//user:pass@www.domain.",
						"rootRelative": "//user:pass@www.domain.",
						"shortest":     "//user:pass@www.domain."
					},
					{
						"absolute":     "http://user:pass@www.domain.",
						"pathRelative": "//user:pass@www.domain.",
						"rootRelative": "//user:pass@www.domain.",
						"shortest":     "//user:pass@www.domain."
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.",
						"pathRelative": "//user:pass@www.domain.",
						"rootRelative": "//user:pass@www.domain.",
						"shortest":     "//user:pass@www.domain."
					},
					{
						"absolute":     "http://user:pass@www.domain.",
						"pathRelative": "//user:pass@www.domain.",
						"rootRelative": "//user:pass@www.domain.",
						"shortest":     "//user:pass@www.domain."
					},
					{
						"absolute":     "http://user:pass@www.domain.",
						"pathRelative": "//user:pass@www.domain.",
						"rootRelative": "//user:pass@www.domain.",
						"shortest":     "//user:pass@www.domain."
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain",
						"pathRelative": "//user:pass@www.domain",
						"rootRelative": "//user:pass@www.domain",
						"shortest":     "//user:pass@www.domain"
					},
					{
						"absolute":     "http://user:pass@www.domain",
						"pathRelative": "//user:pass@www.domain",
						"rootRelative": "//user:pass@www.domain",
						"shortest":     "//user:pass@www.domain"
					},
					{
						"absolute":     "http://user:pass@www.domain",
						"pathRelative": "//user:pass@www.domain",
						"rootRelative": "//user:pass@www.domain",
						"shortest":     "//user:pass@www.domain"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain",
						"pathRelative": "//user:pass@www.domain",
						"rootRelative": "//user:pass@www.domain",
						"shortest":     "//user:pass@www.domain"
					},
					{
						"absolute":     "http://user:pass@www.domain",
						"pathRelative": "//user:pass@www.domain",
						"rootRelative": "//user:pass@www.domain",
						"shortest":     "//user:pass@www.domain"
					},
					{
						"absolute":     "http://user:pass@www.domain",
						"pathRelative": "//user:pass@www.domain",
						"rootRelative": "//user:pass@www.domain",
						"shortest":     "//user:pass@www.domain"
					}
				]
			},
			{
				"href":                 "http://user:pass@www./",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.",
						"pathRelative": "//user:pass@www.",
						"rootRelative": "//user:pass@www.",
						"shortest":     "//user:pass@www."
					},
					{
						"absolute":     "http://user:pass@www.",
						"pathRelative": "//user:pass@www.",
						"rootRelative": "//user:pass@www.",
						"shortest":     "//user:pass@www."
					},
					{
						"absolute":     "http://user:pass@www.",
						"pathRelative": "//user:pass@www.",
						"rootRelative": "//user:pass@www.",
						"shortest":     "//user:pass@www."
					}
				]
			},
			{
				"href":                 "http://user:pass@www.",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.",
						"pathRelative": "//user:pass@www.",
						"rootRelative": "//user:pass@www.",
						"shortest":     "//user:pass@www."
					},
					{
						"absolute":     "http://user:pass@www.",
						"pathRelative": "//user:pass@www.",
						"rootRelative": "//user:pass@www.",
						"shortest":     "//user:pass@www."
					},
					{
						"absolute":     "http://user:pass@www.",
						"pathRelative": "//user:pass@www.",
						"rootRelative": "//user:pass@www.",
						"shortest":     "//user:pass@www."
					}
				]
			},
			{
				"href":                 "http://user:pass@www/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www",
						"pathRelative": "//user:pass@www",
						"rootRelative": "//user:pass@www",
						"shortest":     "//user:pass@www"
					},
					{
						"absolute":     "http://user:pass@www",
						"pathRelative": "//user:pass@www",
						"rootRelative": "//user:pass@www",
						"shortest":     "//user:pass@www"
					},
					{
						"absolute":     "http://user:pass@www",
						"pathRelative": "//user:pass@www",
						"rootRelative": "//user:pass@www",
						"shortest":     "//user:pass@www"
					}
				]
			},
			{
				"href":                 "http://user:pass@www",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www",
						"pathRelative": "//user:pass@www",
						"rootRelative": "//user:pass@www",
						"shortest":     "//user:pass@www"
					},
					{
						"absolute":     "http://user:pass@www",
						"pathRelative": "//user:pass@www",
						"rootRelative": "//user:pass@www",
						"shortest":     "//user:pass@www"
					},
					{
						"absolute":     "http://user:pass@www",
						"pathRelative": "//user:pass@www",
						"rootRelative": "//user:pass@www",
						"shortest":     "//user:pass@www"
					}
				]
			},
			{
				"href":                 "http://user:pass@/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@",
						"pathRelative": "//user:pass@",
						"rootRelative": "//user:pass@",
						"shortest":     "//user:pass@"
					},
					{
						"absolute":     "http://user:pass@",
						"pathRelative": "//user:pass@",
						"rootRelative": "//user:pass@",
						"shortest":     "//user:pass@"
					},
					{
						"absolute":     "http://user:pass@",
						"pathRelative": "//user:pass@",
						"rootRelative": "//user:pass@",
						"shortest":     "//user:pass@"
					}
				]
			},
			{
				"href":                 "http://user:pass@",
				"expected":
				[
					{
						"absolute":     "http://user:pass@",
						"pathRelative": "//user:pass@",
						"rootRelative": "//user:pass@",
						"shortest":     "//user:pass@"
					},
					{
						"absolute":     "http://user:pass@",
						"pathRelative": "//user:pass@",
						"rootRelative": "//user:pass@",
						"shortest":     "//user:pass@"
					},
					{
						"absolute":     "http://user:pass@",
						"pathRelative": "//user:pass@",
						"rootRelative": "//user:pass@",
						"shortest":     "//user:pass@"
					}
				]
			},
			/*{
				"href":                 "http://user:pass/",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "http://user:pass",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},*/
			{
				"href":                 "http://user/",
				"expected":
				[
					{
						"absolute":     "http://user",
						"pathRelative": "//user",
						"rootRelative": "//user",
						"shortest":     "//user"
					},
					{
						"absolute":     "http://user",
						"pathRelative": "//user",
						"rootRelative": "//user",
						"shortest":     "//user"
					},
					{
						"absolute":     "http://user",
						"pathRelative": "//user",
						"rootRelative": "//user",
						"shortest":     "//user"
					}
				]
			},
			{
				"href":                 "http://user",
				"expected":
				[
					{
						"absolute":     "http://user",
						"pathRelative": "//user",
						"rootRelative": "//user",
						"shortest":     "//user"
					},
					{
						"absolute":     "http://user",
						"pathRelative": "//user",
						"rootRelative": "//user",
						"shortest":     "//user"
					},
					{
						"absolute":     "http://user",
						"pathRelative": "//user",
						"rootRelative": "//user",
						"shortest":     "//user"
					}
				]
			},
			{
				"href":                 "http:///",
				"expected":
				[
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					}
				]
			},
			{
				"href":                 "http://",
				"expected":
				[
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					}
				]
			},
			{
				"href":                 "http:/",
				"expected":
				[
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					}
				]
			},
			{
				"href":                 "http:",
				"expected":
				[
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					},
					{
						"absolute":     "http://",
						"pathRelative": "//",
						"rootRelative": "//",
						"shortest":     "//"
					}
				]
			},
			{
				"href":                 "http",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/http",
						"pathRelative": "http",
						"rootRelative": "/tes.ter/http",
						"shortest":     "http"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/http",
						"pathRelative": "http",
						"rootRelative": "/tes.ter/http",
						"shortest":     "http"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/http",
						"pathRelative": "http",
						"rootRelative": "/test/http",
						"shortest":     "http"
					}
				]
			},
			{
				"href":                 "",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "",
						"rootRelative": "/tes.ter/",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/tes.ter.html",
						"pathRelative": "",
						"rootRelative": "/tes.ter/tes.ter.html",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3",
						"pathRelative": "",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3",
						"shortest":     ""
					}
				]
			}
		],
		"all parts, removing from left":
		[
			{
				"href":                 "http://user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			/*{
				"href":                 "://user:pass@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},*/
			{
				"href":                 "//user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			/*{
				"href":                 "user:pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 ":pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "pass@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "@www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "www.domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "domain.com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 ".com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "com:80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 ":80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},*/
			{
				"href":                 "80/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "80/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "80/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/80/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "80/test/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "/test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			{
				"href":                 "test//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "test/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "//tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//tes.ter?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//tes.ter?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//tes.ter?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//tes.ter?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "/tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "tes.ter/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "./?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "./?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			{
				"href":                 "/./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "./../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "/../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "/index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "./?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "./?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			{
				"href":                 ".html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/.html?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": ".html?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/.html?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     ".html?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/.html?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": ".html?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/.html?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     ".html?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/.html?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": ".html?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/.html?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     ".html?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/html?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "html?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/html?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "html?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/html?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "html?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/html?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "html?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/html?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "html?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/html?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "html?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/tes.ter.html?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/tes.ter/tes.ter.html?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			/*{
				"href":                 "var1=../ +dir/&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "=../+ dir/&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "../+ dir/&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "var2=text&var3#anchor",
				"expected":
				[
					
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},*/
			{
				"href":                 "var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/var3#anchor",
						"pathRelative": "var3#anchor",
						"rootRelative": "/tes.ter/var3#anchor",
						"shortest":     "var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/var3#anchor",
						"pathRelative": "var3#anchor",
						"rootRelative": "/tes.ter/var3#anchor",
						"shortest":     "var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/var3#anchor",
						"pathRelative": "var3#anchor",
						"rootRelative": "/test/var3#anchor",
						"shortest":     "var3#anchor"
					}
				]
			},
			{
				"href":                 "#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/tes.ter/#anchor",
						"shortest":     "#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/tes.ter.html#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/tes.ter/tes.ter.html#anchor",
						"shortest":     "#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "#anchor"
					}
				]
			},
			{
				"href":                 "anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/anchor",
						"pathRelative": "anchor",
						"rootRelative": "/tes.ter/anchor",
						"shortest":     "anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/anchor",
						"pathRelative": "anchor",
						"rootRelative": "/tes.ter/anchor",
						"shortest":     "anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/anchor",
						"pathRelative": "anchor",
						"rootRelative": "/test/anchor",
						"shortest":     "anchor"
					}
				]
			}
		],
		"edge cases":
		[
			/*{
				"href":                 ":/user:pass@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},*/
			{
				"href":                 "http://user123:pass123@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//user123:pass123@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "http://user@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//user@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "http://:pass@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "//:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/(test)/tes.ter/../(index.html)?va r1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"pathRelative": "../(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"rootRelative": "/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor",
						"shortest":     "/(test)/(index.html)?va%20r1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html? var1= +dir&var2=text&var3#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?%20var1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?%20var1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?%20var1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?%20var1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?%20var1=++dir&var2=text&var3#anchor",
						"pathRelative": "../test/?%20var1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?%20var1=++dir&var2=text&var3#anchor",
						"shortest":     "/test/?%20var1=++dir&var2=text&var3#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?%20var1=++dir&var2=text&var3#anchor",
						"pathRelative": "?%20var1=++dir&var2=text&var3#anchor",
						"rootRelative": "/test/?%20var1=++dir&var2=text&var3#anchor",
						"shortest":     "?%20var1=++dir&var2=text&var3#anchor"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html?var1= +dir&var2=text&var3# anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?var1=++dir&var2=text&var3#%20anchor",
						"pathRelative": "../test/?var1=++dir&var2=text&var3#%20anchor",
						"rootRelative": "/test/?var1=++dir&var2=text&var3#%20anchor",
						"shortest":     "/test/?var1=++dir&var2=text&var3#%20anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?var1=++dir&var2=text&var3#%20anchor",
						"pathRelative": "../test/?var1=++dir&var2=text&var3#%20anchor",
						"rootRelative": "/test/?var1=++dir&var2=text&var3#%20anchor",
						"shortest":     "/test/?var1=++dir&var2=text&var3#%20anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?var1=++dir&var2=text&var3#%20anchor",
						"pathRelative": "?var1=++dir&var2=text&var3#%20anchor",
						"rootRelative": "/test/?var1=++dir&var2=text&var3#%20anchor",
						"shortest":     "?var1=++dir&var2=text&var3#%20anchor"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#anchor=asdf",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor=asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor=asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"pathRelative": "#anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor=asdf",
						"shortest":     "#anchor=asdf"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#?anchor=asdf",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"pathRelative": "#?anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#?anchor=asdf",
						"shortest":     "#?anchor=asdf"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#&anchor=asdf",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"pathRelative": "#&anchor=asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#&anchor=asdf",
						"shortest":     "#&anchor=asdf"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html?va r1= +dir&var2=text&var3#anchor/asdf",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor/asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"pathRelative": "../test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"shortest":     "/test/?va%20r1=++dir&var2=text&var3#anchor/asdf"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"pathRelative": "#anchor/asdf",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#anchor/asdf",
						"shortest":     "#anchor/asdf"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html? ",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "../test/",
						"rootRelative": "/test/",
						"shortest":     "/test/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80/test/tes.ter/../index.html?%20",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/test/?%20",
						"pathRelative": "../test/?%20",
						"rootRelative": "/test/?%20",
						"shortest":     "/test/?%20"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?%20",
						"pathRelative": "../test/?%20",
						"rootRelative": "/test/?%20",
						"shortest":     "/test/?%20"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?%20",
						"pathRelative": "?%20",
						"rootRelative": "/test/?%20",
						"shortest":     "?%20"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80?var",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com:80#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com?var",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					}
				]
			},
			{
				"href":                 " http://user:pass@www.domain.com:80/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			/*{
				"href":                 "http://user123:pass123/",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "http://user123:pass123",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},*/
			{
				"href":                 "./index.html",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "",
						"rootRelative": "/tes.ter/",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "./",
						"rootRelative": "/tes.ter/",
						"shortest":     "./"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "../index.html",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 ".index.html",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/.index.html",
						"pathRelative": ".index.html",
						"rootRelative": "/tes.ter/.index.html",
						"shortest":     ".index.html"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/.index.html",
						"pathRelative": ".index.html",
						"rootRelative": "/tes.ter/.index.html",
						"shortest":     ".index.html"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/.index.html",
						"pathRelative": ".index.html",
						"rootRelative": "/test/.index.html",
						"shortest":     ".index.html"
					}
				]
			},
			{
				"href":                 "..index.html",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/..index.html",
						"pathRelative": "..index.html",
						"rootRelative": "/tes.ter/..index.html",
						"shortest":     "..index.html"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/..index.html",
						"pathRelative": "..index.html",
						"rootRelative": "/tes.ter/..index.html",
						"shortest":     "..index.html"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/..index.html",
						"pathRelative": "..index.html",
						"rootRelative": "/test/..index.html",
						"shortest":     "..index.html"
					}
				]
			},
			{
				"href":                 "./#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/tes.ter/#anchor",
						"shortest":     "#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#anchor",
						"pathRelative": "./#anchor",
						"rootRelative": "/tes.ter/#anchor",
						"shortest":     "./#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/#anchor",
						"pathRelative": "./#anchor",
						"rootRelative": "/test/#anchor",
						"shortest":     "./#anchor"
					}
				]
			},
			{
				"href":                 "../#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					}
				]
			},
			{
				"href":                 ".#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#anchor",
						"pathRelative": "#anchor",
						"rootRelative": "/tes.ter/#anchor",
						"shortest":     "#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#anchor",
						"pathRelative": "./#anchor",
						"rootRelative": "/tes.ter/#anchor",
						"shortest":     "./#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/#anchor",
						"pathRelative": "./#anchor",
						"rootRelative": "/test/#anchor",
						"shortest":     "./#anchor"
					}
				]
			},
			{
				"href":                 "..#anchor",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#anchor",
						"pathRelative": "../#anchor",
						"rootRelative": "/#anchor",
						"shortest":     "/#anchor"
					}
				]
			},
			{
				"href":                 "./#",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#",
						"pathRelative": "#",
						"rootRelative": "/tes.ter/#",
						"shortest":     "#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#",
						"pathRelative": "./#",
						"rootRelative": "/tes.ter/#",
						"shortest":     "./#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/#",
						"pathRelative": "./#",
						"rootRelative": "/test/#",
						"shortest":     "./#"
					}
				]
			},
			{
				"href":                 "../#",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com#",
						"pathRelative": "../#",
						"rootRelative": "/#",
						"shortest":     "/#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#",
						"pathRelative": "../#",
						"rootRelative": "/#",
						"shortest":     "/#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#",
						"pathRelative": "../#",
						"rootRelative": "/#",
						"shortest":     "/#"
					}
				]
			},
			{
				"href":                 ".#",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#",
						"pathRelative": "#",
						"rootRelative": "/tes.ter/#",
						"shortest":     "#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#",
						"pathRelative": "./#",
						"rootRelative": "/tes.ter/#",
						"shortest":     "./#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/#",
						"pathRelative": "./#",
						"rootRelative": "/test/#",
						"shortest":     "./#"
					}
				]
			},
			{
				"href":                 "..#",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com#",
						"pathRelative": "../#",
						"rootRelative": "/#",
						"shortest":     "/#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#",
						"pathRelative": "../#",
						"rootRelative": "/#",
						"shortest":     "/#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com#",
						"pathRelative": "../#",
						"rootRelative": "/#",
						"shortest":     "/#"
					}
				]
			},
			{
				"href":                 "#",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/#",
						"pathRelative": "#",
						"rootRelative": "/tes.ter/#",
						"shortest":     "#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/tes.ter.html#",
						"pathRelative": "#",
						"rootRelative": "/tes.ter/tes.ter.html#",
						"shortest":     "#"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?va%20r1=++dir&var2=text&var3#",
						"pathRelative": "#",
						"rootRelative": "/test/?va%20r1=++dir&var2=text&var3#",
						"shortest":     "#"
					}
				]
			},
			{
				"href":                 "./?var",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?var",
						"pathRelative": "?var",
						"rootRelative": "/tes.ter/?var",
						"shortest":     "?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?var",
						"pathRelative": "./?var",
						"rootRelative": "/tes.ter/?var",
						"shortest":     "./?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?var",
						"pathRelative": "?var",
						"rootRelative": "/test/?var",
						"shortest":     "?var"
					}
				]
			},
			{
				"href":                 "../?var",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					}
				]
			},
			{
				"href":                 ".?var",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?var",
						"pathRelative": "?var",
						"rootRelative": "/tes.ter/?var",
						"shortest":     "?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/?var",
						"pathRelative": "./?var",
						"rootRelative": "/tes.ter/?var",
						"shortest":     "./?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/?var",
						"pathRelative": "?var",
						"rootRelative": "/test/?var",
						"shortest":     "?var"
					}
				]
			},
			{
				"href":                 "..?var",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					},
					{
						"absolute":     "http://user:pass@www.domain.com?var",
						"pathRelative": "../?var",
						"rootRelative": "/?var",
						"shortest":     "/?var"
					}
				]
			},
			{
				"href":                 "./?",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "",
						"rootRelative": "/tes.ter/",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "./",
						"rootRelative": "/tes.ter/",
						"shortest":     "./"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "../?",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 ".?",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "",
						"rootRelative": "/tes.ter/",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "./",
						"rootRelative": "/tes.ter/",
						"shortest":     "./"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "..?",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 "?",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "",
						"rootRelative": "/tes.ter/",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/tes.ter.html",
						"pathRelative": "",
						"rootRelative": "/tes.ter/tes.ter.html",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "./",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "",
						"rootRelative": "/tes.ter/",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "./",
						"rootRelative": "/tes.ter/",
						"shortest":     "./"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "../",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			},
			{
				"href":                 ".",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "",
						"rootRelative": "/tes.ter/",
						"shortest":     ""
					},
					{
						"absolute":     "http://user:pass@www.domain.com/tes.ter/",
						"pathRelative": "./",
						"rootRelative": "/tes.ter/",
						"shortest":     "./"
					},
					{
						"absolute":     "http://user:pass@www.domain.com/test/",
						"pathRelative": "./",
						"rootRelative": "/test/",
						"shortest":     "./"
					}
				]
			},
			{
				"href":                 "..",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					},
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "../",
						"rootRelative": "/",
						"shortest":     "/"
					}
				]
			}
		],
		"different protocols":
		[
			{
				"href":                 "https://user:pass@www.domain.com:443/",
				"expected":
				[
					{
						"absolute":     "https://user:pass@www.domain.com",
						"pathRelative": "https://user:pass@www.domain.com",
						"rootRelative": "https://user:pass@www.domain.com",
						"shortest":     "https://user:pass@www.domain.com"
					},
					{
						"absolute":     "https://user:pass@www.domain.com",
						"pathRelative": "https://user:pass@www.domain.com",
						"rootRelative": "https://user:pass@www.domain.com",
						"shortest":     "https://user:pass@www.domain.com"
					},
					{
						"absolute":     "https://user:pass@www.domain.com",
						"pathRelative": "https://user:pass@www.domain.com",
						"rootRelative": "https://user:pass@www.domain.com",
						"shortest":     "https://user:pass@www.domain.com"
					}
				]
			},
			{
				"href":                 "ftp://user:pass@www.domain.com:80/",
				"expected":
				[
					{
						"absolute":     "ftp://user:pass@www.domain.com:80",
						"pathRelative": "ftp://user:pass@www.domain.com:80",
						"rootRelative": "ftp://user:pass@www.domain.com:80",
						"shortest":     "ftp://user:pass@www.domain.com:80"
					},
					{
						"absolute":     "ftp://user:pass@www.domain.com:80",
						"pathRelative": "ftp://user:pass@www.domain.com:80",
						"rootRelative": "ftp://user:pass@www.domain.com:80",
						"shortest":     "ftp://user:pass@www.domain.com:80"
					},
					{
						"absolute":     "ftp://user:pass@www.domain.com:80",
						"pathRelative": "ftp://user:pass@www.domain.com:80",
						"rootRelative": "ftp://user:pass@www.domain.com:80",
						"shortest":     "ftp://user:pass@www.domain.com:80"
					}
				]
			},
			{
				"href":                 "ftp://user:pass@www.domain.com:21/",
				"expected":
				[
					{
						"absolute":     "ftp://user:pass@www.domain.com",
						"pathRelative": "ftp://user:pass@www.domain.com",
						"rootRelative": "ftp://user:pass@www.domain.com",
						"shortest":     "ftp://user:pass@www.domain.com"
					},
					{
						"absolute":     "ftp://user:pass@www.domain.com",
						"pathRelative": "ftp://user:pass@www.domain.com",
						"rootRelative": "ftp://user:pass@www.domain.com",
						"shortest":     "ftp://user:pass@www.domain.com"
					},
					{
						"absolute":     "ftp://user:pass@www.domain.com",
						"pathRelative": "ftp://user:pass@www.domain.com",
						"rootRelative": "ftp://user:pass@www.domain.com",
						"shortest":     "ftp://user:pass@www.domain.com"
					}
				]
			},
			{
				"href":                 "sftp://user:pass@www.domain.com:22/;type=d",
				"expected":
				[
					{
						"absolute":     "sftp://user:pass@www.domain.com:22/;type=d",
						"pathRelative": "sftp://user:pass@www.domain.com:22/;type=d",
						"rootRelative": "sftp://user:pass@www.domain.com:22/;type=d",
						"shortest":     "sftp://user:pass@www.domain.com:22/;type=d"
					},
					{
						"absolute":     "sftp://user:pass@www.domain.com:22/;type=d",
						"pathRelative": "sftp://user:pass@www.domain.com:22/;type=d",
						"rootRelative": "sftp://user:pass@www.domain.com:22/;type=d",
						"shortest":     "sftp://user:pass@www.domain.com:22/;type=d"
					},
					{
						"absolute":     "sftp://user:pass@www.domain.com:22/;type=d",
						"pathRelative": "sftp://user:pass@www.domain.com:22/;type=d",
						"rootRelative": "sftp://user:pass@www.domain.com:22/;type=d",
						"shortest":     "sftp://user:pass@www.domain.com:22/;type=d"
					}
				]
			},
			{
				"href":                 "ssh://user:pass@www.domain.com:22/",
				"expected":
				[
					{
						"absolute":     "ssh://user:pass@www.domain.com:22",
						"pathRelative": "ssh://user:pass@www.domain.com:22",
						"rootRelative": "ssh://user:pass@www.domain.com:22",
						"shortest":     "ssh://user:pass@www.domain.com:22"
					},
					{
						"absolute":     "ssh://user:pass@www.domain.com:22",
						"pathRelative": "ssh://user:pass@www.domain.com:22",
						"rootRelative": "ssh://user:pass@www.domain.com:22",
						"shortest":     "ssh://user:pass@www.domain.com:22"
					},
					{
						"absolute":     "ssh://user:pass@www.domain.com:22",
						"pathRelative": "ssh://user:pass@www.domain.com:22",
						"rootRelative": "ssh://user:pass@www.domain.com:22",
						"shortest":     "ssh://user:pass@www.domain.com:22"
					}
				]
			}
		],
		"different hosts":
		[
			{
				"href":                 "http://www.other-domain.com:80/",
				"expected":
				[
					{
						"absolute":     "http://www.other-domain.com",
						"pathRelative": "//www.other-domain.com",
						"rootRelative": "//www.other-domain.com",
						"shortest":     "//www.other-domain.com"
					},
					{
						"absolute":     "http://www.other-domain.com",
						"pathRelative": "//www.other-domain.com",
						"rootRelative": "//www.other-domain.com",
						"shortest":     "//www.other-domain.com"
					},
					{
						"absolute":     "http://www.other-domain.com",
						"pathRelative": "//www.other-domain.com",
						"rootRelative": "//www.other-domain.com",
						"shortest":     "//www.other-domain.com"
					}
				]
			},
			{
				"href":                 "http://255.255.255.255:80/",
				"expected":
				[
					{
						"absolute":     "http://255.255.255.255",
						"pathRelative": "//255.255.255.255",
						"rootRelative": "//255.255.255.255",
						"shortest":     "//255.255.255.255"
					},
					{
						"absolute":     "http://255.255.255.255",
						"pathRelative": "//255.255.255.255",
						"rootRelative": "//255.255.255.255",
						"shortest":     "//255.255.255.255"
					},
					{
						"absolute":     "http://255.255.255.255",
						"pathRelative": "//255.255.255.255",
						"rootRelative": "//255.255.255.255",
						"shortest":     "//255.255.255.255"
					}
				]
			},
			{
				"href":                 "http://1337.net:80/",
				"expected":
				[
					{
						"absolute":     "http://1337.net",
						"pathRelative": "//1337.net",
						"rootRelative": "//1337.net",
						"shortest":     "//1337.net"
					},
					{
						"absolute":     "http://1337.net",
						"pathRelative": "//1337.net",
						"rootRelative": "//1337.net",
						"shortest":     "//1337.net"
					},
					{
						"absolute":     "http://1337.net",
						"pathRelative": "//1337.net",
						"rootRelative": "//1337.net",
						"shortest":     "//1337.net"
					}
				]
			},
			{
				"href":                 "http://a.bc:80/",
				"expected":
				[
					{
						"absolute":     "http://a.bc",
						"pathRelative": "//a.bc",
						"rootRelative": "//a.bc",
						"shortest":     "//a.bc"
					},
					{
						"absolute":     "http://a.bc",
						"pathRelative": "//a.bc",
						"rootRelative": "//a.bc",
						"shortest":     "//a.bc"
					},
					{
						"absolute":     "http://a.bc",
						"pathRelative": "//a.bc",
						"rootRelative": "//a.bc",
						"shortest":     "//a.bc"
					}
				]
			}
		],
		/*"unicode characters":
		[
			{
				"href":                 "http://مثال.إختبار/",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "http://例子.测试/",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			},
			{
				"href":                 "http://उदाहरण.परीक्षा/",
				"expected":
				[
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					},
					{
						"absolute":     "filler",
						"pathRelative": "filler",
						"rootRelative": "filler",
						"shortest":     "filler"
					}
				]
			}
		],*/
		"weird":
		[
			{
				"href":                 "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
				"expected":
				[
					{
						"absolute":     "http://-.~_!$&'()*+,;=:@:80/::::::@example.com",	// Shouldn't these be urlencoded ?
						"pathRelative": "//-.~_!$&'()*+,;=:@:80/::::::@example.com",		// Shouldn't these be urlencoded ?
						"rootRelative": "//-.~_!$&'()*+,;=:@:80/::::::@example.com",		// Shouldn't these be urlencoded ?
						"shortest":     "//-.~_!$&'()*+,;=:@:80/::::::@example.com"			// Shouldn't these be urlencoded ?
					},
					{
						"absolute":     "http://-.~_!$&'()*+,;=:@:80/::::::@example.com",
						"pathRelative": "//-.~_!$&'()*+,;=:@:80/::::::@example.com",
						"rootRelative": "//-.~_!$&'()*+,;=:@:80/::::::@example.com",
						"shortest":     "//-.~_!$&'()*+,;=:@:80/::::::@example.com"
					},
					{
						"absolute":     "http://-.~_!$&'()*+,;=:@:80/::::::@example.com",
						"pathRelative": "//-.~_!$&'()*+,;=:@:80/::::::@example.com",
						"rootRelative": "//-.~_!$&'()*+,;=:@:80/::::::@example.com",
						"shortest":     "//-.~_!$&'()*+,;=:@:80/::::::@example.com"
					}
				]
			}
		],
		"non-URLs":
		[
			{
				"href":                 "javascript:someFunction('/path');",
				"expected":
				[
					{
						"absolute":     "javascript:someFunction('/path');",
						"pathRelative": "javascript:someFunction('/path');",
						"rootRelative": "javascript:someFunction('/path');",
						"shortest":     "javascript:someFunction('/path');"
					},
					{
						"absolute":     "javascript:someFunction('/path');",
						"pathRelative": "javascript:someFunction('/path');",
						"rootRelative": "javascript:someFunction('/path');",
						"shortest":     "javascript:someFunction('/path');"
					},
					{
						"absolute":     "javascript:someFunction('/path');",
						"pathRelative": "javascript:someFunction('/path');",
						"rootRelative": "javascript:someFunction('/path');",
						"shortest":     "javascript:someFunction('/path');"
					}
				]
			},
			{
				"href":                 "data:image/svg+xml;base64,mZiIvPjwvZz",
				"expected":
				[
					{
						"absolute":     "data:image/svg+xml;base64,mZiIvPjwvZz",
						"pathRelative": "data:image/svg+xml;base64,mZiIvPjwvZz",
						"rootRelative": "data:image/svg+xml;base64,mZiIvPjwvZz",
						"shortest":     "data:image/svg+xml;base64,mZiIvPjwvZz"
					},
					{
						"absolute":     "data:image/svg+xml;base64,mZiIvPjwvZz",
						"pathRelative": "data:image/svg+xml;base64,mZiIvPjwvZz",
						"rootRelative": "data:image/svg+xml;base64,mZiIvPjwvZz",
						"shortest":     "data:image/svg+xml;base64,mZiIvPjwvZz"
					},
					{
						"absolute":     "data:image/svg+xml;base64,mZiIvPjwvZz",
						"pathRelative": "data:image/svg+xml;base64,mZiIvPjwvZz",
						"rootRelative": "data:image/svg+xml;base64,mZiIvPjwvZz",
						"shortest":     "data:image/svg+xml;base64,mZiIvPjwvZz"
					}
				]
			},
			{
				"href":                 "mailto:asdf@asdf.com",
				"expected":
				[
					{
						"absolute":     "mailto:asdf@asdf.com",
						"pathRelative": "mailto:asdf@asdf.com",
						"rootRelative": "mailto:asdf@asdf.com",
						"shortest":     "mailto:asdf@asdf.com"
					},
					{
						"absolute":     "mailto:asdf@asdf.com",
						"pathRelative": "mailto:asdf@asdf.com",
						"rootRelative": "mailto:asdf@asdf.com",
						"shortest":     "mailto:asdf@asdf.com"
					},
					{
						"absolute":     "mailto:asdf@asdf.com",
						"pathRelative": "mailto:asdf@asdf.com",
						"rootRelative": "mailto:asdf@asdf.com",
						"shortest":     "mailto:asdf@asdf.com"
					}
				]
			}
		]
	}
}
