// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1000);
    });

    // Navigation
    let lastScroll = 0;
    const nav = document.getElementById('navWrapper');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (nav) {
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        
        // Update active nav item
        updateActiveNav();
        
        // Update consciousness meter
        updateConsciousnessMeter();
        
        lastScroll = currentScroll;
    });

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 80;
            const sectionTop = section.offsetTop - offset;
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-item');
        
        if (!sections.length || !navItems.length) return;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.toLowerCase() === current || 
                (item.textContent === 'CCT' && current === 'cct') ||
                (item.textContent === 'Connect' && current === 'connect')) {
                item.classList.add('active');
            }
        });
    }

    // Mobile menu
    window.toggleMobileMenu = function() {
        const menu = document.getElementById('mobileMenu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }


    // Make functions globally available
    window.scrollToSection = scrollToSection;
    window.scrollToTop = scrollToTop;

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections and chambers
    document.querySelectorAll('.section, .chamber-wrapper').forEach(el => {
        observer.observe(el);
    });

    // Consciousness Meter
    let explorationDepth = 0;
    let sectionsVisited = new Set();

    function updateConsciousnessMeter() {
        const meter = document.getElementById('consciousnessMeter');
        const fill = document.getElementById('meterFill');
        
        if (!meter || !fill) return;
        
        // Track sections visited
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                sectionsVisited.add(section.id);
            }
        });
        
        // Calculate exploration depth
        explorationDepth = (sectionsVisited.size / sections.length) * 100;
        
        // Show meter after some exploration
        if (explorationDepth > 20) {
            meter.classList.add('active');
            fill.style.width = `${explorationDepth}%`;
        }
    }


    // Performance optimization - pause animations when not visible
    let animationsPaused = false;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.style.setProperty('--animation-play-state', 'paused');
            animationsPaused = true;
        } else {
            document.body.style.setProperty('--animation-play-state', 'running');
            animationsPaused = false;
        }
    });

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }

});


// --- Abstract Spirit Form Animation ---

