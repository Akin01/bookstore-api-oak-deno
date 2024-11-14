import { NotFoundException } from "../common/exceptions.ts";

interface IDatabase<T> {
  findAll: () => T[] | undefined;
  insertOne: (data: T) => T;
  findOne: (id: unknown) => T | undefined;
  updateOne: (id: unknown, data: T) => T;
  deleteOne: (id: unknown) => void;
  seed: (data: T[]) => void;
}

export class Database<T extends { id: unknown }> implements IDatabase<T> {
  dbKey: string;
  data: string | null;

  constructor(dbKey: string) {
    this.dbKey = dbKey;
    this.data = localStorage.getItem(this.dbKey);

    if (!this.dbKey) {
      throw new NotFoundException(`Database ${this.dbKey} not found`);
    }
  }

  private refreshLocalStorage() {
    this.data = localStorage.getItem(this.dbKey);
  }

  findAll() {
    this.refreshLocalStorage();
    const itemsArray = JSON.parse(this.data as string) as unknown as T[];
    if (!itemsArray.length) {
      return;
    }
    return itemsArray;
  }

  insertOne(data: T): T {
    this.refreshLocalStorage();
    const itemsArray = JSON.parse(this.data as string);
    data.id = crypto.randomUUID();
    itemsArray.push(data);
    localStorage.setItem(this.dbKey, JSON.stringify(itemsArray));
    return data;
  }

  findOne(id: unknown) {
    this.refreshLocalStorage();
    const itemsArray: T[] = JSON.parse(this.data as string);
    return itemsArray.find((item: T) => item.id === id);
  }

  updateOne(id: unknown, data: T): T {
    this.refreshLocalStorage();
    const itemsArray: T[] = JSON.parse(this.data as string);
    const index = itemsArray.findIndex((item: T) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    itemsArray[index] = data;
    localStorage.setItem(this.dbKey, JSON.stringify(itemsArray));
    return data;
  }

  deleteOne(id: unknown): void {
    this.refreshLocalStorage();
    const itemsArray: T[] = JSON.parse(this.data as string);
    const index = itemsArray.findIndex((item: T) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    itemsArray.splice(index, 1);
    localStorage.setItem(this.dbKey, JSON.stringify(itemsArray));
  }

  seed(data: T[]) {
    localStorage.setItem(this.dbKey, JSON.stringify(data));
  }
}
