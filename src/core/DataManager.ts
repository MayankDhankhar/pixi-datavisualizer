import type { ParticleData } from '../types';

export class DataManager {
  private data: Map<number, ParticleData> = new Map();
  private maxSize: number = 10001;

  async load(url: string): Promise<ParticleData[]> {
    const response = await fetch(url);
    const data = await response.json();
    return this.validateDataset(data);
  }

  private validateDataset(data: any[]): ParticleData[] {
    return data.map(item => ({
      id: item.id || Date.now() + Math.random(),
      value: item.value ?? Math.random() * 100,
      category: item.category || 'A',
      x: this.clamp(item.x, 0, 1),
      y: this.clamp(item.y, 0, 1),
      color: item.color || '#FFFFFF',
      time: item.time || 5,
      size: item.size || 0.1
    }));
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  generateMockData(count = 1000): ParticleData[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      value: Math.random() * 100,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      x: Math.random(),
      y: Math.random(),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      time: Math.random() * 100,
      size: Math.random() * 0.2
    }));
  }

  updateData(newData: Map<number, ParticleData>) {
    this.data = newData;
  }

  getFilteredData(timeRange: number, category: string): ParticleData[] {
    const particleData = [];
    this.data.forEach((d) => {
      if (d.time <= timeRange && 
        (category === 'all' || d.category === category)) {
          particleData.push(d);
      }
    });

    return particleData;
  }

  getStats(filteredData: ParticleData[]) {
    const values = filteredData.map(d => d.value);
    return {
        average: values.reduce((a, b) => a + b, 0) / (values.length || 1),
        max: Math.max(...values, 0),
        count: filteredData.length
    };
  }

}