const express = require("express");
const { ndown } = require("nayan-media-downloader");
const { bing } = require("nayan-bing-api");
const Youtube = require('youtube-search-api');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');


const app = express();
const PORT = 3000;

async function downloadMedia(url) {
    const URL = await ndown(url);
    return URL;
}

async function searchAndDownload(keyword) {
    try {
        // Search for the video
        const data = (await Youtube.GetListByKeyword(keyword, false, 6)).items;
        if (data.length === 0) {
            throw new Error('No results found.');
        }

        // Extract video details
        const videoId = data[0].id;
        const title = data[0].title;
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        console.log(`Downloading: ${title}`);

        // Download the audio
        await downloadMusicFromYoutube(url);
        return `Download complete: ${title}`;
    } catch (error) {
        throw new Error(`Error during search and download: ${error.message}`);
    }
}

async function downloadMusicFromYoutube(url) {
    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;

        return new Promise((resolve, reject) => {
            const stream = ytdl(url, { filter: 'audioonly' });
            const writeStream = fs.createWriteStream('video.mp3');

            stream.pipe(writeStream);

            writeStream.on('finish', () => {
                resolve(`Download complete: ${title}`);
            });

            writeStream.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        throw new Error(`Failed to get video info: ${error.message}`);
    }
}

app.get('/', (req, res) => res.send('YAHALLO!!'));

app.get('/music', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).send('Keyword query parameter is required');
    }

    try {
        const message = await searchAndDownload(keyword);
        console.log(message);

        const filePath = path.join(__dirname, 'video.mp3');
        res.download(filePath, 'downloaded_music.mp3', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get("/facebook", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send("URL parameter is required");
        }

        const URL = await downloadMedia(url);
        res.send(URL);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/tiktok", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send("URL parameter is required");
        }

        const URL = await download(url);
        res.send(URL);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
const key = "Nayan"; // Don't change the key
const cookie = "1wWvu6_PD2zxb-S9vL1tES27U8-eGSo0S954C9MtNSAdYktZsy8pLtoo6uHC_ii61xQBYhWTTgKO2HziGxMs9ekY1wJUgcqRWuVJ_wXyvToX2a6jHOKlgBpTS5qny0Haom1iS2iKCFQ2c1L-Pez45IGzeM7O5aMCOekXRh8V_TfnlUBksJYPiugXiuR1GOCWrU60tVRAL_SRX873IwCYAHg"; // Paste your bing cookie here

// Define the route
app.get('/bing', async (req, res) => {
    const prompt = req.query.prompt || "cat"; // Use the prompt from the query parameter or default to "cat"

    try {
        const data = await bing(prompt, cookie, key);
        res.json(data); // Send the data as JSON response
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});