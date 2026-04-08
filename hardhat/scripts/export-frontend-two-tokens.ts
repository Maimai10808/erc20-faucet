import fs from "node:fs";
import path from "node:path";

type ArtifactFile = {
  abi: unknown[];
};

type PrimitiveExportValue = string | number | boolean | null;
type ExportValue = PrimitiveExportValue | unknown[] | Record<string, unknown>;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildExportLine(name: string, value: string): string {
  return `export const ${name} = ${value} as const;`;
}

function serializePrimitive(value: PrimitiveExportValue): string {
  return JSON.stringify(value);
}

function serializeObject(value: ExportValue): string {
  return JSON.stringify(value, null, 2);
}

function generateContractsTs(params: {
  addresses: Record<string, string>;
  abis: Record<string, unknown[]>;
  objects?: Record<string, ExportValue>;
}): string {
  const { addresses, abis, objects = {} } = params;

  const lines: string[] = ["/* Auto-generated file. Do not edit manually. */", ""];

  for (const [name, value] of Object.entries(addresses)) {
    lines.push(buildExportLine(name, JSON.stringify(value)));
  }

  lines.push("");

  for (const [name, value] of Object.entries(abis)) {
    lines.push(buildExportLine(name, serializeObject(value)));
    lines.push("");
  }

  for (const [name, value] of Object.entries(objects)) {
    const serialized =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
        ? serializePrimitive(value)
        : serializeObject(value);

    lines.push(buildExportLine(name, serialized));
    lines.push("");
  }

  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  lines.push("");
  return lines.join("\n");
}

function resolveDeploymentDir(hardhatRoot: string): string {
  const deploymentsRoot = path.join(hardhatRoot, "ignition", "deployments");

  if (!fs.existsSync(deploymentsRoot)) {
    throw new Error(
      "Ignition deployments directory not found. Please deploy first.",
    );
  }

  const explicitDeploymentId = process.env.IGNITION_DEPLOYMENT_ID;
  if (explicitDeploymentId) {
    const explicitDir = path.join(deploymentsRoot, explicitDeploymentId);
    if (!fs.existsSync(explicitDir)) {
      throw new Error(
        `Ignition deployment folder not found: ${explicitDeploymentId}`,
      );
    }
    return explicitDir;
  }

  const defaultDir = path.join(deploymentsRoot, "chain-31337");
  if (fs.existsSync(defaultDir)) {
    return defaultDir;
  }

  const entries = fs
    .readdirSync(deploymentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const fullPath = path.join(deploymentsRoot, entry.name);
      const stat = fs.statSync(fullPath);
      return {
        name: entry.name,
        fullPath,
        mtimeMs: stat.mtimeMs,
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (entries.length === 0) {
    throw new Error(
      "No Ignition deployment folders found. Please deploy first.",
    );
  }

  return entries[0].fullPath;
}

function main() {
  const hardhatRoot = process.cwd();

  const myTokenArtifactPath = path.join(
    hardhatRoot,
    "artifacts",
    "contracts",
    "MyToken.sol",
    "MyToken.json",
  );

  const faucetArtifactPath = path.join(
    hardhatRoot,
    "artifacts",
    "contracts",
    "TokenFaucet.sol",
    "Faucet.json",
  );

  const deploymentDir = resolveDeploymentDir(hardhatRoot);
  const deployedAddressesPath = path.join(
    deploymentDir,
    "deployed_addresses.json",
  );

  if (!fs.existsSync(deployedAddressesPath)) {
    throw new Error(`Missing deployed_addresses.json in ${deploymentDir}`);
  }

  const deployedAddresses = readJson<Record<string, string>>(
    deployedAddressesPath,
  );
  const myTokenArtifact = readJson<ArtifactFile>(myTokenArtifactPath);
  const faucetArtifact = readJson<ArtifactFile>(faucetArtifactPath);

  const trumpTokenAddress = deployedAddresses["TwoTokensTwoFaucets#TrumpToken"];
  const bidenTokenAddress = deployedAddresses["TwoTokensTwoFaucets#BidenToken"];
  const trumpFaucetAddress =
    deployedAddresses["TwoTokensTwoFaucets#TrumpFaucet"];
  const bidenFaucetAddress =
    deployedAddresses["TwoTokensTwoFaucets#BidenFaucet"];

  if (
    !trumpTokenAddress ||
    !bidenTokenAddress ||
    !trumpFaucetAddress ||
    !bidenFaucetAddress
  ) {
    throw new Error(
      [
        "Missing one or more contract addresses in deployed_addresses.json.",
        "Expected keys:",
        "  TwoTokensTwoFaucets#TrumpToken",
        "  TwoTokensTwoFaucets#BidenToken",
        "  TwoTokensTwoFaucets#TrumpFaucet",
        "  TwoTokensTwoFaucets#BidenFaucet",
      ].join("\n"),
    );
  }

  const deploymentId = path.basename(deploymentDir);
  const content = generateContractsTs({
    addresses: {
      trumpTokenAddress,
      bidenTokenAddress,
      trumpFaucetAddress,
      bidenFaucetAddress,
    },
    abis: {
      myTokenAbi: myTokenArtifact.abi,
      faucetAbi: faucetArtifact.abi,
    },
    objects: {
      deploymentMeta: {
        deploymentId,
        deploymentDir,
        exportedAt: new Date().toISOString(),
      },
    },
  });

  const outputFiles = [
    path.resolve(hardhatRoot, "../generated/contracts.ts"),
    path.resolve(hardhatRoot, "../web/src/contracts/generated.ts"),
  ];

  for (const outputFile of outputFiles) {
    ensureDir(path.dirname(outputFile));
    fs.writeFileSync(outputFile, content);
    console.log(`Exported generated contract file to: ${outputFile}`);
  }

  console.log(`Using Ignition deployment: ${deploymentId}`);
}

try {
  main();
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Unknown export error",
  );
  process.exit(1);
}
