import contractABI from "./ABI/BuyMeACoffee.json"
import { ethers } from "ethers"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useContractWrite, useContractRead } from "wagmi"
import styles from "../styles/Home.module.css"

export default function Home() {
    const contractAddress = "0x87B9CFe5487d027102532B16657cd410432DBeE7"

    // State variables to signify a loading state
    const { isConnected } = useAccount()

    // Component state
    const [name, setName] = useState('anon')
    const [message, setMessage] = useState('Enjoy your coffee!')
    const [memos, setMemos] = useState([])
    const [loading, setLoading] = useState(true);

    const contractConfig = {
        address: contractAddress,
        abi: contractABI,
    }

    // Buy coffee and send a message
    const { write: buyCoffee } = useContractWrite({
        ...contractConfig,
        functionName: "buyCoffee",
        args: [name,
             message
            ],
        overrides: {
            value: ethers.utils.parseEther("0.001"),
            // value: price,
        },
    })

    const { data } = useContractRead({
        ...contractConfig,
        functionName: "getMemos",
    })

     // Function to call `buyCoffee`
  async function handleBuyCoffee() {
    // Send the create campaign transaction
    const coffeeBuyTxn = buyCoffee()

    // Clear the form fields.
    setName('')
    setMessage('')
  }

    // Function to fetch all memos stored on-chain.
    const getMemos = async () => {
        try {
            if (isConnected) {
                console.log("fetching memos from the blockchain..")
                const memos = data
                console.log("fetched!")
                setMemos(memos)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMemos()

        // Create an event handler function for when someone sends
        // us a new memo.
        const onNewMemo = (from, timestamp, name, message) => {
            console.log("Memo received: ", from, timestamp, name, message)
            setMemos((prevState) => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message,
                    name,
                },
            ])
        }
    })

    return (
        <div className={styles.container}>
            <Head>
                <title>Crypto Coffee</title>
                <meta name="description" content="Tipping site" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Support me by buying cup of coffee</h1>
                <p>
                    <ConnectButton />
                </p>

                {isConnected && (
                    <div>
                        <form>
                            <div className="formgroup">
                                <label className={styles.label}>Name</label>
                                <br />

                                <input
                                    className={styles.inputbox}
                                    id="name"
                                    type="text"
                                    placeholder="anon"
                                    value={name}
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setName('anon')
                                        } else {
                                            setName(e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <br />
                            <div className="formgroup">
                                <label className={styles.label}>Send me a message</label>
                                <br />

                                <textarea
                                    className={styles.textbox}
                                    rows={3}
                                    placeholder="Enjoy your coffee!"
                                    type="text"
                                    value={message}
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setMessage('Enjoy your coffee!')
                                        } else {
                                            setMessage(e.target.value)
                                        }
                                    }}
                                ></textarea>
                            </div>
                            <p>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() => {
                                        handleBuyCoffee()
                                    }}
                                ><span>  Send 1 Coffee for 0.001ETH  </span>
                                    
                                </button>
                            </p>
                        </form>
                    </div>
                    
                )}
            </main>

            {isConnected && <h1>Memos received</h1>}
            {isConnected &&
                memos.filter((memo, idx) => idx > memos.length - 3).map((memo, idx) => {
                    return (
                        <div
                            key={idx}
                            style={{
                                border: "2px solid",
                                "border-radius": "5px",
                                padding: "5px",
                                margin: "5px",
                            }}
                        >
                            <p style={{ "font-weight": "bold" }}>"{memo.message}"</p>
                            <p>
                                From: {memo.name} at {memo.timestamp.toString()}
                            </p>
                        </div>
                    )
                })}

            <footer className={styles.footer}>
                <div>
                    <a
                        href="https://github.com/AnastasiaMenshikova"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Created with ♥ by me
                    </a>
                </div>
            </footer>
        </div>
    )
}