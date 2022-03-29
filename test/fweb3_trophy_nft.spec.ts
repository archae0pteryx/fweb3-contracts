import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { Contract, ContractFactory, utils } from 'ethers'
import { ethers } from 'hardhat'

interface TrophyJSON {
  name: string
  description: string
  image: string
}

let owner: SignerWithAddress,
  user1: SignerWithAddress,
  user2: SignerWithAddress,
  fweb3TrohpyNFT: Contract,
  fweb3Game: Contract

describe('Fweb3 Trophy NFT', () => {
  beforeEach(async () => {
    ;[owner, user1, user2] = await ethers.getSigners()
    const Fweb3ContractFactory: ContractFactory =
      await ethers.getContractFactory('Fweb3Token')
    const fweb3Token: Contract = await Fweb3ContractFactory.deploy()
    await fweb3Token.deployed()

    const Fweb3GameFactory: ContractFactory = await ethers.getContractFactory(
      'Fweb3Game'
    )
    fweb3Game = await Fweb3GameFactory.deploy(fweb3Token.address)
    await fweb3Game.deployed()

    const Fweb3TrophyNFTFactory: ContractFactory =
      await ethers.getContractFactory('Fweb3TrophyNFT')
    fweb3TrohpyNFT = await Fweb3TrophyNFTFactory.deploy(fweb3Game.address)
    await fweb3TrohpyNFT.deployed()

    await fweb3Token.transfer(user1.address, utils.parseEther('100'))
    await fweb3Token.transfer(fweb3Game.address, utils.parseEther('1000000'))

    await fweb3Game.verifyPlayer(user1.address)
    const user1Fweb3Game: Contract = await fweb3Game.connect(user1)
    await user1Fweb3Game.win()
  })
  it('checks if player is a winner', async () => {
    const notIsWinner: boolean = await fweb3TrohpyNFT.isWinner(user2.address)
    expect(notIsWinner).to.be.false

    const isWinner: boolean = await fweb3TrohpyNFT.isWinner(user1.address)
    expect(isWinner).to.be.true
  })

  it('mints a trophy', async () => {
    const user1Web3TrohpyNFT: Contract = await fweb3TrohpyNFT.connect(user1)
    await user1Web3TrohpyNFT.mint()

    const tokenURI: string = await fweb3TrohpyNFT.tokenURI(1)
    const tokenBase64: string = tokenURI.split(
      'data:application/json;base64,'
    )[1]
    const tokenBuffer: Buffer = Buffer.from(tokenBase64, 'base64')

    const tokenJSON: TrophyJSON = JSON.parse(tokenBuffer.toString())
    expect(tokenJSON.name).to.equal('Fweb3 Gold Trophy NFT')
  })
})
