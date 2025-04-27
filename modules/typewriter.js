export default class Typewriter {
    constructor(elementId, phrases) {
        this.element = document.getElementById(elementId);
        this.phrases = phrases;
        this.phraseIdx = 0;
        this.letterIdx = 0;
        this.deleting = false;

        if (this.element) this.animate();
    }

    animate() {
        const text = this.phrases[this.phraseIdx];
        if (!this.deleting && this.letterIdx <= text.length) {
            this.element.textContent = text.slice(0, this.letterIdx++);
            setTimeout(() => this.animate(), 110);
        } else if (this.deleting && this.letterIdx >= 0) {
            this.element.textContent = text.slice(0, this.letterIdx--);
            setTimeout(() => this.animate(), 55);
        } else {
            this.deleting = !this.deleting;
            if (!this.deleting) {
                this.phraseIdx = (this.phraseIdx + 1) % this.phrases.length;
                this.letterIdx = 0;
                setTimeout(() => this.animate(), 200);
            } else {
                setTimeout(() => this.animate(), 1000);
            }
        }
    }

    updatePhrases(newPhrases) {
        this.phrases = newPhrases;
        this.phraseIdx = 0;
        this.letterIdx = 0;
        this.deleting = false;
    }
}