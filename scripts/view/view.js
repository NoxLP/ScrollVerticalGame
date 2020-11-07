var canvas, ctx;

/**
 * Store canvas and 2d context in global variable for easy access during the game execution
 * @param {canvas} canvasElement Main canvas element
 */
export const setCanvas = canvasElement => {
    canvas = canvasElement;
    ctx = canvas.getContext("2d");
}