class Simulateureconomiesenergie {
    constructor() {
        // Updated coefficients based on the latest requirements
        this.isolation_coefficients = {
            'good': 0.9,    // Least savings potential
            'correct': 0.75, // Least savings potential
            'old': 0.4,     // More savings potential
            'none': 0.3     // Maximum savings potential
        };

        this.etage_coefficients = {
            'ground': 0.3,   // Maximum savings potential
            'top': 0.6,      // Intermediate savings
            'first': 0.8,    // Less savings
            'other': 0.9     // Least savings potential
        };

        this.orientation_coefficients = {
            'north': 0.3,    // Maximum savings potential
            'south': 0.9,    // Least savings potential
            'east': 0.5,     // Intermediate savings
            'west': 0.7      // Less savings
        };

        this.energy_price = 0.0725; // €/kWh
        this.min_savings = 0.179;   // 17.9% minimum savings
        this.max_savings = 0.266;   // 26.6% maximum savings
        this.base_savings_rate = 0.222; // Midpoint of the range
        this.default_consumption = 12000; // kWh per year
    }

    calculateSavings(isolation, etage, orientation) {
        const isolation_coef = this.isolation_coefficients[isolation];
        const etage_coef = this.etage_coefficients[etage];
        const orientation_coef = this.orientation_coefficients[orientation];

        // Calculate composite coefficient by taking the minimum (which has the highest savings potential)
        const composite_coef = Math.min(isolation_coef, etage_coef, orientation_coef);

        // Map the composite coefficient to savings range
        // Lowest coefficients (0.3) should map to max savings
        // Highest coefficients (0.9) should map to min savings
        let adjusted_savings_rate;
        if (composite_coef === 0.3) {
            adjusted_savings_rate = this.max_savings;
        } else if (composite_coef >= 0.9) {
            adjusted_savings_rate = this.min_savings;
        } else {
            // Linear interpolation between min and max savings
            adjusted_savings_rate = this.max_savings - 
                (this.max_savings - this.min_savings) * 
                ((composite_coef - 0.3) / (0.9 - 0.3));
        }

        return adjusted_savings_rate;
    }

    estimateAnnualSavings(savingsRate, averageConsumption = 12000) {
        return savingsRate * averageConsumption * this.energy_price;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('savingsForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const savingsResult = document.getElementById('savingsResult');
    const annualSavings = document.getElementById('annualSavings');
    const calculationBasis = document.getElementById('calculationBasis');

    const calculator = new Simulateureconomiesenergie();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const etageType = document.getElementById('etageType').value;
        const isolation = document.getElementById('isolation').value;
        const orientation = document.getElementById('orientation').value;

        // Calculate savings
        const savingsRate = calculator.calculateSavings(isolation, etageType, orientation);
        const annualEnergyMoneySaved = calculator.estimateAnnualSavings(savingsRate);

        // Display results
        savingsResult.textContent = `Potentiel d'économie d'énergie: ${(savingsRate * 100).toFixed(1)}%`;
        annualSavings.textContent = `Estimation des économies annuelles: €${annualEnergyMoneySaved.toFixed(2)}`;

        resultsContainer.classList.remove('hidden');
    });
});