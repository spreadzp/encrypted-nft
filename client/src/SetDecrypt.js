import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { decrypt } from "./cypher";
import { decryptMessage } from "./metamask";

const SetDecrypt = props => {

    const { drizzle, drizzleState, encData } = props;
    const [encryptedInfo, setEncryptedInfo] = useState('');
    const { Coupoken } = drizzleState.contracts;
    const [decryptedInfo, setDecryptedInfo] = useState('');
    const [decMessage, setDecryptMessage] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();

    useEffect(() => {
        setEncryptedInfo(encData);
    }, [encData]);

    useEffect( () => {
        if (decMessage) {
            async function getDecryptMessage() {
                if (encryptedInfo !== '') {
                    const dm = await decryptMessage(encryptedInfo, '0x4D1E260E63e9331C4552991874dA4FBF4Aa6A3df');
                    console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm)
                    setDecryptedInfo(dm)
                }

            }
            getDecryptMessage()
            
        }
    }, [decMessage]);




    return (
        <section>
            <h2>Decrypt Side</h2>
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
            <button onClick={() => setDecryptMessage(!decMessage)} >DECRYPT</button>

        </section>
    );
};

export default SetDecrypt;
