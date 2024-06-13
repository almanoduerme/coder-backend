import { FsDatabase } from "../libs/fs";
import { CartInterface } from "../interfaces/cart.interface";
import path from 'path';

const cartsFilePath = path.resolve(__dirname, '../../src/database/carts.json');

class CartService {
  private readonly database = new FsDatabase(cartsFilePath);

  public async getCart(id: string): Promise<CartInterface | undefined> {
    try {
      const cart = await this.database.getById(id);
      return cart as CartInterface;
    } catch (error) {
      throw new Error(`Failed to read file at ${cartsFilePath}: ${error}`);
    }
  }

  public async createCart(cart: CartInterface): Promise<CartInterface> {
    try {
      const newCart = await this.database.create(cart);
      return newCart as CartInterface;
    } catch (error) {
      throw new Error(`Failed to write file at ${cartsFilePath}: ${error}`);
    }
  }

  public async updateCart(cart: CartInterface): Promise<CartInterface> {
    try {
      const updatedCart = await this.database.update(cart.id, cart);
      return updatedCart as CartInterface;
    } catch (error) {
      throw new Error(`Failed to update file at ${cartsFilePath}: ${error}`);
    }
  }
}

export { CartService };