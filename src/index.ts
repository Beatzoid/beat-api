require("dotenv").config();
import express from "express";
import Canvas, { loadImage } from "canvas";
import { wrapText } from "./utils";
import axios from "axios";
import rateLimit from "express-rate-limit";

const app = express();
// For heroku
app.set("trust proxy", 1);

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: function (_, res) {
        res.status(429).send({
            error: "You have been rate limited",
            limit: "100 requests every minute"
        });
    }
});

app.use(limiter);

app.get("/", (_, res) => {
    res.json({
        message:
            "Hello API user! This is a list of all routes avalible for you to use",
        routes: {
            "/": "A route that displays this message",
            "/emergencyMeeting?text=text":
                "Generates an emergency meeting image. Text is the text you want. Example: https://prnt.sc/zeqasq",
            "/weather?city=city": "Get the weather for a city"
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
    const bg = await loadImage("https://i.imgur.com/kpiG6nn.jpg");
    ctx.drawImage(bg, 0, canvas.height / 2, canvas.width, canvas.height / 2);

    res.writeHead(200, {
        "Content-Type": "image/png"
    });
    return res.end(canvas.toBuffer());
});

app.get("/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "No city provided" });

    axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API}`
        )
        .then((data) => {
            return res.json(data.data);
        })
        .catch((err) => {
            return res.json({ error: err.response.data.message });
        });

    return;
});

app.get("/shorten", async (req, res) => {
    const url = (req.query.url as string).trim();
    if (!url) return res.status(400).json({ error: "No URL specified" });

    axios
        .post(`https://cleanuri.com/api/v1/shorten`, { url })
        .then((data) => {
            return res.json({ url: data.data.result_url });
        })
        .catch((err) => {
            return res.json({ error: err.response.data.error });
        });

    return;
});

app.listen(process.env.PORT || 5000, () =>
    console.log(
        `Server listening on http://localhost:${process.env.PORT || 5000}`
    )
);
