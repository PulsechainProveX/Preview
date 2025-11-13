// === HEXAGON CANVAS BACKGROUND ===
const canvas = document.getElementById('hexCanvas');
const ctx = canvas.getContext('2d');

let hexagons = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
}

function createHexagons() {
    hexagons = [];
    const count = Math.floor((canvas.width * canvas.height) / 30000);
    
    for (let i = 0; i < count; i++) {
        hexagons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 3, // 3-7px
            opacity: Math.random() * 0.04 + 0.02, // 0.02-0.06
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.01
        });
    }
}

function drawHexagon(x, y, size, angle) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const currentAngle = angle + (Math.PI / 3) * i;
        const px = x + size * Math.cos(currentAngle);
        const py = y + size * Math.sin(currentAngle);
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isDark = !document.body.classList.contains('light-theme');
    const baseColor = isDark ? '0, 212, 255' : '0, 100, 200';
    
    hexagons.forEach(hex => {
        // Parallax effect based on mouse position
        const parallaxX = (mouseX / window.innerWidth - 0.5) * 20;
        const parallaxY = (mouseY / window.innerHeight - 0.5) * 20;
        
        // Update position
        hex.x += hex.speedX;
        hex.y += hex.speedY;
        hex.angle += hex.rotationSpeed;
        
        // Wrap around screen
        if (hex.x < -20) hex.x = canvas.width + 20;
        if (hex.x > canvas.width + 20) hex.x = -20;
        if (hex.y < -20) hex.y = canvas.height + 20;
        if (hex.y > canvas.height + 20) hex.y = -20;
        
        // Draw hexagon
        ctx.save();
        ctx.fillStyle = `rgba(${baseColor}, ${hex.opacity})`;
        drawHexagon(
            hex.x + parallaxX,
            hex.y + parallaxY,
            hex.size,
            hex.angle
        );
        ctx.fill();
        ctx.restore();
    });
    
    requestAnimationFrame(animate);
}

// Mouse tracking for parallax
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Initialize canvas
resizeCanvas();
createHexagons();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    createHexagons();
});

// === THEME TOGGLE ===
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    
    // Save preference
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
}

// === CTA MODAL ===
const ctaBtn = document.getElementById('ctaBtn');
const modal = document.getElementById('ctaModal');
const modalClose = document.getElementById('modalClose');
const modalOverlay = modal.querySelector('.modal-overlay');

ctaBtn.addEventListener('click', () => {
    modal.classList.add('active');
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modalOverlay.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Handle form submission
const modalForm = modal.querySelector('.modal-form');
modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = modalForm.querySelector('input').value;
    alert(`Thank you! We'll send early access details to ${email}`);
    modal.classList.remove('active');
    modalForm.reset();
});

// === TESTIMONIAL CAROUSEL ===
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.carousel-dots .dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(index);
    });
});

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}, 6000);

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all glass cards
document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// === PRICING CARD HOVER EFFECT ===
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// === DASHBOARD PREVIEW STICKY REVEAL ===
const dashboardPreview = document.querySelector('.dashboard-preview');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const dashboardRect = dashboardPreview.getBoundingClientRect();
    
    if (dashboardRect.top < window.innerHeight * 0.8 && dashboardRect.bottom > 0) {
        dashboardPreview.style.opacity = '1';
        dashboardPreview.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Initialize dashboard preview
dashboardPreview.style.opacity = '0';
dashboardPreview.style.transform = 'translateY(50px)';
dashboardPreview.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
// === TRANSACTION DASHBOARD FUNCTIONALITY ===
const transactionForm = document.getElementById('transactionForm');
const proofGenerated = document.getElementById('proofGenerated');
const partyBView = document.getElementById('partyBView');
const generateProofBtn = document.getElementById('generateProofBtn');
const newProofBtn = document.getElementById('newProofBtn');
const shareProofBtn = document.getElementById('shareProofBtn');
const verifyBtn = document.getElementById('verifyBtn');
const backToFormBtn = document.getElementById('backToFormBtn');
const partyBadges = document.querySelectorAll('.party-badge');

// Generate random hash
function generateHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Generate Proof
generateProofBtn.addEventListener('click', () => {
    const desc = document.getElementById('transactionDesc').value;
    const amount = document.getElementById('transactionAmount').value;
    const currency = document.getElementById('transactionCurrency').value;
    const partyB = document.getElementById('partyBId').value;
    const privacyMode = document.getElementById('privacyMode').checked;
    
    if (!desc || !amount || !partyB) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Simulate proof generation
    generateProofBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        Generating...
    `;
    generateProofBtn.disabled = true;
    
    setTimeout(() => {
        const hash = generateHash();
        const shortHash = hash.slice(0, 10) + '...';
        
        document.getElementById('proofHash').textContent = shortHash;
        document.getElementById('proofHash').dataset.full = hash;
        document.getElementById('verifyLink').textContent = `provex.io/verify/${hash.slice(2, 10)}...`;
        document.getElementById('verifyLink').dataset.full = `https://provex.io/verify/${hash}`;
        
        transactionForm.style.display = 'none';
        proofGenerated.style.display = 'block';
        
        generateProofBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
            </svg>
            Generate Proof
        `;
        generateProofBtn.disabled = false;
    }, 2300);
});

// Copy functionality
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.dataset.copy;
        const target = document.getElementById(targetId);
        const textToCopy = target.dataset.full || target.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = this.innerHTML;
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            this.style.color = 'var(--primary)';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.color = '';
            }, 2000);
        });
    });
});

// New Proof
newProofBtn.addEventListener('click', () => {
    proofGenerated.style.display = 'none';
    transactionForm.style.display = 'block';
    document.getElementById('transactionDesc').value = '';
    document.getElementById('transactionAmount').value = '';
    document.getElementById('partyBId').value = '';
});

// Share Proof
shareProofBtn.addEventListener('click', () => {
    const link = document.getElementById('verifyLink').dataset.full;
    const text = `Verify our transaction proof: ${link}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'ProveX Transaction Proof',
            text: text,
            url: link
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Verification link copied to clipboard!');
        });
    }
});

// Switch to Party B View
partyBadges.forEach(badge => {
    badge.addEventListener('click', function() {
        const party = this.dataset.party;
        
        partyBadges.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        if (party === 'receiver') {
            transactionForm.style.display = 'none';
            proofGenerated.style.display = 'none';
            partyBView.style.display = 'block';
        } else {
            partyBView.style.display = 'none';
            transactionForm.style.display = 'block';
        }
    });
});

// Back to form
backToFormBtn.addEventListener('click', () => {
    partyBView.style.display = 'none';
    transactionForm.style.display = 'block';
    partyBadges.forEach(b => b.classList.remove('active'));
    partyBadges[0].classList.add('active');
});

// Verify Proof
verifyBtn.addEventListener('click', () => {
    const input = document.getElementById('verifyInput').value;
    
    if (!input || input.length < 10) {
        alert('Please enter a valid proof hash');
        return;
    }
    
    verifyBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
        </svg>
        Verifying...
    `;
    verifyBtn.disabled = true;
    
    setTimeout(() => {
        alert('✅ Proof Verified!\n\nTransaction is cryptographically valid.\nVerified on-chain at block #18,942,673\n\nBoth parties can trust this proof without intermediaries.');
        
        verifyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Verify Proof
        `;
        verifyBtn.disabled = false;
    }, 1500);
});

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);