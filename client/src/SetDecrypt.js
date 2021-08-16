import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { decrypt } from "./cypher";
import { decryptPrivateKey, decryptUriFile } from "./metamask";

const SetDecrypt = props => {

    const { drizzle, drizzleState, encData, encPrivateKey } = props;
    const [encryptedInfo, setEncryptedInfo] = useState('');
    const { Coupoken } = drizzleState.contracts;
    const [decryptedPK, setDecryptedPK] = useState('');
    const [decryptedInfo, setDecryptedInfo] = useState('');
    const [decMessage, setDecryptMessage] = useState(false);
    const [decPk, setDecPk] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();

    useEffect(() => {
        setEncryptedInfo(encData);
    }, [encData]);

    useEffect(() => {
        console.log('decPk :>> ', decPk);
        console.log('encPrivateKey :>> ', encPrivateKey);
        if (decPk) {
            async function getDecryptMessage() {
                if (encPrivateKey !== '') {
                    const dm = await decryptPrivateKey(encPrivateKey, drizzleState.accounts[0]);
                    console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm)
                    setDecryptedPK(dm)
                }

            }
            getDecryptMessage()

        }
    }, [decPk, encPrivateKey]);

    useEffect(() => {
        console.log('decryptedPK && encData :>> ', decryptedPK, encData);
        if (decryptedPK && encData) {
            async function getDecryptMessage() { 
                    const dm = await decryptUriFile(encData, decryptedPK);
                    console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm)
                    setDecryptedInfo(dm) 

            }
            getDecryptMessage()

        }
    }, [decryptedPK, encData]);

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
            <button onClick={() => setDecPk(!decPk)} >DECRYPT PK</button>
            <button onClick={() => setDecryptMessage(!decMessage)} >DECRYPT FILE</button>

<h2>Decrypted PK</h2>
<div>{decryptedPK}</div>
<h2>Decrypted file info</h2>
<div>{decryptedInfo}</div>
        </section>
    );
};
export default SetDecrypt;
