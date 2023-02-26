import "@rainbow-me/rainbowkit/styles.css"
import "../styles/globals.css"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { infuraProvider } from "wagmi/providers/infura"
import { publicProvider } from "wagmi/providers/public"
import { goerli } from "wagmi/chains"

const { chains, provider } = configureChains(
    [goerli],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_GOERLI_API_KEY }),
        infuraProvider({ apiKey: process.env.INFURA_GOERLI_API_KEY }),
        publicProvider(),
    ]
)

const { connectors } = getDefaultWallets({
    appName: 'Crypto Coffee',
    chains,
  });

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

function MyApp({ Component, pageProps }) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default MyApp
