const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = 5000;

// Enable CORS for all origins
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/remove-background', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const imagePath = req.file.path;
    const outputFileName = `processed_${req.file.filename}.png`;
    const outputPath = path.join(__dirname, 'processed_images', outputFileName);

    try {
        // Ensure the output directory exists
        if (!fs.existsSync(path.join(__dirname, 'processed_images'))) {
            fs.mkdirSync(path.join(__dirname, 'processed_images'));
        }

        // Call Python script to remove background
        const pythonProcess = spawn('python3', [
            path.join(__dirname, 'remove_bg.py'),
            imagePath,
            outputPath
        ]);

        let pythonError = '';
        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
        });

        await new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Python script exited with code ${code}. Error: ${pythonError}`));
                }
            });
        });

        // Clean up the uploaded file
        fs.unlinkSync(imagePath);

        // Send the processed image back
        res.sendFile(outputPath, () => {
            // Optionally, clean up the processed image after sending
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error processing image:', error);
        // Clean up the uploaded file in case of error
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        res.status(500).json({ message: 'Failed to process image.', error: error.message });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Speed Test Endpoints
app.get('/speedtest/download', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const filePath = path.join(__dirname, 'dummy_100mb.bin');
    res.download(filePath, 'dummy_100mb.bin', (err) => {
        if (err) {
            console.error('Error sending dummy file:', err);
            res.status(500).send('Error sending file');
        }
    });
});

app.post('/speedtest/upload', (req, res) => {
    // For upload test, we just need to receive data. The actual speed calculation
    // will be done on the client side by measuring how long it takes to send data.
    res.status(200).send('Upload received');
});

app.get('/speedtest/ping', (req, res) => {
    res.status(200).send('Pong');
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
