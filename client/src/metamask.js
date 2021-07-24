import { encrypt } from 'eth-sig-util'
import web3 from 'web3'
var ethcrypto = require('eth-crypto');
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

export async function metamaskEncrypt(message, pubKey) {
    console.log(message)
    const encryptedMessage = web3.utils.toHex(
        JSON.stringify(
            encrypt(
                pubKey,
                { data: message },
                'x25519-xsalsa20-poly1305'
            )
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

export async function decryptMessage(encryptedMessage, account) {
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