import { ParticleSystem } from '../core/ParticleSystem';
import { DataManager } from '../core/DataManager';

export class UIController {
    private particleSystem: ParticleSystem;
    private dataManager: DataManager;

    constructor(particleSystem: ParticleSystem, dataManager: DataManager) {
        this.particleSystem = particleSystem;
        this.dataManager = dataManager;
    }

    initialize() {
        const timeSlider = document.getElementById('timeSlider') as HTMLInputElement;
        const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;

        timeSlider.addEventListener('input', () => {
            this.particleSystem.removeAllParticles();
        });

        categoryFilter.addEventListener('change', () => {
            this.particleSystem.removeAllParticles();
        });
    }

    updateStats() {
        const timeRange = parseFloat((document.getElementById('timeSlider') as HTMLInputElement).value);
        const category = (document.getElementById('categoryFilter') as HTMLSelectElement).value;
        const filteredData = this.dataManager.getFilteredData(timeRange, category);
        const stats = this.dataManager.getStats(filteredData);

        document.getElementById('avgValue')!.textContent = stats.average.toFixed(2);
        document.getElementById('maxValue')!.textContent = stats.max.toFixed(2);
        document.getElementById('particleCount')!.textContent = stats.count.toString();
    }
}