import type { MenuItem } from "../types";

export const ROOM_RENTAL_RATE = "$50 per person";

export const MINIMUM_QUANTITIES: Record<string, number> = {
  sandwiches: 10,
  sandwich_avocado: 10,
  sandwich_caprese: 10,
  sandwich_tunisian_tuna: 10,
  sandwich_athens: 10,
  frittata: 12,
  quiche: 12,
  quiche_large: 4,
  deviled_eggs: 12,
  roasted_potatoes: 12,
  sweet_potatoes: 12,
  green_beans: 12,
  stuffed_mushrooms: 12,
  pasta_salad: 12,
};

type MenuCardInfo = Omit<MenuItem, "price" | "unit">;

export type MenuSizeOption = {
  label: string;
  detail: string;
  item: MenuItem & { price: number };
};

type SizedMenuCard = MenuCardInfo & { sizes: MenuSizeOption[]; optionLabel?: string };
type SizeVariant = { id: string; price: number; description?: string };

const CATERING_SIZES = [
  { label: "Small", serves: 10 },
  { label: "Medium", serves: 20 },
  { label: "Large", serves: 25 },
] as const;

function sizeOption(info: MenuCardInfo, variant: SizeVariant, label: string, detail: string): MenuSizeOption {
  return {
    label,
    detail,
    item: {
      ...info,
      id: variant.id,
      name: `${info.name} · ${label.toLowerCase()}`,
      description: variant.description ?? info.description,
      price: variant.price,
      unit: detail,
    },
  };
}

function cateringSizes(info: MenuCardInfo, variants: [SizeVariant, SizeVariant, SizeVariant]): SizedMenuCard {
  return {
    ...info,
    sizes: CATERING_SIZES.map(({ label, serves }, index) =>
      sizeOption(info, variants[index], label, `Serves ${serves}`),
    ),
  };
}

function saladSizes(info: MenuCardInfo): SizedMenuCard {
  return cateringSizes(info, [
    { id: `${info.id}_small`, price: 99.5 },
    { id: `${info.id}_medium`, price: 195.5 },
    { id: `${info.id}_large`, price: 250.5 },
  ]);
}

const quiche = {
  id: "quiche",
  name: "Quiche",
  description: "Wild mushroom & Swiss, broccoli & cheddar, or tomato. Priced per piece.",
  category: "Sides",
  image: "/images/quiche.webp",
} satisfies MenuCardInfo;

const parveCakes = {
  id: "parve_cakes",
  name: "Parve cakes",
  description: "Choose from a beautiful selection of Raspberry, Lemon, or Chocolate parve cakes.",
  category: "Desserts",
  image: "/images/parve-cakes.webp",
} satisfies MenuCardInfo;

const soupPhotos = [
  "/images/chunky-moroccan-soup.webp",
  "/images/everyday-minestrone-soup.webp",
  "/images/warm-cucumber-soup.webp",
];

