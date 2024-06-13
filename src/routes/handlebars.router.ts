import { Router } from "express";
import { HandlebarsController } from "../controllers/handlebars.controller";

class HandlebarsRouter {
  private readonly router = Router();
  private readonly handlebarsController = new HandlebarsController();

  constructor() {
    this.routes();
  }

  private routes(): void {
    this.router.get("/realtimeproducts", this.handlebarsController.getProducts);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export { HandlebarsRouter };