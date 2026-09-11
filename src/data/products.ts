export type Testimonial = {
  name: string
  quote: string
  date: string
}

export type Product = {
  id?: string
  name: string
  category: string
  price: string
  unit: string
  color: string
  icon: string
  imageUrl?: string
  description: string
  rating: number
  reviewCount: number
  origin: string
  testimonials: Testimonial[]
}

export const products: Product[] = [
  {
    name: 'Organic Avocados',
    category: 'Fresh produce',
    price: '$4.50',
    unit: 'bag',
    color: 'green',
    icon: '🥑',
    description: 'Creamy, tree-ripened avocados selected at their best. Great for toast, salads, and a fresh bowl of guacamole.',
    rating: 4.9,
    reviewCount: 128,
    origin: 'Grown in California',
    testimonials: [
      { name: 'Maya R.', quote: 'Perfectly ripe and creamy. These never last long in our kitchen.', date: '2 days ago' },
      { name: 'Jon P.', quote: 'Fresh, consistent, and a great size for weekday lunches.', date: '1 week ago' },
    ],
  },
  {
    name: 'Sourdough Bread',
    category: 'Bakery',
    price: '$5.25',
    unit: 'loaf',
    color: 'gold',
    icon: '🍞',
    description: 'A naturally leavened sourdough loaf with a crisp golden crust and an airy, gently tangy center.',
    rating: 4.8,
    reviewCount: 94,
    origin: 'Baked fresh in our kitchen',
    testimonials: [
      { name: 'Priya S.', quote: 'The crust is beautiful and it makes the best grilled cheese.', date: '3 days ago' },
      { name: 'Noah K.', quote: 'A really dependable loaf for breakfast and dinner.', date: '2 weeks ago' },
    ],
  },
  {
    name: 'Strawberries',
    category: 'Fresh produce',
    price: '$3.75',
    unit: 'box',
    color: 'red',
    icon: '🍓',
    description: 'Sweet, fragrant strawberries picked for bright flavor. Enjoy them fresh or fold them into your favorite dessert.',
    rating: 4.7,
    reviewCount: 76,
    origin: 'Picked in New York state',
    testimonials: [
      { name: 'Elena T.', quote: 'Sweet berries with no soft ones in the box. A family favorite.', date: '5 days ago' },
      { name: 'Chris D.', quote: 'Excellent on yogurt in the morning.', date: '3 weeks ago' },
    ],
  },
  {
    name: 'Farm Eggs',
    category: 'Dairy & eggs',
    price: '$6.00',
    unit: 'dozen',
    color: 'cream',
    icon: '🥚',
    description: 'A dozen pasture-raised eggs with golden yolks and rich flavor for everyday cooking.',
    rating: 4.9,
    reviewCount: 112,
    origin: 'From local family farms',
    testimonials: [
      { name: 'Liam W.', quote: 'The yolks are noticeably richer than grocery store eggs.', date: '1 day ago' },
      { name: 'Sam A.', quote: 'Fresh and carefully packed every time.', date: '1 week ago' },
    ],
  },
  {
    name: 'Cold Brew Coffee',
    category: 'Beverages',
    price: '$4.95',
    unit: 'bottle',
    color: 'brown',
    icon: '☕',
    description: 'Smooth, slow-steeped cold brew with a balanced finish. Keep chilled and enjoy over ice.',
    rating: 4.6,
    reviewCount: 61,
    origin: 'Roasted by Harbor Coffee Co.',
    testimonials: [
      { name: 'Tara N.', quote: 'Smooth without being too sweet. It is now my morning shortcut.', date: '4 days ago' },
      { name: 'Owen B.', quote: 'Great coffee flavor and easy to take on the go.', date: '2 weeks ago' },
    ],
  },
  {
    name: 'Wildflower Honey',
    category: 'Pantry',
    price: '$8.50',
    unit: 'jar',
    color: 'honey',
    icon: '🍯',
    description: 'Small-batch honey gathered from local wildflowers, with a floral aroma and warm golden finish.',
    rating: 4.9,
    reviewCount: 83,
    origin: 'Harvested by Hudson Valley beekeepers',
    testimonials: [
      { name: 'Nina F.', quote: 'Beautiful flavor in tea and on fresh sourdough.', date: '6 days ago' },
      { name: 'Marco G.', quote: 'A lovely local pantry staple with a lot of character.', date: '1 month ago' },
    ],
  },
]
