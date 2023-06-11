'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function (processor) {
    // A simple closure for reading contents of a file and prepend/append strings to it
    function decorateFileContent (before, after) {
        return function (content, block, blockLine, blockContent) {
                var assetpath = block.asset;
                var l = blockLine.length;
                var fileContent, i, jsCode, result;

                if (fs.existsSync(assetpath)) {
                    fileContent = fs.readFileSync(assetpath).toString();

                    fileContent = before + block.indent + fileContent.replace(/\n$/, '') + after;

                    while ((i = content.indexOf(blockLine)) !== -1) {
                        content = content.substring(0, i) + fileContent + content.substring(i + l);
                    }
                }

                return content.replace(blockLine, content);
        }    
    }

    // This will allow us to use this <!-- build:includeJsFile[:target] <value> --> syntax
    processor.registerBlockType('includeJsFile', decorateFileContent('<script>', '</script>'));
    processor.registerBlockType('includeCssFile', decorateFileContent('<style>', '</style>'));
};
