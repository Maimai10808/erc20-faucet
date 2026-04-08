# New Developer Guide

## Goal

This guide explains how a new developer should run, update, and extend this project.

## Prerequisites

Make sure your machine has:

- Node.js 24 or newer recommended
- npm
- a browser wallet such as MetaMask

## First-time setup

Install dependencies in both workspaces:

```bash
cd hardhat
npm install

cd ../web
npm install
```

## How to run the project locally

### 1. Start Hardhat local node

Open one terminal:

```bash
cd hardhat
npx hardhat node
```

### 2. Deploy contracts

Open a second terminal:

```bash
cd hardhat
npx hardhat ignition deploy ignition/modules/TwoTokensTwoFaucets.ts --network localhost
```

This creates an Ignition deployment under `hardhat/ignition/deployments/`.

### 3. Export addresses and ABIs to the frontend

Still in `hardhat/`:

```bash
npm run export:generated
```

This updates:

- `generated/contracts.ts`
- `web/src/contracts/generated.ts`

If export fails, check that deployment output exists first.

### 4. Start the frontend

Open a third terminal:

```bash
cd web
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Wallet setup for local testing

Configure your wallet to use Hardhat localhost:

- Network name: `Hardhat Localhost`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

Import one of the funded test accounts from the Hardhat node output into your wallet.

## How to test the faucet flow

1. Open the homepage.
2. Connect the wallet.
3. Confirm the network shown in the top wallet panel is Hardhat Localhost (`31337`).
4. Claim `Trump Coin`.
5. Confirm the card changes to claimed state.
6. Confirm the balance value refreshes and highlights.
7. Claim `Biden Coin`.
8. Confirm the second card also changes to claimed state.
9. Refresh the page and verify both claim states remain correct.

## Common developer tasks

### Update contracts

If you change Solidity code:

```bash
cd hardhat
npx hardhat compile
```

Then redeploy and re-export generated contract files.

### Update frontend

Frontend code lives mainly in:

- `web/src/app`
- `web/src/components`
- `web/src/hooks`
- `web/src/lib/web3`

### Lint and build

```bash
cd web
npm run lint
npm run build
```

## Important project rules

- Do not edit `generated/contracts.ts` manually.
- Do not edit `web/src/contracts/generated.ts` manually.
- Re-run contract export after every deployment that changes addresses or ABIs.
- Keep the frontend on Hardhat chain `31337` during local development unless you intentionally move to another network.

## Where to read next

- Project overview: [PROJECT_INTRODUCTION.md](/Users/mac/Desktop/Web/BlockchainDemoProjects/erc20-faucet/docs/PROJECT_INTRODUCTION.md)
- Contract export flow: [CONTRACT_EXPORT_TEMPLATE.md](/Users/mac/Desktop/Web/BlockchainDemoProjects/erc20-faucet/docs/CONTRACT_EXPORT_TEMPLATE.md)