export const MENU_ITEMS: (MenuItem | SizedMenuCard)[] = [
  cateringSizes(
    {
      id: "breakfast_basket",
      name: "Breakfast basket",
      description: "Croissants, sticky buns, cheese danish, bagels, artisanal cheeses & all the fixings.",
      category: "Breakfast",
      image: "/images/breakfast-basket.jpg",
      tag: "Morning favorite",
    },
    [
      { id: "breakfast_small", price: 119.5 },
      {
        id: "breakfast_medium",
        price: 239.5,
        description: "A generous spread of fresh pastries, bagels, cheeses and house-made accompaniments.",
      },
      {
        id: "breakfast_large",
        price: 303.5,
        description: "A celebration-sized assortment for the whole table.",
      },
    ],
  ),
  cateringSizes(
    {
      id: "breakfast_package",
      name: "Breakfast package",
      description: "Assorted bagels & spreads, artisanal cheeses and hot coffee.",
      category: "Breakfast",
      image: "/images/breakfast-package.webp",
    },
    [
      { id: "breakfast_package_small", price: 214.5 },
      {
        id: "breakfast_package_medium",
        price: 369.5,
        description: "The full breakfast spread with fresh coffee.",
      },
      { id: "breakfast_package_large", price: 419.5, description: "A generous morning for a big gathering." },
    ],
  ),
  cateringSizes(
    {
      id: "patisserie_lunch",
      name: "Patisserie lunch",
      description: "Assorted sandwiches, two salads and a selection of petite desserts.",
      category: "Lunch",
      image: "/images/patisserie-lunch.webp",
      tag: "House favorite",
    },
    [
      { id: "lunch_small", price: 254.5 },
      { id: "lunch_medium", price: 364.5 },
      {
        id: "lunch_large",
        price: 429.5,
        description: "An abundant midday spread with sandwiches, salads and desserts.",
      },
    ],
  ),
  cateringSizes(
    {
      id: "assorted_bagels",
      name: "Bagels & house-made spreads",
      description: "Homemade jam, classic and roasted garlic cream cheese, and butter.",
      category: "À la carte",
      image: "/images/bagels-and-house-made-spreads.webp",
    },
    [
      { id: "assorted_bagels", price: 79.5 },
      { id: "bagels_medium", price: 129.5 },
      { id: "bagels_large", price: 149.5 },
    ],
  ),
  cateringSizes(
    {
      id: "fish_plate",
      name: "The fish plate",
      description:
        "Nova lox, Patis tuna salad, whipped cream cheese, pickled onions, tomato, cucumber & capers.",
      category: "À la carte",
      image: "/images/fish-plate.webp",
    },
    [
      { id: "fish_plate", price: 124.5 },
      { id: "fish_plate_medium", price: 245.5 },
      { id: "fish_plate_large", price: 294.5 },
    ],
  ),
  cateringSizes(
    {
      id: "seasonal_fruit",
      name: "Seasonal fruit",
      description: "Whole fresh fruit, sweet grapes and market berries.",
      category: "À la carte",
      image: "/images/seasonal-fruit.webp",
    },
    [
      { id: "seasonal_fruit", price: 109.5 },
      { id: "seasonal_fruit_medium", price: 179.5 },
      { id: "seasonal_fruit_large", price: 219.5 },
    ],
  ),
  cateringSizes(
    {
      id: "artisanal_cheese",
      name: "Artisanal cheeses",
      description: "A thoughtful selection of hard and soft cheeses with crostini, grapes & berries.",
      category: "À la carte",
      image: "/images/artisanal-cheeses.webp",
    },
    [
      { id: "artisanal_cheese", price: 165.5 },
      { id: "artisanal_cheese_medium", price: 209.5 },
      { id: "artisanal_cheese_large", price: 265.5 },
    ],
  ),
  cateringSizes(
    {
      id: "roasted_vegetables",
      name: "Roasted vegetables",
      description: "Mushroom, eggplant, asparagus, peppers and red onion with balsamic glaze.",
      category: "À la carte",
      image: "/images/roasted-vegetables.webp",
    },
    [
      { id: "roasted_vegetables", price: 139.5 },
      { id: "roasted_vegetables_medium", price: 195.5 },
      { id: "roasted_vegetables_large", price: 245.5 },
    ],
  ),
  cateringSizes(
    {
      id: "crudites",
      name: "Market crudités",
      description: "A colorful selection of fresh vegetables with lemon aioli.",
      category: "À la carte",
      image: "/images/market-crudites.webp",
    },
    [
      { id: "crudites", price: 129.5 },
      { id: "crudites_medium", price: 199.5 },
      { id: "crudites_large", price: 255.5 },
    ],
  ),
  {
    id: "sandwiches",
    name: "Sandwiches, assorted",
    description:
      "Choose from Caprese, Tunisian tuna, Athens or avocado toast. Priced per person; 10 person minimum.",
    category: "Sandwiches",
    price: 16.95,
    unit: "per person",
    image: "/images/assorted-sandwiches.jpg",
    tag: "10 person minimum",
  },
  {
    id: "sandwich_avocado",
    name: "Avocado toast",
    description:
      "Toasted country white, mashed avocado, pickled onion, tomato, pumpkin seeds & feta. 10 person minimum.",
    category: "Sandwiches",
    price: 16.95,
    unit: "per person",
    image: "/images/avocado-toast.webp",
    tag: "10 person minimum",
  },
  {
    id: "sandwich_caprese",
    name: "Caprese",
    description:
      "Multigrain sourdough, roasted peppers, fresh mozzarella & homemade pesto. 10 person minimum.",
    category: "Sandwiches",
    price: 16.95,
    unit: "per person",
    image: "/images/caprese.webp",
    tag: "10 person minimum",
  },
  {
    id: "sandwich_tunisian_tuna",
    name: "Tunisian tuna",
    description:
      "Multigrain sourdough, lemon-caper tuna, roasted peppers, lemon aioli, pickled onion & greens. 10 person minimum.",
    category: "Sandwiches",
    price: 16.95,
    unit: "per person",
    image: "/images/tunisian-tuna.webp",
    tag: "10 person minimum",
  },
  {
    id: "sandwich_athens",
    name: "Athens",
    description:
      "Country white sourdough, lemon aioli, capers, Kalamata olive, roasted peppers, feta & crispy leaf. 10 person minimum.",
    category: "Sandwiches",
    price: 16.95,
    unit: "per person",
    image: "/images/athens.webp",
    tag: "10 person minimum",
  },
  saladSizes({
    id: "caprese_salad",
    name: "Tomato mozzarella",
    description: "Fresh mozzarella, cherry tomatoes, basil and olive oil.",
    category: "Salads",
    image: "/images/tomato-mozzarella.jpg",
  }),
  saladSizes({
    id: "caesar_salad",
    name: "Caesar",
    description:
      "Greens, croissant croutons, shaved parmesan, watermelon radish, tomato & creamy Caesar dressing.",
    category: "Salads",
    image: "/images/caesar.jpg",
  }),
  saladSizes({
    id: "greek_salad",
    name: "It’s all Greek",
    description:
      "Greens, cucumber, Kalamata olive, tomato, roasted peppers, chickpeas, feta & red wine vinaigrette.",
    category: "Salads",
    image: "/images/its-all-greek.jpg",
  }),
  saladSizes({
    id: "tuna_nicoise",
    name: "Tuna Niçoise",
    description:
      "Greens, lemon-caper tuna, roasted peppers, potato, egg, Kalamata olives & lemon vinaigrette.",
    category: "Salads",
    image: "/images/tuna-nicoise.jpg",
  }),
  saladSizes({
    id: "greek_quinoa",
    name: "Greek quinoa",
    description: "Tomato, cucumber, feta, Kalamata olives, red onion, parsley, mint & lemon.",
    category: "Salads",
    image: "/images/greek-quinoa.jpg",
  }),
  saladSizes({
    id: "beet_salad",
    name: "Beet salad",
    description: "Crispy leaf, roasted beets, walnuts, feta & balsamic vinaigrette.",
    category: "Salads",
    image: "/images/beet-salad.jpg",
  }),
  saladSizes({
    id: "egg_salad",
    name: "Egg salad",
    description: "Egg salad with greens, tomatoes and cucumber.",
    category: "Salads",
    image: "/images/egg-salad.jpg",
  }),
  saladSizes({
    id: "salad_of_the_day",
    name: "Salad of the day",
    description: "A fresh, assorted special salad of the day to surprise your palate.",
    category: "Salads",
    image: "/images/tomato-mozzarella.jpg",
  }),
  {
    id: "soup_of_the_day",
    name: "Soup of the day",
    description: "Vegetarian soup of the day, served in an 8 oz portion.",
    category: "Soups",
    price: 6.95,
    unit: "8 oz portion",
    image: soupPhotos[0],
  },
  {
    id: "frittata",
    name: "Garden frittata",
    description: "Wild mushroom & Swiss, broccoli & cheddar, or tomato. 12 person minimum.",
    category: "Sides",
    price: 5.95,
    unit: "per person",
    image: "/images/garden-frittata.webp",
  },
  {
    ...quiche,
    sizes: [
      sizeOption(quiche, { id: "quiche", price: 7.95 }, "Mini", `${MINIMUM_QUANTITIES.quiche} minimum`),
      sizeOption(
        quiche,
        { id: "quiche_large", price: 36.95 },
        "Large",
        `${MINIMUM_QUANTITIES.quiche_large} minimum`,
      ),
    ],
  },
  {
    id: "deviled_eggs",
    name: "Deviled eggs",
    description: "A classic, dressed up with a little Patisserie flair. 12 piece minimum.",
    category: "Sides",
    price: 3.95,
    unit: "each",
    image: "/images/deviled-eggs.webp",
  },
  {
    id: "roasted_potatoes",
    name: "Roasted potatoes",
    description: "Golden, herb-roasted potatoes. 12 person minimum.",
    category: "Sides",
    price: 7.95,
    unit: "per person",
    image: "/images/roasted-potatoes.webp",
  },
  {
    id: "sweet_potatoes",
    name: "Roasted sweet potatoes",
    description: "A warmly seasoned café side. 12 person minimum.",
    category: "Sides",
    price: 7.95,
    unit: "per person",
    image: "/images/roasted-sweet-potatoes.webp",
  },
  {
    id: "green_beans",
    name: "Sautéed green beans",
    description: "A fresh, simple side with a little café polish. 12 person minimum.",
    category: "Sides",
    price: 7.95,
    unit: "per person",
    image: "/images/sauteed-green-beans.webp",
  },
  {
    id: "stuffed_mushrooms",
    name: "Stuffed mushrooms",
    description: "Savory stuffed mushrooms. 12 person minimum.",
    category: "Sides",
    price: 13.95,
    unit: "per person",
    image: "/images/stuffed-mushrooms.webp",
  },
  {
    id: "pasta_salad",
    name: "Pasta salad",
    description: "A fresh, colorful café classic. 12 person minimum.",
    category: "Sides",
    price: 4.95,
    unit: "per person",
    image: "/images/pasta-salad.webp",
  },
  {
    ...parveCakes,
    optionLabel: "Flavor",
    sizes: ["Raspberry", "Lemon", "Chocolate"].map((flavor) =>
      sizeOption(parveCakes, { id: `parve_cake_${flavor.toLowerCase()}`, price: 40 }, flavor, "9-inch cake"),
    ),
  },
];

export const MENU_PHOTO_ROTATIONS: Partial<Record<string, string[]>> = {
  salad_of_the_day: MENU_ITEMS.flatMap((item) =>
    item.category === "Salads" && item.id !== "salad_of_the_day" && item.image ? [item.image] : [],
  ),
  soup_of_the_day: soupPhotos,
};

const menuItemsById = new Map(
  MENU_ITEMS.flatMap((item) => ("sizes" in item ? item.sizes.map((option) => option.item) : [item])).map(
    (item) => [item.id, item],
  ),
);

export function findMenuItem(id: string) {
  return menuItemsById.get(id);
}

export const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "À la carte",
  "Sandwiches",
  "Salads",
  "Soups",
  "Sides",
  "Desserts",
] as const;

export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
