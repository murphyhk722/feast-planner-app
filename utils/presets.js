export const PRESET_MENUS = [
  {
    id: 'herb-chicken',
    name: 'Herb Roasted Chicken Dinner',
    emoji: '🍗',
    description: 'Classic plated dinner with roasted chicken, potatoes, and vegetables',
    ingredients: [
      { name: 'Chicken breasts', base_qty: 4, unit: 'pcs', unit_cost: 3.5 },
      { name: 'Olive oil', base_qty: 3, unit: 'tbsp', unit_cost: 0.12 },
      { name: 'Garlic cloves', base_qty: 4, unit: 'cloves', unit_cost: 0.08 },
      { name: 'Russet potatoes', base_qty: 2, unit: 'lbs', unit_cost: 0.7 },
      { name: 'Heavy cream', base_qty: 0.5, unit: 'cups', unit_cost: 0.45 },
      { name: 'Unsalted butter', base_qty: 4, unit: 'tbsp', unit_cost: 0.15 },
      { name: 'Mixed vegetables', base_qty: 1.5, unit: 'lbs', unit_cost: 1.2 },
      { name: 'Chicken broth', base_qty: 1, unit: 'cups', unit_cost: 0.35 },
      { name: 'Fresh thyme', base_qty: 4, unit: 'sprigs', unit_cost: 0.25 },
      { name: 'Lemon', base_qty: 1, unit: 'pcs', unit_cost: 0.5 },
    ]
  },
  {
    id: 'bbq-buffet',
    name: 'BBQ Buffet',
    emoji: '🍖',
    description: 'Crowd-pleasing BBQ spread with ribs, brisket, and all the sides',
    ingredients: [
      { name: 'Pork ribs', base_qty: 2, unit: 'lbs', unit_cost: 4.5 },
      { name: 'Beef brisket', base_qty: 1.5, unit: 'lbs', unit_cost: 6.0 },
      { name: 'BBQ sauce', base_qty: 0.5, unit: 'cups', unit_cost: 0.4 },
      { name: 'Coleslaw mix', base_qty: 2, unit: 'cups', unit_cost: 0.6 },
      { name: 'Cornbread mix', base_qty: 1, unit: 'box', unit_cost: 1.2 },
      { name: 'Baked beans', base_qty: 1, unit: 'cups', unit_cost: 0.5 },
      { name: 'Corn on the cob', base_qty: 1, unit: 'pcs', unit_cost: 0.6 },
      { name: 'Smoked paprika', base_qty: 2, unit: 'tbsp', unit_cost: 0.3 },
      { name: 'Brown sugar', base_qty: 3, unit: 'tbsp', unit_cost: 0.1 },
      { name: 'Apple cider vinegar', base_qty: 0.25, unit: 'cups', unit_cost: 0.2 },
    ]
  },
  {
    id: 'italian-feast',
    name: 'Italian Feast',
    emoji: '🍝',
    description: 'Hearty Italian spread with pasta, salad, and garlic bread',
    ingredients: [
      { name: 'Penne pasta', base_qty: 0.5, unit: 'lbs', unit_cost: 0.8 },
      { name: 'Ground beef', base_qty: 0.5, unit: 'lbs', unit_cost: 2.5 },
      { name: 'Marinara sauce', base_qty: 1, unit: 'cups', unit_cost: 0.6 },
      { name: 'Parmesan cheese', base_qty: 0.25, unit: 'cups', unit_cost: 1.2 },
      { name: 'Mozzarella cheese', base_qty: 0.25, unit: 'lbs', unit_cost: 1.5 },
      { name: 'Italian bread', base_qty: 0.5, unit: 'loaf', unit_cost: 1.0 },
      { name: 'Garlic', base_qty: 3, unit: 'cloves', unit_cost: 0.08 },
      { name: 'Olive oil', base_qty: 2, unit: 'tbsp', unit_cost: 0.12 },
      { name: 'Romaine lettuce', base_qty: 1, unit: 'cups', unit_cost: 0.4 },
      { name: 'Caesar dressing', base_qty: 2, unit: 'tbsp', unit_cost: 0.25 },
    ]
  },
  {
    id: 'taco-bar',
    name: 'Taco Bar',
    emoji: '🌮',
    description: 'Build-your-own taco bar with all the fixings',
    ingredients: [
      { name: 'Ground beef', base_qty: 0.5, unit: 'lbs', unit_cost: 2.5 },
      { name: 'Flour tortillas', base_qty: 3, unit: 'pcs', unit_cost: 0.2 },
      { name: 'Shredded cheddar', base_qty: 0.25, unit: 'cups', unit_cost: 0.8 },
      { name: 'Sour cream', base_qty: 2, unit: 'tbsp', unit_cost: 0.2 },
      { name: 'Salsa', base_qty: 3, unit: 'tbsp', unit_cost: 0.15 },
      { name: 'Guacamole', base_qty: 2, unit: 'tbsp', unit_cost: 0.4 },
      { name: 'Shredded lettuce', base_qty: 0.25, unit: 'cups', unit_cost: 0.2 },
      { name: 'Diced tomatoes', base_qty: 0.25, unit: 'cups', unit_cost: 0.3 },
      { name: 'Taco seasoning', base_qty: 1, unit: 'tbsp', unit_cost: 0.1 },
      { name: 'Lime', base_qty: 0.5, unit: 'pcs', unit_cost: 0.3 },
    ]
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean Spread',
    emoji: '🥙',
    description: 'Fresh Mediterranean mezze with grilled proteins and dips',
    ingredients: [
      { name: 'Chicken thighs', base_qty: 2, unit: 'pcs', unit_cost: 1.8 },
      { name: 'Hummus', base_qty: 0.25, unit: 'cups', unit_cost: 0.5 },
      { name: 'Pita bread', base_qty: 1, unit: 'pcs', unit_cost: 0.4 },
      { name: 'Cucumber', base_qty: 0.25, unit: 'pcs', unit_cost: 0.4 },
      { name: 'Cherry tomatoes', base_qty: 0.25, unit: 'cups', unit_cost: 0.6 },
      { name: 'Feta cheese', base_qty: 2, unit: 'tbsp', unit_cost: 0.5 },
      { name: 'Kalamata olives', base_qty: 2, unit: 'tbsp', unit_cost: 0.4 },
      { name: 'Lemon', base_qty: 0.5, unit: 'pcs', unit_cost: 0.3 },
      { name: 'Olive oil', base_qty: 2, unit: 'tbsp', unit_cost: 0.12 },
      { name: 'Tzatziki', base_qty: 2, unit: 'tbsp', unit_cost: 0.35 },
    ]
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    emoji: '✏️',
    description: 'Build your own menu with custom ingredients',
    ingredients: []
  }
]
