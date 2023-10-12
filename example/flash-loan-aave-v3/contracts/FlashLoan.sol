// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

/**
 * @title FlashLoan
 * @dev A contract that demonstrates how to use Aave's flash loans. This contract can borrow any token from the Aave lending pool, perform custom logic with the borrowed funds, and repay the loan plus interest in a single transaction. 
 */

contract FlashLoan is FlashLoanSimpleReceiverBase {
    address payable public owner; // The owner of this contract, who can withdraw funds.

    /**
     * @dev Constructor function that sets the address provider for the Aave lending pool and the contract owner.
     * @param _addressProvider The address provider for the Aave lending pool.
     */
    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        owner = payable(msg.sender); // Set the contract owner to the creator of this contract.
    }

    /**
     * @dev This function is called after this contract receives a flash loan. It executes custom logic with the borrowed funds and repays the loan plus interest to the Aave lending pool.
     * @param asset The token being borrowed.
     * @param amount The amount of the token being borrowed.
     * @param premium The fee paid to the Aave lending pool.
     * @param initiator The address that initiated the flash loan.
     * @param params Additional parameters for the flash loan.
     * @return true to indicate that the flash loan has been repaid.
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {

        // This function is called by the Aave lending pool contract after this contract receives the flash loan.
        // The asset parameter represents the token being borrowed, amount is the amount borrowed, and premium is the fee paid to the pool.
        // 👇 Your custom logic for the flash loan should be implemented here 👇


                    /** YOUR CUSTOM LOGIC HERE */


        // 👆 Your custom logic for the flash loan should be implemented above here 👆
        // Approve the lending pool contract to pull funds from this contract to pay back the flash loan.
        
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true; // Return true to indicate that the flash loan has been repaid.
    }

    /**
     * @dev Function to request a flash loan for a specified token and amount.
     * receiverAddress The address of this contract, which will receive the flash loan.
     * @param _token The token to be borrowed.
     * @param _amount The amount of the token to be borrowed.
     * params No additional parameters are needed.
     * referralCode No referral code is used.
     */
    function requestFlashLoan(address _token, uint256 _amount) public onlyOwner {
        address receiverAddress = address(this); 
        address asset = _token; 
        uint256 amount = _amount; 
        bytes memory params = "";
        uint16 referralCode = 0; 

        // Call the Aave lending pool contract to initiate the flash loan.
        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }

        /**
     * @dev Get the balance of a specific token in this contract.
     * @param _tokenAddress The address of the token to check the balance of.
     * @return The balance of the specified token in this contract.
     */
    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    /**
     * @dev Withdraw a specific token from this contract to the contract owner's address.
     * @param _tokenAddress The address of the token to withdraw.
     */
    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);                           // Create an instance of the token contract.
        token.transfer(msg.sender, token.balanceOf(address(this)));     // Transfer the token balance to the contract owner.
    }

    /**
     * @dev Modifier to ensure that only the contract owner can call a specific function.
     */
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "You are not the owner!"
        );
        _;
    }

    /**
     * @dev Fallback function to receive ETH payments.
     */
    receive() external payable {}
}

