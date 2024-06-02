import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

class ProductRouter {
  private readonly router = Router();
  private readonly productController = new ProductController();

  constructor() {
    this.routes();
  }

  private routes(): void {
    this.router.get("/", this.productController.getProducts);
    this.router.get("/:id", this.productController.getProduct);
    this.router.post("/", this.productController.addProduct);
    this.router.put("/:id", this.productController.updateProduct);
    this.router.delete("/:id", this.productController.deleteProduct);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export { ProductRouter };
