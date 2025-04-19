import { Application } from 'pixi.js';
import { ParticleSystem } from './core/ParticleSystem';
import { DataManager } from './core/DataManager';
import { DataStream } from './core/DataStream';
import { StatsManager } from './utils/StatsManager';
import { UIController } from './ui/uiController';



(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById('app')?.appendChild(app.canvas);
  
  // Initialize systems
  const stats = new StatsManager();
  const dataManager = new DataManager();
  const dataStream = new DataStream('ws://localhost:8080/stream');
  let particleSystem: ParticleSystem;

  try {
    // Load initial dataset
    const initialData = await dataManager.load('./src/data/dataset.json');
    particleSystem = new ParticleSystem(initialData, dataManager, app.renderer);
    app.stage.addChild(particleSystem.container);

    const uiController = new UIController(particleSystem, dataManager);
    uiController.initialize();

    // Connect live stream
    dataStream.connect((newParticle) => {
      particleSystem.addParticle(newParticle);
    });

    // Update Loop
    app.ticker.add(() => {
      stats.begin();
      particleSystem.update(app.ticker.lastTime);
      uiController.updateStats();
      stats.end();
    });

    // Handle resize
    window.addEventListener('resize', () => {
      particleSystem.handleResize();
    });

  } catch (err) {
    console.error('Initialization failed:', err);
    // Fallback to mock data
    particleSystem = new ParticleSystem(dataManager.generateMockData(1000), dataManager, app.renderer);
  }
})();