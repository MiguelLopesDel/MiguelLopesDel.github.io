import Typewriter from './modules/typewriter.js';
import {initParticles} from './modules/particles.js';
import ExplosionManager from './modules/explosions.js';

let typewriter;
let explosionManager;
document.addEventListener('DOMContentLoaded', () => {
    let phrases = window.t && window.t('typewriter_phrases') || [
        "Web Developer",
        "Technology Enthusiast",
        "Front-End | UI/UX",
        "Back-End | DevOps"
    ];

    typewriter = new Typewriter('typewriter', phrases);
    window.updateTypewriter = () => {
        const newPhrases = typeof window.t('typewriter_phrases') === 'object'
            ? window.t('typewriter_phrases')
            : phrases;
        typewriter.updatePhrases(newPhrases);
    };

    try {
        initParticles('particles-js');
    } catch (err) {
        console.error('Erro ao inicializar partículas:', err);
    }

    explosionManager = new ExplosionManager('explosions-canvas');

    setupEvents();
});


function setupEvents() {
    document.getElementById('particles-js')?.addEventListener('click', function (e) {
        const particlesCanvas = document.querySelector('#particles-js canvas');
        if (!particlesCanvas) return;

        const rect = particlesCanvas.getBoundingClientRect();
        const mouseX = e.clientX, mouseY = e.clientY;

        if (window.pJSDom && pJSDom.length) {
            const pJS = pJSDom[0]?.pJS;
            const escalaX = rect.width / particlesCanvas.width;
            const escalaY = rect.height / particlesCanvas.height;
            const clickedParticle = pJS.particles.array.find(part => {
                const px = part.x * escalaX + rect.left;
                const py = part.y * escalaY + rect.top;
                const raio = part.radius || part.size.value || 6;
                return Math.hypot(mouseX - px, mouseY - py) <= raio + 7;
            });

            if (clickedParticle) {
                explosionManager.explodeAtPosition(
                    clickedParticle.x * escalaX + rect.left,
                    clickedParticle.y * escalaY + rect.top
                );
                return;
            }
        }
        explosionManager.explodeAtPosition(mouseX, mouseY);
    });

    document.addEventListener('click', function (e) {
        if (e.target.matches('.redes a img')) {
            explosionManager.explodeAtPosition(e.clientX, e.clientY);
        }
    });
}