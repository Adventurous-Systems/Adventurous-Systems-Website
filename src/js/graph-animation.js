/**
 * AECO Knowledge Graph Animation
 * Renders a semantic, interactive graph of real-world construction component
 * relationships in the hero right-hand panel.
 */

// ─── Flow Data ────────────────────────────────────────────────────────────────
// nx/ny are normalised (0–1) canvas coords; scaled to pixels at runtime.

const FLOWS = [
    {
        id: 0,
        name: 'Structural Foundation Chain',
        nodes: [
            { id: 'site-survey', label: 'Site Survey', nx: 0.12, ny: 0.72 },
            { id: 'foundation', label: 'Foundation', nx: 0.33, ny: 0.85 },
            { id: 'ground-beam', label: 'Ground Beam', nx: 0.55, ny: 0.70 },
            { id: 'str-column', label: 'Structural Column', nx: 0.74, ny: 0.50 },
            { id: 'floor-slab', label: 'Floor Slab', nx: 0.87, ny: 0.28 },
        ],
        edges: [
            { from: 'site-survey', to: 'foundation', relation: 'SURVEYS' },
            { from: 'foundation', to: 'ground-beam', relation: 'SUPPORTS' },
            { from: 'ground-beam', to: 'str-column', relation: 'ANCHORS' },
            { from: 'str-column', to: 'floor-slab', relation: 'CARRIES' },
        ],
    },
    {
        id: 1,
        name: 'Facade Assembly',
        nodes: [
            { id: 'str-frame', label: 'Structural Frame', nx: 0.10, ny: 0.50 },
            { id: 'ext-wall', label: 'External Wall', nx: 0.32, ny: 0.28 },
            { id: 'window-frame', label: 'Window Frame', nx: 0.54, ny: 0.18 },
            { id: 'glazing', label: 'Glazing Panel', nx: 0.72, ny: 0.38 },
            { id: 'curtain-wall', label: 'Curtain Wall', nx: 0.86, ny: 0.65 },
        ],
        edges: [
            { from: 'str-frame', to: 'ext-wall', relation: 'ENCLOSES' },
            { from: 'ext-wall', to: 'window-frame', relation: 'CONTAINS' },
            { from: 'window-frame', to: 'glazing', relation: 'HOLDS' },
            { from: 'glazing', to: 'curtain-wall', relation: 'FORMS' },
        ],
    },
    {
        id: 2,
        name: 'Vertical Access Stack',
        nodes: [
            { id: 'v-found', label: 'Foundation', nx: 0.22, ny: 0.84 },
            { id: 'core-wall', label: 'Core Wall', nx: 0.27, ny: 0.60 },
            { id: 'staircase', label: 'Staircase', nx: 0.50, ny: 0.44 },
            { id: 'landing', label: 'Landing', nx: 0.68, ny: 0.62 },
            { id: 'roof-struct', label: 'Roof Structure', nx: 0.80, ny: 0.24 },
        ],
        edges: [
            { from: 'v-found', to: 'core-wall', relation: 'SUPPORTS' },
            { from: 'core-wall', to: 'staircase', relation: 'HOUSES' },
            { from: 'staircase', to: 'landing', relation: 'LEADS_TO' },
            { from: 'landing', to: 'roof-struct', relation: 'CONNECTS_TO' },
        ],
    },
    {
        id: 3,
        name: 'MEP Coordination',
        nodes: [
            { id: 'duct-shaft', label: 'Duct Shaft', nx: 0.14, ny: 0.40 },
            { id: 'hvac', label: 'HVAC Unit', nx: 0.36, ny: 0.22 },
            { id: 'dist-duct', label: 'Distribution Duct', nx: 0.57, ny: 0.42 },
            { id: 'diffuser', label: 'Diffuser', nx: 0.74, ny: 0.26 },
            { id: 'zone-ctrl', label: 'Zone Controller', nx: 0.84, ny: 0.65 },
        ],
        edges: [
            { from: 'duct-shaft', to: 'hvac', relation: 'FEEDS' },
            { from: 'hvac', to: 'dist-duct', relation: 'DISTRIBUTES' },
            { from: 'dist-duct', to: 'diffuser', relation: 'TERMINATES_AT' },
            { from: 'diffuser', to: 'zone-ctrl', relation: 'REPORTS_TO' },
        ],
    },
    {
        id: 4,
        name: 'Material Passport Chain',
        nodes: [
            { id: 'raw-mat', label: 'Raw Material', nx: 0.10, ny: 0.68 },
            { id: 'comp-spec', label: 'Component Spec', nx: 0.30, ny: 0.48 },
            { id: 'installed', label: 'Installed Element', nx: 0.52, ny: 0.33 },
            { id: 'passport', label: 'Material Passport', nx: 0.70, ny: 0.52 },
            { id: 'circ-record', label: 'Circular Record', nx: 0.86, ny: 0.75 },
        ],
        edges: [
            { from: 'raw-mat', to: 'comp-spec', relation: 'SPECIFIES' },
            { from: 'comp-spec', to: 'installed', relation: 'BECOMES' },
            { from: 'installed', to: 'passport', relation: 'RECORDS' },
            { from: 'passport', to: 'circ-record', relation: 'ENABLES' },
        ],
    },
    {
        id: 5,
        name: 'Digital Twin Lifecycle',
        nodes: [
            { id: 'design-model', label: 'Design Model (BIM)', nx: 0.10, ny: 0.32 },
            { id: 'const-record', label: 'Construction Record', nx: 0.32, ny: 0.56 },
            { id: 'iot-sensor', label: 'IoT Sensor', nx: 0.52, ny: 0.28 },
            { id: 'digital-twin', label: 'Digital Twin', nx: 0.70, ny: 0.50 },
            { id: 'ai-analytics', label: 'AI Analytics', nx: 0.87, ny: 0.24 },
        ],
        edges: [
            { from: 'design-model', to: 'const-record', relation: 'VALIDATES' },
            { from: 'const-record', to: 'iot-sensor', relation: 'MONITORS' },
            { from: 'iot-sensor', to: 'digital-twin', relation: 'UPDATES' },
            { from: 'digital-twin', to: 'ai-analytics', relation: 'FEEDS' },
        ],
    },
    {
        id: 6,
        name: 'Procurement to Installation',
        nodes: [
            { id: 'bom', label: 'Bill of Materials', nx: 0.12, ny: 0.24 },
            { id: 'proc-ord', label: 'Procurement Order', nx: 0.34, ny: 0.46 },
            { id: 'delivered', label: 'Delivered Component', nx: 0.55, ny: 0.28 },
            { id: 'inst-rec', label: 'Installation Record', nx: 0.72, ny: 0.52 },
            { id: 'qa', label: 'QA Sign-off', nx: 0.86, ny: 0.36 },
        ],
        edges: [
            { from: 'bom', to: 'proc-ord', relation: 'GENERATES' },
            { from: 'proc-ord', to: 'delivered', relation: 'FULFILS' },
            { from: 'delivered', to: 'inst-rec', relation: 'LOGS' },
            { from: 'inst-rec', to: 'qa', relation: 'TRIGGERS' },
        ],
    },
    {
        id: 7,
        name: 'Structural Load Path',
        nodes: [
            { id: 'roof-load', label: 'Roof Load', nx: 0.50, ny: 0.10 },
            { id: 'beam', label: 'Beam', nx: 0.40, ny: 0.32 },
            { id: 'column', label: 'Column', nx: 0.60, ny: 0.54 },
            { id: 'pad-found', label: 'Pad Foundation', nx: 0.36, ny: 0.74 },
            { id: 'ground', label: 'Ground', nx: 0.50, ny: 0.90 },
        ],
        edges: [
            { from: 'roof-load', to: 'beam', relation: 'TRANSFERS' },
            { from: 'beam', to: 'column', relation: 'TRANSFERS' },
            { from: 'column', to: 'pad-found', relation: 'DISTRIBUTES' },
            { from: 'pad-found', to: 'ground', relation: 'TRANSMITS' },
        ],
    },
    {
        id: 8,
        name: 'Smart Building Systems',
        nodes: [
            { id: 'occ-sensor', label: 'Occupancy Sensor', nx: 0.12, ny: 0.56 },
            { id: 'bms', label: 'BMS Controller', nx: 0.34, ny: 0.28 },
            { id: 'energy-m', label: 'Energy Meter', nx: 0.57, ny: 0.18 },
            { id: 'carbon-r', label: 'Carbon Report', nx: 0.75, ny: 0.40 },
            { id: 'esg', label: 'ESG Dashboard', nx: 0.86, ny: 0.68 },
        ],
        edges: [
            { from: 'occ-sensor', to: 'bms', relation: 'SIGNALS' },
            { from: 'bms', to: 'energy-m', relation: 'READS' },
            { from: 'energy-m', to: 'carbon-r', relation: 'GENERATES' },
            { from: 'carbon-r', to: 'esg', relation: 'FEEDS' },
        ],
    },
    {
        id: 9,
        name: 'Circular Demolition Loop',
        nodes: [
            { id: 'asset-reg', label: 'Asset Register', nx: 0.50, ny: 0.14 },
            { id: 'decon', label: 'Deconstruction Plan', nx: 0.82, ny: 0.38 },
            { id: 'salvaged', label: 'Salvaged Element', nx: 0.72, ny: 0.76 },
            { id: 'mat-reuse', label: 'Material Reuse', nx: 0.28, ny: 0.76 },
            { id: 'new-proj', label: 'New Project', nx: 0.18, ny: 0.38 },
        ],
        edges: [
            { from: 'asset-reg', to: 'decon', relation: 'INFORMS' },
            { from: 'decon', to: 'salvaged', relation: 'PRODUCES' },
            { from: 'salvaged', to: 'mat-reuse', relation: 'ENABLES' },
            { from: 'mat-reuse', to: 'new-proj', relation: 'INCORPORATES' },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bezierPt(ax, ay, cpx, cpy, bx, by, t) {
    const mt = 1 - t;
    return {
        x: mt * mt * ax + 2 * mt * t * cpx + t * t * bx,
        y: mt * mt * ay + 2 * mt * t * cpy + t * t * by,
    };
}

function calcCP(ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len, ny = dx / len;
    return { x: (ax + bx) / 2 + nx * len * 0.18, y: (ay + by) / 2 + ny * len * 0.18 };
}

function drawRRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function initGraphAnimation(canvasId, panelId, legendId) {
    const canvas = document.getElementById(canvasId);
    const panel = document.getElementById(panelId);
    const legendEl = document.getElementById(legendId);
    if (!canvas || !panel) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;

    // ── Ambient background particles ──────────────────────────────────────────
    const bgParticles = [];

    function BgParticle() {
        this.reset = () => {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            const spd = Math.random() * 0.14 + 0.04;
            this.vx = (Math.random() - 0.5) * spd;
            this.vy = (Math.random() - 0.5) * spd;
            const r = Math.random();
            if (r > 0.88) { this.sz = Math.random() * 1.5 + 2; this.col = 'rgba(74,222,128,0.45)'; }
            else if (r > 0.40) { this.sz = Math.random() * 1 + 1.2; this.col = 'rgba(45,134,89,0.35)'; }
            else { this.sz = Math.random() * 0.8 + 0.8; this.col = 'rgba(212,244,221,0.22)'; }
        };
        this.reset();
    }
    BgParticle.prototype.update = function () {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    };
    BgParticle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
        ctx.fillStyle = this.col;
        ctx.fill();
    };

    // ── Flow state ────────────────────────────────────────────────────────────
    let currentFlowIdx = 5; // Digital Twin Lifecycle on load
    let activeNodes = [], activeEdges = [];
    let fadingNodes = [], fadingEdges = [];
    let packets = [];
    let isHovering = false;
    let cycleTimer = null;

    // ── GraphNode ─────────────────────────────────────────────────────────────
    function GraphNode(def, w, h) {
        this.id = def.id;
        this.label = def.label;
        this.x = def.nx * w;
        this.y = def.ny * h;
        this.alpha = 0; this.targetAlpha = 0;
        this.scale = 0; this.targetScale = 0;
        this.highlighted = false;
    }
    GraphNode.prototype.update = function () {
        this.alpha += (this.targetAlpha - this.alpha) * 0.06;
        this.scale += (this.targetScale - this.scale) * 0.07;
    };
    GraphNode.prototype.draw = function () {
        if (this.alpha < 0.01) return;
        const r = this.highlighted ? 7.5 : 5.5;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.alpha;

        // Outer glow ring
        ctx.shadowBlur = this.highlighted ? 22 : 12;
        ctx.shadowColor = 'rgba(74,222,128,0.75)';
        ctx.beginPath();
        ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = this.highlighted ? 'rgba(74,222,128,1)' : 'rgba(74,222,128,0.55)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner filled circle
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Label pill (not scaled)
        if (this.alpha > 0.15) {
            this._drawLabel();
        }
        ctx.globalAlpha = 1;
    };
    GraphNode.prototype._drawLabel = function () {
        ctx.globalAlpha = this.alpha;
        ctx.font = 'bold 9px Inter, system-ui, sans-serif';
        const tw = ctx.measureText(this.label).width;
        const pw = tw + 14, ph = 17;
        const px = this.x - pw / 2;
        const py = this.y + (this.highlighted ? 7.5 : 5.5) * this.scale + 7;

        ctx.fillStyle = 'rgba(8,16,38,0.88)';
        drawRRect(ctx, px, py, pw, ph, 3);
        ctx.fill();

        ctx.strokeStyle = this.highlighted ? 'rgba(74,222,128,0.85)' : 'rgba(74,222,128,0.38)';
        ctx.lineWidth = 0.8;
        drawRRect(ctx, px, py, pw, ph, 3);
        ctx.stroke();

        ctx.fillStyle = this.highlighted ? '#ffffff' : 'rgba(255,255,255,0.88)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 9px Inter, system-ui, sans-serif';
        ctx.fillText(this.label, this.x, py + ph / 2);
        ctx.globalAlpha = 1;
    };

    // ── GraphEdge ─────────────────────────────────────────────────────────────
    function GraphEdge(def, nodesMap) {
        this.from = nodesMap.get(def.from);
        this.to = nodesMap.get(def.to);
        this.relation = def.relation;
        this.alpha = 0; this.targetAlpha = 0;
        this.labelAlpha = 0.18;
        this.hovered = false;
        this._cp = null;
    }
    GraphEdge.prototype.cp = function () {
        if (!this._cp) {
            this._cp = calcCP(this.from.x, this.from.y, this.to.x, this.to.y);
        }
        return this._cp;
    };
    GraphEdge.prototype.update = function () {
        this.alpha += (this.targetAlpha - this.alpha) * 0.045;
        const tLbl = this.hovered ? 0.95 : 0.18;
        this.labelAlpha += (tLbl - this.labelAlpha) * 0.1;
    };
    GraphEdge.prototype.draw = function () {
        if (this.alpha < 0.01) return;
        const cp = this.cp();

        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = this.hovered ? 10 : 4;
        ctx.shadowColor = this.hovered ? 'rgba(74,222,128,0.55)' : 'rgba(21,112,225,0.3)';

        ctx.beginPath();
        ctx.moveTo(this.from.x, this.from.y);
        ctx.quadraticCurveTo(cp.x, cp.y, this.to.x, this.to.y);
        ctx.strokeStyle = this.hovered ? 'rgba(74,222,128,0.85)' : 'rgba(21,112,225,0.65)';
        ctx.lineWidth = this.hovered ? 2 : 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Arrowhead
        const p0 = bezierPt(this.from.x, this.from.y, cp.x, cp.y, this.to.x, this.to.y, 0.92);
        const dx = this.to.x - p0.x, dy = this.to.y - p0.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len, uy = dy / len;
        ctx.beginPath();
        ctx.moveTo(this.to.x, this.to.y);
        ctx.lineTo(this.to.x - ux * 9 - uy * 5, this.to.y - uy * 9 + ux * 5);
        ctx.lineTo(this.to.x - ux * 9 + uy * 5, this.to.y - uy * 9 - ux * 5);
        ctx.closePath();
        ctx.fillStyle = this.hovered ? 'rgba(74,222,128,0.85)' : 'rgba(21,112,225,0.65)';
        ctx.fill();

        // Relation label
        const mid = bezierPt(this.from.x, this.from.y, cp.x, cp.y, this.to.x, this.to.y, 0.5);
        ctx.globalAlpha = this.alpha * this.labelAlpha;

        if (this.hovered && this.labelAlpha > 0.5) {
            ctx.font = '8.5px Inter, system-ui, sans-serif';
            const rw = ctx.measureText(this.relation).width;
            ctx.fillStyle = 'rgba(8,16,38,0.78)';
            drawRRect(ctx, mid.x - rw / 2 - 6, mid.y - 9, rw + 12, 17, 3);
            ctx.fill();
        }

        ctx.fillStyle = 'rgba(212,244,221,1)';
        ctx.font = '8.5px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.relation, mid.x, mid.y);
        ctx.globalAlpha = 1;
    };
    GraphEdge.prototype.isNear = function (mx, my) {
        const cp = this.cp();
        for (let t = 0; t <= 1; t += 0.06) {
            const p = bezierPt(this.from.x, this.from.y, cp.x, cp.y, this.to.x, this.to.y, t);
            if ((mx - p.x) ** 2 + (my - p.y) ** 2 < 225) return true;
        }
        return false;
    };

    // ── Data Packet ───────────────────────────────────────────────────────────
    function FlowPacket(edge) {
        this.edge = edge;
        this.t = 0;
        this.speed = 0.007 + Math.random() * 0.01;
    }
    FlowPacket.prototype.update = function () { this.t += this.speed; };
    FlowPacket.prototype.done = function () { return this.t >= 1; };
    FlowPacket.prototype.draw = function () {
        const cp = this.edge.cp();
        const p = bezierPt(this.edge.from.x, this.edge.from.y, cp.x, cp.y, this.edge.to.x, this.edge.to.y, this.t);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#4ADE80';
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    };

    // ── Flow Management ───────────────────────────────────────────────────────
    function buildFlow(flowDef) {
        const nodesMap = new Map();
        const nodes = flowDef.nodes.map(def => {
            const n = new GraphNode(def, W, H);
            nodesMap.set(def.id, n);
            return n;
        });
        const edges = flowDef.edges.map(def => new GraphEdge(def, nodesMap));
        return { nodes, edges };
    }

    function startFlow(idx) {
        // Fade out current into fading buffers
        activeNodes.forEach(n => { n.targetAlpha = 0; n.targetScale = 0.5; });
        activeEdges.forEach(e => { e.targetAlpha = 0; });
        fadingNodes = [...activeNodes];
        fadingEdges = [...activeEdges];
        packets = [];

        currentFlowIdx = idx;
        const built = buildFlow(FLOWS[idx]);
        activeNodes = built.nodes;
        activeEdges = built.edges;

        // Staggered entry: nodes appear one by one, then edges draw in
        activeNodes.forEach((n, i) => {
            setTimeout(() => {
                n.targetAlpha = 1;
                n.targetScale = 1;
            }, i * 130);
        });
        const edgeDelay = activeNodes.length * 130 + 80;
        activeEdges.forEach((e, i) => {
            setTimeout(() => { e.targetAlpha = 1; }, edgeDelay + i * 90);
        });

        updateLegend(FLOWS[idx].name, null);
        resetCycleTimer();
    }

    function nextFlow() {
        startFlow((currentFlowIdx + 1) % FLOWS.length);
    }

    function resetCycleTimer() {
        clearTimeout(cycleTimer);
        cycleTimer = setTimeout(nextFlow, 10000);
    }

    // ── Legend chip ───────────────────────────────────────────────────────────
    function updateLegend(flowName, relation) {
        if (!legendEl) return;
        if (relation) {
            legendEl.innerHTML =
                `<span class="graph-legend__flow">${flowName}</span>` +
                `<span class="graph-legend__rel">⟶ ${relation}</span>`;
        } else {
            legendEl.innerHTML = `<span class="graph-legend__flow">${flowName}</span>`;
        }
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        W = panel.offsetWidth;
        H = panel.offsetHeight;
        if (!W || !H) return;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${W}px`;
        canvas.style.height = `${H}px`;

        // Reset bg particles
        bgParticles.length = 0;
        const count = Math.min(38, Math.max(18, Math.floor((W * H) / 10000)));
        for (let i = 0; i < count; i++) bgParticles.push(new BgParticle());

        // Rebuild active flow with new pixel coords (preserve alpha state)
        const prevAlphas = activeNodes.map(n => ({ a: n.alpha, ta: n.targetAlpha, s: n.scale, ts: n.targetScale }));
        const prevEAlphas = activeEdges.map(e => ({ a: e.alpha, ta: e.targetAlpha }));
        const built = buildFlow(FLOWS[currentFlowIdx]);
        built.nodes.forEach((n, i) => {
            if (prevAlphas[i]) { n.alpha = prevAlphas[i].a; n.targetAlpha = prevAlphas[i].ta; n.scale = prevAlphas[i].s; n.targetScale = prevAlphas[i].ts; }
        });
        built.edges.forEach((e, i) => {
            if (prevEAlphas[i]) { e.alpha = prevEAlphas[i].a; e.targetAlpha = prevEAlphas[i].ta; }
        });
        activeNodes = built.nodes;
        activeEdges = built.edges;
        fadingNodes = []; fadingEdges = [];
        packets = [];
    }

    // ── Mouse events ──────────────────────────────────────────────────────────
    panel.addEventListener('mouseenter', () => { isHovering = true; });
    panel.addEventListener('mouseleave', () => {
        isHovering = false;
        activeNodes.forEach(n => n.highlighted = false);
        activeEdges.forEach(e => e.hovered = false);
        updateLegend(FLOWS[currentFlowIdx].name, null);
    });
    panel.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // Nearest named node highlight
        activeNodes.forEach(n => {
            const d = Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2);
            n.highlighted = d < 55;
        });

        // Edge hover
        let found = null;
        for (const edge of activeEdges) {
            if (edge.isNear(mx, my)) { found = edge; break; }
        }
        activeEdges.forEach(e => e.hovered = (e === found));

        if (found) {
            updateLegend(FLOWS[currentFlowIdx].name,
                `${found.from.label} → ${found.to.label}: ${found.relation}`);
        } else {
            updateLegend(FLOWS[currentFlowIdx].name, null);
        }
        resetCycleTimer();
    });

    // Click to advance to next flow
    panel.addEventListener('click', () => nextFlow());

    // ── Ambient edge rendering ────────────────────────────────────────────────
    function drawBgEdges() {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < bgParticles.length; i++) {
            for (let j = i + 1; j < bgParticles.length; j++) {
                const dx = bgParticles[i].x - bgParticles[j].x;
                const dy = bgParticles[i].y - bgParticles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 85) {
                    ctx.strokeStyle = `rgba(21,112,225,${(1 - d / 85) * 0.1})`;
                    ctx.beginPath();
                    ctx.moveTo(bgParticles[i].x, bgParticles[i].y);
                    ctx.lineTo(bgParticles[j].x, bgParticles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // ── Packet spawning ───────────────────────────────────────────────────────
    function maybeSpawnPacket() {
        const rate = isHovering ? 0.28 : 0.07;
        if (Math.random() < rate && activeEdges.length > 0) {
            const edge = activeEdges[Math.floor(Math.random() * activeEdges.length)];
            if (edge.alpha > 0.5) packets.push(new FlowPacket(edge));
        }
        if (packets.length > 18) packets.shift();
    }

    // ── Animation loop ────────────────────────────────────────────────────────
    let animFrameId;
    function animate() {
        animFrameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, W, H);

        // 1. Ambient background
        bgParticles.forEach(p => p.update());
        drawBgEdges();
        bgParticles.forEach(p => p.draw());

        // 2. Fading-out flow (removed nodes/edges animate toward invisible)
        fadingEdges.forEach(e => { e.update(); e.draw(); });
        fadingNodes.forEach(n => { n.update(); n.draw(); });

        // 3. Active flow
        activeEdges.forEach(e => { e.update(); e.draw(); });
        activeNodes.forEach(n => { n.update(); n.draw(); });

        // 4. Data packets
        maybeSpawnPacket();
        for (let i = packets.length - 1; i >= 0; i--) {
            packets[i].update();
            packets[i].draw();
            if (packets[i].done()) packets.splice(i, 1);
        }
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 100);
    });

    resize();
    startFlow(5); // Digital Twin Lifecycle as the hero flow
    animate();

    // Return cleanup fn
    return () => {
        cancelAnimationFrame(animFrameId);
        clearTimeout(cycleTimer);
        clearTimeout(resizeTimer);
    };
}
