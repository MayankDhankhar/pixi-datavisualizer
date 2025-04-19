import { Texture } from "pixi.js";

export interface ParticleData {
    id: number;
    value: number;
    category: string;
    x: number;
    y: number;
    color: string;
    time: number;
    size?: number;
  }
  
  export interface FilterState {
    range: [number, number];
    categories: string[];
  }
  
  export interface ShaderUniforms {
    uTime: number;
    uIntensity: number;
    uSampler: Texture | null;
  }