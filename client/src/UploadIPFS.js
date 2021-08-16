import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { encrypt, encryptData, getAccount, getNewAccount } from "./cypher";
import SetDecrypt from "./SetDecrypt";
import { create } from 'ipfs-http-client'
import { metamaskEncrypt, metamaskEncryptData } from "./metamask";
import MintNFT from "./MintNFT";
import TransferNFT from "./TransferNFT";
const client = create('https://ipfs.infura.io:5001/api/v0')


const UploadIPFS = props => {
    const [fileUrl, updateFileUrl] = useState(``)
    const [stackId, setStackID] = useState(null);
    const [clearData, setClearData] = useState('');
    const [encryptedData, setEncryptedData] = useState('');
    const [encryptedPrivateKey, setEncryptedPrivateKey] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const { drizzle, drizzleState } = props;
    const [cid, setCid] = useState('')
    const [textFromIpfsFIle, setTextFromIpfsFIle] = useState('')
    const [newPrivateKey, setNewPrivateKey] = useState('')
    const [newPublicKey, setNewPublicKey] = useState('')
    const [newAddress, setNewAddress] = useState('')
    const [creatorAddress, setCreatorAddress] = useState('')

    const { register, handleSubmit, watch, errors } = useForm();
    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            updateFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }


    const onSubmit = data => {
        setValue(data);
    };

    // const onSubmitMint = async (data) => {
    //     console.log('data :>> ', data);
        

    // }

    const encryptPrivateKeyForNFTFile = async () => {
        
        const encData = await encryptData(creatorAddress, newPrivateKey )
        if (encData !== '') {
            setEncryptedPrivateKey(encData)
        }

    };

    const setValue = async value => {
        console.log('value.address-to-encrypt :>> ', value.addressToEncrypt, value.dataToEncrypt);
        setCustomerAddress(value.addressToEncrypt)
        // const encData = await encryptData(value.addressToEncrypt, value.dataToEncrypt || clearData || 'HELLO')
        // if (encData !== '') {
        //     setEncryptedData(encData)
        // }
        console.log('newPublicKey :>> ', newPublicKey);
        console.log('clearData :>> ', clearData);

        const encData = await metamaskEncryptData(value.dataToEncrypt || clearData, newPublicKey)
        if (encData !== '') {
            setEncryptedData(encData)
        }
    };

    const downloadToFile = (content, filename, contentType) => {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });

        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);
    };

    useEffect(async () => {
        const address = await getAccount()
        if(address) {
            setCreatorAddress(address)
        }
        
    }, [getAccount, setCreatorAddress ])

    useEffect(() => {
        if (encryptedData && creatorAddress) {
            async function sendEncryptInfoToIPFS() {
                // downloadToFile(encryptedData, `${customerAddress}.txt`, 'text/plain');
                const added = await client.add(encryptedData)
                setCid(added.path)
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                updateFileUrl(url)
            }

            sendEncryptInfoToIPFS();
        }


    }, [encryptedData, creatorAddress])


    const onFileChange = (event) => {
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsText(file);

        fileReader.onload = (event) => {
            let fileAsText = event.target.result;
            setClearData(fileAsText);
        };
    };

    const getInfoFromIPFS = async () => {
        if (fileUrl) {
            const result = await client.object.get(cid, { timeout: 30000 })
            const string = new TextDecoder().decode(result.Data).slice(0, -3);
            const cuttedString = string.slice(5)
            setTextFromIpfsFIle(cuttedString)
        }
    }

    const generateKeys = () => {
        const newIdentity = getNewAccount()
        setNewPrivateKey(newIdentity.privateKey)
        setNewPublicKey(newIdentity.publicKey)
        setNewAddress(newIdentity.address)
    }
    const getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[stackId];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash] &&
            transactions[txHash].status}`;
    };
    return (
        <div className="App">
            <h1>IPFS Example</h1>
            <section>
                <h2>Encryption private key via owner public key</h2>

                <button onClick={()=>generateKeys()}>Generate keys for encryption a file</button>
                <div>Private, public, address</div>
                <div>pk: {newPrivateKey}</div>
                <div>pubkey: {newPublicKey}</div>
                <div>add: {newAddress}</div>
                <div>Creator address{creatorAddress}</div>

                <button onClick={()=>encryptPrivateKeyForNFTFile()}>Encrypt private key via new owner public key</button>
                <div>Encrypted private key</div>
                <div>{encryptedPrivateKey}</div>
                <br></br>
<h2>Encrypt a file via generated public key for NFT URI </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="u-full-width">
                            <label htmlFor="mURI">Data for encryption</label>
                            <input
                                name="dataToEncrypt"
                                className="u-full-width"
                                placeholder="string data"
                                ref={register({ required: false, maxLength: 8000 })}
                            />
                            {errors.dataToEncrypt && <span>Use a valid input</span>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="u-full-width">
                            <label htmlFor="mURI">Upload</label>
                            <input
                                type="file"
                                name="fileToEncrypt"
                                className="u-full-width"
                                onChange={onFileChange}
                            />
                            {errors.fileToEncrypt && <span>Use a valid input</span>}
                        </div>
                    </div>
                    <input className="button-primary" type="submit" value="Submit" />
                </form>
               {/*  <div>{getTxStatus()}</div> */}
                {/* <UriBlock /> */}
                <div>{encryptedData}</div>

               
                <SetDecrypt
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    encData={encryptedData}
                    encPrivateKey={encryptedPrivateKey}
                />
            </section>
            <input
                type="file"
                onChange={onChange}
            />
            <a href={fileUrl}>{fileUrl}</a>
            <button onClick={() => getInfoFromIPFS()}>Get Info from IPFS</button>
            <div>{textFromIpfsFIle}</div>
            <MintNFT 
            drizzle={drizzle}
            drizzleState={drizzleState}
            ipfsLink={fileUrl}
            encryptedKey={encryptedPrivateKey}
            />
            
        </div>
    );
};

export default UploadIPFS;
