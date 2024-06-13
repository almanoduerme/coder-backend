import { Server as SocketServer } from "socket.io";
import { HandlebarsController } from "../controllers/handlebars.controller";

export class SocketHandler {
  private io: SocketServer;
  private handlebarsController: HandlebarsController;

  constructor(io: SocketServer) {
    this.io = io;
    this.handlebarsController = new HandlebarsController();
    this.setupSocket();
  }

  private setupSocket(): void {
    this.io.on("connection", async (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("add-product", async (data) => {
        try {
          await this.handlebarsController.addProductCore(data);
          this.io.emit("all-products", await this.handlebarsController.getProductsCore());
          socket.emit("product-added", "Product added successfully");
        } catch (error) {
          console.error(`Error adding product: ${error}`);
          socket.emit("error", "Error adding product");
        }
      });

      socket.on("get-products-init", async () => {
        try {
          const products = await this.handlebarsController.getProductsCore();
          socket.emit("all-products", products);
        } catch (error) {
          console.error(`Error fetching products: ${error}`);
          socket.emit("error", "Error fetching products");
        }
      });

      socket.on("delete-product", async (id) => {
        try {
          await this.handlebarsController.deleteProduct(id);
          this.io.emit("all-products", await this.handlebarsController.getProductsCore());
          socket.emit("product-deleted", "Product deleted successfully");
        } catch (error) {
          console.error(`Error deleting product: ${error}`);
          socket.emit("error", "Error deleting product");
        }
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}
