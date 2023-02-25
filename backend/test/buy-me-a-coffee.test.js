const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BuyMeACoffee Unit Tests", function () {
          let buyMeACoffee, BuyMeACoffeeContract
          const donation = ethers.utils.parseEther("0.01")

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]

              await deployments.fixture(["all"])

              BuyMeACoffeeContract = await ethers.getContractFactory("BuyMeACoffee")
              buyMeACoffee = await BuyMeACoffeeContract.deploy()
          })

          describe("buyCoffee()", function () {
              it("can create new memo and emits an event", async () => {
                  const tx = await buyMeACoffee
                      .connect(user)
                      .buyCoffee("Test", "Test", { value: donation })
                  expect(tx).to.emit(buyMeACoffee, "NewMemo")
              })
              it("can't create a new memo without donation", async () => {
                  const tx = buyMeACoffee.connect(user).buyCoffee("Test", "Test")
                  await expect(tx).to.be.revertedWith("can't buy coffee for free!")
              })
          })
          describe("withdrawTips()", () => {
              beforeEach(async () => {
                  await buyMeACoffee.connect(user).buyCoffee("Test", "Test", { value: donation })
              })
              it("can withdraw tips", async () => {
                  const tx = await buyMeACoffee.connect(deployer).withdrawTips()
                  const endingBuyMeACoffeeBalance = await buyMeACoffee.provider.getBalance(
                      buyMeACoffee.address
                  )
                  assert.equal(endingBuyMeACoffeeBalance, 0)
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const buyMeACoffeeConnectedContract = await buyMeACoffee.connect(accounts[1])
                  await expect(buyMeACoffeeConnectedContract.withdrawTips()).to.be.revertedWith(
                      "Not owner of the contract"
                  )
              })
          })
      })