function initMandalaAnimation() {
    const canvas = document.getElementById('mandala');
    // If the canvas doesn't exist or has already been initialized, do nothing.
    if (!canvas || canvas.dataset.initialized) {
        return;
    }
    canvas.dataset.initialized = 'true'; // Mark as initialized

    const ctx = canvas.getContext('2d');
    const wrapper = document.querySelector('.mandala-wrapper');

    // Set canvas size based on its container
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetWidth;
    const size = canvas.width;
    
    const centerX = size / 2;
    const centerY = size / 2;
    
    let time = 0;
    let mouseX = centerX;
    let mouseY = centerY;
    let smoothMouseX = centerX;
    let smoothMouseY = centerY;
    let smoothAngle = 0;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    function createGradient(x, y, r1, r2, colors) {
        const gradient = ctx.createRadialGradient(x, y, r1, x, y, r2);
        colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color);
        });
        return gradient;
    }
    
    function drawTorusForm(phase, scale) {
        const radius = size * 0.35 * scale;
        const segments = 180;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const torusPhase = phase + angle * 2;
            const r = radius * (1 + 0.3 * Math.sin(torusPhase) * Math.cos(torusPhase * 0.5));
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
    }
    
    function drawHyperbolicForm(phase, scale, offset) {
        const maxRadius = size * 0.4 * scale;
        ctx.beginPath();
        for (let t = 0; t < 30; t += 0.1) {
            const r = maxRadius * Math.tanh(t / 10 + phase);
            const theta = t + offset;
            const x = centerX + r * Math.cos(theta);
            const y = centerY + r * Math.sin(theta);
            if (t === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
    }
    
 
    function animate() {
        ctx.fillStyle = 'rgba(30, 58, 138, 0.1)';
        ctx.fillRect(0, 0, size, size);
        
        time += 0.008;

        mouseX += (centerX - mouseX) * 0.01;
        mouseY += (centerY - mouseY) * 0.01;

        smoothMouseX += (mouseX - smoothMouseX) * 0.02;
        smoothMouseY += (mouseY - smoothMouseY) * 0.02;
        
        const dx = smoothMouseX - centerX;
        const dy = smoothMouseY - centerY;
        const influence = Math.sqrt(dx * dx + dy * dy) / (size * 0.5);
        const angleInfluence = Math.atan2(dy, dx);

        // This finds the shortest way to the new angle, preventing jerky rotations
        let delta = angleInfluence - smoothAngle;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
        
        // Smooth the angle by a small fraction each frame
        smoothAngle += delta * 0.05;
        

        ctx.save();
        ctx.translate(centerX, centerY);
        
        ctx.rotate(smoothAngle * 0.1); 
        ctx.translate(-centerX, -centerY);
        
        // Layer 1: Outer form (Purple and Blue)
        ctx.globalCompositeOperation = 'screen';
        drawTorusForm(time, 1 + influence * 0.1);
        const gradient1 = createGradient(centerX, centerY, 0, size * 0.5, [
            'rgba(147, 112, 219, 0)','rgba(147, 112, 219, 0.3)','rgba(0, 212, 255, 0.2)','rgba(0, 212, 255, 0)'
        ]);
        ctx.strokeStyle = gradient1;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Layer 2: Middle form (Purple and Beige Glow)
        drawHyperbolicForm(time * 1.5, 0.8, influence);
        const gradient2 = createGradient(centerX, centerY, size * 0.1, size * 0.4, [
            'rgba(240, 230, 200, 0.4)','rgba(147, 112, 219, 0.3)','rgba(30, 58, 138, 0.2)','rgba(30, 58, 138, 0)'
        ]);
        ctx.strokeStyle = gradient2;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Layer 3: Inner form (Light Blue and Purple)
        drawTorusForm(time * 2 + Math.PI, 0.6 - influence * 0.1);
        const gradient3 = createGradient(centerX, centerY, 0, size * 0.3, [
            'rgba(0, 212, 255, 0)','rgba(0, 212, 255, 0.2)','rgba(147, 112, 219, 0.3)','rgba(147, 112, 219, 0)'
        ]);
        ctx.strokeStyle = gradient3;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Layer 4: Central spiral (Bright Beige Glow and Purple)
        ctx.globalCompositeOperation = 'lighter';
        drawHyperbolicForm(time * 3, 0.4, -influence * 2);
        const gradient4 = createGradient(centerX, centerY, 0, size * 0.2, [
            'rgba(240, 230, 200, 0.5)','rgba(147, 112, 219, 0.4)','rgba(30, 58, 138, 0.2)','rgba(30, 58, 138, 0)'
        ]);
        ctx.strokeStyle = gradient4;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Central glow (Brightest Beige)
        const glowGradient = createGradient(centerX, centerY, 0, size * 0.15, [
            'rgba(240, 230, 200, 0.6)','rgba(147, 112, 219, 0.3)','rgba(147, 112, 219, 0.1)','rgba(30, 58, 138, 0)'
        ]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        ctx.restore();
        
        requestAnimationFrame(animate);
    }
        
        animate();
}

// Modify the Intersection Observer to start the animation when it's visible
const visionSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initMandalaAnimation();
        }
    });
}, { threshold: 0.1 });

const visionSection = document.getElementById('vision');
if (visionSection) {
    visionSectionObserver.observe(visionSection);
}



// --- Sacred Heart Contemplation Animation ---

