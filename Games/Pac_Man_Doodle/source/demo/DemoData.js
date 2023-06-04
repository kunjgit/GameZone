var DemoData = (function () {
    "use strict";
    
    return {
        /**
         * Returns the list of animations
         * @return {Array.<string>}
         */
        get animations() {
            return [ "title", "chase", "frighten", "present" ];
        },
        
        
        /**
         * Returns the title data
         * @return {Object}
         */
        get title() {
            return {
                endTime    : 700,
                endTile    : 11,
                leftText   : { x:  9, y: 4 },
                rightText  : { x: 13, y: 4 },
                blobY      : 4.5,
                blobDir    : { x: 1, y: 0 },
                blobMouth  : 5,
                blobRadius : 2.5
            };
        },
        
        /**
         * Returns the chase data
         * @return {Object}
         */
        get chase() {
            return {
                endTile    : 26.5,
                playersY   : 15,
                playersDir : { x: 1, y: 0 },
                scoreInc   : 500,
                scoreTime  : 1000,
                enerX      : 26,
                enerY      : 14.5
            };
        },
        
        /**
         * Returns the frighten data
         * @return {Object}
         */
        get frighten() {
            return {
                endTile    : -4,
                playersDir : { x: -1, y: 0 },
                speedMult  : 0.9,
                textTile   : 15
            };
        },
        
        /**
         * Returns the present data
         * @return {Object}
         */
        get present() {
            return {
                dir     : { x: 1, y: 0 },
                tile    : 20,
                namePos : { x: 14, y: 15 },
                timer   : 1000
            };
        }
    };
}());
