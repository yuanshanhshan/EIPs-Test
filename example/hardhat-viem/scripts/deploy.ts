import { formatEther, getContract, parseEther } from 'viem'
import hre from 'hardhat'

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const unlockTime = BigInt(currentTimestampInSeconds + 60)

  const lockedAmount = parseEther('0.001')

  const lock = await hre.viem.deployContract('Lock', [unlockTime], {
    value: lockedAmount,
  })

  console.log(
    `Lock with ${formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  )
}

async function withdraw() {
  const LockInstance = await hre.viem.getContractAt(
    'Lock',
    '0x63c894b806f848503aa23c2f236f7f534201d31f'
  )

  await LockInstance.write.withdraw()
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error)
//   process.exitCode = 1
// })

withdraw().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
