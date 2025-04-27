export function initParticles(containerId) {
    if (!window.particlesJS) return console.error('particles.js não está carregado');

    particlesJS(containerId, {
        particles: {
            number: {value: 60},
            color: {value: "#64ffda"},
            shape: {type: "circle"},
            opacity: {value: 0.4},
            size: {value: 3},
            move: {enable: true, speed: 1.5}
        }
    });
}