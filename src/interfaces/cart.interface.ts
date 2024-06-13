interface ProductInCartInterface {
  product_id: string;
  quantity: number;
}

interface CartInterfaceBase {
  products: ProductInCartInterface[];
}

interface CartInterface extends CartInterfaceBase {
  id: string;
}

export { CartInterface, CartInterfaceBase };
