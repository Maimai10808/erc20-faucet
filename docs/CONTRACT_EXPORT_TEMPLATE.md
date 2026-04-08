# Contract Export Template

## Goal

After deployment, write one deployment manifest and generate a reusable frontend contract file under `generated/`.

## Reusable functions

- `hardhat/utils/deployment.ts`
  - `saveDeploymentManifest(...)`
  - `loadDeploymentManifest(...)`
- `hardhat/utils/export-generated.ts`
  - `writeGeneratedContractsFile(...)`

## Recommended flow

1. Save addresses to a deployment manifest in `hardhat/deployments/`
2. Call `writeGeneratedContractsFile(...)`
3. Output generated TypeScript to `generated/contracts.ts`

## Current project script

```bash
cd hardhat
npm run export:generated
```

## What the export script currently writes

- token addresses
- faucet addresses
- token ABI
- faucet ABI
- deployment metadata

## Current output target

`generated/contracts.ts`