function initSacredHeartAnimation() {
    const canvas = document.getElementById('sacred-heart-canvas');
    if (!canvas || canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';

    const scriptureVerses = [
        "In the beginning was the Word...", // John 1:1
        "The light shines in the darkness.", // John 1:5
        "I am the light of the world.", // John 8:12
        "Your word is a lamp for my feet.", // Psalm 119:105
        "For in him all things were created.", // Colossians 1:16
        "The path of the just is as a shining light.", // Proverbs 4:18
        "In Him all things hold together.", //Collossians 1:17
        "Love one another: just as I have loved you", //John 13:34-35
        "The way, and the truth, and the life", // John 14:6
        "Let your light so shine before men.", // Matthew 5:16
        "God is love.",
        "God is light.",
        "Christ, have mercy on us.",
        "Lord, have mercy on us.",
        "Heart of Jesus, of Infinite Majesty.",
        "Heart of Jesus, House of God and Gate of Heaven.",
        "Heart of Jesus, abode of justice and love.",
        "Heart of Jesus, patient and most merciful.",
        "Heart of Jesus, our life and resurrection.",
        "Make our hearts like to Thine.",
        "In life and in death, I place my trust in You.",
        "In all my work, I place my trust in You.",
        "In time and in eternity, I place my trust in You.",
        "Lamb of God, have mercy on us.",
        "Have mercy on us.",

    ];


    const ctx = canvas.getContext('2d');
    const wrapper = canvas.parentElement;

    let canvasWidth = wrapper.offsetWidth;
    let canvasHeight = wrapper.offsetHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let time = 0;
    const particles = [];
    const particleCount = 300;
    const PHI = (1 + Math.sqrt(5)) / 2;

    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    let baseRadius = Math.min(canvasWidth, canvasHeight) * 0.12;
    
    let mouseX = centerX;
    let mouseY = centerY;
    let clickRipples = [];
    let activeVerses = [];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.angle = Math.random() * Math.PI * 2;
            this.toroidalAngle = Math.random() * Math.PI * 2;
            this.radius = baseRadius + Math.random() * baseRadius * PHI;
            this.speed = 0.001 + Math.random() * 0.002;
            this.size = Math.random() * 2 + 0.5;
            this.life = 1;
            this.decay = 0.001 + Math.random() * 0.002;
            this.colorPhase = Math.random() * Math.PI * 2;
            this.colorType = Math.floor(Math.random() * 4);
        }
        update() {
            this.toroidalAngle += this.speed;
            this.angle += this.speed * 0.5;
            const geoInfluence = Math.sin(time * 0.001 + this.angle * 3) * 0.5 + 0.5;
            const majorRadius = this.radius * (1 + geoInfluence * 0.3);
            const minorRadius = baseRadius * PHI * 0.3 * Math.sin(time * 0.001 + this.colorPhase);
            const vesicaOffset = Math.sin(this.angle * 2) * baseRadius * 0.2;
            const x = centerX + (majorRadius + minorRadius * Math.cos(this.toroidalAngle)) * Math.cos(this.angle) + vesicaOffset;
            const y = centerY + (majorRadius + minorRadius * Math.cos(this.toroidalAngle)) * Math.sin(this.angle);
            const z = minorRadius * Math.sin(this.toroidalAngle);
            const dx = mouseX - x;
            const dy = mouseY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const attraction = Math.max(0, 1 - dist / (baseRadius * 3));
            this.x = x + dx * attraction * 0.1;
            this.y = y + dy * attraction * 0.1 + z * 0.5;
            this.life -= this.decay;
            if (this.life <= 0) this.reset();
        }
        draw() {
            const alpha = this.life * this.life;
            let r, g, b;
            const phase = time * 0.001 + this.colorPhase;
            switch(this.colorType) {
                case 0: r = 255; g = 50 + Math.sin(phase) * 50; b = 100 + Math.sin(phase * 1.5) * 50; break;
                case 1: r = 100 + Math.sin(phase * 1.5) * 50; g = 150 + Math.sin(phase) * 50; b = 255; break;
                case 2: r = 255; g = 215 + Math.sin(phase) * 40; b = 0; break;
                case 3: r = g = b = 255; break;
            }
            ctx.save();
            ctx.globalAlpha = alpha * 0.7;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            if (this.colorType === 3 && alpha > 0.5) {
                ctx.globalAlpha = alpha * 0.3;
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x - this.size * 2, this.y); ctx.lineTo(this.x + this.size * 2, this.y);
                ctx.moveTo(this.x, this.y - this.size * 2); ctx.lineTo(this.x, this.y + this.size * 2);
                ctx.stroke();
            }
            ctx.restore();
        }
    }


    for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); }

    function drawHeart() {
        const scale = 1 + Math.sin(time * 0.002) * 0.05;
        const size = baseRadius * scale;
        ctx.save();
        ctx.translate(centerX, centerY);
        for (let layer = 3; layer >= 0; layer--) {
            const layerScale = 1 + layer * 0.1;
            const layerAlpha = 0.2 / (layer + 1);
            const gradient = ctx.createRadialGradient(0, -size * 0.2, 0, 0, 0, size * layerScale * 2);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${layerAlpha})`);
            gradient.addColorStop(0.2, `rgba(255, 200, 200, ${layerAlpha * 0.8})`);
            gradient.addColorStop(0.4, `rgba(255, 100, 100, ${layerAlpha * 0.6})`);
            gradient.addColorStop(0.6, `rgba(150, 100, 255, ${layerAlpha * 0.4})`);
            gradient.addColorStop(0.8, `rgba(100, 100, 255, ${layerAlpha * 0.2})`);
            gradient.addColorStop(1, 'rgba(50, 50, 150, 0)');
            ctx.shadowBlur = 50 + layer * 20;
            ctx.shadowColor = layer % 2 === 0 ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 150, 255, 0.6)';
            ctx.fillStyle = gradient;
            ctx.beginPath();
            for (let i = 0; i <= Math.PI * 2; i += 0.01) {
                const x = 16 * Math.pow(Math.sin(i), 3) * size * layerScale / 16;
                const y = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)) * size * layerScale / 16;
                if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
            }
            ctx.closePath();
            ctx.fill();
        }
        const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.8);
        innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        innerGradient.addColorStop(0.5, 'rgba(255, 235, 205, 0.4)');
        innerGradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(255, 255, 255, 1)';
        ctx.fillStyle = innerGradient;
        ctx.fill();
        ctx.restore();
    }

    function drawRays() {
                const rayCount = 48; // More rays for finer magnetic field effect
                
                ctx.save();
                ctx.translate(centerX, centerY);
                
                // Draw magnetic field-inspired red and blue rays
                for (let i = 0; i < rayCount; i++) {
                    const baseAngle = (i / rayCount) * Math.PI * 2;
                    // Add subtle magnetic field curvature
                    const magneticWarp = Math.sin(time * 0.001 + i * 0.5) * 0.1;
                    const angle = baseAngle + magneticWarp;
                    
                    // Varying lengths create organic field pattern
                    const lengthVariation = Math.sin(i * PHI + time * 0.001) * 0.3 + 0.7;
                    const length = baseRadius * 6 * lengthVariation;
                    
                    // Ultra-thin lines like magnetic field lines
                    const width = 0.5 + Math.sin(time * 0.005 + i * 2) * 0.3;
                    
                    // Alternating red and blue rays
                    const isRedRay = i % 2 === 0;
                    const gradient = ctx.createLinearGradient(0, 0, Math.cos(angle) * length, Math.sin(angle) * length);
                    
                    if (isRedRay) {
                        // Sacred red ray - more intense at center
                        gradient.addColorStop(0, 'rgba(255, 0, 50, 1)');
                        gradient.addColorStop(0.1, 'rgba(255, 30, 80, 0.9)');
                        gradient.addColorStop(0.3, 'rgba(255, 60, 100, 0.6)');
                        gradient.addColorStop(0.6, 'rgba(255, 100, 130, 0.3)');
                        gradient.addColorStop(1, 'rgba(255, 150, 180, 0)');
                    } else {
                        // Divine blue ray - more intense at center
                        gradient.addColorStop(0, 'rgba(50, 100, 255, 1)');
                        gradient.addColorStop(0.1, 'rgba(80, 130, 255, 0.9)');
                        gradient.addColorStop(0.3, 'rgba(100, 160, 255, 0.6)');
                        gradient.addColorStop(0.6, 'rgba(130, 180, 255, 0.3)');
                        gradient.addColorStop(1, 'rgba(180, 200, 255, 0)');
                    }
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = width;
                    ctx.globalAlpha = 0.8 + Math.sin(time * 0.002 + i * 0.3) * 0.2;
                    ctx.lineCap = 'round';
                    
                    // Subtle glow for magnetic field effect
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = isRedRay ? 'rgba(255, 0, 100, 0.3)' : 'rgba(50, 150, 255, 0.3)';
                    
                    // Draw curved magnetic field line
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    
                    // Create slight curvature like magnetic field lines
                    const steps = 20;
                    for (let j = 0; j <= steps; j++) {
                        const t = j / steps;
                        const r = t * length;
                        // Add subtle field line curvature
                        const curveOffset = Math.sin(t * Math.PI) * Math.sin(baseAngle * 3) * 10;
                        const x = Math.cos(angle) * r + Math.sin(angle) * curveOffset * t;
                        const y = Math.sin(angle) * r - Math.cos(angle) * curveOffset * t;
                        
                        if (j === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    
                    ctx.stroke();
                }
                
                // Add secondary field lines - even thinner
                ctx.globalAlpha = 0.3;
                for (let i = 0; i < rayCount * 2; i++) {
                    const angle = (i / (rayCount * 2)) * Math.PI * 2 + Math.PI / (rayCount * 2);
                    const length = baseRadius * 4 + Math.sin(time * 0.001 + i) * baseRadius;
                    
                    const gradient = ctx.createLinearGradient(0, 0, Math.cos(angle) * length, Math.sin(angle) * length);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.25;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.2)';
                    
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
                    ctx.stroke();
                }
                
                ctx.restore();
    }
    function drawSacredGeometry() {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.globalAlpha = 0.1;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.lineWidth = 0.5;
                
                // Flower of Life pattern
                const flowerRadius = baseRadius * 2;
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const x = Math.cos(angle) * flowerRadius;
                    const y = Math.sin(angle) * flowerRadius;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, flowerRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Central circle
                ctx.beginPath();
                ctx.arc(0, 0, flowerRadius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Golden spiral
                ctx.globalAlpha = 0.05;
                ctx.beginPath();
                let spiralRadius = 10;
                for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
                    spiralRadius = 10 * Math.pow(PHI, angle / (Math.PI * 2));
                    const x = Math.cos(angle) * spiralRadius;
                    const y = Math.sin(angle) * spiralRadius;
                    
                    if (angle === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                ctx.restore();
    }

    function animate() {
        const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvasWidth, canvasHeight));
        bgGradient.addColorStop(0, 'rgba(10, 0, 20, 0.98)');
        bgGradient.addColorStop(0.5, 'rgba(0, 0, 30, 0.98)');
        bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        drawSacredGeometry();
        drawRays();
        drawHeart();
        
        particles.forEach(particle => { particle.update(); particle.draw(); });
        
        activeVerses = activeVerses.filter(verse => {
            verse.life -= verse.decay;
            verse.y -= 0.5; // Make the text float upwards

            if (verse.life > 0) {
                ctx.save();
                ctx.globalAlpha = verse.life;
                ctx.fillStyle = 'rgba(255, 215, 0, 0.7)'; // Golden color
                ctx.shadowColor = 'rgba(255, 215, 0, 1)';
                ctx.shadowBlur = 10;
                ctx.font = 'italic 20px Georgia';
                ctx.textAlign = 'center';
                ctx.fillText(verse.text, verse.x, verse.y);
                ctx.restore();
                return true;
            }
            return false;
        });
    // --- END: NEW SCRIPTURE VERSE DRAWING LOGIC ---


        clickRipples = clickRipples.filter(ripple => {
            ripple.radius += 3; ripple.life -= 0.02;
            if (ripple.life > 0) {
                ctx.save();
                ctx.globalAlpha = ripple.life;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                return true;
            }
            return false;
        });
        
        time++;
        requestAnimationFrame(animate);
    }

    wrapper.addEventListener('mousemove', (e) => { 
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left; 
        mouseY = e.clientY - rect.top; 
    });

    wrapper.addEventListener('click', (e) => { 
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Add the click ripple effect (this was already here)
        clickRipples.push({ x: clickX, y: clickY, radius: 0, life: 1 });

        // NEW: Select a random verse and add it to our active list
        const verseText = scriptureVerses[Math.floor(Math.random() * scriptureVerses.length)];
        activeVerses.push({
            text: verseText,
            x: clickX,
            y: clickY,
            life: 1.0, // Start at full opacity
            decay: 0.004 // How fast it fades per frame
        });
    });

    // Handle resize
    window.addEventListener('resize', () => {
        canvasWidth = wrapper.offsetWidth;
        canvasHeight = wrapper.offsetHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        centerX = canvasWidth / 2;
        centerY = canvasHeight / 2;
        baseRadius = Math.min(canvasWidth, canvasHeight) * 0.12;
    });
    
    animate();
}

// Use an Intersection Observer to start the animation only when it's visible
const sacredHeartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initSacredHeartAnimation();
        }
    });
}, { threshold: 0.1 });

const sacredHeartSection = document.getElementById('sacred-heart');
if (sacredHeartSection) {
    sacredHeartObserver.observe(sacredHeartSection);
}

