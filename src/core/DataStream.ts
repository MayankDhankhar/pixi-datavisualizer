import type { ParticleData } from '../types';

export class DataStream {
  private ws: WebSocket | null = null;
  private intervalId?: number;

  constructor(private url: string) {}

  connect(onData: (data: ParticleData) => void) {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const validated = this.validateParticleData(data);
          onData(validated);
        } catch (e) {
          console.error('Invalid data format', e);
        }
      };

      this.ws.onerror = () => this.startMockStream(onData);
      this.ws.onclose = () => this.startMockStream(onData);

    } catch (e) {
      this.startMockStream(onData);
    }
  }

  private validateParticleData(data: any): ParticleData {
    return {
      id: data.id || Date.now(),
      value: data.value ?? Math.random() * 100,
      category: data.category || ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      x: Math.min(1, Math.max(0, data.x ?? Math.random())),
      y: Math.min(1, Math.max(0, data.y ?? Math.random())),
      color: data.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      time: data.time || 5,
      size: data.size ?? Math.random() * 0.2
    };
  }

  // private generateMockParticle(): ParticleData {
  //   return {
  //     id: Date.now(),
  //     value: Math.random() * 100,
  //     category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
  //     x: Math.random(),
  //     y: Math.random(),
  //     color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  //     size: Math.random() * 0.2
  //   };
  // }

  private startMockStream(onData: (data: ParticleData) => void) {
    this.intervalId = window.setInterval(() => {
      onData(this.validateParticleData({}));
    }, 500);
  }

  disconnect() {
    this.ws?.close();
    if (this.intervalId) clearInterval(this.intervalId);
  }
}



