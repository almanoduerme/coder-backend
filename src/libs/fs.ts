import fs from "fs";

class FsDatabase<T> {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private read = async (): Promise<T[]> => {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read file at ${this.filePath}: ${error}`);
    }
  }

  private write = async (data: T[]): Promise<void> => {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Failed to write file at ${this.filePath}: ${error}`);
    }
  }

  private delete = async (id: string): Promise<void> => {
    try {
      const entities = await this.read();
      const filteredEntities = entities.filter((entity: any) => entity.id !== id);

      await this.write(filteredEntities);
    } catch (error) {
      throw new Error(`Failed to delete file at ${this.filePath}: ${error}`);
    }
  }

  public getAll = async (): Promise<T[]> => {
    try {
      const data = await this.read();

      return data;
    } catch (error) {
      throw new Error(`Failed to get all entities from ${this.filePath}: ${error}`);
    }
  }

  public getById = async (id: string): Promise<T | undefined> => {
    try {
      const entities = await this.read();
      return entities.find((entity: any) => entity.id === id);
    } catch (error) {
      throw new Error(`Failed to get entity by id from ${this.filePath}: ${error}`);
    }
  }

  public create = async (entity: T): Promise<T> => {
    try {
      const entities = await this.read();
      entities.push(entity);
      await this.write(entities);
      return entity;
    } catch (error) {
      throw new Error(`Failed to create entity in ${this.filePath}: ${error}`);
    }
  }

  public update = async (id: string, entity: T): Promise<T> => {
    try {
      const entities = await this.read();
      const entityIndex = entities.findIndex((e: any) => e.id === id);

      if (entityIndex === -1) {
        throw new Error("Entity not found");
      }

      entities[entityIndex] = entity;
      await this.write(entities);
      return entity;
    } catch (error) {
      throw new Error(`Failed to update entity in ${this.filePath}: ${error}`);
    }
  }

  public deleteOne = async (id: string): Promise<void> => {
    try {
      await this.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete entity in ${this.filePath}: ${error}`);
    }
  }
}

export { FsDatabase };