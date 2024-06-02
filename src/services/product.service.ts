import { FsDatabase } from "../libs/fs";
import { ProductInterface } from "../interfaces/product.interface";
import path from 'path';

const productsFilePath = path.resolve(__dirname,'../../src/database/products.json');

class ProductService {
  private readonly database = new FsDatabase(productsFilePath);

  public async getProducts(): Promise<ProductInterface[] | []> {
    try {
      const products = await this.database.getAll();
      return products as ProductInterface[];
    } catch (error) {
      throw new Error(`Failed to read file at ${productsFilePath}: ${error}`);
    }
  }

  public async getProduct(id: string): Promise<ProductInterface | undefined> {
    try {
      const product = await this.database.getById(id);
      return product as ProductInterface;
    } catch (error) {
      throw new Error(`Failed to read file at ${productsFilePath}: ${error}`);
    }
  }

  public async addProduct(product: ProductInterface): Promise<ProductInterface> {
    try {
      const newProduct = await this.database.create(product);
      return newProduct as ProductInterface;
    } catch (error) {
      throw new Error(`Failed to write file at ${productsFilePath}: ${error}`);
    }
  }

  public async updateProduct(product: ProductInterface): Promise<ProductInterface> {
    try {
      const updatedProduct = await this.database.update(product.id, product);
      return updatedProduct as ProductInterface;
    } catch (error) {
      throw new Error(`Failed to update file at ${productsFilePath}: ${error}`);
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    try {
      await this.database.deleteOne(id);
    } catch (error) {
      throw new Error(`Failed to delete file at ${productsFilePath}: ${error}`);
    }
  }
}

export { ProductService };