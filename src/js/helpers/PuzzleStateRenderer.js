PuzzleStateRenderer = function(context) {

    var xPaddingLeft = 4;
    var xPaddingRight = 4;
    var xSpacing = 3;
    var yPaddingTop = 12;
    var yPaddingBottom = 15;
    var ySpacing = 3;
    var characterWidth = 0;
    var characterHeight = 11;

    context.font = "11px Arial";

    // Calculate expected text metrics for each character
    var characters = ['\u2012','1','2','3','4','5','6','7','8','9'];
    var textMetrics = [];
    for (var c in characters) {
        textMetrics.push(context.measureText(c));
    }

    // Find width of widest character
    for (var c in characters) {
        if (textMetrics[c].width > characterWidth) {
            characterWidth = textMetrics[c].width;
        }
    }

    var width = xPaddingLeft + characterWidth * 3 + xSpacing * 2 + xPaddingRight;
    var height = yPaddingTop + characterHeight * 3 + ySpacing * 2 + yPaddingBottom;

    this.getExpectedHeight = function() {
        return height;
    },


    this.getExpectedWidth = function() {
        return width;
    },

    this.renderState = function(state, stateColor, x, y) {

        context.strokeStyle = stateColor;
        context.strokeRect(x + 0.5, y + 0.5, width, height);

        for (var ty = 0; ty < 3; ty++) {
            for (var tx = 0; tx < 3; tx++) {

                var tile = state.getTile(tx, ty);
                var tileCharacter;
                if (tile == 0) {
                    tileCharacter = '\u2012';
                    context.fillStyle = '#999';
                } else {
                    tileCharacter = tile;
                    context.fillStyle = '#000';
                }
                var characterOffset = (characterWidth - textMetrics[tile].width) / 2;

                context.font = "11px Arial";
                context.fillText(tileCharacter,
                    x + tx * (xSpacing + characterWidth) + xPaddingLeft + characterOffset + 0.5,
                    y + ty * (ySpacing + characterHeight) + yPaddingTop + 0.5);
            }
        }

        var text = '-';
        var hv = state.getHeuristicValue();
        if (hv != null) {
            text = parseInt(hv, 10);
        }

        context.font = "11px Arial";
        yPos = y + 3 * (ySpacing + characterHeight) + yPaddingTop + 0.5;

        context.beginPath();
        context.moveTo(x, yPos - 10);
        context.lineTo(x + this.getExpectedWidth(), yPos - 10);
        context.moveTo(x + this.getExpectedWidth() / 2 + 0.5, yPos - 10);
        context.lineTo(x + this.getExpectedWidth() / 2 + 0.5, yPos + 12);
        context.stroke();

        context.fillStyle = '#000';
        context.fillText(state.getDepth(), x + xPaddingLeft + 2, yPos + 5);
        context.fillText(text, x + xPaddingLeft + 2.0 * (xSpacing + characterWidth) - 2, yPos + 5);
    };
};