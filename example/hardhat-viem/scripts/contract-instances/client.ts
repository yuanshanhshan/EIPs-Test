import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'

import dotenv from 'dotenv'
dotenv.config()

const POLYGON_MUMBAI = process.env.POLYGON_MUMBAI || ''

const transport = http(POLYGON_MUMBAI, {
  batch: true,
})

export const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport, // 使用自己的provider
})
