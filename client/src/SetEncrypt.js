import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { encrypt, encryptData } from "./cypher";
import SetDecrypt from "./SetDecrypt";

const SetEncrypt = props => {
    const [stackId, setStackID] = useState(null);
    const [encryptedData, setEncryptedData] = useState('');
    const { drizzle, drizzleState } = props;
    const { Coupoken } = drizzleState.contracts;

    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => {
        setValue(data);
    };

    const setValue = async value => {
        console.log('value.address-to-encrypt :>> ', value.addressToEncrypt, value.dataToEncrypt);
        const encData = await encryptData(value.addressToEncrypt, value.dataToEncrypt)
        if (encData !== '') {
            setEncryptedData(encData)
        }

       
    };

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
                            ref={register({ required: true, maxLength: 80 })}
                        />
                        {errors.dataToEncrypt && <span>Use a valid input</span>}
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
              encData={encryptedData}
            />
        </section>
    );
};

export default SetEncrypt;
