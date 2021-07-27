import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { decrypt } from "./cypher";
import {  decryptPrivateKey, decryptUriFile } from "./metamask";

const DownloadIPFS = props => {

    const { drizzle, drizzleState, encData } = props;
    const [encryptedInfo, setEncryptedInfo] = useState('');
    const { Coupoken } = drizzleState.contracts;
    const [decryptedPK, setDecryptedPK] = useState('');
    const [decryptedInfo, setDecryptedInfo] = useState('');
    const [decMessage, setDecryptMessage] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();

    useEffect(() => {
        setEncryptedInfo(encData);
    }, [encData]);

    useEffect(() => {
        if (decMessage) {
            async function getDecryptMessage() {
                if (encryptedInfo !== '') {
                    const dm = await decryptPrivateKey(encryptedInfo, '0x4D1E260E63e9331C4552991874dA4FBF4Aa6A3df');
                    console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm)
                    setDecryptedPK(dm)
                }

            }
            getDecryptMessage()

        }
    }, [decMessage]);

    useEffect(() => {
        if (decryptedInfo) {
            async function getDecryptMessage() {
                if (encryptedInfo !== '') {
                    const dm = await decryptUriFile(encryptedInfo, '0x4D1E260E63e9331C4552991874dA4FBF4Aa6A3df');
                    console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm)
                    setDecryptedInfo(dm)
                }

            }
            getDecryptMessage()

        }
    }, [decMessage, decryptedInfo]);

    const onFileChange = (event) => {
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsText(file);

        fileReader.onload = (event) => {
            let fileAsText = event.target.result;
            setEncryptedInfo(fileAsText);
        };
    };



    return (
        <section>
            <h2>Download a file from IPFS</h2>
            <div>{encryptedInfo}</div>
            <div className="row">
                <div className="six columns">
                    <label htmlFor="decrypredData">Encrypted Data</label>
                    <div
                        name="decrypredData"
                        className="u-full-width"

                    >{decryptedInfo}</div>

                </div>
            </div>
            <div className="row">
                <div className="u-full-width">
                    <label htmlFor="mURI">Read the file and decrypt</label>
                    <input
                        type="file"
                        name="fileToDecrypt"
                        className="u-full-width"
                        onChange={onFileChange}
                    />
                    {errors.fileToDecrypt && <span>Use a valid input</span>}
                </div>
            </div>
            <button onClick={() => setDecryptMessage(!decMessage)} >DECRYPT</button>

<h2>Decrypted PK</h2>
<div>{decryptedPK}</div>
<h2>Decrypted file info</h2>
<div>{decryptedInfo}</div>
        </section>
    );
};

export default DownloadIPFS;
