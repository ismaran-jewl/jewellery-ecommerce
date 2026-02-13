#!/bin/bash
# Create e-commerce folder structure and empty Next.js page files with 'return null'

# Public assets
dirs=(
  "public/assets/images"
  "public/assets/videos"
  "public/assets/icons"
  "src/app"
  "src/components/common"
  "src/components/layout"
  "src/components/ui"
  "src/components/product"
  "src/components/cart"
  "src/components/checkout"
  "src/components/navigation"
  "src/components/forms"
  "src/components/modals"
  "src/features/cart"
  "src/features/checkout"
  "src/features/product"
  "src/features/user"
  "src/features/order"
  "src/features/wishlist"
  "src/features/reviews"
  "src/features/search"
  "src/features/filters"
  "src/hooks"
  "src/lib"
  "src/utils"
  "src/services/api"
  "src/services/auth"
  "src/services/payment"
  "src/data"
  "src/constants"
  "src/styles"
  "src/middleware"
  "src/types"
  "src/contexts"
  "src/providers"
  "src/config"
  "src/tests"
)

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"
done

# Essential Next.js pages (JSX files)
pages=(
  "src/app/page.jsx" # Home
  "src/app/shop/page.jsx"
  "src/app/product/[id]/page.jsx"
  "src/app/category/[category]/page.jsx"
  "src/app/category/[category]/[subcategory]/page.jsx"
  "src/app/cart/page.jsx"
  "src/app/checkout/page.jsx"
  "src/app/order-confirmation/page.jsx"
  "src/app/wishlist/page.jsx"
  "src/app/account/page.jsx"
  "src/app/account/orders/page.jsx"
  "src/app/account/addresses/page.jsx"
  "src/app/login/page.jsx"
  "src/app/register/page.jsx"
  "src/app/forgot-password/page.jsx"
  "src/app/search/page.jsx"
  "src/app/about/page.jsx"
  "src/app/contact/page.jsx"
  "src/app/faq/page.jsx"
  "src/app/privacy-policy/page.jsx"
  "src/app/terms/page.jsx"
  "src/app/admin/page.jsx"
  "src/app/offers/page.jsx"
  "src/app/gift-cards/page.jsx"
  "src/app/reviews/page.jsx"
  "src/app/404.jsx"
)

for page in "${pages[@]}"; do
  mkdir -p "$(dirname "$page")"
  echo "export default function Page() { return null }" > "$page"
done
