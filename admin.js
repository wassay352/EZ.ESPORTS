// ===================================
// ADMIN.JS
// Handles admin authentication and tournament/match management
// ===================================

// Admin credentials (hardcoded for front-end only)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Check if user is logged in
function checkAdminAuth() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Form elements
const createTournamentForm = document.getElementById('create-tournament-form');
const addMatchForm = document.getElementById('add-match-form');

// Display elements
const adminTournamentsList = document.getElementById('admin-tournaments-list');
const matchTournamentSelect = document.getElementById('match-tournament-select');
const recentEntries = document.getElementById('recent-entries');

// ===================================
// AUTHENTICATION
// ===================================

if (loginForm) {
    // Check if already logged in
    if (checkAdminAuth()) {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadAdminDashboard();
    }

    // Handle login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            loginScreen.style.display = 'none';
            adminDashboard.style.display = 'block';
            loadAdminDashboard();
            showToast('Login successful!', 'success');
        } else {
            loginError.textContent = 'Invalid username or password';
            loginError.style.display = 'block';
            
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    });
}

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        location.reload();
    });
}

// ===================================
// TAB SWITCHING
// ===================================

tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});

// ===================================
// TOURNAMENT MANAGEMENT
// ===================================

// Create Tournament
if (createTournamentForm) {
    createTournamentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tournamentName = document.getElementById('tournament-name-input').value;
        const tournamentDate = document.getElementById('tournament-date-input').value;
        const totalMatches = document.getElementById('tournament-matches-input').value;
        
        // Get existing tournaments
        const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
        
        // Create new tournament
        const newTournament = {
            id: generateId(),
            name: tournamentName,
            date: tournamentDate,
            totalMatches: parseInt(totalMatches),
            createdAt: new Date().toISOString()
        };
        
        // Add to tournaments array
        tournaments.push(newTournament);
        
        // Save to localStorage
        localStorage.setItem('tournaments', JSON.stringify(tournaments));
        
        // Reset form
        createTournamentForm.reset();
        
        // Reload tournament list
        loadTournamentsList();
        updateTournamentSelect();
        
        showToast('Tournament created successfully!', 'success');
    });
}

// Load tournaments list in admin
function loadTournamentsList() {
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    
    if (tournaments.length === 0) {
        adminTournamentsList.innerHTML = '<div class="empty-state"><p>No tournaments created yet</p></div>';
        return;
    }
    
    adminTournamentsList.innerHTML = tournaments.map(tournament => `
        <div class="admin-tournament-item">
            <div class="admin-tournament-info">
                <h4>${tournament.name}</h4>
                <p>Date: ${formatDate(tournament.date)} | Total Matches: ${tournament.totalMatches}</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-edit" onclick="editTournament('${tournament.id}')">EDIT</button>
                <button class="btn-delete" onclick="deleteTournament('${tournament.id}')">DELETE</button>
            </div>
        </div>
    `).join('');
}

// Delete tournament
function deleteTournament(tournamentId) {
    if (!confirm('Are you sure you want to delete this tournament? All match data will be lost.')) {
        return;
    }
    
    // Get tournaments
    let tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    
    // Remove tournament
    tournaments = tournaments.filter(t => t.id !== tournamentId);
    
    // Save
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
    
    // Delete all matches for this tournament
    let matches = JSON.parse(localStorage.getItem('matches') || '[]');
    matches = matches.filter(m => m.tournamentId !== tournamentId);
    localStorage.setItem('matches', JSON.stringify(matches));
    
    // Reload
    loadTournamentsList();
    updateTournamentSelect();
    loadRecentEntries();
    
    showToast('Tournament deleted successfully!', 'success');
}

// Update tournament select dropdown
function updateTournamentSelect() {
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    
    if (matchTournamentSelect) {
        matchTournamentSelect.innerHTML = '<option value="">-- Select Tournament --</option>' +
            tournaments.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    }
}

// ===================================
// MATCH DATA MANAGEMENT
// ===================================

// Calculate total points in real-time
const placementPointsInput = document.getElementById('placement-points-input');
const killPointsInput = document.getElementById('kill-points-input');
const totalPointsDisplay = document.getElementById('total-points-display');

if (placementPointsInput && killPointsInput) {
    function updateTotalPoints() {
        const placementPoints = parseInt(placementPointsInput.value) || 0;
        const killPoints = parseInt(killPointsInput.value) || 0;
        const total = placementPoints + killPoints;
        totalPointsDisplay.textContent = total;
    }
    
    placementPointsInput.addEventListener('input', updateTotalPoints);
    killPointsInput.addEventListener('input', updateTotalPoints);
}

