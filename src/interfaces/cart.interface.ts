interface ProductInCartInterface {
  product_id: string;
  quantity: number;
}

interface CartInterface {
  id: string;
  products: ProductInCartInterface[];
}

export { CartInterface };
