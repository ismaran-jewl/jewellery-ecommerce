#!/usr/bin/env bash
set -e

#################################################
# PROJECT CONFIGURATION
#################################################
PROJECT_NAME="jewellery-ecommerce"
NODE_MIN=18

#################################################
# NODE VERSION CHECK
#################################################
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed"
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt "$NODE_MIN" ]; then
  echo "❌ Node.js $NODE_MIN+ required"
  exit 1
fi

#################################################
# YARN (COREPACK) SETUP
#################################################
corepack enable
corepack prepare yarn@stable --activate

#################################################
# CREATE NEXT.JS PROJECT (NO TYPESCRIPT)
#################################################
yarn create next-app "$PROJECT_NAME" \
  --eslint \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-yarn \
  --skip-install

cd "$PROJECT_NAME"

#################################################
# YARN 4 FIX
#################################################
echo "nodeLinker: node-modules" >> .yarnrc.yml

#################################################
# NEXT.JS CONFIG (JS ONLY)
#################################################
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
};

module.exports = nextConfig;
EOF

#################################################
# PRODUCTION DEPENDENCIES
#################################################
yarn add \
  mongoose \
  mongodb@^6.10.0 \
  next-auth@beta \
  @auth/mongodb-adapter \
  bcryptjs \
  zustand \
  uuid \
  nodemailer@^6.9.0 \
  lucide-react \
  react-icons \
  @radix-ui/react-dialog \
  chart.js \
  react-chartjs-2 \
  @vercel/analytics \
  @vercel/speed-insights \
  class-variance-authority \
  clsx \
  tailwind-merge \
  @fortawesome/fontawesome-free

#################################################
# DEV DEPENDENCIES (NO @types)
#################################################
yarn add -D \
  eslint-plugin-react-hooks \
  @next/eslint-plugin-next

#################################################
# INSTALL ALL DEPENDENCIES
#################################################
yarn install

#################################################
# SHADCN/UI INITIALIZATION (JS MODE)
#################################################
npx shadcn@latest init -d

#################################################
# SHADCN/UI COMPONENTS
#################################################
npx shadcn@latest add button card input avatar dialog tooltip sonner
npx shadcn@latest add dropdown-menu menubar navigation-menu
npx shadcn@latest add select tabs badge separator

#################################################
# FINAL MESSAGE
#################################################
echo ""
echo "✅ Jewellery E-Commerce Setup Complete (NO TypeScript)"
echo "🛍️ JS + Tailwind + Shadcn + Yarn 4"
echo "▶ cd $PROJECT_NAME && yarn dev"
