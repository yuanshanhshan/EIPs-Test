import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'
import dotenv from 'dotenv'
dotenv.config()
const POLYGON_MUMBAI = process.env.POLYGON_MUMBAI || ''
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY || ''

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  defaultNetwork: 'hardhat',
  networks: {
    polygon_mumbai: {
      url: POLYGON_MUMBAI,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
}

export default config
