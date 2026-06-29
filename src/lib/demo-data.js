
export const DEMO_CAFES = [
  {
    slug: 'toko-kopi-tuku-cipete',
    name: 'Toko Kopi Tuku Cipete',
    address: 'Jl. Cipete Raya No.7, Cipete Sel., Jakarta Selatan',
    area: { name: 'Jakarta Selatan', slug: 'jakarta-selatan' },
    latitude: -6.2626,
    longitude: 106.7980,
    rating: 4.8,
    total_reviews: 3200,
    price_level: '$',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    description: 'Pelopor Kopi Susu Tetangga yang legendaris.'
  },
  {
    slug: 'giyanti-coffee-roastery',
    name: 'Giyanti Coffee Roastery',
    address: 'Jl. Surabaya No.20, Menteng, Jakarta Pusat',
    area: { name: 'Jakarta Pusat', slug: 'jakarta-pusat' },
    latitude: -6.2023,
    longitude: 106.8402,
    rating: 4.7,
    total_reviews: 1850,
    price_level: '$$$',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
    description: 'Salah satu roastery terbaik di Jakarta.'
  },
  {
    slug: 'anomali-coffee-menteng',
    name: 'Anomali Coffee Menteng',
    address: 'Jl. Teuku Cik Ditiro No.52, Menteng, Jakarta Pusat',
    area: { name: 'Jakarta Pusat', slug: 'jakarta-pusat' },
    latitude: -6.1958,
    longitude: 106.8346,
    rating: 4.6,
    total_reviews: 1250,
    price_level: '$$',
    thumbnail: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&h=400&fit=crop',
    description: 'Kopi asli Indonesia dengan suasana homey.'
  },
  {
    slug: 'arabica-jakarta',
    name: '% Arabica Jakarta',
    address: 'Senopati, Jakarta Selatan',
    area: { name: 'Jakarta Selatan', slug: 'jakarta-selatan' },
    latitude: -6.2301,
    longitude: 106.8066,
    rating: 4.5,
    total_reviews: 950,
    price_level: '$$$',
    thumbnail: 'https://images.unsplash.com/photo-1521017432531-fde3a5004131?w=600&h=400&fit=crop',
    description: 'Brand kopi terkenal dari Kyoto, Jepang.'
  }
];

export const getDemoCafes = () => DEMO_CAFES;