// Add Match Data
if (addMatchForm) {
    addMatchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tournamentId = document.getElementById('match-tournament-select').value;
        const matchNumber = document.getElementById('match-number-input').value;
        const teamName = document.getElementById('team-name-input').value;
        const placementPosition = document.getElementById('placement-position-input').value;
        const placementPoints = document.getElementById('placement-points-input').value;
        const killPoints = document.getElementById('kill-points-input').value;
        
        if (!tournamentId) {
            showToast('Please select a tournament', 'error');
            return;
        }
        
        // Get existing matches
        const matches = JSON.parse(localStorage.getItem('matches') || '[]');
        
        // Create new match entry
        const newMatch = {
            id: generateId(),
            tournamentId: tournamentId,
            matchNumber: parseInt(matchNumber),
            teamName: teamName,
            placementPosition: parseInt(placementPosition),
            placementPoints: parseInt(placementPoints),
            killPoints: parseInt(killPoints),
            totalPoints: parseInt(placementPoints) + parseInt(killPoints),
            createdAt: new Date().toISOString()
        };
        
        // Add to matches array
        matches.push(newMatch);
        
        // Save to localStorage
        localStorage.setItem('matches', JSON.stringify(matches));
        
        // Reset form
        addMatchForm.reset();
        updateTotalPoints();
        
        // Reload recent entries
        loadRecentEntries();
        
        showToast('Match data added successfully!', 'success');
    });
}

// Load recent entries
function loadRecentEntries() {
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    
    if (matches.length === 0) {
        recentEntries.innerHTML = '<div class="empty-state"><p>No match data added yet</p></div>';
        return;
    }
    
    // Sort by creation date (most recent first)
    const sortedMatches = matches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Show last 10 entries
    const recentMatches = sortedMatches.slice(0, 10);
    
    recentEntries.innerHTML = recentMatches.map(match => {
        const tournament = tournaments.find(t => t.id === match.tournamentId);
        const tournamentName = tournament ? tournament.name : 'Unknown Tournament';
        
        return `
            <div class="entry-item">
                <strong>${tournamentName}</strong> - Match ${match.matchNumber}<br>
                Team: ${match.teamName} | Position: ${match.placementPosition} | 
                Placement Pts: ${match.placementPoints} | Kill Pts: ${match.killPoints} | 
                <strong>Total: ${match.totalPoints}</strong>
            </div>
        `;
    }).join('');
}

// ===================================
// LOAD DASHBOARD
// ===================================

function loadAdminDashboard() {
    loadTournamentsList();
    updateTournamentSelect();
    loadRecentEntries();
    loadSiteSettings();
    loadSquadList();
}

// ===================================
// SITE EDITOR FUNCTIONALITY
// ===================================

// Initialize site settings with defaults
function initializeSiteSettings() {
    const defaultSettings = {
        teamNameMain: 'EZ',
        teamNameSecondary: 'ESPORTS',
        heroTitle1: 'EZ',
        heroTitle2: 'ESPORTS',
        heroSubtitle: 'DOMINATING THE BATTLEGROUNDS SINCE 2026',
        establishedYear: 2026,
        firstMatchDate: 'JAN 28',
        teamLogoUrl: '',
        aboutPara1: 'EZ ESPORTS is a newly established professional PUBG team ready to dominate the competitive scene. Founded in 2026, we bring together exceptional talent and strategic gameplay to compete at the highest level.',
        aboutPara2: 'Our roster consists of four elite players, each bringing unique skills and experience to create a formidable force on the battlegrounds. With our first tournament starting on January 28, 2026, we\'re just getting started.'
    };
    
    if (!localStorage.getItem('siteSettings')) {
        localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
    }
    
    const defaultSocial = {
        twitter: '',
        instagram: '',
        youtube: '',
        discord: ''
    };
    
    if (!localStorage.getItem('socialLinks')) {
        localStorage.setItem('socialLinks', JSON.stringify(defaultSocial));
    }
}

// Load site settings into form
function loadSiteSettings() {
    initializeSiteSettings();
    
    const settings = JSON.parse(localStorage.getItem('siteSettings'));
    const social = JSON.parse(localStorage.getItem('socialLinks'));
    
    // Populate home page form
    if (document.getElementById('team-name-main')) {
        document.getElementById('team-name-main').value = settings.teamNameMain;
        document.getElementById('team-name-secondary').value = settings.teamNameSecondary;
        document.getElementById('hero-title-1').value = settings.heroTitle1;
        document.getElementById('hero-title-2').value = settings.heroTitle2;
        document.getElementById('hero-subtitle').value = settings.heroSubtitle;
        document.getElementById('established-year').value = settings.establishedYear;
        document.getElementById('first-match-date').value = settings.firstMatchDate;
        document.getElementById('team-logo-url').value = settings.teamLogoUrl || '';
        document.getElementById('about-para-1').value = settings.aboutPara1;
        document.getElementById('about-para-2').value = settings.aboutPara2;
    }
    
    // Populate social links form
    if (document.getElementById('social-twitter')) {
        document.getElementById('social-twitter').value = social.twitter || '';
        document.getElementById('social-instagram').value = social.instagram || '';
        document.getElementById('social-youtube').value = social.youtube || '';
        document.getElementById('social-discord').value = social.discord || '';
    }
}

