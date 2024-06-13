import express, { Application, NextFunction, Request, Response } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { engine } from "express-handlebars";
import cors from "cors";

import { CartRouter, HandlebarsRouter, ProductRouter } from "./routes";
import { SocketHandler } from "./sockets/socket";

class Bootstrap {
  private app: Application;
  private port: number | string;
  private productRouter: ProductRouter;
  private cartRouter: CartRouter;
  private handlebarsRouter: HandlebarsRouter;

  private server: HttpServer;
  private io: SocketServer;

  constructor() {
    this.app = express();
    this.port = process.env.PORT as string || 3000;
    this.productRouter = new ProductRouter();
    this.cartRouter = new CartRouter();
    this.handlebarsRouter = new HandlebarsRouter();

    this.server = createServer(this.app);
    this.io = new SocketServer(this.server);

    this.config();
    this.routes();
    this.sockets();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Handlebars
    this.app.engine("handlebars", engine());
    this.app.set("views", "./src/views");
    this.app.set("view engine", "handlebars");

    // Static files
    this.app.use(express.static("public"));

    // Error handler
    this.app.use(this.errorHandler);
  }

  private routes(): void {
    this.app.use("/api/products", this.productRouter.getRouter());
    this.app.use("/api/cart", this.cartRouter.getRouter());
    this.app.use("/", this.handlebarsRouter.getRouter());
  }

  private sockets(): void {
    new SocketHandler(this.io);
  }

  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON" });
    } else {
      console.error(`Error occurred: ${err.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }

    next();
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public start(): void {
    this.listen();
  }
}

export { Bootstrap }