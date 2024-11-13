const { expect } = require("chai");

const NAME = "TokenMaster";
const SYMBOL = "TM";

describe("TokenMaster", () => {
  let tokenMaster;
  let buyer, deployer;

  const OCCASION_NAME = "ETH texas";
  const OCCASION_COST = ethers.utils.parseUnits("1", "ether");
  const OCCASION_MAX_TICKET = 100;
  const OCCASION_DATE = "Apr 27";
  const OCCASION_TIME = "10:00AM CST";
  const OCCASION_LOCATION = "Austin Texas";

  beforeEach(async () => {
    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
    [deployer, buyer] = await ethers.getSigners();
    const transaction = await tokenMaster
      .connect(deployer)
      .list(
        OCCASION_NAME,
        OCCASION_COST,
        OCCASION_MAX_TICKET,
        OCCASION_DATE,
        OCCASION_TIME,
        OCCASION_LOCATION
      );
    await transaction.wait();
  });
  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await tokenMaster.name()).to.be.equal(NAME);
    });
    it("Sets the symbol", async () => {
      expect(await tokenMaster.symbol()).to.be.equal(SYMBOL);
    });
    it("Sets the owner", async () => {
      expect(await tokenMaster.owner()).to.equal(deployer.address);
    });
  });
  describe("Occasions", () => {
    it("Updates the occassions count", async () => {
      expect(await tokenMaster.totalOccasions()).to.equal(1);
    });
    it("Returns occasion attributes", async () => {
      const Occasion = await tokenMaster.getOccasion(1);
      expect(Occasion.id).to.equal(1);
      expect(Occasion.name).to.equal(OCCASION_NAME);
      expect(Occasion.cost).to.equal(OCCASION_COST);
      expect(Occasion.tickets).to.equal(OCCASION_MAX_TICKET);
      expect(Occasion.maxTickets).to.equal(OCCASION_MAX_TICKET);
      expect(Occasion.date).to.equal(OCCASION_DATE);
      expect(Occasion.time).to.equal(OCCASION_TIME);
      expect(Occasion.location).to.equal(OCCASION_LOCATION);
    });
  });
});
