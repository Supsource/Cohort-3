const express = require('express');
const bodyParser = require('body-parser');
const bip39 = require('bip39');
const Wallet = require('ethereumjs-wallet').default;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

let wallets = [];

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/create', (req, res) => {
  const mnemonic = bip39.generateMnemonic();
  res.render('create', { mnemonic });
});

app.post('/add-wallet', (req, res) => {
    try {
      const { mnemonic } = req.body;
      if (!bip39.validateMnemonic(mnemonic)) {
        return res.status(400).send('Invalid mnemonic');
      }
  
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const wallet = Wallet.fromPrivateKey(seed.slice(0, 32)); // Use first 32 bytes of seed for private key
      wallets.push({ address: wallet.getAddressString(), publicKey: wallet.getPublicKeyString() });
      res.redirect('/wallets');
    } catch (error) {
      console.error('Error adding wallet:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.get('/wallets', (req, res) => {
  res.render('wallets', { wallets });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
