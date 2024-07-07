const express = require('express');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const port = 3000;

app.get('/upscale', (req, res) => {
  const url = "https://i.ibb.co/nMpnz8P/profile.jpg";

  if (!url) {
    return res.status(400).send('Please provide an image URL.');
  }

  const outputPath = `./output-${Date.now()}.jpg`;

  sharp(url)
    .resize(800, 800, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
      position: 'center',
    })
    .toFile(outputPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error processing the image.');
      }

      res.send(outputPath, (sendErr) => {
        if (sendErr) {
          console.error(sendErr);
        }
        fs.unlink(outputPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(unlinkErr);
          }
        });
      });
    });
});

app.listen(port, () => {
  console.log(`Image upscaling API listening at http://localhost:${port}`);
});