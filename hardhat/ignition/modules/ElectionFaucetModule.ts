import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DECIMALS = 18n;
const UNIT = 10n ** DECIMALS;

export default buildModule("ElectionFaucetModule", (m) => {
  const deployer = m.getAccount(0);

  const initialSupply = 1_000_000n * UNIT;
  const rewardAmount = 100n * UNIT;
  const initialFundAmount = 100_000n * UNIT;

  const trumpToken = m.contract(
    "MyToken",
    ["Trump Coin", "TRUMP", 18, initialSupply, deployer],
    { id: "TrumpToken" },
  );

  const bidenToken = m.contract(
    "MyToken",
    ["Biden Coin", "BIDEN", 18, initialSupply, deployer],
    { id: "BidenToken" },
  );

  const electionFaucet = m.contract(
    "ElectionFaucet",
    [trumpToken, bidenToken, rewardAmount, deployer],
    { id: "ElectionFaucet" },
  );

  m.call(trumpToken, "approve", [electionFaucet, initialFundAmount], {
    id: "ApproveTrumpFunding",
  });

  m.call(bidenToken, "approve", [electionFaucet, initialFundAmount], {
    id: "ApproveBidenFunding",
  });

  m.call(electionFaucet, "fundTrump", [initialFundAmount], {
    id: "FundTrumpPool",
  });

  m.call(electionFaucet, "fundBiden", [initialFundAmount], {
    id: "FundBidenPool",
  });

  return {
    trumpToken,
    bidenToken,
    electionFaucet,
  };
});
