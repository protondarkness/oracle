
import { configureChains, createClient } from '@wagmi/core'
import { goerli, mainnet } from '@wagmi/core/chains'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'

// 1. Define constants
const projectId = '4a8965768ed1be8f25412e5cb222a4ea'
const chains = [mainnet, goerli]

// 2. Configure wagmi client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider
})

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiClient, chains)
export const web3Modal = new Web3Modal({ projectId }, ethereumClient)