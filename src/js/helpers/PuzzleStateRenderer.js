import Util from './Util';

class PuzzleStateRenderer {
  constructor(context) {
    // Character metrics for normal-sized font
    const xPaddingLeft = 6;
    const xPaddingRight = 5;
    const xSpacing = 6;
    const yPaddingTop = 4;
    const yPaddingBottom = 4;
    const ySpacing = 2;
    const characterWidth = 7;
    const characterHeight = 10;

    // Assets
    const fontUrl = new URL('../../images/font.png', import.meta.url).href;
    const tinyFontUrl = new URL('../../images/tiny-font.png', import.meta.url).href;

    // Load normal sized font
    const font = new Image();
    const fontPromise = new Promise((resolve, reject) => {
      font.src = fontUrl;
      font.onload = () => {
        resolve();
      };
      font.onerror = () => {
        reject();
      };
    });

    // Load tiny font (for depth and path cost)
    const tinyFont = new Image();
    const tinyFontPromise = new Promise((resolve, reject) => {
      tinyFont.src = tinyFontUrl;
      tinyFont.onload = () => {
        resolve();
      };
      tinyFont.onerror = () => {
        reject();
      };
    });

    // Character metrics for tiny font
    const tinyPaddingTop = 5;
    const tinyCharacterWidth = 5;
    const tinyCharacterHeight = 7;
    const tinyCharacterSpacing = 1;

    // Special character offsets
    const tinyFontCharGreaterThanOrEqual = 10;
    const tinyFontK = 11;
    const tinyFontHash = 12;
    const tinyFontDash = 13;

    // Pre-calculate expected width and height of a node
    const width = xPaddingLeft + characterWidth * 3 + xSpacing * 2 + xPaddingRight;
    const height = yPaddingTop + 5 * characterHeight + 2 * ySpacing + yPaddingBottom * 2 + 2 * tinyPaddingTop + tinyCharacterSpacing * 2;

    this.getExpectedHeight = function () {
      return height;
    };

    this.getExpectedWidth = function () {
      return width;
    };

    this.convertNumberToTinyFontChars = function (value) {
      // Indices of characters to be rendered
      const characters = [];

      // Extract digits
      const numDigits = value > 0 ? Math.floor(Util.log10(value)) + 1 : 1;
      for (let i = 0; i < numDigits; i++) {
        const digit = value % 10;
        characters.unshift(digit);
        value = (value - digit) / 10;
      }

      return characters;
    };

    this.convertNumberToTinyFontCharsLimit1k = function (value) {
      if (value < 1000) {
        // Convert to character indices
        return this.convertNumberToTinyFontChars(value);
      } else {
        // Print characters to represent >= 1000
        return [tinyFontCharGreaterThanOrEqual, 1, tinyFontK];
      }
    };

    this.renderNumberUsingTinyFont = function (xOffset, yOffset, boxWidth, characters) {
      // Calculate width of text
      const textWidth = (tinyCharacterWidth + tinyCharacterSpacing) * characters.length;

      // Calculate initial X offset so that text will be centered
      xOffset += (boxWidth - textWidth) / 2;

      for (let i = 0; i < characters.length; i++) {
        const destX = Math.round(xOffset + (tinyCharacterWidth + tinyCharacterSpacing) * i);
        const destY = Math.round(yOffset + tinyPaddingTop);

        context.drawImage(tinyFont, characters[i] * tinyCharacterWidth, 0, tinyCharacterWidth, 7,
          destX, destY, tinyCharacterWidth, tinyCharacterHeight);
      }
    };

    this.renderState = async function (state, stateColor, x, y) {
      await Promise.all([fontPromise, tinyFontPromise]);

      context.strokeStyle = stateColor;

      context.strokeRect(x + 0.5, y + 0.5, width, height);

      for (let ty = 0; ty < 3; ty++) {
        for (let tx = 0; tx < 3; tx++) {
          const tile = state.getTile(tx, ty);
          const srcX = characterWidth * tile;
          const destX = x + tx * (xSpacing + characterWidth) + xPaddingLeft;
          const destY = y + ty * (ySpacing + characterHeight) + yPaddingTop;

          context.drawImage(font,
            srcX, 0, characterWidth, characterHeight,
            destX, destY, characterWidth, characterHeight);
        }
      }

      const middleX = Math.round(x + this.getExpectedWidth() / 2) + 0.5;
      let middleY = y + yPaddingTop + 3 * characterHeight + 2 * ySpacing + yPaddingBottom + 0.5;

      // Draw horizontal line
      context.beginPath();
      context.moveTo(x + 0.5, middleY);
      context.lineTo(Math.round(x + this.getExpectedWidth() + 0.5), middleY);
      context.stroke();

      // Divide bottom section in half with a vertical line
      context.beginPath();
      context.moveTo(middleX, middleY);
      context.lineTo(middleX, middleY + yPaddingTop + characterHeight + yPaddingBottom);
      context.stroke();

      let characters = this.convertNumberToTinyFontCharsLimit1k(state.getDepth());
      this.renderNumberUsingTinyFont(x + 1, middleY, this.getExpectedWidth() / 2, characters);

      let hv = state.getHeuristicValue();
      if (hv == null) {
        characters = [tinyFontDash];
      } else {
        hv = parseInt(hv, 10);
        characters = this.convertNumberToTinyFontCharsLimit1k(hv);
      }
      this.renderNumberUsingTinyFont(middleX, middleY, this.getExpectedWidth() / 2, characters);

      middleY += yPaddingTop + characterHeight + yPaddingBottom;

      context.beginPath();
      context.moveTo(x + 0.5, middleY);
      context.lineTo(Math.round(x + this.getExpectedWidth() + 0.5), middleY);
      context.stroke();

      const eo = state.getExpansionOrder();
      if (eo === 0) {
        characters = [tinyFontDash];
      } else {
        characters = this.convertNumberToTinyFontChars(eo);
        characters.unshift(tinyFontHash);
      }

      this.renderNumberUsingTinyFont(x + 1, middleY, this.getExpectedWidth(), characters);
    };
  }
}

export default PuzzleStateRenderer;
