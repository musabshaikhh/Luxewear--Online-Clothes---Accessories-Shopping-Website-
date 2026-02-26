// ================= SHOP ITEMS DATA =================
// This file contains all product data for the shop

const shopItems = {
  men: [
    {
      id: 'men-1',
      name: 'Classic Cotton T-Shirt',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=464&auto=format&fit=crop',
      description: 'Premium classic cotton t-shirt made with 100% high-quality cotton. Perfect for everyday wear with a comfortable fit and durable fabric.',
      category: 'T-Shirts & Tees',
      rating: 4.5,
      reviews: 12
    },
    {
      id: 'men-2',
      name: 'Slim Fit Denim Jacket',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=464&auto=format&fit=crop',
      description: 'Classic denim jacket with a slim fit design. Made from premium denim with reinforced stitching for durability and long-lasting wear.',
      category: 'Jackets & Coats',
      rating: 4.8,
      reviews: 24
    },
    {
      id: 'men-3',
      name: 'Oxford Button-Down Shirt',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=464&auto=format&fit=crop',
      description: 'Classic Oxford button-down shirt with timeless design. Premium cotton fabric offers comfort and breathability for all-day wear.',
      category: 'Shirts',
      rating: 4.6,
      reviews: 18
    },
    {
      id: 'men-4',
      name: 'Casual Blazer',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=464&auto=format&fit=crop',
      description: 'Sophisticated casual blazer perfect for business-casual settings. Crafted from premium wool blend with expert tailoring.',
      category: 'Formal Wear',
      rating: 4.7,
      reviews: 15
    },
    {
      id: 'men-5',
      name: 'Premium Polo Shirt',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=464&auto=format&fit=crop',
      description: 'Premium polo shirt with refined craftsmanship. Features moisture-wicking fabric and a modern fit for everyday elegance.',
      category: 'Casual',
      rating: 4.4,
      reviews: 9
    },
    {
      id: 'men-6',
      name: 'Urban Streetwear Hoodie',
      price: 64.99,
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=464&auto=format&fit=crop',
      description: 'Trendy urban hoodie combining style and comfort. Made from soft cotton blend with modern streetwear aesthetics.',
      category: 'Streetwear',
      rating: 4.5,
      reviews: 21
    }
  ],
  women: [
    {
      id: 'women-1',
      name: 'Elegant Evening Dress',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1595777707802-221b42c0bbb2?q=80&w=464&auto=format&fit=crop',
      description: 'Stunning evening dress perfect for special occasions. Made from premium silk with elegant draping and sophisticated design.',
      category: 'Dresses',
      rating: 4.9,
      reviews: 28
    },
    {
      id: 'women-2',
      name: 'Casual Linen Blouse',
      price: 54.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=464&auto=format&fit=crop',
      description: 'Breathable linen blouse perfect for warm weather. Features a relaxed fit and timeless style for everyday wear.',
      category: 'Blouses',
      rating: 4.3,
      reviews: 14
    },
    {
      id: 'women-3',
      name: 'Premium Leather Jacket',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=464&auto=format&fit=crop',
      description: 'Classic leather jacket with modern edge. Crafted from genuine leather with quality stitching and timeless appeal.',
      category: 'Jackets & Coats',
      rating: 4.8,
      reviews: 32
    },
    {
      id: 'women-4',
      name: 'Flowy Midi Skirt',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1606664515524-2ddc6c603615?q=80&w=464&auto=format&fit=crop',
      description: 'Elegant midi skirt with flowing fabric. Perfect for creating versatile looks from casual to formal occasions.',
      category: 'Skirts',
      rating: 4.5,
      reviews: 11
    },
    {
      id: 'women-5',
      name: 'Fitted Sweater',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=464&auto=format&fit=crop',
      description: 'Cozy fitted sweater made from premium wool blend. Offers warmth and style for layering or standalone wear.',
      category: 'Sweaters',
      rating: 4.6,
      reviews: 19
    },
    {
      id: 'women-6',
      name: 'Chic Blazer',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=464&auto=format&fit=crop',
      description: 'Modern blazer with tailored fit. Perfect for professional settings and business-casual environments.',
      category: 'Formal Wear',
      rating: 4.7,
      reviews: 22
    }
  ],
  accessories: [
    {
      id: 'acc-1',
      name: 'Premium Leather Belt',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=464&auto=format&fit=crop',
      description: 'Classic leather belt with quality buckle. Versatile accessory that complements any outfit.',
      category: 'Belts',
      rating: 4.4,
      reviews: 8
    },
    {
      id: 'acc-2',
      name: 'Silk Scarf',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=435&auto=format&fit=crop',
      description: 'Luxurious silk scarf with vibrant colors. Perfect for adding elegance to any ensemble.',
      category: 'Scarves',
      rating: 4.6,
      reviews: 13
    },
    {
      id: 'acc-3',
      name: 'Designer Sunglasses',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=464&auto=format&fit=crop',
      description: 'Stylish designer sunglasses with UV protection. Combines fashion and function for outdoor wear.',
      category: 'Eyewear',
      rating: 4.7,
      reviews: 26
    },
    {
      id: 'acc-4',
      name: 'Leather Crossbody Bag',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=464&auto=format&fit=crop',
      description: 'Elegant crossbody bag made from genuine leather. Spacious and stylish for everyday use.',
      category: 'Bags',
      rating: 4.8,
      reviews: 31
    },
    {
      id: 'acc-5',
      name: 'Wool Beanie',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1529308995801-23a08016b735?q=80&w=464&auto=format&fit=crop',
      description: 'Warm wool beanie perfect for cold weather. Available in multiple colors to match your style.',
      category: 'Hats',
      rating: 4.3,
      reviews: 7
    },
    {
      id: 'acc-6',
      name: 'Stainless Steel Watch',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=464&auto=format&fit=crop',
      description: 'Elegant stainless steel watch with precision movement. Timeless accessory for any occasion.',
      category: 'Watches',
      rating: 4.9,
      reviews: 35
    }
  ]
};

// Function to get all items from a category
function getShopItems(category) {
  return shopItems[category] || [];
}

// Function to get a single item by ID
function getShopItemById(id) {
  for (const category in shopItems) {
    const item = shopItems[category].find(item => item.id === id);
    if (item) return item;
  }
  return null;
}

// Function to search items across all categories
function searchShopItems(query) {
  const results = [];
  const lowerQuery = query.toLowerCase();

  for (const category in shopItems) {
    shopItems[category].forEach(item => {
      if (
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
      ) {
        results.push(item);
      }
    });
  }

  return results;
}

// Function to filter items by price range
function filterShopItemsByPrice(category, minPrice, maxPrice) {
  const items = getShopItems(category);
  return items.filter(item => item.price >= minPrice && item.price <= maxPrice);
}

// Function to sort items
function sortShopItems(items, sortBy = 'name') {
  const sorted = [...items];

  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

export {
  shopItems,
  getShopItems,
  getShopItemById,
  searchShopItems,
  filterShopItemsByPrice,
  sortShopItems
};