// Save home page settings
const editHomepageForm = document.getElementById('edit-homepage-form');
if (editHomepageForm) {
    editHomepageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const settings = {
            teamNameMain: document.getElementById('team-name-main').value,
            teamNameSecondary: document.getElementById('team-name-secondary').value,
            heroTitle1: document.getElementById('hero-title-1').value,
            heroTitle2: document.getElementById('hero-title-2').value,
            heroSubtitle: document.getElementById('hero-subtitle').value,
            establishedYear: document.getElementById('established-year').value,
            firstMatchDate: document.getElementById('first-match-date').value,
            teamLogoUrl: document.getElementById('team-logo-url').value
        };
        
        // Get existing settings to preserve aboutPara values
        const existingSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        const finalSettings = { ...existingSettings, ...settings };
        
        localStorage.setItem('siteSettings', JSON.stringify(finalSettings));
        showToast('Home page settings saved successfully!', 'success');
    });
}

// Save about section
const editAboutForm = document.getElementById('edit-about-form');
if (editAboutForm) {
    editAboutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const existingSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        existingSettings.aboutPara1 = document.getElementById('about-para-1').value;
        existingSettings.aboutPara2 = document.getElementById('about-para-2').value;
        
        localStorage.setItem('siteSettings', JSON.stringify(existingSettings));
        showToast('About section saved successfully!', 'success');
    });
}

// Save social links
const editSocialForm = document.getElementById('edit-social-form');
if (editSocialForm) {
    editSocialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const social = {
            twitter: document.getElementById('social-twitter').value,
            instagram: document.getElementById('social-instagram').value,
            youtube: document.getElementById('social-youtube').value,
            discord: document.getElementById('social-discord').value
        };
        
        localStorage.setItem('socialLinks', JSON.stringify(social));
        showToast('Social links saved successfully!', 'success');
    });
}

// ===================================
// SQUAD MANAGER FUNCTIONALITY
// ===================================

// Initialize default squad if none exists
function initializeDefaultSquad() {
    if (!localStorage.getItem('squad')) {
        const defaultSquad = [
            {
                id: generateId(),
                name: 'Mubashir',
                ign: 'EZ',
                role: 'IGL',
                status: 'ACTIVE',
                imageUrl: '',
                twitter: '',
                instagram: ''
            },
            {
                id: generateId(),
                name: 'Rehan',
                ign: 'Q8',
                role: 'Assaulter',
                status: 'ACTIVE',
                imageUrl: '',
                twitter: '',
                instagram: ''
            },
            {
                id: generateId(),
                name: 'Abdul Wassay',
                ign: 'EZ INF3RN0',
                role: 'Support',
                status: 'ACTIVE',
                imageUrl: '',
                twitter: '',
                instagram: ''
            },
            {
                id: generateId(),
                name: 'Hashir',
                ign: 'EZ HITLER',
                role: 'Support',
                status: 'ACTIVE',
                imageUrl: '',
                twitter: '',
                instagram: ''
            }
        ];
        localStorage.setItem('squad', JSON.stringify(defaultSquad));
    }
}

// Add new player
const addPlayerForm = document.getElementById('add-player-form');
if (addPlayerForm) {
    addPlayerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const squad = JSON.parse(localStorage.getItem('squad') || '[]');
        
        const newPlayer = {
            id: generateId(),
            name: document.getElementById('player-name').value,
            ign: document.getElementById('player-ign').value,
            role: document.getElementById('player-role').value,
            status: document.getElementById('player-status').value,
            imageUrl: document.getElementById('player-image').value || '',
            twitter: document.getElementById('player-twitter').value || '',
            instagram: document.getElementById('player-instagram').value || ''
        };
        
        squad.push(newPlayer);
        localStorage.setItem('squad', JSON.stringify(squad));
        
        addPlayerForm.reset();
        loadSquadList();
        
        showToast('Player added successfully!', 'success');
    });
}

