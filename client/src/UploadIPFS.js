import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { encrypt, encryptData } from "./cypher";
import SetDecrypt from "./SetDecrypt";
import { create } from 'ipfs-http-client'
import all from 'it-all';
const client = create('https://ipfs.infura.io:5001/api/v0')

const UploadIPFS = props => {

    const [fileUrl, updateFileUrl] = useState(``)
    const [stackId, setStackID] = useState(null);
    const [clearData, setClearData] = useState('');
    const [encryptedData, setEncryptedData] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const { drizzle, drizzleState } = props;
    const { Coupoken } = drizzleState.contracts;
    const [cid, setCid] = useState('')
    const [textFromIpfsFIle, setTextFromIpfsFIle] = useState('')

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

    const setValue = async value => {
        console.log('value.address-to-encrypt :>> ', value.addressToEncrypt, value.dataToEncrypt);
        setCustomerAddress(value.addressToEncrypt)
        const encData = await encryptData(value.addressToEncrypt, value.dataToEncrypt || clearData || 'HELLO')
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

    useEffect(() => {
        if (encryptedData && customerAddress) {
            async function sendEncryptInfoToIPFS() {
                // downloadToFile(encryptedData, `${customerAddress}.txt`, 'text/plain');
                const added = await client.add(encryptedData)
                setCid(added.path)
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                updateFileUrl(url)
            }

            sendEncryptInfoToIPFS();
        }


    }, [encryptedData, customerAddress])


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
                <h2>Encrypt Side</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="u-full-width">
                            <label htmlFor="mURI">Public for encryption</label>
                            <input
                                name="addressToEncrypt"
                                className="u-full-width"
                                placeholder="0x4D1E260E63e9331C4552991874dA4FBF4Aa6A3df"
                                ref={register({ required: true, maxLength: 42 })}
                            />
                            {errors.addressToEncrypt && <span>Use a valid input</span>}
                        </div>
                    </div>
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
                <div>{getTxStatus()}</div>
                {/* <UriBlock /> */}
                <div>{encryptedData}</div>
                <SetDecrypt
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    encData={textFromIpfsFIle}
                />
            </section>
            <input
                type="file"
                onChange={onChange}
            />
            <a href={fileUrl}>{fileUrl}</a>
            <button onClick={() => getInfoFromIPFS()}>Get Info from IPFS</button>
            <div>{textFromIpfsFIle}</div>
        </div>
    );
};

export default UploadIPFS;
