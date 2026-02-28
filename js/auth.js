import { showNotification } from './utils.js';

// ================= AUTH MODAL =================
const USER_KEY = 'luxewear_user';

function getUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch(e) {
    return null;
  }
}

function saveUser(userData) {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
}

function openAuth() {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');
  if (overlay) overlay.classList.add('open');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const user = getUser();
  if (user) {
    switchAuthTab('profile');
    updateProfileDisplay();
  } else {
    switchAuthTab('login');
  }
}

function closeAuth() {
  const overlay = document.getElementById('authOverlay');
  const modal = document.getElementById('authModal');
  if (overlay) overlay.classList.remove('open');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthTab(tabName) {
  const tabs = document.querySelectorAll('.auth-tab-content');
  tabs.forEach(tab => tab.classList.add('hidden'));
  const activeTab = document.getElementById(tabName + 'Tab');
  if (activeTab) activeTab.classList.remove('hidden');

  // Handle tab button active state
  const tabBtns = document.querySelectorAll('.auth-tab');
  tabBtns.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(tabName + 'TabBtn');
  if (activeBtn) activeBtn.classList.add('active');
}


function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail')?.value || '';
  const password = document.getElementById('loginPassword')?.value || '';

  if (!email || !password) {
    showNotification('Error', 'Please fill all fields', 'error');
    return;
  }

  const userData = {
    name: email.split('@')[0],
    email: email,
    phone: '',
    notifications: true,
    loginDate: new Date().toISOString()
  };

  saveUser(userData);
  showNotification('Success', 'Login successful!', 'success');
  switchAuthTab('profile');
  updateProfileDisplay();
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName')?.value || '';
  const email = document.getElementById('signupEmail')?.value || '';
  const password = document.getElementById('signupPassword')?.value || '';
  const confirm = document.getElementById('signupConfirm')?.value || '';

  if (!name || !email || !password || !confirm) {
    showNotification('Error', 'Please fill all fields', 'error');
    return;
  }

  if (password !== confirm) {
    showNotification('Error', 'Passwords do not match', 'error');
    return;
  }

  const userData = {
    name: name,
    email: email,
    phone: '',
    notifications: true,
    joinDate: new Date().toISOString()
  };

  saveUser(userData);
  showNotification('Success', 'Account created successfully!', 'success');
  switchAuthTab('profile');
  updateProfileDisplay();
  document.getElementById('signupName').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPassword').value = '';
  document.getElementById('signupConfirm').value = '';
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    clearUser();
    showNotification('Success', 'Logged out successfully!', 'success');
    closeAuth();
  }
}

function updateProfileDisplay() {
  const user = getUser();
  if (user) {
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    if (nameEl) nameEl.textContent = user.name || 'User';
    if (emailEl) emailEl.textContent = user.email || 'Not set';

    document.getElementById('settingsName').value = user.name || '';
    document.getElementById('settingsEmail').value = user.email || '';
    document.getElementById('settingsPhone').value = user.phone || '';
    document.getElementById('settingsNotifications').checked = user.notifications !== false;
  }
}

function openSettings() {
  updateProfileDisplay();
  switchAuthTab('settings');
}

function handleSettings(event) {
  event.preventDefault();
  const user = getUser();
  if (!user) {
    showNotification('Error', 'Not logged in', 'error');
    return;
  }

  user.name = document.getElementById('settingsName')?.value || user.name;
  user.email = document.getElementById('settingsEmail')?.value || user.email;
  user.phone = document.getElementById('settingsPhone')?.value || '';
  user.notifications = document.getElementById('settingsNotifications')?.checked !== false;

  saveUser(user);
  showNotification('Success', 'Settings saved successfully!', 'success');
  updateProfileDisplay();
  switchAuthTab('profile');
}

// ================= GOOGLE LOGIN =================
function signInWithGoogle() {
  showNotification('Authenticating', 'Signing in with Google...', 'info', 2000);

  if (typeof firebaseInitialized !== 'undefined' && firebaseInitialized && typeof firebase !== 'undefined' && firebase.auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const user = {
          name: result.user.displayName,
          email: result.user.email,
          phone: '',
          notifications: true,
          uid: result.user.uid,
          loginDate: new Date().toISOString()
        };
        saveUser(user);
        showNotification('Success', 'Logged in with Google!', 'success');
        switchAuthTab('profile');
        updateProfileDisplay();
        closeAuth();
      })
      .catch(error => {
        showNotification('Error', 'Google login failed: ' + error.message, 'error');
      });
  } else {
    const demoUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '',
      notifications: true,
      loginDate: new Date().toISOString()
    };
    saveUser(demoUser);
    showNotification('Success', 'Logged in successfully!', 'success');
    switchAuthTab('profile');
    updateProfileDisplay();
    closeAuth();
  }
}

export {
  getUser,
  saveUser,
  clearUser,
  openAuth,
  closeAuth,
  switchAuthTab,
  handleLogin,
  handleSignup,
  handleLogout,
  updateProfileDisplay,
  openSettings,
  handleSettings,
  signInWithGoogle
};
