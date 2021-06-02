const PORT = 3000;

const path = require('path')
const express = require('express')
const app = express()
const {
    AwesomeQR
} = require("awesome-qr");
const fs = require("fs");
const CoinGecko = require('coingecko-api');
const request = require('request')

const CoinGeckoClient = new CoinGecko();

app.get('/api/v1/:coin/:wallet', async (req, res) => {
    const allCoinsAPI = await CoinGeckoClient.coins.list();
    const allCoins = allCoinsAPI.data
    var coinId;

    for (i = 0; i < allCoins.length; i++) {
        if (allCoins[i].id == req.params.coin) {
            coinId = allCoins[i].id
            break
        }
    }

    if (!coinId) {
        return res.send('coin is fake')
    }

    const theCoin = await CoinGeckoClient.coins.fetch(coinId, {});
    const logoFull = theCoin.data.image.large

    const coin = req.params.coin;
    const wallet = req.params.wallet;
    const code = `assets/qr/${coin}_${wallet}_${Math.random()}_${Date.now()}.png`;
    const codeFull = path.join(__dirname, `/${code}`);

    try {
        request.get(logoFull, async function (err, res, body) {
            const buffer = await new AwesomeQR({
                text: wallet,
                size: 1000,
                logoImage: body,
                logoCornerRadius: 0,
                logoScale: 0.3
            }).draw();

            fs.writeFileSync(codeFull, await buffer);
        });

    } catch (err) {
        res.send('coin doesnt exist, or query too long: ' + err)
    }
})

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.listen(PORT, () => console.log('server running'));