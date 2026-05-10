// ======================= STORAGE & DATA MANAGEMENT =======================
const users = JSON.parse(localStorage.getItem('users')) || {};
const currentSessionUser = localStorage.getItem('currentUser') || null;

// Motivational quotes for sorrows
const motivationalQuotes = [
    "This pain you're feeling is temporary. Better days are coming, I promise.",
    "Your struggles are making you stronger. You're more resilient than you think.",
    "Every night passes. This darkness will too. Dawn is always on the horizon.",
    "You are worthy of happiness, even when it doesn't feel that way right now.",
    "Difficult roads often lead to beautiful destinations. Your journey matters.",
    "Your tears water the seeds of growth. Let yourself feel, and then let it go.",
    "You've survived 100% of your worst days. You're stronger than you realize.",
    "This chapter is hard, but it won't last forever. The next chapter awaits.",
    "Your pain has a purpose. Through it, you're learning and becoming wiser.",
    "Be gentle with yourself. You're doing the best you can, and that's enough.",
    "The fact that you're still trying means everything. That's strength.",
    "Your broken pieces are being rearranged into something beautiful.",
    "This feeling is not permanent. You will smile again, genuinely.",
    "You deserve peace, rest, and kindness—especially from yourself.",
    "What seems impossible today might be your greatest victory tomorrow."
];

// Cheerful messages for happiness
const cheerMessages = [
    "🎉 Your joy is contagious! Keep spreading those smiles!",
    "✨ You're absolutely crushing it! Keep shining!",
    "🌟 Your happiness is the best energy! Keep being amazing!",
    "💫 That's the spirit! Keep celebrating life's beautiful moments!",
    "🚀 You're on fire! Keep riding this wave of positivity!",
    "🎊 Amazing! Your energy is inspiring everyone around you!",
    "💝 That's beautiful! Keep embracing all the good in your life!",
    "🌈 You're glowing! Keep being this wonderful version of yourself!",
    "🎈 Love this energy! Keep bringing this happiness everywhere!",
    "⭐ You deserve every bit of this happiness! Enjoy every moment!",
    "🌺 Your smile lights up the world! Keep being joyful!",
    "💖 This is what living fully looks like! Keep going!",
    "🦋 You're blossoming beautifully! Keep growing and shining!",
    "🌞 You're a ray of sunshine! Keep spreading warmth and love!",
    "🎯 You're living your best life! Keep momentum and joy flowing!"
];

// ======================= PAGE NAVIGATION =======================
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    // Update header for main page
    if (pageId === 'mainPage' && currentSessionUser) {
        document.getElementById('currentUser').textContent = `Welcome, ${currentSessionUser}! 👋`;
        loadUserContent();
    }
}

// ======================= AUTHENTICATION =======================
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value.trim();
    
    // Validation
    if (username.length < 3) {
        alert('❌ Username must be at least 3 characters long');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters long');
        return;
    }
    
    if (users[username]) {
        alert('❌ Username already exists! Please choose another.');
        return;
    }
    
    // Create user
    users[username] = {
        password: btoa(password), // Simple encoding (not production-grade)
        email: email,
        createdAt: new Date().toISOString(),
        content: {
            secrets: [],
            sorrows: [],
            happiness: [],
            notes: []
        }
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    alert(`✅ Account created successfully! Welcome to Secret Hub, ${username}!`);
    document.getElementById('registerForm').reset();
    showPage('loginPage');
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!users[username]) {
        alert('❌ Username not found. Please check or create a new account.');
        return;
    }
    
    if (users[username].password !== btoa(password)) {
        alert('❌ Incorrect password. Please try again.');
        return;
    }
    
    // Login successful
    localStorage.setItem('currentUser', username);
    alert(`✅ Welcome back, ${username}! Great to see you again!`);
    document.getElementById('loginForm').reset();
    showPage('mainPage');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout? 👋')) {
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// ======================= TAB SWITCHING =======================
function switchTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active from buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active to clicked button
    event.target.classList.add('active');
    
    if (tabName === 'myContent') {
        loadUserContent();
    }
}

// ======================= PRIVACY TOGGLE =======================
function togglePrivacy(type) {
    const checkbox = document.getElementById(`${type}Private`);
    const passwordDiv = document.getElementById(`${type}PasswordDiv`);
    
    if (checkbox.checked) {
        passwordDiv.classList.remove('hidden');
    } else {
        passwordDiv.classList.add('hidden');
    }
}

