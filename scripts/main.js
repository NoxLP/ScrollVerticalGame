//Import view.js file for storing the canvas in it
import * as View from "./scripts/view/view.js"

window.onload = () => {
    //send canvas to view and store it
    View.setCanvas(document.querySelector("canvas"));
};