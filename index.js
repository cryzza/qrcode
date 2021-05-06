const PORT = 3000;

const path = require('path')
const express = require('express')
const app = express()
const {
    AwesomeQR
} = require("awesome-qr");
const fs = require("fs");

app.get('/api/v1/:coin/:wallet', async (req, res) => {
    const coin = req.params.coin;
    const wallet = req.params.wallet;
    const code = `assets/qr/${coin}_${wallet}_${Math.random()}_${Date.now()}.png`;
    const codeFull = path.join(__dirname, `/${code}`);
    const logoFull = path.join(__dirname, `/assets/logos/${coin}.png`);

    try {
        const buffer = await new AwesomeQR({
            text: wallet,
            size: 1000,
            logoImage: fs.readFileSync(logoFull),
            logoCornerRadius: 0,
            logoScale: 0.3
        }).draw();

        fs.writeFileSync(codeFull, buffer);

        res.sendFile(codeFull, code);
    } catch (err) {
        res.send('coin doesnt exist, or query too long')
    }
})

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.listen(PORT, () => console.log('server running'));