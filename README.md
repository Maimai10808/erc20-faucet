# ERC20 Faucet Scaffold

Top-level scaffold:

```text
web/        Next.js frontend
hardhat/    Contract workspace
generated/  Generated ABI/types output
docs/       Project docs
```

## Bootstrap commands used

```bash
npx create-next-app@latest web --ts --tailwind --eslint --app --src-dir --import-alias '@/*' --use-npm --yes
cd hardhat && npx hardhat --init
```

## Intended workflow

1. Write contracts and deployments in `hardhat`
2. Export ABI/address artifacts into `generated`
3. Consume them from `web`
4. Keep notes and setup docs in `docs`
