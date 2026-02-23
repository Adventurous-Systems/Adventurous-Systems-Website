/**
 * Interactive Digital Twin Graph Animation
 * Renders a knowledge graph/network that visualizes data flow (e.g. material passports) 
 * and highlights connections when queried (hovered).
 */

export function initNetworkAnimation() {
    const canvas = document.getElementById('hero-network');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let packets = [];
    let animationFrameId;

    // Mouse properties (acts as the query/inspection point)
    const mouse = { x: null, y: null, radius: 150 };

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
        constructor(id) {
            this.id = id;
            this.x = Math.random() * width;
            this.y = Math.random() * height;

            // Differentiate node importance visually
            const rank = Math.random();
            if (rank > 0.90) {
                // Primary hubs (large)
                this.baseSize = Math.random() * 2 + 3;
                this.color = 'rgba(74, 222, 128, 0.9)'; // Accent light
            } else if (rank > 0.4) {
                // Standard nodes (medium)
                this.baseSize = Math.random() * 1.5 + 1.5;
                this.color = 'rgba(45, 134, 89, 0.7)'; // Accent
            } else {
                // Data points (small)
                this.baseSize = Math.random() * 1 + 1;
                this.color = 'rgba(212, 244, 221, 0.4)'; // Accent bg
            }

            this.size = this.baseSize;

            // Very slow, deliberate drift like a stabilizing graph laying out
            const speed = Math.random() * 0.15 + 0.05;
            this.velocityX = (Math.random() - 0.5) * speed;
            this.velocityY = (Math.random() - 0.5) * speed;
            this.connections = [];
        }

        draw(isFocused, isConnected) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            if (isFocused) {
                // The actively inspected node glows intensely
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(74, 222, 128, 1)';
            } else if (isConnected) {
                // Immediate network of the inspected node
                ctx.fillStyle = 'rgba(74, 222, 128, 0.9)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(45, 134, 89, 0.8)';
            } else {
                // Idle nodes
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 0;
            }

            ctx.fill();
            ctx.shadowBlur = 0; // reset for next drawing operations
        }

        update() {
            // Constant background drift
            this.x += this.velocityX;
            this.y += this.velocityY;

            // Bounce off edges smoothly
            if (this.x < 0 || this.x > width) this.velocityX *= -1;
            if (this.y < 0 || this.y > height) this.velocityY *= -1;

            // Inspection pull - nodes near the mouse are gently drawn closer, 
            // visualizing "querying" the digital twin graph
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Very gentle attraction (positive instead of negative repulsion)
                    this.x += dx * force * 0.01;
                    this.y += dy * force * 0.01;
                }
            }
        }
    }

    class DataPacket {
        constructor(startX, startY, targetX, targetY) {
            this.x = startX;
            this.y = startY;
            this.targetX = targetX;
            this.targetY = targetY;
            this.progress = 0;
            // Variable speed for data flow
            this.speed = 0.015 + Math.random() * 0.02;
        }

        update() {
            this.progress += this.speed;
        }

        draw() {
            const currentX = this.x + (this.targetX - this.x) * this.progress;
            const currentY = this.y + (this.targetY - this.y) * this.progress;

            ctx.beginPath();
            ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#4ade80'; // Green glowing data dot
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particles = [];
        packets = [];
        // Calculate particle count relative to screen area so sparse but readable
        let numParticles = Math.floor((width * height) / 12000);

        // Cap particles for performance and clarity
        if (numParticles > 120) numParticles = 120;
        if (numParticles < 40) numParticles = 40;

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(i));
        }
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        // Identify the node closest to the user's cursor
        let hoveredParticle = null;
        let minDist = Infinity;

        if (mouse.x != null && mouse.y != null) {
            for (let i = 0; i < particles.length; i++) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                // "Focus" range is tighter than general attraction radius
                if (dist < 100 && dist < minDist) {
                    minDist = dist;
                    hoveredParticle = particles[i];
                }
            }
        }

        const connectedToHover = new Set();
        if (hoveredParticle) {
            connectedToHover.add(hoveredParticle.id);
        }

        // 1. Calculate and Draw Edges First
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); // update position first
            particles[i].connections = []; // Reset per frame

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distanceSq = dx * dx + dy * dy;

                // Threshold distance to connect nodes (approx 122px)
                if (distanceSq < 15000) {
                    particles[i].connections.push(particles[j]);
                    particles[j].connections.push(particles[i]);

                    const isHoverEdge = hoveredParticle &&
                        (hoveredParticle === particles[i] || hoveredParticle === particles[j]);

                    if (isHoverEdge) {
                        connectedToHover.add(particles[i].id);
                        connectedToHover.add(particles[j].id);

                        // Spawn data packets along active queried edges (Material Passports flowing)
                        if (Math.random() < 0.04) {
                            // Flow outward from the hovered node
                            if (hoveredParticle === particles[i]) {
                                packets.push(new DataPacket(particles[i].x, particles[i].y, particles[j].x, particles[j].y));
                            } else {
                                packets.push(new DataPacket(particles[j].x, particles[j].y, particles[i].x, particles[i].y));
                            }
                        }
                    }

                    const distance = Math.sqrt(distanceSq);
                    const baseOpacity = 1 - (distance / 122);
                    // Dim non-hovered edges slightly if a node is being inspected
                    let opacity = baseOpacity * 0.3;
                    if (hoveredParticle) opacity = isHoverEdge ? baseOpacity * 0.9 : baseOpacity * 0.1;

                    ctx.strokeStyle = isHoverEdge ?
                        `rgba(74, 222, 128, ${opacity})` :
                        `rgba(45, 134, 89, ${opacity})`;

                    ctx.lineWidth = isHoverEdge ? 1.5 : 0.8;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // 2. Draw active Packets
        for (let i = packets.length - 1; i >= 0; i--) {
            packets[i].update();
            packets[i].draw();
            // Remove packets that have reached their target
            if (packets[i].progress >= 1) {
                packets.splice(i, 1);
            }
        }

        // 3. Draw Nodes (Particles) on top
        for (let i = 0; i < particles.length; i++) {
            const isFocused = hoveredParticle === particles[i];
            const isConnected = connectedToHover.has(particles[i].id);
            particles[i].draw(isFocused, isConnected);
        }
    }

    // Initialize and start animation
    resize();
    animate();

    // Return cleanup function
    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
}
