const keyword = `alan walker faded`;
const Youtube = require('youtube-search-api');
const fs = require('fs');
const ytdl = require('ytdl-core');

async function searchAndDownload(keyword) {
    try {
        // Search for the video
        const data = (await Youtube.GetListByKeyword(keyword, false, 6)).items;
        if (data.length === 0) {
            console.log('No results found.');
            return;
        }

        // Extract video details
        const videoId = data[0].id;

console.log(videoId);
         
        const title = data[0].title;
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        console.log(`Downloading: ${title}`);

        // Download the audio
        await downloadMusicFromYoutube(url);
        console.log('Download complete.');
    } catch (error) {
        console.error('Error:', error);
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

// Start the search and download process
searchAndDownload(keyword);
