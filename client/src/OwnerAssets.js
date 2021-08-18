import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { decrypt } from "./cypher";
import { Table } from 'react-bootstrap';
import { decryptPrivateKey, decryptUriFile } from "./metamask";
import { create } from 'ipfs-http-client'
const client = create('https://ipfs.infura.io:5001/api/v0')

const OwnerAssets = props => {

    const { drizzle, drizzleState, encData, encPrivateKey } = props;
    const [encryptedInfo, setEncryptedInfo] = useState('');
    const { Coupoken } = drizzleState.contracts;
    const [decryptedPK, setDecryptedPK] = useState('');
    const [decryptedInfo, setDecryptedInfo] = useState('');
    const [decMessage, setDecryptMessage] = useState(false);
    const [countTokens, setCountTokens] = useState(0);
    const [countSellers, setCountSellers] = useState([]);
    const [sellerSoldAmounts, setSellerSoldAmounts] = useState([]);
    const [textFromIpfsFIle, setTextFromIpfsFIle] = useState('')
    const [decPk, setDecPk] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();
    const contract = drizzle.contracts.EncNft;
    const contractMarket = drizzle.contracts.MarketPlace;

    useEffect(() => {
        setEncryptedInfo(encData);
    }, [encData]);

    useEffect(() => {
        async function countOfTokens() {
            const result = await contract.methods
                .getIdsByAddress(drizzleState.accounts[0])
                .call({ from: drizzleState.accounts[0] });
            console.log('result   ', result);
            if (result && result.length) {

                Promise.all(
                    result.map(async (id) => {
                        const soldBalance = await contractMarket.methods
                            .getOwnerInfo(id, drizzleState.accounts[0])
                            .call({ from: drizzleState.accounts[0] });

                        const currentOwnerInfo = await contract.methods.getTokenInfoLastOwner(id).call({ from: drizzleState.accounts[0] });
                        console.log(id, "🚀 ~ file: OwnerAssets.js ~ line 42 ~ result.map ~  currentOwnerInfo", currentOwnerInfo.encData, currentOwnerInfo.owner)

                        const uriInfo = await contract.methods.tokenURI(id).call({ from: drizzleState.accounts[0] });

                        const parsedUri = JSON.parse(uriInfo)
                        console.log("🚀 ~ file: OwnerAssets.js ~ line 48 ~ result.map ~ parsedUri", parsedUri)
                        setSellerSoldAmounts(sellerSoldAmounts => [...sellerSoldAmounts, { idToken: id, balance: soldBalance, currentOwner: currentOwnerInfo.owner, encPrivateKey: currentOwnerInfo.encData, ...parsedUri }])
                    })
                )
            }
            console.log('sellerSoldAmounts :>> ', sellerSoldAmounts);

        }
        countOfTokens()
    }, [])

    const getInfoFromIPFS = async (cid) => {
        const result = await client.object.get(cid, { timeout: 30000 })
        const string = new TextDecoder().decode(result.Data).slice(0, -3);
        const cuttedString = string.slice(5)
        console.log("🚀 ~ file: OwnerAssets.js ~ line 66 ~ getInfoFromIPFS ~ cuttedString", cuttedString)
        return cuttedString
    }

    const withdrawSum = async (idToken) => {

        const resultWithdraw = await contractMarket.methods.sellerWithdrawSum(idToken).send({
            from: drizzleState.accounts[0],
            gasPrice: 5 * 10 ** 10, gasLimit: 400000
        })
        console.log("🚀 ~ file: OwnerAssets.js ~ line 57 ~ result ~ result", resultWithdraw)
    };

    const decryptInfo = async (token) => {
        console.log("🚀 ~ file: OwnerAssets.js ~ line 71 ~ decryptInfo ~ token", token)
        const dm = await decryptPrivateKey(token.encPrivateKey, drizzleState.accounts[0]);
        console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm)
        if (dm) {
            console.log('token.image.slice(28) :>> ', token.image.slice(28));
            const cutTextFromIpfsFIle = await getInfoFromIPFS(token.image.slice(28))
            console.log("🚀 ~ file: OwnerAssets.js ~ line 86 ~ decryptInfo ~ cutTextFromIpfsFIle", cutTextFromIpfsFIle)
            if (cutTextFromIpfsFIle) {
                const dm1 = await decryptUriFile(cutTextFromIpfsFIle, dm);
                console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm1)
                setDecryptedInfo(dm1)
            }
        }

    }

    const compareAddresses = (add1, add2) => {
        console.log('add1 === add2 :>> ', add1, add2);
        const res = add1 === add2
        console.log("🚀 ~ file:  OwnerAssets.js ~ line 68 ~ compareAddresses ~ res", res)
        return res
    }

    return (
        <section>
            <h2>Your assets</h2>
            <h3>Sold tokens </h3>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID NFT</th>
                        <th>Sum</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sellerSoldAmounts.map((token, i) =>
                    (<tr key={i}>
                        <td>{token.idToken}</td>
                        <td>{token.balance}</td>
                        <td>{token.balance > 0 ? <button onClick={() => withdrawSum(token.idToken)}>Withdraw</button> ?
                            compareAddresses(token.currentOwner, drizzleState.accounts[0]) :
                            'You sold the token' :
                            <button onClick={() => decryptInfo(token)}>Decrypt the file to see it </button>
                        }</td>
                    </tr>)
                    )
                    }

                </tbody>
            </Table>

            <div>Decrypted: {decryptedInfo}</div>
        </section>
    );
};
export default OwnerAssets;
