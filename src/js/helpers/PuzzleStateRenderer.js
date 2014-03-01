PuzzleStateRenderer = function(context) {

    // Character metrics for normal-sized font
    var xPaddingLeft = 6;
    var xPaddingRight = 5;
    var xSpacing = 6;
    var yPaddingTop = 4;
    var yPaddingBottom = 4;
    var ySpacing = 2;
    var characterWidth = 7;
    var characterHeight = 10;

    // Load normal sized font
    var font = new Image();
    font.src = "images/font.png";

    // Character metrics for tiny font
    var tinyPaddingTop = 5;
    var tinyCharacterWidth = 5;
    var tinyCharacterHeight = 7;
    var tinyCharacterSpacing = 1;

    // Special character offsets
    var tinyFontCharGreaterThanOrEqual = 10;
    var tinyFontK = 11;

    // Load tiny font (for depth and path cost)
    var tinyFont = new Image();
    tinyFont.src = "images/tiny-font.png";

    // Pre-calculate expected width and height of a node
    var width = xPaddingLeft + characterWidth * 3 + xSpacing * 2 + xPaddingRight;
    var height = yPaddingTop * 2 + 3 * characterHeight + 2 * ySpacing + characterHeight + yPaddingBottom * 2;

    this.getExpectedHeight = function() {
        return height;
    },


    this.getExpectedWidth = function() {
        return width;
    },

    this.renderNumberUsingTinyFont = function(xOffset, yOffset, value) {

        var log10 = function(val) {
            return Math.log(val) / Math.LN10;
        }

        // Width of text area
        var boxWidth = this.getExpectedWidth() / 2;

        // Indices of characters to be rendered
        var characters = new Array();

        if (value < 1000) {
            // Extract digits
            var numDigits = value > 0 ? Math.floor(log10(value)) + 1 : 1;
            for (var i = 0; i < numDigits; i++) {
                var digit = value % 10;
                characters.unshift(digit);
                value = (value - digit) / 10;
            }
        } else {
            // Print characters to represent >= 1000
            characters = new Array(tinyFontCharGreaterThanOrEqual, 1, tinyFontK);
        }

        // Calculate width of text
        var textWidth = (tinyCharacterWidth + tinyCharacterSpacing) * characters.length;

        // Calculate initial X offset so that text will be centered
        xOffset += (boxWidth - textWidth) / 2;

        for(i = 0; i < characters.length; i++) {

            var destX = Math.round(xOffset + (tinyCharacterWidth + tinyCharacterSpacing) * i);
            var destY = Math.round(yOffset + tinyPaddingTop);

            context.drawImage(tinyFont,
                characters[i] * tinyCharacterWidth, 0, tinyCharacterWidth, 7,
                destX, destY, tinyCharacterWidth, tinyCharacterHeight);
        }
    },

    this.renderState = function(state, stateColor, x, y) {

        context.strokeStyle = stateColor;
        context.strokeRect(x + 0.5, y + 0.5, width, height);

        for (var ty = 0; ty < 3; ty++) {
            for (var tx = 0; tx < 3; tx++) {

                var tile = state.getTile(tx, ty);
                var tileCharacter;
                var srcX = characterWidth * tile;

                var destX = x + tx * (xSpacing + characterWidth) + xPaddingLeft;
                var destY = y + ty * (ySpacing + characterHeight) + yPaddingTop;

                context.drawImage(font,
                    srcX, 0, characterWidth, characterHeight,
                    destX, destY, characterWidth, characterHeight);
            }
        }


        var middleX = Math.round(x + this.getExpectedWidth() / 2) + 0.5;
        var middleY = y + yPaddingTop + 3 * characterHeight + 2 * ySpacing + yPaddingBottom + 0.5;

        context.beginPath();

        // Draw horizontal line
        context.moveTo(x + 0.5, middleY);
        context.lineTo(Math.round(x + this.getExpectedWidth() + 0.5), middleY);

        // Divide bottom section in half with a vertical line
        context.moveTo(middleX, middleY);
        context.lineTo(middleX, middleY + yPaddingTop + characterHeight + yPaddingBottom);

        context.stroke();

        this.renderNumberUsingTinyFont(x + 1, middleY, state.getDepth());

        var hv = state.getHeuristicValue();
        if (hv != null) {
            hv = parseInt(hv, 10);
            this.renderNumberUsingTinyFont(middleX, middleY, hv);
        }
    };
};