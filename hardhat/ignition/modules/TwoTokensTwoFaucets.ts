import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DECIMALS = 18n;
const UNIT = 10n ** DECIMALS;

export default buildModule("TwoTokensTwoFaucets", (m) => {
  const deployer = m.getAccount(0);

  const trumpToken = m.contract(
    "MyToken",
    ["Trump Coin", "TRUMP", 18, 1_000_000n * UNIT, deployer],
    { id: "TrumpToken" },
  );

  const bidenToken = m.contract(
    "MyToken",
    ["Biden Coin", "BIDEN", 18, 1_000_000n * UNIT, deployer],
    { id: "BidenToken" },
  );

  const trumpFaucet = m.contract("Faucet", [trumpToken, 100n * UNIT], {
    id: "TrumpFaucet",
  });

  const bidenFaucet = m.contract("Faucet", [bidenToken, 100n * UNIT], {
    id: "BidenFaucet",
  });

  m.call(trumpToken, "transfer", [trumpFaucet, 100_000n * UNIT], {
    id: "FundTrumpFaucet",
  });

  m.call(bidenToken, "transfer", [bidenFaucet, 100_000n * UNIT], {
    id: "FundBidenFaucet",
  });

  return {
    trumpToken,
    bidenToken,
    trumpFaucet,
    bidenFaucet,
  };
});
