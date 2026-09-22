const express = require("express");
const cors = require("cors");
const app = express()

app.use(cors())
app.use(express.json())

const urls = new Map()
const rateLimits = new Map();

let id = 1;

const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateShortCode(number) {
    let code = "";

    while (number > 0) {
        code = characters[number % 62] + code;
        number = Math.floor(number / 62);
    }

    return code;
}

app.post("/shorten", rateLimiter, (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({
            message: "URL is required"
        });
    }

    try {
        new URL(url);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid URL provided. Please include http:// or https://"
        });
    }
    const shortCode = generateShortCode(id);
    urls.set(shortCode, {
        originalUrl: url,
        hits: 0
    });
    id++;
    res.json({
        shortUrl: `http://localhost:3000/${shortCode}`,
        originalUrl: url
    });
});

app.get("/urls", (req, res) => {
    const allUrls = [];

    for (const [shortCode, data] of urls) {
        allUrls.push({
            shortCode,
            originalUrl: data.originalUrl,
            hits: data.hits
        });
    }

    res.json(allUrls);
});

app.get("/:shortCode", (req, res) => {
    const { shortCode } = req.params;

    const data = urls.get(shortCode);

    if (!data) {
        return res.status(404).json({
            message: "Short URL not found"
        });
    }

    data.hits++;

    res.redirect(302, data.originalUrl);
});

function rateLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - 60 * 1000;

    let requests = rateLimits.get(ip) || [];

    requests = requests.filter(time => time > windowStart);

    if (requests.length >= 50) {
        const retryAfter = Math.ceil(
            (requests[0] + 60 * 1000 - now) / 1000
        );

        res.set("Retry-After", retryAfter);

        return res.status(429).json({
            message: "Too many requests. Try again later."
        });
    }

    requests.push(now);

    rateLimits.set(ip, requests);

    next();
}

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});