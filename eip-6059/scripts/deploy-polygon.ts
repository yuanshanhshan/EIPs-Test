import { NestableTokenMock } from '../typechain-types'
import { ethers } from 'hardhat'

async function deployParentAndChildContract(): Promise<{
  parent: NestableTokenMock
  child: NestableTokenMock
}> {
  const factory = await ethers.getContractFactory('NestableTokenMock')
  const parent = await factory.deploy()
  await parent.deployed()
  const child = await factory.deploy()
  await child.deployed()
  return { parent, child }
}

async function mint(
  contractAddress: string,
  destinationAdd: string
): Promise<string> {
  const factory = await ethers.getContractFactory('NestableTokenMock')
  const res = await factory.attach(contractAddress).mint(destinationAdd, 1)
  console.log('mint res :', res.hash)
  return res.hash
}

;(async () => {
  const res = await ethers.getSigners()
  const owner = res[0]
  const user1 = res[1]
  console.log('测试账号信息：', owner.address, user1.address)
  const { parent, child } = await deployParentAndChildContract()
  console.log('合约地址： ', parent.address, child.address)
  const parentId = 1
  const childId1 = 99
  // 1. parent mint

  await mint(parent.address, owner.address)

  // 2. child nestMint
  const nestRes = await child.nestMint(parent.address, childId1, parentId)
  console.log('nestMint Res : ', nestRes.hash)
  console.log('childId1 的拥有者信息: ', await child.ownerOf(childId1))

  // 获取在pending中的子类：有一个
  console.log(await parent.pendingChildrenOf(parentId))
  // 获取active状态的子类 ： 为空
  console.log('未接受任何子类NFT: ', await parent.childrenOf(parentId))

  // 3. 接受Pending 中的子类NFT
  await child.approve(parent.address, childId1)
  await parent.acceptChild(parentId, 0, child.address, childId1)

  console.log('处于激活的子类NFT: ', await parent.childrenOf(parentId))
})()
