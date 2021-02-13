import express from "express";
import Canvas, { loadImage } from "canvas";
import { wrapText } from "./utils";

const app = express();

app.get("/", (_, res) => {
    res.json({
        message:
            "Hello API user! This is a list of all routes avalible for you to use",
        routes: {
            "/": "A route that displays this message",
            "/emergencyMeeting?text=text":
                "Generates an emergency meeting image. Text is the text you want, example:"
        }
    });
});

app.get("/emergencyMeeting", async (req, res) => {
    if (!req.query.text)
        return res.status(400).json({ error: "No text provided" });

    const canvas = Canvas.createCanvas(600, 400);
    const ctx = canvas.getContext("2d");

    // White Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text as bold black text
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Manrope";
    wrapText(ctx, req.query.text as string, 10, 30, canvas.width, 25);

    // Draw Emergency Meeting Picture
    const bg = await loadImage(
        `${__dirname}/images/among-us-emergency-meeting.jpg`
    );
    ctx.drawImage(bg, 0, canvas.height / 2, canvas.width, canvas.height / 2);

    res.writeHead(200, {
        "Content-Type": "image/png"
    });
    return res.end(canvas.toBuffer());
});

app.listen(process.env.PORT || 5000, () =>
    console.log(
        `Server listening on http://localhost:${process.env.PORT || 5000}`
    )
);
