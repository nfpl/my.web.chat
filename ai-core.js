// Basic AI Core Framework
class AICore {
    constructor() {
        this.knowledgeBase = {};
        this.learningRate = 0.1;
        this.memory = [];
        this.iterationCount = 0;
    }

    // Basic learning function
    learn(input, output) {
        if (!this.knowledgeBase[input]) {
            this.knowledgeBase[input] = output;
        } else {
            // Simple adaptation - adjust based on previous knowledge
            this.knowledgeBase[input] = this.lerp(
                this.knowledgeBase[input], 
                output, 
                this.learningRate
            );
        }
        this.memory.push({input, output, timestamp: Date.now()});
        this.iterationCount++;
    }

    // Linear interpolation for gradual learning
    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    // Query the AI
    query(input) {
        if (this.knowledgeBase[input]) {
            return this.knowledgeBase[input];
        }
        return this.findClosestMatch(input);
    }

    // Find closest matching knowledge
    findClosestMatch(input) {
        const words = input.toLowerCase().split(' ');
        let bestMatch = {key: null, score: 0};
        
        Object.keys(this.knowledgeBase).forEach(key => {
            const keyWords = key.toLowerCase().split(' ');
            const intersection = words.filter(word => 
                keyWords.includes(word)
            ).length;
            
            const score = intersection / Math.max(words.length, keyWords.length);
            
            if (score > bestMatch.score) {
                bestMatch = {key, score};
            }
        });

        return bestMatch.score > 0.3 
            ? this.knowledgeBase[bestMatch.key] 
            : "I don't understand yet. Can you teach me?";
    }

    // Evolve the AI by increasing learning capacity
    evolve() {
        this.learningRate = Math.min(0.9, this.learningRate * 1.5);
        console.log(`AI evolved! New learning rate: ${this.learningRate}`);
    }
}

// Export for Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AICore;
} else {
    window.AICore = AICore;
}
