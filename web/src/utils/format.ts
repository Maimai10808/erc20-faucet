import { formatUnits, type Address } from "viem";

export function shortenAddress(address?: Address) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenAmount(
  value?: bigint,
  decimals = 18,
  maximumFractionDigits = 2,
) {
  if (value === undefined) return "--";

  const numeric = Number(formatUnits(value, decimals));
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(numeric);
}
