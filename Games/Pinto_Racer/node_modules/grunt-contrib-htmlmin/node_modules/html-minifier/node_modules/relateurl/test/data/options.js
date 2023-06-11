module.exports =
{
	"options.defaultPorts":
	{
		"sites":
		[
			"http://www.domain.com/"
		],
		"tests":
		[
			{
				"href":                 "http://user:pass@www.domain.com:80/",
				"expected":
				[
					{
						"absolute":     "http://user:pass@www.domain.com",
						"pathRelative": "//user:pass@www.domain.com",
						"rootRelative": "//user:pass@www.domain.com",
						"shortest":     "//user:pass@www.domain.com"
					}
				]
			},
			{
				"href":                 "sftp://user:pass@www.domain.com:22/",
				"expected":
				[
					{
						"absolute":     "sftp://user:pass@www.domain.com",
						"pathRelative": "sftp://user:pass@www.domain.com",
						"rootRelative": "sftp://user:pass@www.domain.com",
						"shortest":     "sftp://user:pass@www.domain.com"
					}
				]
			},
			{
				"href":                 "ssh://user:pass@www.domain.com:22/",
				"expected":
				[
					{
						"absolute":     "ssh://user:pass@www.domain.com",
						"pathRelative": "ssh://user:pass@www.domain.com",
						"rootRelative": "ssh://user:pass@www.domain.com",
						"shortest":     "ssh://user:pass@www.domain.com"
					}
				]
			}
		]
	},
	"options.directoryIndexes":
	{
		"sites":
		[
			"http://www.domain.com/"
		],
		"tests":
		[
			{
				"href":                 "http://www.domain.com/default.html",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			},
			{
				"href":                 "http://www.domain.com/index.html",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			},
			{
				"href":                 "http://www.domain.com/other.html",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com/other.html",
						"pathRelative": "other.html",
						"rootRelative": "/other.html",
						"shortest":     "other.html"
					}
				]
			}
		]
	},
	"options.ignore_www":
	{
		"sites":
		[
			"http://www.domain.com/",
			"http://domain.com/"
		],
		"tests":
		[
			{
				"href":                 "http://www.domain.com/",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					},
					{
						"absolute":     "http://domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			},
			{
				"href":                 "http://domain.com/",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					},
					{
						"absolute":     "http://domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			}
		]
	},
	"options.rejectedSchemes":
	{
		"sites":
		[
			"http://www.domain.com/"
		],
		"tests":
		[
			{
				"href":                 "dunno:some-stuff",
				"expected":
				[
					{
						"absolute":     "dunno:some-stuff",
						"pathRelative": "dunno:some-stuff",
						"rootRelative": "dunno:some-stuff",
						"shortest":     "dunno:some-stuff"
					}
				]
			},
			{
				"href":                 "http://www.domain.com/",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			}
		]
	},
	"options.removeAuth":
	{
		"sites":
		[
			"http://user:pass@www.domain.com/",
			"http://www.domain.com/"
		],
		"tests":
		[
			{
				"href":                 "http://www.domain.com/",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					},
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			},
			{
				"href":                 "http://user:pass@www.domain.com/",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					},
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			}
		]
	},
	"options.removeDirectoryIndexes":
	{
		"sites":
		[
			"http://www.domain.com/"
		],
		"tests":
		[
			{
				"href":                 "http://www.domain.com/index.html",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com/index.html",
						"pathRelative": "index.html",
						"rootRelative": "/index.html",
						"shortest":     "index.html"
					}
				]
			},
			{
				"href":                 "http://www.domain.com/other.html",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com/other.html",
						"pathRelative": "other.html",
						"rootRelative": "/other.html",
						"shortest":     "other.html"
					}
				]
			}
		]
	},
	"options.removeEmptyQueries":
	{
		"sites":
		[
			"http://www.domain.com/",
			"http://www.other.com/"
		],
		"tests":
		[
			{
				"href":                 "http://www.domain.com/?var1=&var2&var3=",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					},
					{
						"absolute":     "http://www.domain.com?var1&var2&var3",
						"pathRelative": "//www.domain.com?var1&var2&var3",
						"rootRelative": "//www.domain.com?var1&var2&var3",
						"shortest":     "//www.domain.com?var1&var2&var3"
					}
				]
			},
			{
				"href":                 "http://www.domain.com/?var=&var2=asdf&var3",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com?var2=asdf",
						"pathRelative": "?var2=asdf",
						"rootRelative": "/?var2=asdf",
						"shortest":     "?var2=asdf"
					},
					{
						"absolute":     "http://www.domain.com?var&var2=asdf&var3",
						"pathRelative": "//www.domain.com?var&var2=asdf&var3",
						"rootRelative": "//www.domain.com?var&var2=asdf&var3",
						"shortest":     "//www.domain.com?var&var2=asdf&var3"
					}
				]
			}
		]
	},
	"options.removeRootTrailingSlash":
	{
		"sites":
		[
			"http://www.domain.com/"
		],
		"tests":
		[
			{
				"href":                 "http://www.domain.com/",
				"expected":
				[
					{
						"absolute":     "http://www.domain.com/",
						"pathRelative": "",
						"rootRelative": "/",
						"shortest":     ""
					}
				]
			}
		]
	},
	"options.schemeRelative":
	{
		"sites":
		[
			"http://www.domain.com/"
		],
		"tests":
		[
			{
				"href":                 "http://www.other.com/",
				"expected":
				[
					{
						"absolute":     "http://www.other.com",
						"pathRelative": "http://www.other.com",
						"rootRelative": "http://www.other.com",
						"shortest":     "http://www.other.com"
					}
				]
			},
			{
				"href":                 "https://www.other.com/",
				"expected":
				[
					{
						"absolute":     "https://www.other.com",
						"pathRelative": "https://www.other.com",
						"rootRelative": "https://www.other.com",
						"shortest":     "https://www.other.com"
					}
				]
			}
		]
	},
	"options.slashesDenoteHost":
	{
		"sites":
		[
			"filler",
			"filler"
		],
		"tests":
		[
			{
				"href":                 "filler",
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
					}
				]
			}
		]
	}
}
