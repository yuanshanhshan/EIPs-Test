import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'

import dotenv from 'dotenv'

dotenv.config()

const FUJI_CHAINSTACK = process.env.FUJI_CHAINSTACK || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

console.log(process.env.PRIVATE_KEY)
const config: HardhatUserConfig = {
  solidity: '0.8.10',
  networks: {
    fuji: {
      url: FUJI_CHAINSTACK,
      accounts: [PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: {
      avalancheFujiTestnet: 'YQKCJAKFQHBGPINAAYMKF4EB7W6P7HXZK8',
    },
  },
}

export default config
