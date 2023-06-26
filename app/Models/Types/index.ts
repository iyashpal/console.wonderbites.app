type CartDataProduct = {
  id: number;
  category: number;
  quantity: number;
  variant?: CartDataVariant;
  ingredients?: CartDataIngredient[];
}

type CartDataVariant = {
  id: number;
  ingredients?: CartDataIngredient[]
}

type CartDataIngredient = {
  id: number;
  category: number;
  quantity: number;
}
