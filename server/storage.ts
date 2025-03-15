import { spinWheels, type SpinWheel, type InsertWheel } from "@shared/schema";

export interface IStorage {
  getAllWheels(): Promise<SpinWheel[]>;
  getWheel(id: number): Promise<SpinWheel | undefined>;
  createWheel(wheel: InsertWheel): Promise<SpinWheel>;
  deleteWheel(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private wheels: Map<number, SpinWheel>;
  private currentId: number;

  constructor() {
    this.wheels = new Map();
    this.currentId = 1;
  }

  async getAllWheels(): Promise<SpinWheel[]> {
    return Array.from(this.wheels.values());
  }

  async getWheel(id: number): Promise<SpinWheel | undefined> {
    return this.wheels.get(id);
  }

  async createWheel(insertWheel: InsertWheel): Promise<SpinWheel> {
    const id = this.currentId++;
    // Explicitly type the wheel object to match SpinWheel type
    const wheel: SpinWheel = {
      id,
      name: insertWheel.name,
      segments: insertWheel.segments as string[],
      colors: insertWheel.colors as string[],
    };
    this.wheels.set(id, wheel);
    return wheel;
  }

  async deleteWheel(id: number): Promise<void> {
    this.wheels.delete(id);
  }
}

export const storage = new MemStorage();