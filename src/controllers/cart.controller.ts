import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { ProductService } from "../services/product.service";
import { CartInterface, CartInterfaceBase } from "../interfaces/cart.interface";

class CartController {
  private readonly cartService = new CartService();

  constructor() {
    this.getCart = this.getCart.bind(this);
    this.createCart = this.createCart.bind(this);
    this.addProductToCart = this.addProductToCart.bind(this);
  }

  public async getCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid } = req.params;
      const cart = await this.cartService.getCart(cid);

      if (!cart) {
        res.status(404).send({ status: "error", message: "Cart not found" });
        return;
      }

      res.status(200).send(cart as CartInterface);
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  };

  public async createCart(req: Request, res: Response): Promise<void> {
    try {
      const newCart: CartInterfaceBase = { products: [] };
      const cart = await this.cartService.createCart(newCart as CartInterface);

      res.status(201).send(cart);
    } catch (error) {}
  };

  public async addProductToCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid, pid } = req.params;
  
      const [cart, product] = await Promise.all([
        this.cartService.getCart(cid),
        new ProductService().getProduct(pid),
      ]);
  
      if (!cart) {
        res.status(404).send({ status: "error", message: "Cart not found" });
        return;
      }
  
      if (!product) {
        res.status(404).send({ status: "error", message: "Product not found" });
        return;
      }
  
      const productIndex = cart.products.findIndex(p => p.product_id === pid);
  
      if (productIndex > -1) cart.products[productIndex].quantity++;
      else cart.products.push({ product_id: pid, quantity: 1 });
  
      await this.cartService.updateCart(cart);
      res.status(200).send({ status: "success", message: "Product added to cart" });
    } catch (error) {
      res.status(500).send({ status: "error", message: error || "Internal server error" });
    }
  }
  
}

export { CartController };
