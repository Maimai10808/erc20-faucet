# Web3 DApp Scaffold SOP

## Scope

This SOP is for quickly bootstrapping a Web3 DApp workspace with:

- `web` (Next.js frontend)
- `hardhat` (smart contract workspace)
- `generated` (ABI/type/address outputs)
- `docs` (project documentation)

## Standard Flow

1. Create top-level folders.
2. Initialize frontend with Next.js.
3. Initialize contract workspace with Hardhat.
4. Remove default sample/demo files.
5. Keep a clean skeleton with placeholder directories and README docs.

## Commands

Run from project root:

```bash
mkdir -p web hardhat generated docs
npx create-next-app@latest web --ts --tailwind --eslint --app --src-dir --import-alias '@/*' --use-npm --yes
cd hardhat && npx hardhat --init
```

## Post-init Cleanup Rules

### `web`

- Remove nested `.git` created by `create-next-app`.
- Remove non-essential generator metadata files if present.
- Keep `src/app` minimal (`layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`).
- Install baseline Web3 frontend deps:
  - `wagmi`
  - `viem`
  - `@tanstack/react-query`

### `hardhat`

- Remove default example contract/tests/scripts/modules.
- Keep only clean directories:
  - `contracts`
  - `ignition/modules`
  - `scripts`
  - `test`

## Required `web/src` Structure

```text
src/
  app/
  components/
  contracts/
  hooks/
  lib/
  pages/
  services/
  shared/
  utils/
```

## Directory Documentation Rule

Each `web/src/*` directory must include a `README.md` describing what belongs in that folder.

Required docs:

- `web/src/app/README.md`
- `web/src/components/README.md`
- `web/src/contracts/README.md`
- `web/src/hooks/README.md`
- `web/src/lib/README.md`
- `web/src/pages/README.md`
- `web/src/services/README.md`
- `web/src/shared/README.md`
- `web/src/utils/README.md`

## Definition of Done

- Top-level folders exist: `web`, `hardhat`, `generated`, `docs`
- Next.js app is created in `web`
- Hardhat project is created in `hardhat`
- Default demos are removed
- `web/src` standard directories exist
- Each standard directory has a `README.md`
- Frontend lint passes
- Hardhat compile runs without sample contracts

## Execution Policy

When asked to generate this scaffold again, execute this SOP directly with no exploratory redesign unless explicitly requested.
