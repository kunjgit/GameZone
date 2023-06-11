var uiModule = (function(module) {
    
    let config = {
        color: "#FFFFFF",//"#FFFF00",//"rgba(255, 255, 255, 0.9)",
        textColor: "#000000",//"#000033",
        fontSize: 30,
        borderWidth: 10,
        borderColor: "#000033",
        

        cursorHeight: 30,

        shadowColor: "rgba(0, 0, 0, 0.6)",
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowOffsetY: 0,

        usedSpell: {
            width: 150,
            time: 1000,
            marginY: 15,
        },

        randomLetters: ["A", "C", "D", "E", "F", "H", "I", "K", "L", "N", "O", "R", "S", "X"]
    };

    class StyleBox extends uiModule.TextBlock{
        constructor(x, y, width, height = 50, centerY = true) {
            super(x, y, width, height, "");

            this.setBGColor(config.color);
            this.setTextColor(config.textColor);
            this.setFontSize(config.fontSize);
            this.setBorder(config.borderWidth, config.borderColor);
            if (centerY) {
                this.setTextCenterY();
            }
            else {
                this.textY = 10;
            }

            this.content = "";
            this.maxLength = null;
        }
        fitText() {
            // TODO: how to not hard-code?
            this.width = 20 + config.fontSize * 0.6 * this.content.length;
            this.setTextCenter();
        }
        fitMax() {
            // TODO: how to not hard-code?
            this.width = 20 + config.fontSize * 0.6 * this.maxLength;
        }
        setContent(content) {
            if (this.maxLength !== null) {
                content = content.slice(0, this.maxLength);
            }

            this.content = content.toUpperCase();
            this.setText(this.content);
        }
        appendContent(newContent) {
            this.setContent(this.content + newContent);
        }
        setAndFitContent(content) {
            this.setContent(content);
            this.fitText();
        }
    }

    class SpellBox extends StyleBox{
        constructor(x, y, width, height, text = "") {
            super(x, y, width, height);
            
            this.frontText = "";
            this.textCursorIndex = 0;
            this.availableSpell = "";
            this.maxLength = 20;

            this.setLookDisabled(true);
        }
        drawItself(ctx) {
            super.drawItself(ctx);

            if (this.isLookDisabled) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fillRect(0, 0, this.width, this.height);
            }
            else {
                ctx.font = this.font;
                let textMetric = ctx.measureText(this.frontText);
                ctx.fillRect(this.textX + textMetric.width, this.textY - config.cursorHeight / 2, 1, config.cursorHeight);
            }
        }
        initText() {
            let spellArray = this.availableSpell.split("|");
            let spellRandIndex = Math.floor(Math.random() * spellArray.length);
            let chosenSpell = spellArray[spellRandIndex];

            let length = this.maxLength / 2;
            this.appendContent(genRandString(chosenSpell.split(''), length));

            //this.appendContent(genRandString());
            //this.appendRandString(length);
        }
        indicatorToLeft() {
            if (this.textCursorIndex > 0) {
                this.textCursorIndex--;
            }
            this.adjustFrontText();
        }
        indicatorToRight() {
            if (this.textCursorIndex < this.content.length) {
                this.textCursorIndex++;
            }
            this.adjustFrontText();
        }
        backspace() {
            if (this.textCursorIndex !== 0) {
                let newContent = utils.stringSplice(this.content, this.textCursorIndex - 1);
                this.setContent(newContent);

                this.textCursorIndex--;
                this.adjustFrontText();
            }
        }
        setSpell(spellArray) {
            this.availableSpell = spellArray.join("|");
        }
        castSpell() {
            if (this.availableSpell === "") {
                throw new Exception("No available spell!");
            }
            
            let spellUsed = null;
            let regex = new RegExp(this.availableSpell, 'i');
            let regexResult = regex.exec(this.content);
            //console.log(regexResult);
            if (regexResult !== null) {
                //TODO
                spellUsed = regexResult[0];
                let newContent = utils.stringSplice(this.content, regexResult.index, spellUsed.length);
                this.setContent(newContent);
                this.textCursorIndex = 0;

                //this.setText(this.content);

                // this.usedSpellTextBox.setText(spellUsed);
                // this.usedSpellTextBox.setVisible(true);

                // //this.usedSpellTextBox.opacity = 0.5;

                // this.usedSpellTextBox.opacity = 0;
                // this.usedSpellTextBox.setFadeIn(0, 0,
                //     config.usedSpell.time / 2,
                //     - config.usedSpell.width,
                //     0);

                // setTimeout(() => { this.usedSpellTextBox.setVisible(false) }, 
                //     config.usedSpell.time);

                // spellUsed = spellUsed.toLowerCase()
                // this.appendRandString(5);
            }
            this.adjustFrontText();

            return spellUsed;
        }
        adjustFrontText() {
            /*
            let finalText = this.content.slice(0, this.textCursorIndex) + "|" + this.content.slice(this.textCursorIndex);
            this.setText(finalText);
            */
            if (this.textCursorIndex < this.content.length) {
                this.frontText = this.content.slice(0, this.textCursorIndex);
            }
            else {
                this.frontText = this.content;
            }
            this.addBehaviorWithDelay(spriteModule.SineBehavior, "y", 5, 100, 0, {
                period: 200
            });
        }
    }

    

    class ComingLetterBox extends StyleBox{
        constructor(x, y, width, height) {
            super(x, y, width, height, "");
            this.setTextCenter();

            this.spellArray = [];
            this.content = "";
        }
        drawItself(ctx) {
            super.drawItself(ctx);
        }
        setSpell(spellArray) {
            this.spellArray = spellArray;
        }
        shuffle() {
            let spellRandIndex = Math.floor(Math.random() * this.spellArray.length);
            let chosenSpell = this.spellArray[spellRandIndex];

            this.setContent(genRandString(chosenSpell.split(''), 5));
        }
    }

    let genRandString = function(spellLetters, letterCount) {

        let spellLetterSrc = spellLetters.slice(); // slice() is used for copy
        let randomLetterSrc = config.randomLetters.slice();

        let output = "";

        for (let i = 0; i < letterCount; i++) {

            let takeSpell = (Math.random() < 0.7);
            let randIndex = 0;

            if (takeSpell) {
                randIndex = Math.floor(Math.random() * spellLetterSrc.length);
                output += spellLetterSrc[randIndex];
                spellLetterSrc.splice(randIndex, 1);

                if (spellLetterSrc.length === 0) {
                    spellLetterSrc = spellLetters.slice();
                }
            }
            else {
                randIndex = Math.floor(Math.random() * randomLetterSrc.length);
                output += randomLetterSrc[randIndex];
                randomLetterSrc.splice(randIndex, 1);

                if (randomLetterSrc.length === 0) {
                    randomLetterSrc = config.randomLetters.slice();
                }
            }
        }

        return output;
    }

    // Expose Public Functions and Classes ====================
    module.SpellBox = SpellBox;
    module.ComingLetterBox = ComingLetterBox;
    module.StyleBox = StyleBox;
    
    return module;
})(uiModule || {});