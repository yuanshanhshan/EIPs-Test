import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'
import dotenv from 'dotenv'
dotenv.config()
const POLYGON_MUMBAI = process.env.POLYGON_MUMBAI || ''

const transport = http(POLYGON_MUMBAI, {
  batch: true,
})

const client = createPublicClient({
  chain: polygonMumbai,
  transport, // 使用自己的provider
})

async function main() {
  // The below will send a single Batch JSON-RPC HTTP request to the RPC Provider.
  const blockNumber = await client.getBlockNumber()
  console.log(blockNumber)
}

main()
