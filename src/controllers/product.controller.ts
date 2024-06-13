import { Request, Response } from "express";
import { ProductBase, Product } from "../interfaces/product.interface";
import { ProductService } from "../services/product.service";

class ProductController {
  private readonly productService = new ProductService();

  constructor() {
    this.getProducts = this.getProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;

      const products = await this.productService.getProducts();
      
      if (products.length === 0) {
        res.status(404).send({ status: "error", message: "No products found" });
        return;
      }

      if (limit) {
        res.status(200).send(products.slice(0, Number(limit)));
        return;
      }

      // res.status(200).send(products as Product[]);
      res.status(200).render("home", { products });
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProduct(id);

      if (!product) {
        res.status(404).send({ status: "error", message: "Product not found" });
        return;
      }

      res.status(200).send(product as Product);
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }

  public async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, code, price, status = true, stock, category } = req.body as ProductBase;

      if (!title || !description || !code || !price || !status || !stock || !category ) {
        res.status(400).send({ status: "error", message: "Invalid data" });
        return;
      }

      const products = await this.productService.getProducts();
      const exists = products.some((product: ProductBase) => product.code === code);

      if (exists) {
        res.status(400).send({ status: "error", message: "Product code already exists" });
        return;
      }

      const product: ProductBase = { 
        title, description, code, price, status, stock, category, thumbnails: []
      };

      const newProduct = await this.productService.addProduct(product as Product);
      res.status(201).send({ status: "success", message: "Product added", product: newProduct });
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, code, price, status, stock, category } = req.body as ProductBase  ;

      if (!title || !description || !code || !price || !status || !stock || !category ) {
        res.status(400).send({ status: "error", message: "Invalid data" });
        return;
      }

      const products = await this.productService.getProducts();
      const productIndex = products.findIndex((product: Product) => product.id === id);

      if (productIndex === -1) {
        res.status(404).send({ status: "error", message: "Product not found" });
        return;
      }

      const exists = products.some((product: Product) => product.code === code && product.id !== id);

      if (exists) {
        res.status(400).send({ status: "error", message: "Product code already exists" });
        return;
      }

      const updatedProduct = await this.productService.updateProduct({ id, title, description, code, price, status, stock, category, thumbnails: [] });
      res.status(200).send({ status: "success", message: "Product updated", product: updatedProduct }); 
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const products = await this.productService.getProducts();

      const productIndex = products.findIndex((product: Product) => product.id === id);

      if (productIndex === -1) {
        res.status(404).send({ status: "error", message: "Product not found" });
        return;
      }

      const productToDelete = await this.productService.deleteProduct(id);
      res.status(200).send({ status: "success", message: "Product deleted", product: productToDelete });
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  }
}

export { ProductController };
