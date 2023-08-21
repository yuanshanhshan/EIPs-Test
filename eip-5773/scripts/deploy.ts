import { ethers } from 'hardhat'

import { token } from '../typechain-types/@openzeppelin/contracts'
import { MultiAssetRenderUtils, MultiAssetTokenMock } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const name = 'Test'
const symbol = 'TEST'
const metaURIDefault = 'metaURI'

let token: MultiAssetTokenMock
let renderUtils: MultiAssetRenderUtils
let owner: SignerWithAddress
let Bob: SignerWithAddress
async function deploy() {
  ;[owner, Bob] = await ethers.getSigners()

  const multiassetFactory = await ethers.getContractFactory(
    'MultiAssetTokenMock'
  )

  token = await multiassetFactory.deploy(name, symbol)

  await token.deployed()

  console.log(`Token Address: ${token.address}`)

  const renderFactory = await ethers.getContractFactory('MultiAssetRenderUtils')
  renderUtils = await renderFactory.deploy()
  await renderUtils.deployed()
}

async function addAssets(ids: number[]): Promise<void> {
  ids.forEach(async (resId) => {
    await token.addAssetEntry(resId, metaURIDefault)
  })
}
// add asset to token
async function addAsset() {
  const resId1 = 1
  const resId2 = 2
  const resId3 = 3
  const tokenId = 1
  // Step0 : mint nft 非必须步骤
  await token.mint(owner.address, tokenId)

  // Step1 : add assets
  addAssets([resId1, resId2, resId3])

  // Step2 : add asset to token
  token.addAssetToToken(tokenId, resId1, 0)

  token.addAssetToToken(tokenId, resId2, 0)

  // Step3 : 或者在pending中的资产
  const pendingIds = await token.getPendingAssets(tokenId)
  console.log('Pending ids : ', pendingIds)

  // Step4 : 获取资产信息
  const assetRes = await renderUtils.getAssetsById(
    token.address,
    tokenId,
    pendingIds
  )

  console.log(`assetRes : ${assetRes}`)

  // Step5 : 接受资产
  await token.acceptAsset(tokenId, 0, resId1)

  const pendingIds2 = await token.getPendingAssets(tokenId)

  console.log(`Pending ids :`, pendingIds2)

  // Step5.1 : 用户授权给用户Bob后，Bob，可以代为接受资产

  await token.setApprovalForAllForAssets(Bob.address, true)

  await token.connect(Bob).acceptAsset(tokenId, 0, resId2)
  // 查询接受结果
  const pendingIds3 = await token.getPendingAssets(tokenId)

  console.log(`Pending ids :`, pendingIds3)

  console.log('------------------------------------------')
  console.log(`Overwriting assets`)

  const activeAssets = await token.getActiveAssets(tokenId)
  console.log(`Active Assets: ${activeAssets}}`)
  // 覆盖 resId3
  await token.addAssetToToken(tokenId, resId3, activeAssets[1])

  const pendingIds4 = await token.getPendingAssets(tokenId)
  console.log(`pendingIds3: ${pendingIds4}`)
  const replacesRes = await token.getAssetReplacements(tokenId, pendingIds4[0])
  console.log(`Replacement Res: ${replacesRes}`) // 2 是要被替换的

  await token.acceptAsset(tokenId, 0, resId3)

  const activeIds = await token.getActiveAssets(tokenId)
  console.log(`当前激活的资产ID : ${activeIds}`)
}

;(async () => {
  await deploy()

  await addAsset()
})()
