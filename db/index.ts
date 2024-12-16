import { NotFoundException } from "../common/exceptions.ts";

interface IDatabase<T> {
  findAll: () => T[] | undefined;
  insertOne: (data: T) => T;
  findOne: (id: unknown) => T | undefined;
  updateOne: (id: unknown, data: T) => T;
  deleteOne: (id: unknown) => void;
  seed: (data: T[]) => void;
}

export class Database<T> implements IDatabase<T & { id: unknown }> {
  dbKey: string;
  data: string | null;

  constructor(dbKey: string) {
    this.dbKey = dbKey;
    this.data = localStorage.getItem(this.dbKey);

    if (!this.dbKey) {
      throw new Error("Please provide database key");
    }
  }

  private refreshLocalStorage(items: Array<T & { id: unknown }>) {
    localStorage.setItem(this.dbKey, JSON.stringify(items));
    this.data = localStorage.getItem(this.dbKey);
  }

  private getParsedData() {
    return JSON.parse(this.data as string) as Array<T & { id: unknown }>;
  }

  findAll() {
    const itemsArray = this.getParsedData();
    if (!itemsArray.length) {
      return;
    }
    return itemsArray;
  }

  insertOne(data: T): T & { id: unknown } {
    const itemsArray = this.getParsedData();
    const newData = {
      id: crypto.randomUUID(),
      ...data,
    } as T & { id: unknown };

    itemsArray.push(newData);
    this.refreshLocalStorage(itemsArray);
    return newData;
  }

  findOne(id: unknown) {
    const itemsArray = this.getParsedData();
    return itemsArray.find((e) => e.id === id);
  }

  updateOne(id: unknown, data: T): T & { id: unknown } {
    const itemsArray = this.getParsedData();
    const index = itemsArray.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    itemsArray[index] = {
      ...itemsArray[index],
      ...data,
    };

    this.refreshLocalStorage(itemsArray);
    return itemsArray[index];
  }

  deleteOne(id: unknown): void {
    const itemsArray = this.getParsedData();
    const index = itemsArray.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    itemsArray.splice(index, 1);
    this.refreshLocalStorage(itemsArray);
  }

  seed(data: T[]) {
    const items = data.map(
      (e) => ({ id: crypto.randomUUID(), ...e }),
    );
    localStorage.setItem(this.dbKey, JSON.stringify(items));
  }
}
