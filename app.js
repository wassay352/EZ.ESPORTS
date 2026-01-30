// ===================================
// MAIN APP.JS
// Handles navigation and common functionality
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content first
    loadDynamicContent();
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(196, 30, 58, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.player-card, .feature-card, .role-card, .link-card, .tournament-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Load dynamic content from localStorage
function loadDynamicContent() {
    loadBrandingContent();
    loadHeroContent();
    loadAboutContent();
    loadSocialLinks();
    loadSquadContent();
}

// Load branding (navbar and footer)
function loadBrandingContent() {
    const settings = JSON.parse(localStorage.getItem('siteSettings'));
    if (!settings) return;
    
    // Update all navbar brand instances
    document.querySelectorAll('.nav-brand .brand-ez').forEach(el => {
        el.textContent = settings.teamNameMain || 'EZ';
    });
    
    document.querySelectorAll('.nav-brand .brand-esports').forEach(el => {
        el.textContent = settings.teamNameSecondary || 'ESPORTS';
    });
    
    // Update footer brand
    document.querySelectorAll('.footer-logo .brand-ez').forEach(el => {
        el.textContent = settings.teamNameMain || 'EZ';
    });
    
    document.querySelectorAll('.footer-logo .brand-esports').forEach(el => {
        el.textContent = settings.teamNameSecondary || 'ESPORTS';
    });
}

// Load hero section content
function loadHeroContent() {
    const settings = JSON.parse(localStorage.getItem('siteSettings'));
    if (!settings) return;
    
    // Update hero title
    const titleEz = document.querySelector('.hero-title .title-ez');
    const titleEsports = document.querySelector('.hero-title .title-esports');
    
    if (titleEz) titleEz.textContent = settings.heroTitle1 || 'EZ';
    if (titleEsports) titleEsports.textContent = settings.heroTitle2 || 'ESPORTS';
    
    // Update hero subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) subtitle.textContent = settings.heroSubtitle || 'DOMINATING THE BATTLEGROUNDS SINCE 2026';
    
    // Update stats
    const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
    if (statNumbers.length >= 2) {
        statNumbers[1].textContent = settings.establishedYear || '2026';
        statNumbers[2].textContent = settings.firstMatchDate || 'JAN 28';
    }
    
    // Update player count dynamically
    const squad = JSON.parse(localStorage.getItem('squad') || '[]');
    if (statNumbers.length >= 1) {
        statNumbers[0].textContent = squad.length;
    }
}

// Load about section content
function loadAboutContent() {
    const settings = JSON.parse(localStorage.getItem('siteSettings'));
    if (!settings) return;
    
    const aboutParagraphs = document.querySelectorAll('.about-text p');
    if (aboutParagraphs.length >= 2) {
        aboutParagraphs[0].textContent = settings.aboutPara1 || '';
        aboutParagraphs[1].textContent = settings.aboutPara2 || '';
    }
}

// Load social links
function loadSocialLinks() {
    const social = JSON.parse(localStorage.getItem('socialLinks'));
    if (!social) return;
    
    // Update footer social links
    const footerLinks = document.querySelectorAll('.footer-column a');
    footerLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes('twitter') && social.twitter) {
            link.href = social.twitter;
        } else if (text.includes('instagram') && social.instagram) {
            link.href = social.instagram;
        } else if (text.includes('youtube') && social.youtube) {
            link.href = social.youtube;
        } else if (text.includes('discord') && social.discord) {
            link.href = social.discord;
        }
    });
}

// Load squad content on squad page
function loadSquadContent() {
    const squadGrid = document.querySelector('.squad-grid');
    if (!squadGrid) return; // Not on squad page
    
    const squad = JSON.parse(localStorage.getItem('squad') || '[]');
    
    if (squad.length === 0) {
        squadGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">👥</div>
                <h3>No Players Yet</h3>
                <p>Players will appear here once added by admin</p>
            </div>
        `;
        return;
    }
    
    squadGrid.innerHTML = squad.map((player, index) => {
        const initial = player.name.charAt(0).toUpperCase();
        const roleClass = player.role.toLowerCase().replace(/[^a-z]/g, '');
        const roleBadgeClass = roleClass === 'igl' ? 'igl' : roleClass === 'assaulter' ? 'assaulter' : 'support';
        const roleDisplay = player.role === 'IGL' ? 'IN-GAME LEADER' : player.role.toUpperCase();
        
        // Generate image HTML with fallback
        const imageHtml = player.imageUrl 
            ? `<img src="${player.imageUrl}" alt="${player.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentElement.querySelector('.avatar-fallback').style.display='flex';">
               <div class="avatar-fallback" style="display: none; width: 100%; height: 100%; border-radius: 50%; background: var(--gray); align-items: center; justify-content: center; font-family: var(--font-display); font-size: 3rem; color: var(--primary-red); font-weight: 700;">${initial}</div>`
            : `<div class="avatar-fallback" style="display: flex; width: 100%; height: 100%; border-radius: 50%; background: var(--gray); align-items: center; justify-content: center; font-family: var(--font-display); font-size: 3rem; color: var(--primary-red); font-weight: 700;">${initial}</div>`;
        
        // Generate social links if available
        const socialLinksHtml = (player.twitter || player.instagram) ? `
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                ${player.twitter ? `<a href="${player.twitter}" target="_blank" style="color: var(--primary-red); font-size: 1.5rem; transition: var(--transition);" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">🐦</a>` : ''}
                ${player.instagram ? `<a href="${player.instagram}" target="_blank" style="color: var(--primary-red); font-size: 1.5rem; transition: var(--transition);" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">📷</a>` : ''}
            </div>
        ` : '';
        
        return `
            <div class="player-card" data-role="${roleClass}">
                <div class="player-bg"></div>
                <div class="player-number">${String(index + 1).padStart(2, '0')}</div>
                <div class="player-role-badge ${roleBadgeClass}">${roleDisplay}</div>
                <div class="player-content">
                    <div class="player-avatar">
                        <div class="avatar-ring"></div>
                        <div class="avatar-inner">
                            ${imageHtml}
                        </div>
                    </div>
                    <h3 class="player-name">${player.name}</h3>
                    <div class="player-ign">${player.ign}</div>
                    <div class="player-stats">
                        <div class="stat-item">
                            <span class="stat-label">ROLE</span>
                            <span class="stat-value">${player.role}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">STATUS</span>
                            <span class="stat-value">${player.status}</span>
                        </div>
                    </div>
                    ${socialLinksHtml}
                </div>
                <div class="player-decoration"></div>
            </div>
        `;
    }).join('');
}

// ===================================
// ORIGINAL UTILITY FUNCTIONS
// ===================================

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-message">${message}</div>`;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
