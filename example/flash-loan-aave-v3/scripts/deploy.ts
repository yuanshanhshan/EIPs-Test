import { ethers } from 'hardhat'

// Contract addresses and other values
const AVA_FUJI_POOL_PROVIDER = '0x220c6A7D868FC38ECB47d5E69b99e9906300286A'
const USDC_ADDRESS = '0x5425890298aed601595a70AB815c96711a31Bc65'
const USDC_DECIMALS = 6
const FLASHLOAN_AMOUNT = ethers.utils.parseUnits('1000', USDC_DECIMALS)

// USDC tranfer function ABI
const USDC_ABI = [
  'function transfer(address to, uint256 value) external returns (bool)',
]

async function main() {
  try {
    console.log('Deploying FlashLoan contract...')
    const FlashLoan = await ethers.getContractFactory('FlashLoan')
    const flashLoan = await FlashLoan.deploy(AVA_FUJI_POOL_PROVIDER)
    await flashLoan.deployed()
    console.log(`FlashLoan contract deployed at: ${flashLoan.address}`)
    console.log(
      `View contract at: https://testnet.snowtrace.io/address/${flashLoan.address}`
    )
    console.log(
      '---------------------------------------------------------------\n'
    )

    // Transfer USDC to the FlashLoan contract
    const erc20 = new ethers.Contract(
      USDC_ADDRESS,
      USDC_ABI,
      ethers.provider.getSigner()
    )
    const amount = ethers.utils.parseUnits('5', USDC_DECIMALS)

    console.log(`Transferring ${amount} USDC to the FlashLoan contract...`)
    const transferErc20 = await erc20.transfer(flashLoan.address, amount)
    console.log(`Transferred ${amount} USDC tokens to the FlashLoan contract`)

    console.log('Waiting for 1 block to verify the transfer...')
    await transferErc20.wait(1) // Wait 1 block for the transaction to be verified to update the balance
    console.log(
      `---------------------------------------------------------------\n`
    )

    // Check USDC balance of the FlashLoan contract
    const usdcBalance = await flashLoan.getBalance(USDC_ADDRESS)
    console.log(
      `USDC balance of the FlashLoan contract is: ${usdcBalance / 1e6} USDC`
    )
    console.log(
      '---------------------------------------------------------------\n'
    )

    // Call flash loan
    console.log(`Requesting a flash loan of ${FLASHLOAN_AMOUNT} USDC...`)
    const flashloanTx = await flashLoan.requestFlashLoan(
      USDC_ADDRESS,
      FLASHLOAN_AMOUNT
    )
    console.log('Flash loan executed!')
    console.log(
      `View transaction at: https://testnet.snowtrace.io/tx/${flashloanTx.hash}`
    )
    await flashloanTx.wait(1) // Wait 1 block for the transaction to be verified to update the balance
    console.log(
      '---------------------------------------------------------------\n'
    )

    // Withdraw remaining USDC
    const remainingUSDC = await flashLoan.getBalance(USDC_ADDRESS)
    console.log(
      `Withdrawing ${remainingUSDC / 1e6} USDC from the FlashLoan contract...`
    )

    const withdrawFunds = await flashLoan.withdraw(USDC_ADDRESS)
    await withdrawFunds.wait(1) // Wait 1 block for the transaction to be verified
    console.log(`Funds sent!`)
    console.log(
      `View transaction at: https://testnet.snowtrace.io/tx/${withdrawFunds.hash}`
    )
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

main()
