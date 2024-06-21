const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { db } = require('../firebase');
const jwt = require('jsonwebtoken');

// Middleware untuk memverifikasi token JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Jika tidak ada token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Jika verifikasi gagal
        req.user = user;
        next();
    });
}

async function runPythonScript(inputData) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../../scripts/predict.py');
        const tmpDir = path.join(__dirname, '../../tmp');
        const inputFilePath = path.join(tmpDir, 'input.json');
        const outputFilePath = path.join(tmpDir, 'output.json');

        // Buat direktori /tmp jika belum ada
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Simpan inputData ke file input.json
        fs.writeFileSync(inputFilePath, JSON.stringify({ sentences: inputData }), { encoding: 'utf-8' });

        // Tambahkan log untuk jalur file
        console.log('Executing script with paths:');
        console.log('scriptPath:', scriptPath);
        console.log('inputFilePath:', inputFilePath);
        console.log('outputFilePath:', outputFilePath);

        // Set environment variables for encoding
        const options = {
            env: {
                ...process.env,
                PYTHONIOENCODING: 'utf-8',
                PYTHONLEGACYWINDOWSSTDIO: 'utf-8'
            }
        };

        const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';
        
        execFile(pythonExecutable, [scriptPath, inputFilePath, outputFilePath], options, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing script:', error);
                console.error('Stderr:', stderr);
                console.error('Stdout:', stdout);
                reject({ error, stderr, stdout });
            } else {
                try {
                    const outputData = JSON.parse(fs.readFileSync(outputFilePath, 'utf-8'));
                    resolve(outputData);
                } catch (parseError) {
                    console.error('Error parsing output JSON:', parseError);
                    reject(parseError);
                }
            }
        });
    });
}

async function saveDataToFirestore(userId, data) {
    const userRef = db.collection('users').doc(userId);
    await userRef.set(data, { merge: true });
}

async function processRequest(req, res) {
    const data = req.body;
    const userId = req.user.uid;

    try {
        await saveDataToFirestore(userId, data);
        const result = await runPythonScript(data.sentences);
        res.send(result);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send(error);
    }
}

module.exports = {
    processRequest,
    authenticateToken,
    runPythonScript
};
