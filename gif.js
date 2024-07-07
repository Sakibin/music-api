const Canvas = require("canvas")
const gif = require("gif-in-canvas")

const canvas = Canvas.createCanvas(800, 600);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#000000";
ctx.strokeRect(0, 0, canvas.width, canvas.height );
ctx.fill();

const avatarURL = await gif.loadGIF(`https://i.imgur.com/sLIRVPs.gif`);
const frames = await gif.getFrames(avatarURL /*the GIF data from the GIF URL*/);

const GIF = new gif.GIF(canvas.width /*the width of the GIF*/, canvas.height /*the height of the GIF*/);
GIF.create(true /*if the gif repeats*/, 100 /*the delay between the frames*/);

for(const frame of frames) {

    const canvasGif = Canvas.createCanvas(800, 600);
    const ctxGIF = canvasGif.getContext("2d");
    ctxGIF.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(frame._obj /*the buffer of the actually frame*/);
    ctxGIF.drawImage(avatar, 100, 300, 400, 400);

    GIF.addFrame(gif.getImage(ctxGIF /*the context of the Canvas for the GIF*/, canvas.width, canvas.height) /*the image data of the actually frame*/);
}

GIF.finish()