function toggleNotePrivacy() {
    const privateRadio = document.querySelector('input[name="notePrivacy"][value="private"]');
    const passwordDiv = document.getElementById('notePasswordDiv');
    
    if (privateRadio.checked) {
        passwordDiv.classList.remove('hidden');
    } else {
        passwordDiv.classList.add('hidden');
    }
}

// ======================= SHARE FUNCTIONS =======================
function shareSecret() {
    const content = document.getElementById('secretInput').value.trim();
    const isPrivate = document.getElementById('secretPrivate').checked;
    const password = isPrivate ? document.getElementById('secretPassword').value : null;
    
    if (!content) {
        alert('💭 Please write something to share your secret!');
        return;
    }
    
    if (isPrivate && !password) {
        alert('🔐 Please set a password for your private secret!');
        return;
    }
    
    const secret = {
        id: Date.now(),
        content: content,
        type: 'secret',
        isPrivate: isPrivate,
        password: password ? btoa(password) : null,
        createdAt: new Date().toISOString()
    };
    
    const user = users[currentSessionUser];
    user.content.secrets.push(secret);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Natural language response
    const responses = [
        '✨ Thank you for trusting us with your secret. You're brave.',
        '🔐 Your secret is safely locked away with us.',
        '💫 Sharing takes courage. We appreciate your openness.',
        '🌟 Your secret is between you and this safe space.'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    alert(randomResponse);
    
    document.getElementById('secretInput').value = '';
    document.getElementById('secretPrivate').checked = false;
    document.getElementById('secretPasswordDiv').classList.add('hidden');
}

function shareSorrow() {
    const content = document.getElementById('sorrowInput').value.trim();
    const isPrivate = document.getElementById('sorrowPrivate').checked;
    const password = isPrivate ? document.getElementById('sorrowPassword').value : null;
    
    if (!content) {
        alert('💔 Please share what's in your heart.');
        return;
    }
    
    if (isPrivate && !password) {
        alert('🔐 Please set a password for your private sorrow!');
        return;
    }
    
    const sorrow = {
        id: Date.now(),
        content: content,
        type: 'sorrow',
        isPrivate: isPrivate,
        password: password ? btoa(password) : null,
        createdAt: new Date().toISOString()
    };
    
    const user = users[currentSessionUser];
    user.content.sorrows.push(sorrow);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show motivation
    showMotivation();
    
    // Natural language response
    const responses = [
        '💙 I hear you. Your pain matters, and you're not alone in this.',
        '🤝 Thank you for sharing this burden. Let's carry it together.',
        '💝 Your feelings are valid. You deserve compassion and healing.',
        '🕊️ In darkness, know that light will come again. Hold on.'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => alert(randomResponse), 500);
    
    document.getElementById('sorrowInput').value = '';
    document.getElementById('sorrowPrivate').checked = false;
    document.getElementById('sorrowPasswordDiv').classList.add('hidden');
}

function shareHappiness() {
    const content = document.getElementById('happinessInput').value.trim();
    const isPrivate = document.getElementById('happinessPrivate').checked;
    const password = isPrivate ? document.getElementById('happinessPassword').value : null;
    
    if (!content) {
        alert('😊 Please share what's making you smile!');
        return;
    }
    
    if (isPrivate && !password) {
        alert('🔐 Please set a password for your private moment!');
        return;
    }
    
    const happiness = {
        id: Date.now(),
        content: content,
        type: 'happiness',
        isPrivate: isPrivate,
        password: password ? btoa(password) : null,
        createdAt: new Date().toISOString()
    };
    
    const user = users[currentSessionUser];
    user.content.happiness.push(happiness);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show cheer up
    showCheerUp();
    
    // Natural language response
    const responses = [
        '🎉 This joy is beautiful! Keep celebrating you!',
        '✨ Your happiness is contagious! Share this energy with the world!',
        '🌟 This is what life's about! Keep collecting these golden moments!',
        '💫 You deserve this happiness. Enjoy every second of it!'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => alert(randomResponse), 500);
    
    document.getElementById('happinessInput').value = '';
    document.getElementById('happinessPrivate').checked = false;
    document.getElementById('happinessPasswordDiv').classList.add('hidden');
}

function shareNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteInput').value.trim();
    const isPrivate = document.querySelector('input[name="notePrivacy"]:checked').value === 'private';
    const password = isPrivate ? document.getElementById('notePassword').value : null;
    
    if (!title || !content) {
        alert('📝 Please add both title and content to your note!');
        return;
    }
    
    if (isPrivate && !password) {
        alert('🔐 Please set a password for your private note!');
        return;
    }
    
    const note = {
        id: Date.now(),
        title: title,
        content: content,
        type: 'note',
        isPrivate: isPrivate,
        password: password ? btoa(password) : null,
        createdAt: new Date().toISOString()
    };
    
    const user = users[currentSessionUser];
    user.content.notes.push(note);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Natural language response
    const responses = [
        `✍️ Beautiful note, "${title}"! It's safely saved.`,
        `📚 Your thoughts matter. "${title}" is now preserved.`,
        `💭 Great reflection. We've saved "${title}" for you.`,
        `📖 "${title}" is ready to inspire you anytime!`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    alert(randomResponse);
    
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteInput').value = '';
    document.querySelector('input[name="notePrivacy"][value="public"]').checked = true;
    document.getElementById('notePasswordDiv').classList.add('hidden');
}

// ======================= MOTIVATION & CHEERS =======================
function showMotivation() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationText').textContent = `"${quote}"`;
    document.getElementById('motivationBox').classList.remove('hidden');
}

function getNewQuote(type) {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationText').textContent = `"${quote}"`;
}

function showCheerUp() {
    const cheer = cheerMessages[Math.floor(Math.random() * cheerMessages.length)];
    document.getElementById('cheerText').textContent = cheer;
    document.getElementById('cheerBox').classList.remove('hidden');
}

function getCheerUp() {
    const cheer = cheerMessages[Math.floor(Math.random() * cheerMessages.length)];
    document.getElementById('cheerText').textContent = cheer;
}

// ======================= LOAD USER CONTENT =======================
function loadUserContent() {
    const user = users[currentSessionUser];
    const contentList = document.getElementById('contentList');
    
    if (!user) return;
    
    const allContent = [
        ...user.content.secrets.map(item => ({ ...item, emoji: '🔐' })),
        ...user.content.sorrows.map(item => ({ ...item, emoji: '💔' })),
        ...user.content.happiness.map(item => ({ ...item, emoji: '😊' })),
        ...user.content.notes.map(item => ({ ...item, emoji: '📝' }))
    ];
    
    // Sort by date (newest first)
    allContent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (allContent.length === 0) {
        contentList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <p style="font-size: 3rem; margin-bottom: 10px;">📭</p>
                <p>No content yet. Start sharing your secrets, sorrows, and happiness!</p>
            </div>
        `;
        return;
    }
    
    contentList.innerHTML = allContent.map(item => {
        const date = new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const title = item.title || (item.type.charAt(0).toUpperCase() + item.type.slice(1));
        
        return `
            <div class="content-item ${item.type}">
                <div class="content-item-header">
                    <div>
                        <div class="content-item-title">${title}</div>
                        <span class="content-item-type ${item.isPrivate ? 'private' : ''}">
                            ${item.isPrivate ? '🔒 Private' : '🌍 Public'}
                        </span>
                    </div>
                    <span style="font-size: 1.5rem;">${item.emoji}</span>
                </div>
                <div class="content-item-text">${escapeHtml(item.content)}</div>
                <div class="content-item-date">Shared on ${date}</div>
                <div class="content-item-actions">
                    <button class="btn-delete" onclick="deleteContent('${item.type}', ${item.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteContent(type, id) {
    if (!confirm('Are you sure you want to delete this? This action cannot be undone. 😢')) {
        return;
    }
    
    const user = users[currentSessionUser];
    const contentArray = user.content[type + 's'] || user.content[type === 'note' ? 'notes' : type + 's'];
    
    const index = contentArray.findIndex(item => item.id === id);
    if (index > -1) {
        contentArray.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUserContent();
        alert('✅ Content deleted successfully.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ======================= INITIALIZATION =======================
window.addEventListener('load', function() {
    // If user is logged in, show main page
    if (currentSessionUser && users[currentSessionUser]) {
        showPage('mainPage');
    } else {
        // Otherwise show landing page
        showPage('landingPage');
    }
});

// ======================= NATURAL LANGUAGE INTERACTIONS =======================
// Listen for emotional keywords in text
document.addEventListener('input', function(e) {
    if (e.target.id === 'sorrowInput') {
        const text = e.target.value.toLowerCase();
        const sadKeywords = ['sad', 'depressed', 'lonely', 'alone', 'broken', 'hurt', 'pain', 'suffering', 'lost', 'struggling'];
        
        if (sadKeywords.some(word => text.includes(word))) {
            // Automatically show motivation box when user starts typing sad words
            setTimeout(() => {
                if (!document.getElementById('motivationBox').classList.contains('hidden')) {
                    // Already showing
                } else {
                    // Subtle hint that we care
                }
            }, 1000);
        }
    }
});
