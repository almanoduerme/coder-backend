import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { Product, ProductBase } from "../interfaces/product.interface";

class HandlebarsController {
  private readonly productService = new ProductService();

  constructor() {
    this.getProducts = this.getProducts.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  public async getProductsCore(): Promise<any> {
    try {
      const products = await this.productService.getProducts();
      return products;
    } catch (error) {
      throw error;
    }
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.getProductsCore();
      res.render("realtimeproducts", { products });
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }

  public async addProductCore(data: ProductBase): Promise<Product | Error> {
    try {
      const { title, description, code, price, status = true, stock, category } = data;

      if (!title || !description || !code || !price || !stock || !category) {
        throw new Error("Invalid data");
      }

      const products = await this.productService.getProducts();
      const exists = products.some((product: Product) => product.code === code);

      if (exists) {
        throw new Error("Product code already exists");
      }

      const product: ProductBase = {
        title, description, code, price, status, stock, category, thumbnails: []
      };

      return await this.productService.addProduct(product);
    } catch (error) {
      throw new Error();
    }
  }

  public async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const newProduct = await this.addProductCore(req.body as ProductBase);
      res.status(201).send({ status: "success", message: "Product added", product: newProduct });
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }  

  public async deleteProduct(id: string): Promise<Product | any> {
    try {
      const product = await this.productService.getProduct(id);
      if (!product) {
        throw new Error("Product not found");
      }
      await this.productService.deleteProduct(id);
    } catch (error) {
      throw new Error();
    }
  }
}


export { HandlebarsController };
