import { Renderer, Sprite, Texture, Graphics, Container, GlProgram, Geometry, Mesh, Shader } from 'pixi.js';
import { ShaderPipeline } from './ShaderPipeline';
import type { ParticleData } from '../types';
import glowFragment from '../../src/shaders/glow.frag?raw';
import particleVertex from '../../src/shaders/particle.vert?raw';
import { DataManager } from './DataManager';

export class ParticleSystem {
  public container: Container;
  private sprites: Map<number, Sprite> = new Map();
  private meshes: Map<number, Mesh<Geometry, Shader>> = new Map();
  private particleData: Map<number, ParticleData> = new Map();
  private texture: Texture;
  private shaderPipeline: ShaderPipeline;
  private renderer: Renderer;
  private dataManager: DataManager;

  constructor(initialData: ParticleData[], dataManager: DataManager, renderer: Renderer) {
    this.dataManager = dataManager;
    this.renderer = renderer;
    this.container = new Container();
    
    this.shaderPipeline = new ShaderPipeline();
    initialData.forEach(data => this.addParticle(data));
  }

  private createParticleTexture(color: string): Texture {
    const graphic = new Graphics();
    graphic.fill(this.hexColorToDecimal(color));
    graphic.rect(0, 0, 5, 5);
    graphic.fill();
    return this.renderer.generateTexture(graphic);
  }

  public getParticleData(id: number): ParticleData | undefined {
    return this.particleData.get(id);
  }

  public addParticle(data: ParticleData) {
    if (this.meshes.has(data.id)) return;

    const glProgram = GlProgram.from({
      vertex: particleVertex,
      fragment: glowFragment,
    });

    const geometry = new Geometry({
      attributes: {
          aPosition: [
              -100,
              -100, // x, y
              100,
              -100, // x, y
              100,
              100, // x, y,
          ],
          aUV: [0, 0, 1, 0, 1, 1],
        },
      });

      this.texture = this.createParticleTexture(data.color);
    
      const createdMesh = new Mesh({
        geometry,
        shader: new Shader({
            glProgram,
            resources: {
                uTexture: this.texture.source,
            },
        }),
      }); 

    createdMesh.position.set(
      data.x * window.innerWidth,
      data.y * window.innerHeight
    );
    createdMesh.scale.set(0.1 + (data.size || data.value * 0.005));
    const color = this.hexColorToDecimal(data.color);
    createdMesh.tint = color;
    createdMesh.rotation = Math.random() * 360;
    

    this.meshes.set(data.id, createdMesh);
    this.particleData.set(data.id, data);
    this.container.addChild(createdMesh);

    this.dataManager.updateData(this.particleData);
    
  }

  private hexColorToDecimal(hex: string): number | null {
    const cleanedHex = hex.replace(/^#/, '');
  
    if (!/^[0-9a-fA-F]{6}$/.test(cleanedHex)) {
      return null; // Invalid format
    }
  
    return parseInt(cleanedHex, 16);
  }

  public removeParticle(id: number) {
    const createdMesh = this.meshes.get(id);
    if (createdMesh) {
      this.container.removeChild(createdMesh);
      this.meshes.delete(id);
      this.particleData.delete(id);
    }
  }

  public removeAllParticles() {
    this.meshes.forEach((createdMesh, key) => {
      this.container.removeChild(createdMesh);
      this.meshes.delete(key);
      this.particleData.delete(key);
    });
  }

  public update(time: number) {
    this.shaderPipeline.update(time);
    // this.container.filters = [this.shaderPipeline.getFilter()];
  }

  public handleResize_old() {
    this.sprites.forEach((sprite, id) => {
      const data = this.getParticleData(id);
      if (data) {
        sprite.position.set(
          data.x * window.innerWidth,
          data.y * window.innerHeight
        );
      }
    });
  }

  public handleResize() {
    this.meshes.forEach((createdMesh, id) => {
      const data = this.getParticleData(id);
      if (data) {
        createdMesh.position.set(
          data.x * window.innerWidth,
          data.y * window.innerHeight
        );
      }
    });
  }


}