// Load squad list in admin
function loadSquadList() {
    initializeDefaultSquad();
    
    const squad = JSON.parse(localStorage.getItem('squad') || '[]');
    const adminSquadList = document.getElementById('admin-squad-list');
    
    if (!adminSquadList) return;
    
    if (squad.length === 0) {
        adminSquadList.innerHTML = '<div class="empty-state"><p>No players added yet</p></div>';
        return;
    }
    
    adminSquadList.innerHTML = squad.map((player, index) => {
        const initial = player.name.charAt(0).toUpperCase();
        const imageHtml = player.imageUrl 
            ? `<img src="${player.imageUrl}" alt="${player.name}" class="admin-squad-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="admin-squad-image placeholder" style="display: none;">${initial}</div>`
            : `<div class="admin-squad-image placeholder">${initial}</div>`;
        
        return `
            <div class="admin-squad-item">
                ${imageHtml}
                <div class="admin-squad-info">
                    <h4>${player.name}</h4>
                    <div class="squad-ign">IGN: ${player.ign}</div>
                    <p><strong>Role:</strong> ${player.role} | <strong>Status:</strong> ${player.status}</p>
                    ${player.twitter ? `<p>🐦 Twitter: ${player.twitter}</p>` : ''}
                    ${player.instagram ? `<p>📷 Instagram: ${player.instagram}</p>` : ''}
                </div>
                <div class="admin-squad-actions">
                    <button class="btn-edit" onclick="editPlayer('${player.id}')">EDIT</button>
                    <button class="btn-delete" onclick="deletePlayer('${player.id}')">DELETE</button>
                </div>
            </div>
        `;
    }).join('');
}

// Edit player
window.editPlayer = function(playerId) {
    const squad = JSON.parse(localStorage.getItem('squad') || '[]');
    const player = squad.find(p => p.id === playerId);
    
    if (!player) return;
    
    // Populate form with player data
    document.getElementById('player-name').value = player.name;
    document.getElementById('player-ign').value = player.ign;
    document.getElementById('player-role').value = player.role;
    document.getElementById('player-status').value = player.status;
    document.getElementById('player-image').value = player.imageUrl || '';
    document.getElementById('player-twitter').value = player.twitter || '';
    document.getElementById('player-instagram').value = player.instagram || '';
    
    // Change form to edit mode
    const form = document.getElementById('add-player-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'UPDATE PLAYER';
    submitBtn.className = 'btn btn-secondary';
    
    // Store edit ID
    form.dataset.editId = playerId;
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Modify submit handler
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const squad = JSON.parse(localStorage.getItem('squad') || '[]');
        const index = squad.findIndex(p => p.id === playerId);
        
        if (index !== -1) {
            squad[index] = {
                id: playerId,
                name: document.getElementById('player-name').value,
                ign: document.getElementById('player-ign').value,
                role: document.getElementById('player-role').value,
                status: document.getElementById('player-status').value,
                imageUrl: document.getElementById('player-image').value || '',
                twitter: document.getElementById('player-twitter').value || '',
                instagram: document.getElementById('player-instagram').value || ''
            };
            
            localStorage.setItem('squad', JSON.stringify(squad));
            
            // Reset form
            form.reset();
            submitBtn.textContent = 'ADD PLAYER';
            submitBtn.className = 'btn btn-primary';
            delete form.dataset.editId;
            
            // Restore original submit handler
            form.onsubmit = addPlayerForm.onsubmit;
            
            loadSquadList();
            showToast('Player updated successfully!', 'success');
        }
    };
};

// Delete player
window.deletePlayer = function(playerId) {
    if (!confirm('Are you sure you want to delete this player?')) {
        return;
    }
    
    let squad = JSON.parse(localStorage.getItem('squad') || '[]');
    squad = squad.filter(p => p.id !== playerId);
    localStorage.setItem('squad', JSON.stringify(squad));
    
    loadSquadList();
    showToast('Player deleted successfully!', 'success');
};

// Edit tournament
window.editTournament = function(tournamentId) {
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) return;
    
    // Populate form
    document.getElementById('tournament-name-input').value = tournament.name;
    document.getElementById('tournament-date-input').value = tournament.date;
    document.getElementById('tournament-matches-input').value = tournament.totalMatches;
    
    // Change form to edit mode
    const form = document.getElementById('create-tournament-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'UPDATE TOURNAMENT';
    submitBtn.className = 'btn btn-secondary';
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Modify submit handler
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
        const index = tournaments.findIndex(t => t.id === tournamentId);
        
        if (index !== -1) {
            tournaments[index] = {
                id: tournamentId,
                name: document.getElementById('tournament-name-input').value,
                date: document.getElementById('tournament-date-input').value,
                totalMatches: parseInt(document.getElementById('tournament-matches-input').value),
                createdAt: tournaments[index].createdAt
            };
            
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
            
            // Reset form
            form.reset();
            submitBtn.textContent = 'CREATE TOURNAMENT';
            submitBtn.className = 'btn btn-primary';
            
            // Restore original submit handler
            const originalHandler = createTournamentForm.onsubmit;
            form.onsubmit = originalHandler;
            
            loadTournamentsList();
            updateTournamentSelect();
            showToast('Tournament updated successfully!', 'success');
        }
    };
};
