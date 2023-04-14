const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { errors } = require("ethers");
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Carify", function () {
  let deployer, user, user2
  let carify

  const NAME = "Carify"
  const SYMBOL = "PASS"
  const AMOUNT = tokens(0.01)
  const spots = 100

  beforeEach(async () => {
    // Setup accounts
    [deployer, user, user2] = await ethers.getSigners()

    // Deploy contract
    const Carify = await ethers.getContractFactory("Carify")
    carify = await Carify.deploy(NAME, SYMBOL, spots, AMOUNT)

  })

  describe("Deployment", function () {
    it("1. Sets the name", async () => {
      const result = await carify.name()
      expect(result).to.equal(NAME)
    })

    it("2. Sets the symbol and owner", async () => {
      const result = await carify.symbol()
      expect(result).to.equal(SYMBOL)

      const result2 = await carify.owner()
      expect(result2).to.equal(deployer.address)
    })

    it("3. Sets the price", async () => {
      const result = await carify.price()
      expect(result).to.equal(AMOUNT)
    })

    it('4. Returns total spots', async () => {
      const result = await carify.maxSpots()
      expect(result).to.be.equal(spots)
    })
  })

  describe("Pass Holders", () => {

    var date = new Date(new Date().setDate(new Date().getDate() + 30));

    beforeEach(async () => {
      const transaction = await carify.connect(user).buyPass("CRJB976", { value: AMOUNT })
      await transaction.wait()
    })

    it('1. Returns total passHolders', async () => {
      const result = await carify._tokenIdCounter()
      expect(result).to.be.equal(1)
    })

    it('2. Returns Pass Holder info', async () => {
      const pass = await carify.getPass("CRJB976")
      expect(pass.id).to.be.equal(0)
      expect(pass.licensePlate).to.be.equal('CRJB976')
      // expect(pass.expirationDate).to.be.equal(date.getTime)
      expect(pass.isOwned).to.be.equal(true)
    })

    it('3. Checks if pass is owned', async () => {
      const result = await carify.isOwned("CRJB976")
      expect(result).to.equal(true)
    })

    it('4. Checks if pass is valid', async () => {
      const result = await carify.isPassValid("CRJB976")
      expect(result).to.equal(true)
    })

    it('5. Checks if Parking Lot is full', async () => {
      const result = await carify.isFull()
      expect(result).to.equal(false)

    })

    it("6. Renewing pass", async () => {
      const result = await carify.renew("CRJB976", { value: AMOUNT })
      await result.wait()
    })

    it("7. Canceling pass by owner of token", async () => {
      const buy = await carify.connect(user).buyPass("CRJB977", { value: AMOUNT })
      const pass = await carify.getPass("CRJB976")

      // Cancel the pass
      const result = await carify.connect(user).cancelPass("CRJB976", pass.id);
      const passExists = await carify.isOwned("CRJB976");
      expect(passExists).to.be.false;

    })
  })

  describe("Transfering Ownership", () => {

    beforeEach(async () => {
      const transaction = await carify.connect(user).buyPass("CRJB976", { value: AMOUNT })
      await transaction.wait()

    })

    it("1. Transfers pass to different owner", async () => {
      const pass = await carify.getPass("CRJB976");
      await carify.connect(user).transferPass(user2.address, pass.id)

      expect(await carify.ownerOf(pass.id)).to.equal(user2.address);
    })
  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      const transaction = await carify.connect(user).buyPass("CRJB976", { value: AMOUNT })
      await transaction.wait()

      const result = await carify.connect(user).renew("CRJB976", { value: AMOUNT })
      await result.wait()

      balanceBefore = await ethers.provider.getBalance(deployer.address)

    })

    it("1. Getting balance of contract", async () => {
      const balance = await ethers.provider.getBalance(carify.address);
      let finalBalance = balance
      console.log(`${finalBalance} ETH`)

    })

    it('2. Updates the owner balance', async () => {

      transaction = await carify.connect(deployer).withdraw()
      await transaction.wait()

      const balanceAfter = await ethers.provider.getBalance(deployer.address)

      let finalBalance = balanceAfter
      console.log(`${finalBalance} ETH`)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('3. Updates the contract balance', async () => {
      transaction = await carify.connect(deployer).withdraw()
      await transaction.wait()

      const result = await ethers.provider.getBalance(carify.address)
      let finalBalance = result
      console.log(`${finalBalance} ETH`)
      expect(result).to.equal(0)
    })
  })
})