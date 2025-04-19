import { Filter, GlProgram } from 'pixi.js';
import glowFragment from '../../src/shaders/glow.frag?raw';
import particleVertex from '../../src/shaders/particle.vert?raw';


export class ShaderPipeline {
  private filter: Filter;

  constructor() {
    // this.filter = new Filter({
    //   vertex: particleVertex,
    //   fragment: glowFragment,
    //   uniforms: {
    //     uTime: 0,
    //     uIntensity: 1.5,
    //     uSampler: null
    //   }
    // });

  //   const shader = Shader.from({
  //     gl: {
  //         vertex: particleVertex,
  //         fragment: glowFragment,
  //     }
  // });

    this.filter = new Filter({
      glProgram: new GlProgram({
          fragment: glowFragment,
          vertex: particleVertex,
      }),
      resources: {
          timeUniforms: {
              uTime: { name: 'uTime', type: 'f32', value: 0.0},
              uIntensity: { name: 'uIntensity', type: 'f32', value: 0.5},
              // uSampler: null
          },
      },
    });

  }

  update(time: number) {
    // this.filter.uniforms.uTime = time;
    // this.filter.resources.timeUniforms.uniforms.uTime = time;
    this.filter.resources.timeUniforms.uTime = time;
  }

  getFilter(): Filter {
    return this.filter;
  }
}