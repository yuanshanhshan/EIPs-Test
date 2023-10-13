import { getContract } from 'viem'
import { abi } from '../../artifacts/contracts/Lock.sol/Lock.json'
import { publicClient } from './client'

// 1. Create contract instance
const contract = getContract({
  address: '0x63c894b806f848503aa23c2f236f7f534201d31f',
  abi: abi,
  publicClient,
})

// 2. Call contract methods, fetch events, listen to events, etc.
async function main() {
  // const result = await contract.read.totalSupply()
  // const logs = await contract.getEvents.Transfer()
  // const unwatch = contract.watchEvent.Transfer(
  //   { from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e' },
  //   {
  //     onLogs(logs) {
  //       console.log(logs)
  //     },
  //   }
  // )

  const unlockTime = await contract.read.unlockTime()
  console.log(`unlockTime: ${unlockTime}`)
}

main()
