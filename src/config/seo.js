// src/config/seo.js

export const siteConfig = {
  name: "ISMARN Jewels",
  description: "Exquisite handcrafted jewellery carrying your most precious memories through voice and video embedding. Luxury gold, diamond, and gemstone collections.",
  url: process.env.NEXTAUTH_URL || "https://jewellery-ecommerce-iota.vercel.app",
  image: "/images/og-image.jpg",
  author: "ISMARN Jewels",
  email: "ismarn.jewls@gmail.com",
};


export const getPageMetadata = {
  home: {
    title: "Jewellery E-Commerce | Premium Handcrafted Jewellery",
    description: "Explore our exquisite collection of handcrafted jewellery, from modern minimalist designs to timeless bridal pieces.",
    keywords: ["jewellery", "gold", "diamonds", "bridal", "accessories"],
  },
  shop: {
    title: "Shop Our Collections | Jewellery E-Commerce",
    description: "Browse our curated collections of premium jewellery. Find the perfect piece for any occasion.",
    keywords: ["shop", "jewellery", "gold jewellery", "diamond jewellery"],
  },
  product: {
    title: "{name} | Jewellery E-Commerce",
    description: "Discover {name}. {description}",
    keywords: ["jewellery", "{category}", "{type}"],
  },
  login: {
    title: "Login | Jewellery E-Commerce",
    description: "Sign in to your Jewellery E-Commerce account to access your orders and wishlist.",
    keywords: ["login", "sign in", "account"],
  },
  register: {
    title: "Create Account | Jewellery E-Commerce",
    description: "Join our community and enjoy exclusive benefits. Create your account today.",
    keywords: ["register", "sign up", "create account"],
  },
  cart: {
    title: "Shopping Cart | Jewellery E-Commerce",
    description: "View and manage items in your shopping cart.",
    keywords: ["cart", "shopping", "checkout"],
  },
  checkout: {
    title: "Checkout | Jewellery E-Commerce",
    description: "Complete your purchase securely. Fast and easy checkout process.",
    keywords: ["checkout", "payment", "order"],
  },
  about: {
    title: "About Us | Jewellery E-Commerce",
    description: "Learn about our brand story, values, and commitment to quality craftsmanship.",
    keywords: ["about", "brand", "story", "craftsmanship"],
  },
  contact: {
    title: "Contact Us | Jewellery E-Commerce",
    description: "Get in touch with our customer service team. We're here to help.",
    keywords: ["contact", "support", "customer service"],
  },
};

export const generateStructuredData = (type, data = {}) => {
  const baseUrl = siteConfig.url;

  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: siteConfig.description,
      contact: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: siteConfig.email,
      },
      sameAs: [
        "https://www.facebook.com/profile.php?id=61588464684790",
        "https://www.instagram.com/ismarn.jewels?igsh=amkyeTRydW45bHo4/",
        "https://x.com/IsmarnJewls",
      ],
    },
    product: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.name || "",
      description: data.description || "",
      image: data.image || "",
      price: data.price || "",
      priceCurrency: "INR",
      availability: data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.rating || "5",
        reviewCount: data.reviewCount || "0",
      },
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: (data.items || []).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${baseUrl}${item.url}`,
      })),
    },
  };

  return schemas[type] || schemas.organization;
};
