import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract, ContractFactory, ContractReceipt, utils } from 'ethers'
import { ethers } from 'hardhat'

describe('Fweb3 game contract', async () => {
  let fweb3Game: Contract,
    user1Fweb3Token: Contract,
    user1Fweb3Game: Contract, // has tokens
    user2Fweb3Game: Contract, // no tokens
    fweb3Token: Contract,
    owner: SignerWithAddress,
    user1: SignerWithAddress,
    user1Address: string,
    user2: SignerWithAddress,
    user2Address: string,
    judgeUser: SignerWithAddress,
    judgeAddress: string

  beforeEach(async () => {
    ;[owner, user1, user2, judgeUser] = await ethers.getSigners()
    user1Address = user1.address
    user2Address = user2.address
    judgeAddress = judgeUser.address

    const Fweb3TokenFactory: ContractFactory = await ethers.getContractFactory(
      'Fweb3Token'
    )
    fweb3Token = await Fweb3TokenFactory.deploy()
    await fweb3Token.deployed()

    // give user1 300 tokens
    await fweb3Token.transfer(user1Address, utils.parseEther('300'))
    user1Fweb3Token = await fweb3Token.connect(user1)

    const Fweb3GameFactory: ContractFactory = await ethers.getContractFactory(
      'Fweb3Game'
    )
    fweb3Game = await Fweb3GameFactory.deploy(fweb3Token.address)
    await fweb3Game.deployed()

    // give the game contract tokens for winners
    await fweb3Token.transfer(fweb3Game.address, utils.parseEther('1000000'))

    user1Fweb3Game = await fweb3Game.connect(user1)
    user2Fweb3Game = await fweb3Game.connect(user2)
  })
  it('checks if an account has > 100 tokens', async () => {
    const hasEnoughTokens: boolean = await fweb3Game.hasTokens(user1Address)
    const notEnoughTokens: boolean = await fweb3Game.hasTokens(user2.address)
    expect(hasEnoughTokens).to.equal(true)
    expect(notEnoughTokens).be.false
  })

  it('errors if player seeks verification without enough tokens', async () => {
    let error: any
    const user2Fweb3Game: Contract = await fweb3Game.connect(user2)
    try {
      await user2Fweb3Game.seekVerification()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Not enough tokens')).be.true
  })
  it('allows only owner to set a judge', async () => {
    let error: any
    await fweb3Game.addJudge(judgeAddress)
    const userJudgeCheck: boolean = await fweb3Game.isJudge(judgeAddress)
    expect(userJudgeCheck).be.true

    try {
      await user1Fweb3Game.addJudge(judgeAddress)
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Ownable: caller is not the owner')).be.true
  })
  it('lets allowed player to seek verification', async () => {
    const tx: Contract = await user1Fweb3Game.seekVerification()
    const receipt: ContractReceipt = await tx.wait()
    expect(receipt?.events?.[0].event).to.equal('PlayerSeeksVerification')

    const playerDetails: Contract = await fweb3Game.getPlayer(user1Address)
    expect(playerDetails.isSeekingVerification).be.true
  })

  it('only judges or owner can check judges', async () => {
    await fweb3Game.addJudge(judgeAddress)
    const notJudge: boolean = await fweb3Game.isJudge(user1Address)
    const isJudge: boolean = await fweb3Game.isJudge(judgeAddress)
    expect(notJudge).be.false
    expect(isJudge).be.true

    const judgeAccountGame: Contract = await fweb3Game.connect(judgeUser)
    const judgeChecksIsJudge: boolean = await judgeAccountGame.isJudge(
      judgeAddress
    )
    expect(judgeChecksIsJudge).be.true
  })

  it('allows owner remove a judge', async () => {
    await fweb3Game.addJudge(judgeAddress)
    const isJudge: boolean = await fweb3Game.isJudge(judgeAddress)
    expect(isJudge).be.true

    await fweb3Game.removeJudge(judgeAddress)
    const isJudgeAfterRemove: boolean = await fweb3Game.isJudge(judgeAddress)
    expect(isJudgeAfterRemove).be.false

    let error: any
    try {
      await user1Fweb3Game.removeJudge(judgeAddress)
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Ownable: caller is not the owner')).be.true
  })

  it('verifys a player to win', async () => {
    const tx: Contract = await user1Fweb3Game.seekVerification()
    const receipt: ContractReceipt = await tx.wait()
    const playerDetails: Contract = await fweb3Game.getPlayer(user1Address)
    expect(playerDetails.isSeekingVerification).be.true
    expect(receipt?.events?.[0].event).to.equal('PlayerSeeksVerification')

    const verifyTX: Contract = await fweb3Game.verifyPlayer(user1Address)
    const verifyReceipt: ContractReceipt = await verifyTX.wait()
    const playerDetailsAfterVerify: Contract = await fweb3Game.getPlayer(
      user1Address
    )
    expect(playerDetailsAfterVerify.isSeekingVerification).be.false
    expect(playerDetailsAfterVerify.verifiedToWin).be.true
    expect(verifyReceipt?.events?.[0].event).to.equal('PlayerVerifiedToWin')
  })
  it('wins the game', async () => {
    await fweb3Game.verifyPlayer(user1Address)
    const tx: Contract = await user1Fweb3Game.win()
    const receipt: ContractReceipt = await tx.wait()
    const player: Contract = await fweb3Game.getPlayer(user1Address)
    expect(player.hasWon).be.true
    expect(receipt?.events?.[1].event).to.equal('PlayerWon')
  })
  it('wont win if not enough tokens', async () => {
    let error: any
    try {
      await user2Fweb3Game.win()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Not enough tokens')).be.true
  })
  it('wont win if hasnt been verified', async () => {
    let error: any
    try {
      await user1Fweb3Game.win()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Not verified by a judge')).be.true
  })
})
