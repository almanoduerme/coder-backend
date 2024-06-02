import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { CartRouter, ProductRouter } from "./routes";

class Server {
  private app: Application;
  private port: number | string;
  private productRouter: ProductRouter;
  private cartRouter: CartRouter;

  constructor() {
    this.app = express();
    this.port = process.env.PORT as string || 3000;
    this.productRouter = new ProductRouter();
    this.cartRouter = new CartRouter();

    this.config();
    this.routes();
    this.errorHandler();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/api/products", this.productRouter.getRouter());
    this.app.use("/api/cart", this.cartRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

      if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).send({ status: "error", message: "Invalid JSON" });
      }

      res.status(500).send({ status: "error", message: "Internal Server Error" });
    });
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public start(): void {
    this.listen();
  }
}

export { Server }