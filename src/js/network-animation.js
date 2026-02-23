/**
 * Interactive Network Animation
 * Renders a highly optimized particle network reacting to mouse movement.
 */

export function initNetworkAnimation() {
    const canvas = document.getElementById('hero-network');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;

    // Mouse properties
    const mouse = { x: null, y: null, radius: 200 };

    function resize() {
        const parent = canvas.parentElement;
        if (!parent) return;
        width = parent.offsetWidth;
        height = parent.offsetHeight;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        initParticles();
    }

    // Debounce resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 100);
    });

    // Track mouse over the hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroSection.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // --color-accent-light RGB is 74, 222, 128
            this.color = 'rgba(74, 222, 128, 0.8)';
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 20) + 1;

            // Random velocity
            const speed = 0.5;
            this.velocityX = (Math.random() - 0.5) * speed;
            this.velocityY = (Math.random() - 0.5) * speed;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Idle movement
            this.x += this.velocityX;
            this.y += this.velocityY;

            // Bounce off edges smoothly
            if (this.x < 0 || this.x > width) this.velocityX *= -1;
            if (this.y < 0 || this.y > height) this.velocityY *= -1;

            // Mouse interaction - gentle repulsion
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;

                if (force < 0) force = 0;

                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) {
                    this.x -= directionX * 0.5;
                    this.y -= directionY * 0.5;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        // Calculate particle count based on screen area to keep density consistent
        let numParticles = Math.floor((width * height) / 12000);

        // Cap particles for performance
        if (numParticles > 150) numParticles = 150;
        if (numParticles < 40) numParticles = 40;

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby nodes
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = dx * dx + dy * dy;

                if (distance < 12000) {
                    const opacity = 1 - (distance / 12000);
                    // --color-accent RGB is 45, 134, 89
                    ctx.strokeStyle = `rgba(45, 134, 89, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Initialize and start animation
    resize();
    animate();

    // Return cleanup function just in case
    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
}
