import { createPublicClient, http } from 'viem'
import { mainnet, polygonMumbai } from 'viem/chains'
import dotenv from 'dotenv'
dotenv.config()
const POLYGON_MUMBAI = process.env.POLYGON_MUMBAI || ''

const transport = http(POLYGON_MUMBAI, {
  batch: true,
})

const client = createPublicClient({
  chain: polygonMumbai,
  transport: http(),
})

async function main() {
  // The below will send a single Batch JSON-RPC HTTP request to the RPC Provider.
  const [blockNumber, balance, ensName] = await Promise.all([
    client.getBlockNumber(),
    client.getBalance({
      address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    }),
    client.getEnsName({
      address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    }),
  ])
}

main()
