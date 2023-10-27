import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from 'dotenv'
// 多链部署
import 'xdeployer'

dotenv.config()
const POLYGON_MUMBAI = process.env.POLYGON_MUMBAI || ''
const POLYGON_MAINNET_PROVIDER = process.env.POLYGON_MAINNET_PROVIDER || ''
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY || ''
const MATIC_PRIVATE_KEY = process.env.MATIC_PRIVATE_KEY || ''

const BSC_TESTNET_PROVIDER = process.env.BSC_TESTNET_PROVIDER || ''
const BSC_MAINNET_PROVIDER = process.env.BSC_MAINNET_PROVIDER || ''

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      // {
      //   version: '0.8.19',
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200,
      //     },
      //   },
      // },
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      // {
      //   version: '0.5.16',
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200,
      //     },
      //   },
      // },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    polygon_mumbai: {
      url: POLYGON_MUMBAI,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
    polygon: {
      url: POLYGON_MAINNET_PROVIDER,
      accounts: [MATIC_PRIVATE_KEY],
    },
    bsc: {
      url: 'https://bsc-mainnet.core.chainstack.com/16f2aa775511e699df2644bfeb93639c',
      chainId: 56,
      accounts: [MATIC_PRIVATE_KEY],
    },
    bsc_testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [MATIC_PRIVATE_KEY],
    },
    arbitrum: {
      url: 'https://arb-mainnet.g.alchemy.com/v2/JMXn819nI7oD7XsEjKL5K5YEVBXkz-Xr',
      chainId: 42161,
      accounts: [MATIC_PRIVATE_KEY],
    },
  },

  xdeploy: {
    contract: 'Swap',
    constructorArgsPath: '',
    salt: 'SwapTest',
    signer: MUMBAI_PRIVATE_KEY,
    networks: ['bscMain'],
    rpcUrls: [BSC_MAINNET_PROVIDER],
    // networks: ['mumbai', 'bscMain'],
    // rpcUrls: [POLYGON_MUMBAI, BSC_TESTNET_PROVIDER],
  },

  etherscan: {
    apiKey: {
      bsc: process.env.ETHERSCAN_API_KEY_BSC || '',
      polygonMumbai: process.env.ETHERSCAN_API_KEY_POLYGON || '',
    },
  },
  sourcify: {
    enabled: true
  }
}

export default config
