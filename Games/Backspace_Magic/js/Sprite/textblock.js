var uiModule = (function() {
    "use strict";
        
    let setTextBlockConfig = function(configMap) {
        for (let property in configMap) {
            if (textBlockConfig.hasOwnProperty(property)) {
                textBlockConfig[property] = configMap[property];
            }
        }
    };

    let textBlockConfig = {
        // To be changed by the init method
        width: 40,
        height: 40,
        spacingBetweenH: 10,
        spacingBetweenV: 10,
        gridWidth: 50,
        gridHeight: 50,
        transitionTime: 500,
        
        // Constants
        finalOpacity: 1.0,
        finalFillColor: "transparent",//"#9999CC",
        finalTextColor: "#333333",//"#FFFFFF",
        focusFillColor: "rgba(256, 256, 256, 0.4)",//"#FFFFFF66",//"#FFFFFF66",
        blinkFillColor: "rgba(238, 238, 256, 0.4)",//"#EEEEFF66",//"#FFFFFF66",
        buttonGradientColor: "rgba(102, 102, 102, 0.4)",
        //finalFillColorFormat: "rgba(153, 153, 204, %d)",//"#9999CC",//"rgba(64, 64, 64, %d)",
        //finalTextColorFormat: "rgba(255, 255, 255, %d)",
        font: "20px Lucida Console",//"20px sans-serif",
        textBaseLine: "top",
        textAlign: "start",
        lineHeight: 30,
        padding: 0,
        
        lineJoin: "bevel",
        borderWidth: 0,
        borderColor: "#000000"
    };

    // Text Block ====================
    class TextBlock extends spriteModule.Sprite {
        constructor(x, y, width, height, text = "") {
            super(x, y);

            this.width = width;
            this.height = height;
            this.textX = 10;
            this.textY = 0;
            this.textAlign = "start";
            this.textBaseline = "top";
            this.font = textBlockConfig.font;
            this.lineHeight = textBlockConfig.lineHeight;
            this.finalFillColor = textBlockConfig.finalFillColor;
            this.finalTextColor = textBlockConfig.finalTextColor;
            this.lineJoin = textBlockConfig.lineJoin;
            this.borderWidth = textBlockConfig.borderWidth;
            this.borderColor = textBlockConfig.borderColor;
            this.textList = [];
            this.isLookDisabled = false;

            if (text !== undefined) {
                this.textList.push(text);
            }
        }
        drawItself(ctx) {
            super.drawItself(ctx);

            ctx.save();
            // Need to consider the alpha used by the scene/game
            //ctx.globalAlpha = ctx.globalAlpha * this.opacity;
            if (this.borderWidth > 0) {
                ctx.lineWidth = this.borderWidth;
                ctx.lineJoin = this.lineJoin;
                ctx.strokeStyle = this.borderColor;
                //ctx.strokeRect(0, 0, this.width, this.height);
                //let imgdata = ctx.getImageData(this.getGlobalPos().x, this.getGlobalPos().y, this.width, this.height);
                ctx.strokeRect(0, 0, this.width, this.height);
                //ctx.putImageData(imgdata, this.getGlobalPos().x, this.getGlobalPos().y);
            }
            ctx.fillStyle = this.finalFillColor; //utils.sprintf(textBlockConfig.finalFillColorFormat, this.opacity);
            ctx.fillRect(0, 0, this.width, this.height);
            if (this.isInFocus) {
                ctx.fillStyle = textBlockConfig.focusFillColor;
                ctx.fillRect(0, 0, this.width, this.height);
            }
            // Blinking
            if (this.blinkOpacity > 0) {
                ctx.save();
                ctx.globalAlpha = ctx.globalAlpha * this.blinkOpacity;
                //ctx.strokeStyle = textBlockConfig.blinkFillColor;
                //ctx.strokeRect(0, 0, this.width, this.height);
                let gradient = ctx.createLinearGradient(0, 0, this.width, 0);
                gradient.addColorStop(0, textBlockConfig.blinkFillColor);
                gradient.addColorStop(0.5, "transparent");
                gradient.addColorStop(1, textBlockConfig.blinkFillColor);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.fillStyle = textBlockConfig.blinkFillColor;
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.restore();
            }
            // Move the origin to the top left corner
            ctx.translate(textBlockConfig.padding, textBlockConfig.padding);
            // Font and text setting
            ctx.fillStyle = this.finalTextColor; //utils.sprintf(textBlockConfig.finalTextColorFormat, Math.min(this.opacity * 2, 1));
            ctx.font = this.font;
            ctx.textAlign = this.textAlign; //textBlockConfig.textAlign;
            ctx.textBaseline = this.textBaseline; //textBlockConfig.textBaseLine;
            // Draw Text
            for (let i = 0; i < this.textList.length; i++) {
                let text = this.textList[i];
                //ctx.fillRect(this.textX, textBlockConfig.lineHeight * i, 5, 5);
                ctx.fillText(text, this.textX, this.textY + this.lineHeight * i);
            }

            if (this.isLookDisabled) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fillRect(0, 0, this.width, this.height);
            }

            ctx.restore();
        }
        setTextCenter() {
            this.textAlign = "center";
            this.textX = this.width / 2;
            this.setTextCenterY();
            //this.textBaseline = "middle";
            //this.textY = this.height / 2 - (this.textList.length - 1) * this.lineHeight / 2;
        }
        setTextCenterY() {
            this.textBaseline = "middle";
            this.textY = this.height / 2 - (this.textList.length - 1) * this.lineHeight / 2;
        }
        setTextAlign(textAlign) {
            let possibleArg = ["left", "right", "center"];
            if (possibleArg.includes(textAlign)) {
                switch (textAlign) {
                    case "left":
                        this.textX = 0;
                        break;
                    case "right":
                        this.textX = this.width;
                        break;
                    case "center":
                        this.textX = this.width / 2;
                        break;
                }
                this.textAlign = textAlign;
            }
        }
        setTextPos(xPos, yPos) {
            this.textX = xPos;
            this.textY = yPos;
        }
        setColor(bgColor, textColor) {
            this.finalFillColor = bgColor;
            this.finalTextColor = textColor;
        }
        setTextColor(textColor) {
            this.finalTextColor = textColor;
        }
        setBGColor(bgColor) {
            this.finalFillColor = bgColor;
        }
        setBorder(borderWidth, borderColor) {
            this.borderWidth = borderWidth;
            if (borderColor) {
                this.borderColor = borderColor;
            }
        }
        setFont(font) {
            this.font = font;
        }
        setFontSize(fontSize) {
            this.font = this.font.replace(/\d+/, fontSize.toString());
            this.setLineHeight(fontSize);
        }
        setLineHeight(lineHeight) {
            this.lineHeight = lineHeight;
        }
        setLookDisabled(isDisable) {
            this.isLookDisabled = isDisable;
            this.hasUpdate = true;
        }
        focus(isFocus) {
            this.isInFocus = isFocus;
            // Temp
            //this.finalFillColor = isFocus ? "#BBBBFF" : textBlockConfig.finalFillColor;
        }
        appendText(...args) {
            if (args) {
                args.forEach((e) => this.textList.push(e));
                return true;
            }
            else {
                return false;
            }
        }
        setText(value, index) {
            if (index === undefined || typeof index !== "number") {
                index = 0;
            }
            if (index < this.textList.length) {
                this.textList[index] = value;
            }
            else {
                for (let i = this.textList.length; i < index; i++) {
                    this.textList.push("");
                }
                this.textList.push(value);
            }
            return true;
        }
        setAllText(...args) {
            if (args) {
                args.forEach((e, index) => {
                    if (index < this.textList.length) {
                        this.textList[index] = e;
                    }
                    else {
                        this.textList.push(e);
                    }
                });
                return true;
            }
            else {
                return false;
            }
        }
    }

    let choiceBoxconfig = {
        color: "#FFFFFF",//"#FFFF00",//"rgba(255, 255, 255, 0.9)",
        textColor: "#000000",//"#000033",
        fontSize: 30,

        borderWidth: 10,
        borderColor: "#000033",

        width: 180,
        marginX: 30,
        marginY: 10,
        indicatorX: 10,
        indicatorWidth: 10,
        indicatorHeight: 10,

        shadowColor: "rgba(0, 0, 0, 0.6)",
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
    };

    class ChoiceBox extends TextBlock {
        constructor(x, y) {
            super(x, y, choiceBoxconfig.width, choiceBoxconfig.marginY * 2, "");

            this.setBGColor(choiceBoxconfig.color);
            this.setTextColor(choiceBoxconfig.textColor);
            this.setFontSize(choiceBoxconfig.fontSize);
            this.setBorder(10, "#000033");

            
            this.textX = choiceBoxconfig.marginX;
            this.textY = choiceBoxconfig.marginY;

            this.choiceList = [];
            this.choiceValueList = [];
            this.selectedIndex = 0;

            this.selectIndicator = new spriteModule.Rect(choiceBoxconfig.indicatorX, 
                this.textY + this.lineHeight,
                choiceBoxconfig.indicatorWidth,
                choiceBoxconfig.indicatorHeight);
            this.addSubSprite(this.selectIndicator, false);
        }
        addChoice(choiceText, choiceValue = null) {
            let index = this.choiceList.length;
            this.choiceList.push(choiceText);
            this.choiceValueList.push((choiceValue === null) ? choiceText : choiceValue);
            
            this.setText(choiceText, index);
            this.height += this.lineHeight;
            this.setTextCenterY();

            this.setIndicatorPosition();
        }
        choiceUp() {
            if (this.selectedIndex !== 0) {
                this.selectedIndex--;
            }
            this.setIndicatorPosition();
        }
        choiceDown() {
            if (this.selectedIndex !== this.choiceList.length - 1) {
                this.selectedIndex++;
            }
            this.setIndicatorPosition();
        }
        setIndicatorPosition() {
            let baseY = this.textY - choiceBoxconfig.indicatorHeight / 2;
            this.selectIndicator.setPos(choiceBoxconfig.indicatorX, 
                baseY + this.lineHeight * this.selectedIndex);
        }
        getIndex() {
            return this.selectedIndex;
        }
        getChoice() {
            return this.choiceList[this.selectedIndex];
        }
        getChoiceValue() {
            return this.choiceValueList[this.selectedIndex];
        }
    }
    
    






    
    



    // Expose Public Functions and Classes ====================
    return {
        //init: init,
        setTextBlockConfig: setTextBlockConfig,
        TextBlock: TextBlock,
        ChoiceBox: ChoiceBox,
    };
})();