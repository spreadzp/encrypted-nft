import { encrypt } from 'eth-sig-util'
import web3 from 'web3'
var EthCrypto = require('eth-crypto');
export async function metamaskPublic(address) {
    return new Promise((resolve, reject) => {
        window.ethereum.sendAsync(
            {
                jsonrpc: '2.0',
                method: 'eth_getEncryptionPublicKey',
                params: [address],
                // from: address,
            },
            function (error, encryptionpublickey) {
                if (!error) {
                    resolve(encryptionpublickey.result)
                } else {
                    reject(error)
                }
            }
        )
    })
}

export async function metamaskEncryptData(message, pubKey) {
    console.log(message)
    const encrypted = await EthCrypto.encryptWithPublicKey(
        pubKey, // publicKey
        message // message
    );
    console.log("🚀 ~ file: metamask.js ~ line 30 ~ metamaskEncrypt ~ encrypted", encrypted)
    
    const encryptedMessage = EthCrypto.cipher.stringify(
            encrypted 
    )
    // const enc = await ethcrypto.encryptWithPublicKey(pubKey, message)
    // console.log("🚀 ~ file: metamask.js ~ line 36 ~ metamaskEncrypt ~ enc", enc)
    // const encryptedMessage = ethcrypto.cipher.stringify(enc);
    return encryptedMessage
}
export async function metamaskEncrypt(message, pubKey) {
    console.log(message)
    
    const enc =  encrypt(
        pubKey,
        { data: message },
        'x25519-xsalsa20-poly1305'
    )
    console.log("🚀 ~ file: metamask.js ~ line 31 ~ metamaskEncrypt ~ enc", enc)
    const encryptedMessage = web3.utils.toHex(
        JSON.stringify(
            enc 
        )
    )
    // const enc = await ethcrypto.encryptWithPublicKey(pubKey, message)
    // console.log("🚀 ~ file: metamask.js ~ line 36 ~ metamaskEncrypt ~ enc", enc)
    // const encryptedMessage = ethcrypto.cipher.stringify(enc);
    return encryptedMessage
}

var handle = (promise) => {
    return promise
        .then(data => ([data, undefined]))
        .catch(error => Promise.resolve([undefined, error]));
}

export async function decryptPrivateKey(encryptedMessage, account) {
    console.log(`encryptedMessage: ${encryptedMessage}`)  
    const [decryptedMessage, decryptErr] = await handle(window.ethereum.request({
        method: 'eth_decrypt',
        params: [encryptedMessage, account],
    }));

    if (decryptErr) { console.error(decryptErr.message) }
    else {
        console.log(`decryptedMessage: ${decryptedMessage}`)
        return decryptedMessage
    }
}

export async function decryptUriFile(encryptedMessage, privateKey) {
    console.log(`encryptedMessage: ${encryptedMessage}`)
    const parsedEncInfo = EthCrypto.cipher.parse(encryptedMessage)
    const message = await EthCrypto.decryptWithPrivateKey(
        privateKey, parsedEncInfo)
    console.log("🚀 ~ file: metamask.js ~ line 85 ~ decryptMessage ~ message", message)
    return message;
}
