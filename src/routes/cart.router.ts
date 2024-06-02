import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

class CartRouter {
  private readonly router = Router();
  private readonly cartController = new CartController();

  constructor() {
    this.routes();
  }

  private routes(): void {
    this.router.post("/", this.cartController.createCart);
    this.router.get("/:cid", this.cartController.getCart);
    this.router.post("/:cid/product/:pid", this.cartController.addProductToCart);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export { CartRouter };