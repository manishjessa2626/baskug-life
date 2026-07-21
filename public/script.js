var DEFAULT = {
  monday: [
    { id:'m1', start:'09:30', end:'16:00', activity:'Work', category:'productive' },
    { id:'m2', start:'16:00', end:'17:00', activity:'Rest', category:'rest' },
    { id:'m3', start:'17:00', end:'18:00', activity:'Cook Dinner', category:'life' },
    { id:'m4', start:'18:00', end:'19:00', activity:'Coding', category:'productive' },
    { id:'m5', start:'19:00', end:'21:00', activity:'Free Time', category:'fun' },
    { id:'m6', start:'22:30', end:'06:00', activity:'Sleep', category:'rest' }
  ],
  tuesday: [
    { id:'t1', start:'09:30', end:'16:00', activity:'Work', category:'productive' },
    { id:'t2', start:'16:00', end:'18:00', activity:'Rest & Snack', category:'rest' },
    { id:'t3', start:'18:00', end:'19:00', activity:'Reading', category:'growth' },
    { id:'t4', start:'19:00', end:'21:00', activity:'Movie Night', category:'fun' },
    { id:'t5', start:'22:30', end:'06:00', activity:'Sleep', category:'rest' }
  ],
  wednesday: [
    { id:'w1', start:'09:30', end:'16:00', activity:'Work', category:'productive' },
    { id:'w2', start:'16:00', end:'17:00', activity:'Walk', category:'rest' },
    { id:'w3', start:'17:00', end:'18:00', activity:'Journal', category:'growth' },
    { id:'w4', start:'18:00', end:'19:00', activity:'Coding', category:'productive' },
    { id:'w5', start:'19:00', end:'21:00', activity:'Games', category:'fun' },
    { id:'w6', start:'22:30', end:'06:00', activity:'Sleep', category:'rest' }
  ],
  thursday: [
    { id:'th1', start:'09:30', end:'16:00', activity:'Work', category:'productive' },
    { id:'th2', start:'16:00', end:'17:00', activity:'Rest', category:'rest' },
    { id:'th3', start:'17:00', end:'18:00', activity:'Clean Up', category:'life' },
    { id:'th4', start:'18:00', end:'19:00', activity:'Writing', category:'growth' },
    { id:'th5', start:'19:00', end:'21:00', activity:'Social Media', category:'fun' },
    { id:'th6', start:'22:30', end:'06:00', activity:'Sleep', category:'rest' }
  ],
  friday: [
    { id:'f1', start:'09:30', end:'16:00', activity:'Work', category:'productive' },
    { id:'f2', start:'16:00', end:'17:00', activity:'Rest', category:'rest' },
    { id:'f3', start:'17:00', end:'18:00', activity:'Cook Dinner', category:'life' },
    { id:'f4', start:'18:00', end:'20:00', activity:'Coding Project', category:'productive' },
    { id:'f5', start:'20:00', end:'22:00', activity:'Party / Chill', category:'fun' },
    { id:'f6', start:'23:00', end:'07:00', activity:'Sleep', category:'rest' }
  ],
  saturday: [
    { id:'sa1', start:'10:00', end:'11:00', activity:'Brunch', category:'life' },
    { id:'sa2', start:'11:00', end:'13:00', activity:'DIY Project', category:'growth' },
    { id:'sa3', start:'13:00', end:'15:00', activity:'Gaming', category:'fun' },
    { id:'sa4', start:'15:00', end:'17:00', activity:'Rest & Nap', category:'rest' },
    { id:'sa5', start:'17:00', end:'18:00', activity:'Coding', category:'productive' },
    { id:'sa6', start:'18:00', end:'21:00', activity:'Movie Marathon', category:'fun' },
    { id:'sa7', start:'23:00', end:'08:00', activity:'Sleep', category:'rest' }
  ],
  sunday: [
    { id:'su1', start:'09:00', end:'10:00', activity:'Morning Walk', category:'rest' },
    { id:'su2', start:'10:00', end:'11:00', activity:'Journal & Plan', category:'growth' },
    { id:'su3', start:'11:00', end:'13:00', activity:'Meal Prep', category:'life' },
    { id:'su4', start:'13:00', end:'15:00', activity:'Read / Learn', category:'growth' },
    { id:'su5', start:'15:00', end:'17:00', activity:'Free Time', category:'fun' },
    { id:'su6', start:'17:00', end:'18:00', activity:'Light Coding', category:'productive' },
    { id:'su7', start:'18:00', end:'20:00', activity:'Family Call', category:'life' },
    { id:'su8', start:'22:00', end:'06:00', activity:'Sleep', category:'rest' }
  ]
};

var DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
var DAY_LABEL = { monday:'Monday', tuesday:'Tuesday', wednesday:'Wednesday', thursday:'Thursday', friday:'Friday', saturday:'Saturday', sunday:'Sunday' };
var CAT_ICON = { productive:'🧠', life:'🏠', growth:'🌿', fun:'🎮', rest:'🧘' };
var CAT_LABEL = { productive:'Productive', life:'Life Tasks', growth:'Growth', fun:'Fun', rest:'Rest' };

var user = {}, schedule = {}, workSchedule = {};
var WORK_DAYS = ['monday','tuesday','wednesday','thursday','friday']; // work-week default
var authToken = null;
var firebaseUserResolve = null;
var firebaseReady = new Promise(function(r) { firebaseUserResolve = r; });
var firebaseUserCache = null;
var needsProfile = false;

function getAuthHeaders() {
  return authToken ? { 'Authorization': 'Bearer ' + authToken } : {};
}

function apiGet(key) {
  return fetch('/api/data/' + encodeURIComponent(key), {
    headers: getAuthHeaders()
  }).then(function(r) {
    if (!r.ok) throw new Error('API error');
    return r.json();
  });
}

function apiPut(key, data) {
  var url = '/api/data/' + encodeURIComponent(key);
  return fetch(url, {
    method: 'PUT',
    headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
    body: JSON.stringify(data)
  }).then(function(r) {
    if (!r.ok) throw new Error('API error');
    return r.json();
  });
}

function loadAll() {
  // localStorage-only fallback for non-authed users
  try {
    var u = localStorage.getItem('baskug_user');
    var s = localStorage.getItem('baskug_schedule');
    var w = localStorage.getItem('baskug_work');
    if (u) user = JSON.parse(u);
    if (s) schedule = JSON.parse(s);
    if (w) workSchedule = JSON.parse(w);
  } catch(e) {}
  if (!user || !user.name) user = {};
  if (!schedule || !schedule.monday) schedule = JSON.parse(JSON.stringify(DEFAULT));
  if (!workSchedule || typeof workSchedule !== 'object') workSchedule = {};
  loadMealsLocal();
  loadWorkoutsLocal();
  loadRoutinesLocal();
  loadHobbiesLocal();
  loadSymptomsLocal();
}

// localStorage-only load helpers for non-authed users
function loadMealsLocal() {
  try { var d = localStorage.getItem('baskug_meals'); if (d) mealsData = JSON.parse(d); } catch(e) {}
  if (!mealsData || typeof mealsData !== 'object') mealsData = {};
}
function loadWorkoutsLocal() {
  try { var d = localStorage.getItem('baskug_workouts'); if (d) workoutData = JSON.parse(d); } catch(e) {}
  if (!workoutData || typeof workoutData !== 'object') workoutData = {};
}
function loadSymptomsLocal() {
  try { var d = localStorage.getItem('baskug_symptoms'); if (d) symptomsData = JSON.parse(d); } catch(e) {}
  if (!symptomsData || typeof symptomsData !== 'object') symptomsData = {};
}
function loadRoutinesLocal() {
  try { var d = localStorage.getItem('baskug_routines'); if (d) routineData = JSON.parse(d); } catch(e) {}
  try { var d = localStorage.getItem('baskug_routine_log'); if (d) routineDone = JSON.parse(d); } catch(e) {}
  initDefaults();
}
function loadHobbiesLocal() {
  try { var d = localStorage.getItem('baskug_hobbies'); if (d) hobbyData = JSON.parse(d); } catch(e) {}
  initHobbies();
}

async function saveUser() {
  if (authToken) { await apiPut('baskug_user', user); }
  localStorage.setItem('baskug_user', JSON.stringify(user));
}
async function saveSched() {
  if (authToken) { await apiPut('baskug_schedule', schedule); }
  localStorage.setItem('baskug_schedule', JSON.stringify(schedule));
}

function saveWorkSched() {
  if (authToken) { apiPut('baskug_work', workSchedule); }
  localStorage.setItem('baskug_work', JSON.stringify(workSchedule));
}

function safeListen(id, event, fn) {
  var el = document.getElementById(id);
  if (el) { el.addEventListener(event, fn); }
  else { console.warn('Element #' + id + ' not found for ' + event); }
}

// ===== CAROUSEL =====
function initCarousel() {
  var track = document.getElementById('widget-track');
  var prev = document.getElementById('widget-prev');
  var next = document.getElementById('widget-next');
  if (!track) return;

  var scrollTimer;
  track.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateActiveDot, 50);
  });

  if (prev) prev.addEventListener('click', function() { scrollCarousel(-1); });
  if (next) next.addEventListener('click', function() { scrollCarousel(1); });

  rebuildCarouselDots();
}

function rebuildCarouselDots() {
  var track = document.getElementById('widget-track');
  var dotsContainer = document.getElementById('widget-dots');
  if (!track || !dotsContainer) return;

  var visible = track.querySelectorAll('.widget-card:not(.hidden)');
  var perPage = window.innerWidth <= 750 ? 2 : 3;
  var pages = Math.max(1, Math.ceil(visible.length / perPage));

  dotsContainer.innerHTML = '';
  for (var i = 0; i < pages; i++) {
    var dot = document.createElement('button');
    dot.className = 'widget-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function(idx) {
      return function() { goToCarouselPage(idx); };
    }(i));
    dotsContainer.appendChild(dot);
  }
  updateActiveDot();
}

function goToCarouselPage(page) {
  var track = document.getElementById('widget-track');
  if (!track) return;
  var visible = track.querySelectorAll('.widget-card:not(.hidden)');
  if (!visible.length) return;
  var perPage = window.innerWidth <= 750 ? 2 : 3;
  visible[Math.min(page * perPage, visible.length - 1)].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}

function scrollCarousel(dir) {
  var track = document.getElementById('widget-track');
  if (!track) return;
  var visible = track.querySelectorAll('.widget-card:not(.hidden)');
  if (!visible.length) return;
  var perPage = window.innerWidth <= 750 ? 2 : 3;
  var cardWidth = visible[0].offsetWidth + 14;
  track.scrollBy({ left: cardWidth * perPage * dir, behavior: 'smooth' });
}

function updateActiveDot() {
  var track = document.getElementById('widget-track');
  var dotsContainer = document.getElementById('widget-dots');
  if (!track || !dotsContainer) return;
  var visible = track.querySelectorAll('.widget-card:not(.hidden)');
  if (!visible.length) return;
  var perPage = window.innerWidth <= 750 ? 2 : 3;
  var scrollLeft = track.scrollLeft;
  var cardWidth = visible[0].offsetWidth + 14;
  var pages = Math.max(1, Math.ceil(visible.length / perPage));
  var curPage = Math.min(Math.floor(scrollLeft / (cardWidth * perPage) + 0.3), pages - 1);
  dotsContainer.querySelectorAll('.widget-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === curPage);
  });
}

// ===== OVERLAY SYSTEM =====
function bodyLock() { document.body.classList.add('locked'); }
function bodyUnlock() {
  var anyOpen = document.querySelector('.overlay.active') || document.querySelector('.dim.open');
  if (!anyOpen) document.body.classList.remove('locked');
}

function showOverlay(id) {
  document.getElementById(id).classList.add('active');
  bodyLock();
}

function hideOverlay(id) {
  document.getElementById(id).classList.remove('active');
  bodyUnlock();
}

// ===== DIMENSION SYSTEM =====
var openDim = null;

function openDimension(name) {
  if (openDim) closeDimension(openDim);
  var restricted = ['women'];
  if (restricted.indexOf(name) !== -1 && user.gender !== 'female') return;
  var el = document.getElementById('dim-' + name);
  if (!el) return;
  el.classList.add('open');
  openDim = name;
  bodyLock();
  if (name === 'planner') { switchPlannerTab('work'); }
  if (name === 'body') renderBody();
  if (name === 'women') { renderCycle(); renderCalendar(); renderWomenFeatures(); renderPCOS(); }
  if (name === 'balance') renderBalance();
  if (name === 'reflect') loadReflection();
  if (name === 'meals') renderMeals();
  if (name === 'workout') { renderWorkouts(); renderPilatesPresets(); loadWorkoutPlan().then(function() { renderWorkoutPlan(); switchWoTab('log'); }); }
  if (name === 'routines') renderRoutines();
  if (name === 'hobbies') renderHobbies();
  if (name === 'remedies') renderRemedies();
  if (name === 'remedies') renderRemedies();
  if (name === 'meditation') { renderMedTypes(); stopMeditation(); }
  if (name === 'soundscapes') renderSoundscapes();
}

function closeDimension(name) {
  var el = document.getElementById('dim-' + name);
  if (el) el.classList.remove('open');
  if (openDim === name) openDim = null;
  bodyUnlock();
}

// ===== APP ENTRY =====
function enterApp() {
  hideOverlay('view-hero');
  hideOverlay('view-setup');
  document.getElementById('app-main').classList.remove('hidden');
  document.getElementById('app-main').classList.add('active');
  document.getElementById('main-nav').classList.remove('hidden');
  document.getElementById('main-footer').classList.remove('hidden');

  // Hide auth-only nav elements
  var navUser = document.getElementById('nav-username');
  var logoutBtn = document.getElementById('btn-logout');
  if (navUser) navUser.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'none';

  renderRoster();
  renderDashboard();
  renderBody();
  renderCycle();
  renderCalendar();
  renderWomenFeatures();
  renderPCOS();
  renderBalance();
  loadReflection();
  renderMeals();
  renderWorkouts();
  renderPilatesPresets();
  renderRoutines();
  renderHobbies();
}

// ===== PROFILE =====
function saveProfile(e) {
  e.preventDefault();
  var newName = document.getElementById('profile-name').value.trim();
  var newGender = document.getElementById('profile-gender').value;
  var newAge = document.getElementById('profile-age').value;

  if (!newName) { alert('Please enter your name.'); return; }
  if (!newGender) { alert('Please select your gender — it personalises your dashboard.'); return; }

  // Check if switching to a different person (non-authed users share localStorage)
  var oldName = user.name || '';
  var hasExistingData = localStorage.getItem('baskug_workouts') || localStorage.getItem('baskug_meals') || localStorage.getItem('baskug_workout_plan');
  if (!authToken && oldName && oldName !== newName && hasExistingData) {
    if (!confirm('This will clear all existing data (' + oldName + '\'s logs, meals, workouts, etc.) and start fresh for ' + newName + '. Continue?')) {
      return;
    }
    // Clear all user data from localStorage
    var keys = ['baskug_schedule','baskug_work','baskug_meals','baskug_workouts','baskug_routines','baskug_routine_log','baskug_hobbies','baskug_symptoms','baskug_mealplan','baskug_workout_plan','baskug_workout_done'];
    keys.forEach(function(k) { localStorage.removeItem(k); });
    mealsData = {}; workoutData = {}; routineData = []; routineDone = {};
    hobbyData = []; symptomsData = {}; schedule = {}; workSchedule = {};
    workoutPlan = null; workoutDone = {};
  }

  user.name = newName;
  user.gender = newGender;
  user.age = newAge;
  user.createdAt = user.createdAt || new Date().toISOString();

  setGenderTheme(user.gender);
  saveUser();
  // If authed, also save to API
  if (authToken) {
    fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
      body: JSON.stringify({
        name: user.name, gender: user.gender, age: user.age
      })
    }).catch(function() {});
  }
  enterApp();
}

function fillProfile() {
  document.getElementById('profile-name').value = user.name || '';
  document.getElementById('profile-gender').value = user.gender || '';
  document.getElementById('profile-age').value = user.age || '';
}

// ===== DASHBOARD =====
function setGenderTheme(gender) {
  var theme = 'other';
  if (gender === 'female') theme = 'female';
  else if (gender === 'male') theme = 'male';
  else if (['nonbinary','transgender','bisexual','genderqueer','genderfluid','agender','intersex','other'].indexOf(gender) >= 0) theme = 'pride';
  document.body.setAttribute('data-gender', theme);
}

function renderDashboard() {
  document.getElementById('dash-name').textContent = user.name || 'there';
  setGenderTheme(user.gender);
  var isMale = user.gender === 'male';
  var isFemale = user.gender === 'female';
  var isPride = ['nonbinary','transgender','bisexual','genderqueer','genderfluid','agender','intersex','other'].indexOf(user.gender) >= 0;
  var carousel = document.getElementById('widget-carousel');
  var dots = document.getElementById('widget-dots');
  var grid = document.getElementById('feature-grid');
  // Carousel for male, female & pride; feature grid only for other
  if (carousel) carousel.classList.toggle('hidden', !isMale && !isFemale && !isPride);
  if (dots) dots.classList.toggle('hidden', !isMale && !isFemale && !isPride);
  if (grid) grid.classList.toggle('hidden', isMale || isFemale || isPride);
  var womenCard = document.querySelector('.widget-card[data-dim="women"]');
  if (womenCard) womenCard.classList.toggle('hidden', user.gender !== 'female');
  var womenBtn = document.querySelector('.feature-btn[data-dim="women"]');
  if (womenBtn) womenBtn.classList.toggle('hidden', user.gender !== 'female');
  rebuildCarouselDots();
  var bmi = calcBMI();
  var sEl = document.getElementById('stat-bmi');
  if (bmi) { sEl.textContent = bmi.toFixed(1); sEl.style.color = bmiColor(bmi); }
  else { sEl.textContent = '--'; sEl.style.color = ''; }
  var score = calcEnergy();
  document.getElementById('stat-bal').textContent = score.label;
  var sc = document.getElementById('stat-cycle-card');
  if (user.gender === 'female' && user.cycleData && user.cycleData.lastPeriodDate) {
    sc.classList.remove('hidden');
    var pred = predictPeriod();
    document.getElementById('stat-cycle-val').textContent = pred ? pred.days + 'd' : '--';
  } else {
    sc.classList.add('hidden');
  }
  var total = 0;
  DAYS.forEach(function(d) { total += (schedule[d] || []).length; });
  document.getElementById('stat-blocks').textContent = total;

  var mealCount = 0; Object.keys(mealsData).forEach(function(d) { mealCount += mealsData[d].length; });
  document.getElementById('stat-meals').textContent = mealCount;

  var woCount = 0; Object.keys(workoutData).forEach(function(d) { woCount += workoutData[d].length; });
  document.getElementById('stat-workouts').textContent = woCount;

  var rDone = 0, rTotal = 0;
  routineData.forEach(function(r) { rTotal += r.tasks.length; r.tasks.forEach(function(t) { if (routineDone[todayStr()] && routineDone[todayStr()][r.id + '-' + t.id]) rDone++; }); });
  document.getElementById('stat-routines').textContent = rTotal > 0 ? Math.round(rDone/rTotal*100) + '%' : '0%';

  var hobbyMin = 0;
  hobbyData.forEach(function(h) { h.sessions.forEach(function(s) { hobbyMin += parseInt(s.duration) || 0; }); });
  document.getElementById('stat-hobbies').textContent = hobbyMin >= 60 ? Math.round(hobbyMin/60*10)/10 + 'h' : hobbyMin + 'm';
}

// ===== BMI =====
function calcBMI() {
  var h = parseFloat(user.heightCm), w = parseFloat(user.weightKg);
  if (!h || !w || h <= 0) return null;
  return w / ((h/100) * (h/100));
}

function bmiCat(bmi) {
  if (bmi < 18.5) return { label:'Underweight', color:'#42A5F5', key:'uw' };
  if (bmi < 25) return { label:'Healthy', color:'#4CAF50', key:'h' };
  if (bmi < 30) return { label:'Overweight', color:'#FFA726', key:'ow' };
  return { label:'Obese', color:'#FF6B6B', key:'ob' };
}

function bmiColor(bmi) { return bmiCat(bmi).color; }

function renderBody() {
  var bmi = calcBMI();
  var arc = document.querySelector('.bmi-arc');
  document.getElementById('bmi-height').textContent = user.heightCm ? user.heightCm + ' cm' : '--';
  document.getElementById('bmi-weight').textContent = user.weightKg ? user.weightKg + ' kg' : '--';
  document.getElementById('bmi-activity').textContent = user.activityLevel ? user.activityLevel.replace('_',' ') : '--';
  if (bmi) {
    var cat = bmiCat(bmi);
    document.getElementById('bmi-number').textContent = bmi.toFixed(1);
    document.getElementById('bmi-number').style.color = cat.color;
    document.getElementById('bmi-category').textContent = cat.label;
    document.getElementById('bmi-category').style.color = cat.color;
    var pct = Math.min(1, Math.max(0, (bmi - 10) / 30));
    arc.setAttribute('stroke-dashoffset', 326 - (pct * 326));
    arc.setAttribute('stroke', cat.color);
  } else {
    document.getElementById('bmi-number').textContent = '--';
    document.getElementById('bmi-number').style.color = '';
    document.getElementById('bmi-category').textContent = user.heightCm && user.weightKg ? 'Complete measurements' : 'Add height & weight';
    document.getElementById('bmi-category').style.color = '';
    arc.setAttribute('stroke-dashoffset', 326);
    arc.setAttribute('stroke', 'var(--primary)');
  }
  var e = document.getElementById('insight-energy');
  var r = document.getElementById('insight-rest');
  var h = document.getElementById('insight-hydration');
  if (bmi) {
    var cat = bmiCat(bmi);
    if (cat.key === 'uw') {
      e.textContent = 'Focus on nutrient-rich meals and consistent sleep.';
      r.textContent = 'Aim for 8-9 hours of quality sleep. Light strength training helps.';
    } else if (cat.key === 'h') {
      e.textContent = 'Your BMI is healthy. Maintain balanced nutrition and regular activity.';
      r.textContent = '7-9 hours is ideal. Keep a consistent sleep schedule.';
    } else if (cat.key === 'ow') {
      e.textContent = 'Moderate exercise 30-60 min daily can boost energy. Focus on whole foods.';
      r.textContent = 'Quality sleep helps metabolism. Aim for 7-8 hours.';
    } else {
      e.textContent = 'Low-impact activities like walking can help build energy gradually.';
      r.textContent = 'Prioritize 7-9 hours of rest. Consider speaking with a healthcare provider.';
    }
    if (user.activityLevel === 'sedentary') e.textContent += ' Try short movement breaks every hour.';
    else if (user.activityLevel === 'very_active') r.textContent += ' Rest days are essential with high activity.';
    h.textContent = 'Aim for ' + Math.round((parseFloat(user.weightKg) || 60) * 0.033) + 'L of water daily.';
  } else {
    e.textContent = 'Complete your profile to see energy suggestions.';
    r.textContent = 'Your rest needs will appear here.';
    h.textContent = 'Aim for 6-8 glasses of water daily.';
  }
}

// ===== CYCLE =====
function predictPeriod() {
  if (!user.cycleData || !user.cycleData.lastPeriodDate) return null;
  var last = new Date(user.cycleData.lastPeriodDate);
  var len = user.cycleData.cycleLength || 28;
  var today = new Date(); today.setHours(0,0,0,0);
  var next = new Date(last);
  while (next <= today) next.setDate(next.getDate() + len);
  var diff = Math.round((next - today) / (1000*60*60*24));
  var end = new Date(next); end.setDate(end.getDate() + 5);
  return { start:next, end:end, days:diff, sStr:fmtDate(next), eStr:fmtDate(end) };
}

function fmtDate(d) { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getDate(); }

function getPhase() {
  if (!user.cycleData || !user.cycleData.lastPeriodDate) return null;
  var last = new Date(user.cycleData.lastPeriodDate);
  var len = user.cycleData.cycleLength || 28;
  var today = new Date(); today.setHours(0,0,0,0);
  var d = Math.round((today - last) / (1000*60*60*24)) % len;
  if (d < 5) return { name:'Menstruation', icon:'🌑', desc:'Your period is active. Rest and take it easy.', tips:['Prioritize rest and warmth','Stay hydrated','Light stretching helps cramps'] };
  if (d < 13) return { name:'Follicular', icon:'🌒', desc:'Energy is rising. Great for creative work.', tips:['Great for brainstorming','Your energy is building','Tackle creative projects'] };
  if (d < 16) return { name:'Ovulation', icon:'🌕', desc:'Peak energy and confidence.', tips:['Best time for high-energy activities','Communication flows easily','You feel confident'] };
  return { name:'Luteal', icon:'🌘', desc:'Energy may dip. Focus on self-care.', tips:['Reduce caffeine and sugar','Prioritize sleep','Gentle exercise like walking'] };
}

function renderCycle() {
  var pred = predictPeriod();
  var pt = document.getElementById('cycle-pred-text');
  var de = document.getElementById('cycle-dates');
  if (pred) {
    pt.innerHTML = '<p>Your next period is predicted to start in <strong>' + pred.days + ' days</strong>.</p>';
    de.textContent = pred.sStr + ' – ' + pred.eStr;
  } else {
    pt.innerHTML = '<p>Set your cycle data in your profile to see predictions.</p>';
    de.textContent = 'No data yet';
  }
  var phase = getPhase();
  if (phase) {
    document.getElementById('phase-icon').textContent = phase.icon;
    document.getElementById('phase-name').textContent = phase.name;
    document.getElementById('phase-desc').textContent = phase.desc;
    var tl = document.getElementById('cycle-tips');
    tl.innerHTML = '';
    phase.tips.forEach(function(t) { var li = document.createElement('li'); li.textContent = t; tl.appendChild(li); });
  } else {
    document.getElementById('phase-icon').textContent = '🌑';
    document.getElementById('phase-name').textContent = '--';
    document.getElementById('phase-desc').textContent = 'Complete your profile to track your cycle.';
    document.getElementById('cycle-tips').innerHTML = '<li>Track your cycle to get personalized wellness tips.</li>';
  }
}

// ===== PERIOD CALENDAR =====
var calMonth = new Date().getMonth();
var calYear = new Date().getFullYear();

function getPeriodDaysForMonth(month, year) {
  var pp = { past:[], predicted:[] };
  if (!user.cycleData || !user.cycleData.lastPeriodDate) return pp;
  var last = new Date(user.cycleData.lastPeriodDate);
  var len = user.cycleData.cycleLength || 28;
  var pd = 5;
  var starts = [];
  var cursor = new Date(last);
  while (cursor.getFullYear() > year - 2 || (cursor.getFullYear() === year - 2 && cursor.getMonth() >= month)) {
    cursor.setDate(cursor.getDate() - len);
  }
  var limit = 50;
  while (limit > 0) {
    limit--;
    if (cursor.getFullYear() > year + 1) break;
    if (cursor >= new Date(last.getFullYear(), last.getMonth(), last.getDate(), 0, 0, 0, 0)) {
      starts.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + len);
  }
  starts.forEach(function(start) {
    for (var i = 0; i < pd; i++) {
      var d = new Date(start);
      d.setDate(d.getDate() + i);
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (d <= last) { pp.past.push(d.getDate()); }
        else { pp.predicted.push(d.getDate()); }
      }
    }
  });
  return pp;
}

function renderCalendar() {
  var today = new Date();
  document.getElementById('cal-month-label').textContent = ['January','February','March','April','May','June','July','August','September','October','November','December'][calMonth] + ' ' + calYear;
  var grid = document.getElementById('cal-grid');
  var first = new Date(calYear, calMonth, 1);
  var lastDay = new Date(calYear, calMonth + 1, 0).getDate();
  var startDow = first.getDay();
  var days = getPeriodDaysForMonth(calMonth, calYear);
  var h = '';
  ['S','M','T','W','T','F','S'].forEach(function(d) { h += '<div class="cal-dow">' + d + '</div>'; });
  for (var i = 0; i < startDow; i++) {
    var prevD = new Date(calYear, calMonth, -startDow + i + 1).getDate();
    h += '<div class="cal-day other">' + prevD + '</div>';
  }
  for (var d = 1; d <= lastDay; d++) {
    var cls = 'cal-day';
    if (calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate()) cls += ' today';
    if (days.past.indexOf(d) !== -1) cls += ' period-day';
    else if (days.predicted.indexOf(d) !== -1) cls += ' pred-day';
    h += '<div class="' + cls + '">' + d + '</div>';
  }
  var totalCells = startDow + lastDay;
  var rem = totalCells % 7;
  if (rem > 0) { for (var i = 0; i < 7 - rem; i++) { h += '<div class="cal-day other">' + (i + 1) + '</div>'; } }
  grid.innerHTML = h;

  var btn = document.getElementById('cal-setup-btn');
  var settings = document.getElementById('cycle-settings');
  if (user.cycleData && user.cycleData.lastPeriodDate) {
    btn.textContent = '✏️ Edit Data';
    settings.classList.add('hidden');
  } else {
    btn.textContent = 'Set Cycle Data';
  }
}

function calGo(d) {
  calMonth += d;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}

function calGoToday() {
  var t = new Date();
  calMonth = t.getMonth();
  calYear = t.getFullYear();
  renderCalendar();
}

function toggleCycleSettings() {
  var s = document.getElementById('cycle-settings');
  s.classList.toggle('hidden');
  if (!s.classList.contains('hidden') && user.cycleData) {
    document.getElementById('cal-last-period').value = user.cycleData.lastPeriodDate || '';
    document.getElementById('cal-cycle-length').value = user.cycleData.cycleLength || 28;
  }
}

function saveCycleSettings() {
  var d = document.getElementById('cal-last-period').value;
  var l = parseInt(document.getElementById('cal-cycle-length').value) || 28;
  if (!d) { alert('Select your last period start date.'); return; }
  if (!user.cycleData) user.cycleData = {};
  user.cycleData.lastPeriodDate = d;
  user.cycleData.cycleLength = l;
  saveUser();
  if (authToken) {
    fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
      body: JSON.stringify({ cycleData: user.cycleData })
    }).catch(function() {});
  }
  document.getElementById('cycle-settings').classList.add('hidden');
  renderCycle();
  renderCalendar();
  renderDashboard();
  renderWomenFeatures();
  renderPCOS();
}

// ===== WOMEN'S HEALTH FEATURES =====
var symptomsData = {};

var SYMPTOM_LIST = ['Cramps','Headache','Bloating','Fatigue','Mood Swings','Acne','Back Pain','Nausea','Breast Tenderness','Insomnia','Cravings','Dizziness'];

function loadSymptoms() {
  if (authToken) {
    return apiGet('baskug_symptoms').then(function(d) {
      if (d && typeof d === 'object') symptomsData = d;
    }).catch(function() {
      try { var ld = localStorage.getItem('baskug_symptoms'); if (ld) symptomsData = JSON.parse(ld); } catch(e) {}
    });
  }
  try { var d = localStorage.getItem('baskug_symptoms'); if (d) symptomsData = JSON.parse(d); } catch(e) {}
  if (!symptomsData || typeof symptomsData !== 'object') symptomsData = {};
}

function saveSymptoms() {
  if (authToken) { apiPut('baskug_symptoms', symptomsData); }
  localStorage.setItem('baskug_symptoms', JSON.stringify(symptomsData));
}

var PHASE_CARE = {
  menstruation: {
    selfCare:[ 'Prioritise rest and sleep','Gentle stretching or yoga','Warm baths for cramps','Stay hydrated with herbal tea','Use heat packs for lower back','Take time to slow down' ],
    skinCare:[ 'Skin may be dry — use rich moisturiser','Gentle cleansing only','Avoid harsh exfoliants','Increase water intake','Use soothing face masks','Stick to basic routine' ]
  },
  follicular: {
    selfCare:[ 'Great time for creative projects','Try new workouts','Socialise and connect','Plan goals for the month','Try journaling','Eat fresh, light meals' ],
    skinCare:[ 'Skin is glowing — minimal routine works','Lightweight moisturiser','Good time for facials','Vitamin C serum works well','SPF is essential','Skin absorbs products well' ]
  },
  ovulation: {
    selfCare:[ 'Peak energy — tackle big tasks','High-intensity workouts','Communicate and express','Try something adventurous','Attend social events','Confidence is high — use it' ],
    skinCare:[ 'Skin may be oily — use mattifying products','Salicylic acid if prone to breakouts','Oil-control cleanser','Lightweight sunscreen','Keep makeup minimal','Hydrate well' ]
  },
  luteal: {
    selfCare:[ 'Reduce caffeine and sugar','Prioritise sleep','Gentle exercise like walking','Practice mindfulness','Warm baths to relax','Give yourself grace' ],
    skinCare:[ 'Acne-prone — gentle cleansing','Avoid touching face','Use non-comedogenic products','Spot treatment if needed','Hydrating serum','Stick to simple routine' ]
  }
};

var PHASE_HORMONES = {
  menstruation: [
    { name:'Estrogen', level:15, color:'#F48FB1', desc:'Low — rising slowly' },
    { name:'Progesterone', level:10, color:'#CE93D8', desc:'Low' },
    { name:'FSH', level:70, color:'#81D4FA', desc:'High — stimulating follicle growth' },
    { name:'LH', level:20, color:'#A5D6A7', desc:'Low — rising toward ovulation' }
  ],
  follicular: [
    { name:'Estrogen', level:60, color:'#F48FB1', desc:'Rising — rebuilding uterine lining' },
    { name:'Progesterone', level:15, color:'#CE93D8', desc:'Low — steady' },
    { name:'FSH', level:45, color:'#81D4FA', desc:'Moderate — follicle developing' },
    { name:'LH', level:30, color:'#A5D6A7', desc:'Rising — preparing for surge' }
  ],
  ovulation: [
    { name:'Estrogen', level:95, color:'#F48FB1', desc:'Peak — triggers LH surge' },
    { name:'Progesterone', level:25, color:'#CE93D8', desc:'Starting to rise' },
    { name:'FSH', level:30, color:'#81D4FA', desc:'Moderate' },
    { name:'LH', level:90, color:'#A5D6A7', desc:'Peak surge — triggers ovulation' }
  ],
  luteal: [
    { name:'Estrogen', level:50, color:'#F48FB1', desc:'Moderate — second rise' },
    { name:'Progesterone', level:85, color:'#CE93D8', desc:'High — maintains uterine lining' },
    { name:'FSH', level:15, color:'#81D4FA', desc:'Low — suppressed by progesterone' },
    { name:'LH', level:15, color:'#A5D6A7', desc:'Low' }
  ]
};

function renderWomenFeatures() {
  renderSymptoms();
  renderSelfCare();
  renderSkinCare();
  renderHormones();
  renderAnalysis();
}

function renderSymptoms() {
  var today = todayStr();
  document.getElementById('symptom-date-label').textContent = today;
  var todaySymps = symptomsData[today] || [];
  var grid = document.getElementById('symp-grid');
  grid.innerHTML = '';
  SYMPTOM_LIST.forEach(function(s) {
    var el = document.createElement('button');
    el.className = 'symp-tag' + (todaySymps.indexOf(s) !== -1 ? ' active' : '');
    el.textContent = s;
    el.addEventListener('click', function() { this.classList.toggle('active'); });
    grid.appendChild(el);
  });
  var log = document.getElementById('symp-log');
  var days = Object.keys(symptomsData).sort().reverse().slice(0, 7);
  if (days.length === 0) { log.innerHTML = '<p class="muted" style="padding:8px 0;">No symptoms logged yet.</p>'; return; }
  log.innerHTML = days.map(function(d) {
    var symps = symptomsData[d];
    if (!symps || symps.length === 0) return '';
    return '<div class="symp-log-item"><span class="sl-date">' + fmtDateShort(d) + '</span><span class="sl-symps">' + symps.join(', ') + '</span><button class="sl-del" data-date="' + d + '">&times;</button></div>';
  }).join('');
  log.querySelectorAll('.sl-del').forEach(function(btn) {
    btn.addEventListener('click', function() {
      delete symptomsData[this.dataset.date];
      saveSymptoms();
      renderSymptoms();
    });
  });
}

function saveSympToday() {
  var tags = document.querySelectorAll('#symp-grid .symp-tag.active');
  symptomsData[todayStr()] = Array.from(tags).map(function(t) { return t.textContent; });
  saveSymptoms();
  var msg = document.getElementById('symp-saved');
  msg.classList.add('show');
  setTimeout(function() { msg.classList.remove('show'); }, 2000);
  renderSymptoms();
}

function getPhaseKey() {
  var p = getPhase();
  if (!p) return null;
  return p.name.toLowerCase();
}

function renderSelfCare() {
  var phase = getPhaseKey();
  var list = document.getElementById('sc-list');
  var badge = document.getElementById('sc-phase-badge');
  if (!phase || !PHASE_CARE[phase]) {
    badge.textContent = '--';
    list.innerHTML = '<li class="muted">Set your cycle data to see recommendations.</li>';
    return;
  }
  badge.textContent = phase;
  list.innerHTML = PHASE_CARE[phase].selfCare.map(function(s) { return '<li>' + s + '</li>'; }).join('');
}

function renderSkinCare() {
  var phase = getPhaseKey();
  var list = document.getElementById('skin-list');
  var badge = document.getElementById('skin-phase-badge');
  if (!phase || !PHASE_CARE[phase]) {
    badge.textContent = '--';
    list.innerHTML = '<li class="muted">Set your cycle data to see recommendations.</li>';
    return;
  }
  badge.textContent = phase;
  list.innerHTML = PHASE_CARE[phase].skinCare.map(function(s) { return '<li>' + s + '</li>'; }).join('');
}

function renderHormones() {
  var phase = getPhaseKey();
  var grid = document.getElementById('hormone-grid');
  var badge = document.getElementById('hormone-phase-badge');
  if (!phase || !PHASE_HORMONES[phase]) {
    badge.textContent = '--';
    grid.innerHTML = '<p class="muted" style="padding:8px 0;">Set your cycle data to see hormone levels.</p>';
    return;
  }
  badge.textContent = phase;
  grid.innerHTML = PHASE_HORMONES[phase].map(function(h) {
    return '<div class="hormone-item"><span class="ho-name">' + h.name + '</span><div class="ho-bar-wrap"><div class="ho-bar ' + h.name.toLowerCase() + '" style="width:' + h.level + '%;"></div></div><span class="ho-lvl">' + h.desc + '</span></div>';
  }).join('');
}

function renderAnalysis() {
  var grid = document.getElementById('analysis-grid');
  var insight = document.getElementById('analysis-insight');
  if (!user.cycleData || !user.cycleData.lastPeriodDate) {
    grid.innerHTML = '<p class="muted" style="padding:12px 0;text-align:center;">Set your cycle data to see analysis.</p>';
    insight.innerHTML = '';
    return;
  }
  var last = new Date(user.cycleData.lastPeriodDate);
  var len = user.cycleData.cycleLength || 28;
  var now = new Date();
  var daysSince = Math.round((now - last) / (1000*60*60*24));
  var periodsBack = Math.floor(daysSince / len) + 1;
  var sympEntries = Object.keys(symptomsData).length;
  var freq = {};
  Object.keys(symptomsData).forEach(function(d) {
    symptomsData[d].forEach(function(s) {
      freq[s] = (freq[s] || 0) + 1;
    });
  });
  var topSymp = Object.keys(freq).sort(function(a,b) { return freq[b] - freq[a]; }).slice(0, 3);
  grid.innerHTML = '<div class="analysis-stat"><div class="as-val">' + len + 'd</div><div class="as-lbl">Avg Cycle</div></div><div class="analysis-stat"><div class="as-val">' + periodsBack + '</div><div class="as-lbl">Periods Tracked</div></div><div class="analysis-stat"><div class="as-val">' + sympEntries + '</div><div class="as-lbl">Days Logged</div></div><div class="analysis-stat"><div class="as-val">' + (topSymp.length ? topSymp[0] : '--') + '</div><div class="as-lbl">Top Symptom</div></div>';
  if (topSymp.length > 0) {
    insight.innerHTML = '<strong>📊 Patterns:</strong> Your most common symptoms are <strong>' + topSymp.join(', ') + '</strong>. ' + (len <= 28 ? 'Your cycle length (' + len + ' days) is within the typical range.' : 'Your cycle length (' + len + ' days) is longer than average.') + ' Track consistently to spot trends.';
  } else {
    insight.innerHTML = '<strong>📊 Patterns:</strong> Track your symptoms regularly to discover patterns and insights about your cycle.';
  }
}

// ===== REMEDIES =====
var REMEDIES = [
  { icon:'🩸', title:'Period Cramps', desc:'Gentle ways to ease menstrual discomfort.', womenOnly:true, items:['Apply a heat pack or warm towel to lower belly','Drink chamomile or ginger tea','Magnesium-rich foods (dark chocolate, bananas)','Light stretching or yoga','Warm bath with Epsom salts','Stay hydrated — helps reduce bloating'] },
  { icon:'🤕', title:'Headaches', desc:'Natural relief for tension and hormonal headaches.', items:['Peppermint oil on temples (diluted)','Rest in a dark, quiet room','Stay hydrated — dehydration triggers headaches','Cold compress on forehead','Magnesium or B2 supplement','Reduce screen time'] },
  { icon:'🫧', title:'Bloating', desc:'Reduce water retention and digestive discomfort.', items:['Peppermint or fennel tea after meals','Reduce salty and processed foods','Eat potassium-rich foods (bananas, avocado)','Gentle movement — walking helps','Probiotics for gut health','Avoid carbonated drinks'] },
  { icon:'⚡', title:'Fatigue', desc:'Boost energy naturally during low-energy days.', items:['Iron-rich foods (spinach, lentils, red meat)','B12 and vitamin D supplements','Short 15-min power nap','Light exercise — walking or stretching','Reduce caffeine after 2pm','Consistent sleep schedule'] },
  { icon:'🎭', title:'Mood Swings', desc:'Balance emotions with natural support.', items:['Omega-3s (salmon, walnuts, flax seeds)','Regular exercise — even 20 min helps','Magnesium glycinate before bed','Limit caffeine and sugar','Journaling to process feelings','Talk to a friend or therapist'] },
  { icon:'🌸', title:'PCOS Support', desc:'Natural ways to support hormone balance.', womenOnly:true, items:['Spearmint tea — may help lower androgens','Inositol supplement — supports insulin sensitivity','Balanced diet with lean protein and fibre','Regular strength training','Reduce sugar and refined carbs','Track symptoms to find patterns'] },
  { icon:'😴', title:'Better Sleep', desc:'Improve sleep quality naturally.', items:['Magnesium glycinate 30 min before bed','Lavender essential oil on pillow','No screens 30-60 min before sleep','Consistent bedtime and wake time','Cool, dark bedroom environment','Chamomile tea before bed'] }
];

function renderRemedies() {
  var grid = document.getElementById('remedy-grid');
  var remedies = user.gender === 'female' ? REMEDIES : REMEDIES.filter(function(r) { return !r.womenOnly; });
  grid.innerHTML = remedies.map(function(r) {
    return '<div class="remedy-card"><div class="rc-icon">' + r.icon + '</div><div class="rc-title">' + r.title + '</div><div class="rc-desc">' + r.desc + '</div><ul class="rc-list">' + r.items.map(function(i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
  }).join('');
}

// ===== PCOS WORKOUT =====
var PCOS_WORKOUTS = [
  { icon:'🏋️', name:'Strength Training', benefits:'Builds muscle, improves insulin sensitivity', desc:'Strength training is one of the most effective exercises for PCOS. It helps regulate blood sugar, boosts metabolism, and supports hormone balance.', routine:'• Squats: 3 sets x 12 reps\n• Dumbbell Rows: 3 x 12\n• Overhead Press: 3 x 10\n• Deadlifts: 3 x 10\n• Plank: 3 x 30 sec\n• Rest 60s between sets\n\nDo 3x per week' },
  { icon:'🚶', name:'Walking & Cardio', benefits:'Reduces stress, improves mood, gentle on joints', desc:'Low-impact cardio like walking is excellent for PCOS. It reduces cortisol, improves circulation, and is sustainable long-term.', routine:'• 30-45 min brisk walking\n• Or 20 min cycling / elliptical\n• Maintain conversational pace\n• Add incline for intensity\n\nAim for 4-5x per week' },
  { icon:'🧘', name:'Yoga & Pilates', benefits:'Lowers cortisol, reduces inflammation, balances hormones', desc:'Yoga is powerful for PCOS because it directly lowers cortisol — the stress hormone that can worsen PCOS symptoms.', routine:'• Child\'s Pose: 2 min\n• Cat-Cow: 10 rounds\n• Downward Dog: 1 min\n• Warrior II: 30s each side\n• Bridge Pose: 30s x 3\n• Savasana: 5 min\n\nDo daily or 5x per week' },
  { icon:'🔥', name:'HIIT', benefits:'Burns fat fast, improves cardiovascular health', desc:'HIIT can be effective for PCOS but should be done in moderation (2-3x/week) to avoid spiking cortisol.', routine:'• Jumping Jacks: 30s\n• Rest: 30s\n• Mountain Climbers: 30s\n• Rest: 30s\n• Burpees: 30s\n• Rest: 30s\n• High Knees: 30s\n• Rest: 30s\n\nRepeat circuit 3-4 times' }
];

var PCOS_TIPS = [
  'Consistency matters more than intensity — start slow and build up.',
  'Listen to your body. Rest when you need to, especially during your period.',
  'Pair exercise with balanced nutrition for best results.',
  'Strength training + walking is a powerful combination for PCOS.',
  'Track your workouts and how you feel to find what works for your body.',
  'Stress management (yoga, meditation) is just as important as exercise.',
  'Stay hydrated — aim for 2-3L of water daily.',
  'Celebrate small wins. Every workout counts.'
];

function renderPCOS() {
  var grid = document.getElementById('pcos-grid');
  grid.innerHTML = PCOS_WORKOUTS.map(function(w) {
    return '<div class="pcos-card"><div class="pc-head"><span class="pc-icon">' + w.icon + '</span><div><div class="pc-name">' + w.name + '</div><div class="pc-benefits">' + w.benefits + '</div></div></div><div class="pc-desc">' + w.desc + '</div><div class="pc-routine">' + w.routine + '</div></div>';
  }).join('');
  document.getElementById('pcos-tips').innerHTML = '<h4>💡 Tips for PCOS Exercise</h4><ul>' + PCOS_TIPS.map(function(t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
}

// ===== MEDITATION =====
var MED_TYPES = [
  { id:'breath', icon:'🌬️', name:'Breathing', desc:'Deep breathing to calm the mind' },
  { id:'body', icon:'🧍', name:'Body Scan', desc:'Gentle awareness of your body' },
  { id:'stress', icon:'🌊', name:'Stress Relief', desc:'Release tension and find calm' },
  { id:'sleep', icon:'🌙', name:'Sleep', desc:'Wind down for restful sleep' }
];

var medSelected = null;
var medTimer = null;
var medRunning = false;

function renderMedTypes() {
  var container = document.getElementById('med-types');
  container.innerHTML = MED_TYPES.map(function(m) {
    return '<button class="med-type-btn' + (medSelected === m.id ? ' active' : '') + '" data-med="' + m.id + '"><span class="mt-icon">' + m.icon + '</span><span class="mt-name">' + m.name + '</span></button>';
  }).join('');
  container.querySelectorAll('.med-type-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      medSelected = this.dataset.med;
      renderMedTypes();
      document.getElementById('med-status').textContent = 'Ready. Press Start to begin ' + this.querySelector('.mt-name').textContent + ' session.';
    });
  });
}

function startMeditation() {
  if (!medSelected) { alert('Select a meditation type first.'); return; }
  if (medRunning) { stopMeditation(); return; }
  var dur = parseInt(document.getElementById('med-duration').value) * 1000;
  var endTime = Date.now() + dur;
  medRunning = true;
  document.getElementById('med-start-btn').textContent = 'Stop';
  document.getElementById('med-status').textContent = 'Session started...';

  if (medSelected === 'breath') { startBreathing(endTime); }
  else { startGuided(medSelected, endTime); }
}

function stopMeditation() {
  medRunning = false;
  if (medTimer) { clearInterval(medTimer); medTimer = null; }
  if (medTimer) { clearTimeout(medTimer); medTimer = null; }
  var circle = document.getElementById('breath-circle');
  circle.className = 'breath-circle';
  document.getElementById('breath-text').textContent = 'Breathe';
  document.getElementById('breath-count').textContent = '';
  document.getElementById('med-start-btn').textContent = 'Start Session';
  document.getElementById('med-status').textContent = 'Session ended. Take a moment.';
}

function startBreathing(endTime) {
  var circle = document.getElementById('breath-circle');
  var text = document.getElementById('breath-text');
  var count = document.getElementById('breath-count');
  var phases = ['inhale','hold','exhale','hold'];
  var phaseText = { inhale:'Breathe In', hold:'Hold', exhale:'Breathe Out' };
  var phaseDur = { inhale:4000, hold:4000, exhale:4000 };
  var step = 0, cycleCount = 0;

  function nextPhase() {
    if (!medRunning || Date.now() >= endTime) { stopMeditation(); return; }
    var p = phases[step % 4];
    circle.className = 'breath-circle ' + p;
    text.textContent = phaseText[p] || 'Breathe';
    if (step % 4 === 0) { cycleCount++; count.textContent = 'Cycle ' + cycleCount; }
    var remaining = Math.round((endTime - Date.now()) / 1000);
    document.getElementById('med-status').textContent = 'Breathing — ' + remaining + 's remaining';
    step++;
    var dur = phaseDur[p] || 4000;
    if (p === 'hold' && (step-1) % 4 === 1) dur = 2000;
    if (p === 'hold' && (step-1) % 4 === 3) dur = 2000;
    medTimer = setTimeout(nextPhase, dur);
  }
  nextPhase();
}

function startGuided(type, endTime) {
  var circle = document.getElementById('breath-circle');
  var text = document.getElementById('breath-text');
  var count = document.getElementById('breath-count');
  var guides = {
    body: [
      { t:5000, msg:'Bring attention to your feet...' },
      { t:8000, msg:'Notice sensations in your legs...' },
      { t:8000, msg:'Move awareness to your belly...' },
      { t:8000, msg:'Feel your chest rising and falling...' },
      { t:8000, msg:'Notice your shoulders relaxing...' },
      { t:8000, msg:'Bring awareness to your neck...' },
      { t:8000, msg:'Notice your face — soften the jaw...' },
      { t:8000, msg:'Now scan from head to toe...' },
      { t:6000, msg:'Rest in full body awareness...' }
    ],
    stress: [
      { t:5000, msg:'Take a deep breath in...' },
      { t:5000, msg:'Slowly release...' },
      { t:8000, msg:'Imagine tension melting from your shoulders...' },
      { t:8000, msg:'With each exhale, release more...' },
      { t:8000, msg:'Picture a calm, peaceful place...' },
      { t:8000, msg:'Notice the colours, the sounds...' },
      { t:8000, msg:'Let your mind rest in this peace...' },
      { t:8000, msg:'Carry this calmness with you...' }
    ],
    sleep: [
      { t:6000, msg:'Close your eyes gently...' },
      { t:8000, msg:'Notice your breath becoming deeper...' },
      { t:8000, msg:'Let go of the day\'s thoughts...' },
      { t:10000, msg:'Imagine floating on a warm cloud...' },
      { t:10000, msg:'Your body feels heavy and relaxed...' },
      { t:10000, msg:'Drifting deeper into rest...' },
      { t:10000, msg:'Peace surrounds you...' },
      { t:10000, msg:'Rest now, you are safe...' }
    ]
  };
  var steps = guides[type] || guides.body;
  var idx = 0;

  function next() {
    if (!medRunning || Date.now() >= endTime) { stopMeditation(); circle.className = 'breath-circle'; return; }
    if (idx >= steps.length) idx = 0;
    var s = steps[idx];
    circle.className = 'breath-circle inhale';
    text.textContent = s.msg;
    var remaining = Math.round((endTime - Date.now()) / 1000);
    count.textContent = remaining + 's';
    document.getElementById('med-status').textContent = (type === 'sleep' ? '🌙 ' : '') + 'Guided session — ' + remaining + 's remaining';
    idx++;
    medTimer = setTimeout(next, s.t);
  }
  next();
}

// ===== SOUNDSCAPES =====
var soundPlaying = null;

var SOUNDS = [
  { id:'rain', icon:'🌧️', name:'Rain', desc:'real rainforest rainfall', youtube:'LU1Hb27dSSc' },
  { id:'forest', icon:'🌲', name:'Forest', desc:'real birdsong & forest breeze', youtube:'RUuTIx2gSM4' },
  { id:'waterfall', icon:'🏔️', name:'Waterfall', desc:'real cascading water', youtube:'WwSFmC5FtX0' },
  { id:'waves', icon:'🌊', name:'Waves', desc:'real ocean waves', youtube:'6Yuc-teLGEA' }
];

function renderSoundscapes() {
  var grid = document.getElementById('sound-grid');
  grid.innerHTML = SOUNDS.map(function(s) {
    return '<div class="sound-card' + (soundPlaying === s.id ? ' playing' : '') + '" data-sound="' + s.id + '"><span class="sc-icon">' + s.icon + '</span><span class="sc-name">' + s.name + '</span><span class="sc-status">' + (soundPlaying === s.id ? 'Playing...' : s.desc) + '</span></div>';
  }).join('');
  grid.querySelectorAll('.sound-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var id = this.dataset.sound;
      if (soundPlaying === id) { stopSound(); }
      else { playSound(id); }
    });
  });
}

function playSound(id) {
  stopSound();
  soundPlaying = id;
  var vid = SOUNDS.find(function(s) { return s.id === id; }).youtube;
  document.getElementById('sp-status').textContent = 'Now playing: ' + SOUNDS.find(function(s) { return s.id === id; }).name;
  renderSoundscapes();

  var frame = document.getElementById('sound-frame');
  if (frame) {
    frame.src = 'https://www.youtube.com/embed/' + vid + '?autoplay=1&loop=1&playlist=' + vid + '&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0';
  }
}

function stopSound() {
  var frame = document.getElementById('sound-frame');
  if (frame) frame.src = '';
  soundPlaying = null;
  document.getElementById('sp-status').textContent = 'Select a sound to play';
  renderSoundscapes();
}

// ===== BALANCE =====
function calcEnergy() {
  var total = 0, catH = { productive:0, life:0, growth:0, fun:0, rest:0 };
  DAYS.forEach(function(day) {
    (schedule[day] || []).forEach(function(b) {
      var m = duration(b.start, b.end);
      catH[b.category] += m / 60;
      total += m / 60;
    });
  });
  if (total === 0) return { score:0, label:'--', color:'#999', details:[], breakdown:null };
  var p = { productive:(catH.productive/total)*100, rest:(catH.rest/total)*100, fun:(catH.fun/total)*100, growth:(catH.growth/total)*100, life:(catH.life/total)*100 };
  var score = 100;
  score -= Math.abs(p.productive - 35) * 0.8;
  score -= Math.abs(p.rest - 25) * 0.8;
  score -= Math.abs(p.fun - 15) * 0.6;
  score -= Math.abs(p.growth - 15) * 0.6;
  score -= Math.abs(p.life - 10) * 0.5;
  score = Math.max(0, Math.min(100, Math.round(score)));
  var label, color;
  if (score >= 80) { label = '🌟 Great'; color = '#4CAF50'; }
  else if (score >= 60) { label = '👍 Balanced'; color = '#8BC34A'; }
  else if (score >= 40) { label = '⚡ Needs work'; color = '#FFA726'; }
  else if (score >= 20) { label = '😴 Tired'; color = '#FF7043'; }
  else { label = '🔴 Overloaded'; color = '#FF6B6B'; }
  var details = [];
  if (p.productive > 50) details.push('Work-heavy — add more rest and fun');
  if (p.rest < 15) details.push('Not enough rest — you need more downtime');
  if (p.fun < 5) details.push('Very little entertainment — plan something enjoyable');
  if (p.growth < 5) details.push('Low personal growth time — try journaling or reading');
  if (p.life < 3) details.push('Life tasks low — don\'t forget chores and self-care');
  return { score:score, label:label, color:color, details:details,
    breakdown:{ productive:p.productive, rest:p.rest, fun:p.fun, growth:p.growth, life:p.life,
      hours:{ productive:Math.round(catH.productive*10)/10, rest:Math.round(catH.rest*10)/10,
              fun:Math.round(catH.fun*10)/10, growth:Math.round(catH.growth*10)/10,
              life:Math.round(catH.life*10)/10 } } };
}

function renderBalance() {
  var sd = calcEnergy();
  var arc = document.querySelector('.score-arc');
  if (sd.score > 0) {
    document.getElementById('score-number').textContent = sd.score;
    document.getElementById('score-number').style.color = sd.color;
    document.getElementById('score-status').textContent = sd.label;
    document.getElementById('score-status').style.color = sd.color;
    arc.setAttribute('stroke-dashoffset', 326 - (sd.score/100 * 326));
    arc.setAttribute('stroke', sd.color);
  } else {
    document.getElementById('score-number').textContent = '--';
    document.getElementById('score-number').style.color = '';
    document.getElementById('score-status').textContent = 'Add schedule data to see your score.';
    document.getElementById('score-status').style.color = '';
    arc.setAttribute('stroke-dashoffset', 326);
    arc.setAttribute('stroke', 'var(--primary)');
  }
  var grid = document.getElementById('bal-grid');
  grid.innerHTML = '';
  ['productive','life','growth','fun','rest'].forEach(function(c) {
    var pct = sd.breakdown ? sd.breakdown[c] : 0;
    var cls = { productive:'prod', life:'life', growth:'grow', fun:'fun', rest:'rest' }[c];
    grid.innerHTML += '<div class="bal-item"><div class="bi-icon">' + CAT_ICON[c] + '</div><div class="bi-label">' + CAT_LABEL[c] + '</div><div class="bi-bar-wrap"><div class="bi-bar ' + cls + '" style="width:' + pct + '%;"></div></div><div class="bi-pct ' + cls + '">' + Math.round(pct) + '%</div><div style="font-size:0.7rem;color:var(--muted);">' + (sd.breakdown ? sd.breakdown.hours[c] + 'h' : '') + '</div></div>';
  });
  var bc = document.getElementById('bal-breakdown');
  if (sd.details && sd.details.length > 0) {
    var h = '<ul style="list-style:none;padding:0;">';
    sd.details.forEach(function(d) { h += '<li style="padding:6px 0;border-bottom:1px solid var(--border);font-size:0.85rem;color:var(--soft);">💡 ' + d + '</li>'; });
    h += '</ul>';
    bc.innerHTML = h;
  } else if (sd.score > 0) {
    bc.innerHTML = '<p style="color:var(--success);font-weight:600;">Your week looks well-balanced! Keep it up.</p>';
  } else {
    bc.innerHTML = '<p class="muted">Add blocks to your planner to see your breakdown.</p>';
  }
}

// ===== TIME HELPERS =====
function toMin(t) { var p = t.split(':'); return parseInt(p[0],10)*60 + parseInt(p[1],10); }

function to12(t) {
  var p = t.split(':'), h = parseInt(p[0],10), m = p[1], am = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12; else if (h > 12) h -= 12;
  return h + ':' + m + ' ' + am;
}

function duration(s, e) {
  var a = toMin(s), b = toMin(e);
  if (b <= a) b += 24*60;
  return b - a;
}

function fmtDur(m) {
  var h = Math.floor(m/60), mn = m%60;
  if (h === 0) return mn + 'm';
  if (mn === 0) return h + 'h';
  return h + 'h ' + mn + 'm';
}

// ===== PLANNER =====
function renderWeek() {
  renderWeekCards();
}

function renderRoster() {
  // Legacy — keep for backward compat; weekly tab now uses renderWeekCards
}

// ===== WEEKLY PLANNER (day-card layout) =====
var weekEditTarget = null;

function renderWeekCards() {
  var week = document.getElementById('week-grid');
  if (!week) return;
  week.innerHTML = '';

  var labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var keys = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  keys.forEach(function(day, di) {
    var card = document.createElement('div');
    card.className = 'work-day-card';

    var head = document.createElement('div');
    head.className = 'wdc-head';
    head.textContent = labels[di];
    card.appendChild(head);

    var entries = document.createElement('div');
    entries.className = 'wdc-entries';

    var blocks = schedule[day] || [];
    if (blocks.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'wdc-empty';
      empty.textContent = '—';
      entries.appendChild(empty);
    } else {
      blocks.forEach(function(b, bi) {
        var entry = document.createElement('div');
        entry.className = 'wdc-entry';
        var catCls = b.category || 'productive';
        entry.style.borderLeft = '4px solid var(--c-' + catCls + ')';
        entry.innerHTML = '<div class="wdc-place">' + escHtml(b.activity) + '</div><div class="wdc-times"><span class="wdc-start">' + to12(b.start) + '</span><span class="wdc-arrow">→</span><span class="wdc-end">' + to12(b.end) + '</span></div><span class="wdc-del">✕</span>';
        // Delete
        entry.querySelector('.wdc-del').addEventListener('click', function(e) {
          e.stopPropagation();
          schedule[day].splice(bi, 1);
          saveSched();
          if (weekEditTarget && weekEditTarget.day === day && weekEditTarget.idx === bi) hideWeekForm();
          renderWeekCards();
          renderMonthlyCal();
          renderDashboard();
          renderBalance();
        });
        // Click to edit
        entry.addEventListener('click', function(e) {
          if (e.target.classList.contains('wdc-del')) return;
          showWeekForm(day, bi);
        });
        entries.appendChild(entry);
      });
    }

    card.appendChild(entries);

    var addBtn = document.createElement('div');
    addBtn.className = 'wdc-add';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', function() { showWeekForm(day, null); });
    card.appendChild(addBtn);

    card.addEventListener('click', function(e) {
      if (e.target === card || e.target === head || e.target === entries || e.target.classList.contains('wdc-empty')) {
        showWeekForm(day, null);
      }
    });

    week.appendChild(card);
  });
}

function showWeekForm(day, idx) {
  weekEditTarget = { day: day, idx: idx };
  var form = document.getElementById('week-add-block');
  var dayLabel = document.getElementById('week-form-day');
  dayLabel.textContent = day.charAt(0).toUpperCase() + day.slice(1);
  form.classList.remove('hidden');

  if (idx !== null && schedule[day] && schedule[day][idx]) {
    var b = schedule[day][idx];
    document.getElementById('week-category').value = b.category || 'productive';
    document.getElementById('week-activity').value = b.activity;
    document.getElementById('week-start').value = b.start;
    document.getElementById('week-end').value = b.end;
    document.getElementById('save-week-btn').textContent = 'Update';
  } else {
    document.getElementById('week-category').value = 'productive';
    document.getElementById('week-activity').value = '';
    document.getElementById('week-start').value = '10:00';
    document.getElementById('week-end').value = '11:00';
    document.getElementById('save-week-btn').textContent = 'Add';
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('week-activity').focus();
}

function hideWeekForm() {
  weekEditTarget = null;
  document.getElementById('week-add-block').classList.add('hidden');
  renderWeekCards();
}

function saveWeekBlock() {
  if (!weekEditTarget) { alert('Select a day first'); return; }
  var day = weekEditTarget.day;
  var cat = document.getElementById('week-category').value;
  var act = document.getElementById('week-activity').value.trim();
  var s = document.getElementById('week-start').value;
  var e = document.getElementById('week-end').value;
  if (!act) { alert('Enter an activity'); return; }
  if (!s || !e) { alert('Set start and end times'); return; }

  if (weekEditTarget.idx !== null && schedule[day] && schedule[day][weekEditTarget.idx]) {
    var b = schedule[day][weekEditTarget.idx];
    b.category = cat;
    b.activity = act;
    b.start = s;
    b.end = e;
  } else {
    if (!schedule[day]) schedule[day] = [];
    schedule[day].push({ id:day.charAt(0)+Date.now(), start:s, end:e, activity:act, category:cat });
  }

  schedule[day].sort(function(a,b) { return toMin(a.start) - toMin(b.start); });
  saveSched();
  hideWeekForm();
  renderWeekCards();
  renderMonthlyCal();
  renderDashboard();
  renderBalance();
}

// Legacy add/delete/reset (kept for backward compat)
function addBlock() {
  // fallback — not used by new UI
}
function deleteBlock(day, idx) {
  schedule[day].splice(idx, 1);
  saveSched();
  renderWeekCards();
  renderMonthlyCal();
  renderDashboard();
  renderBalance();
}
function resetWeek() {
  if (confirm('Reset all schedule data?')) {
    schedule = JSON.parse(JSON.stringify(DEFAULT));
    saveSched();
    renderWeekCards();
    renderMonthlyCal();
    renderDashboard();
    renderBalance();
  }
}

// ===== PLANNER TABS =====
function switchPlannerTab(tab) {
  document.querySelectorAll('.planner-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.planner-section').forEach(function(s) { s.classList.add('hidden'); });
  var tabBtn = document.querySelector('.planner-tab[data-ptab="' + tab + '"]');
  var section = document.querySelector('.planner-section[data-psection="' + tab + '"]');
  if (tabBtn) tabBtn.classList.add('active');
  if (section) section.classList.remove('hidden');
  if (tab === 'work') renderWorkRoster();
  if (tab === 'weekly') renderWeekCards();
  if (tab === 'monthly') renderMonthlyCal();
  if (tab === 'routines') renderRoutinesTimeline();
}

// ===== WORK PLANNER (simple weekly calendar) =====
var workEditTarget = null; // { day, idx } or null for new

function renderWorkRoster() {
  var week = document.getElementById('work-week');
  if (!week) return;
  week.innerHTML = '';

  var labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var keys = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  keys.forEach(function(day, di) {
    var card = document.createElement('div');
    card.className = 'work-day-card';

    var head = document.createElement('div');
    head.className = 'wdc-head';
    head.textContent = labels[di];
    card.appendChild(head);

    var entries = document.createElement('div');
    entries.className = 'wdc-entries';

    var blocks = workSchedule[day] || [];
    if (blocks.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'wdc-empty';
      empty.textContent = '—';
      entries.appendChild(empty);
    } else {
      blocks.forEach(function(b, bi) {
        var entry = document.createElement('div');
        entry.className = 'wdc-entry';
        entry.innerHTML = '<div class="wdc-place">' + escHtml(b.activity) + (b.role ? ' <span class="wdc-role">· ' + escHtml(b.role) + '</span>' : '') + '</div><div class="wdc-times"><span class="wdc-start">' + to12(b.start) + '</span><span class="wdc-arrow">→</span><span class="wdc-end">' + to12(b.end) + '</span></div><span class="wdc-del">✕</span>';
        // Delete
        entry.querySelector('.wdc-del').addEventListener('click', function(e) {
          e.stopPropagation();
          workSchedule[day].splice(bi, 1);
          saveWorkSched();
          if (workEditTarget && workEditTarget.day === day && workEditTarget.idx === bi) hideWorkForm();
          renderWorkRoster();
          renderDashboard();
        });
        // Click to edit
        entry.addEventListener('click', function(e) {
          if (e.target.classList.contains('wdc-del')) return;
          showWorkForm(day, bi);
        });
        entries.appendChild(entry);
      });
    }

    card.appendChild(entries);

    // Add button
    var addBtn = document.createElement('div');
    addBtn.className = 'wdc-add';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', function() { showWorkForm(day, null); });
    card.appendChild(addBtn);

    // Click empty area to add
    card.addEventListener('click', function(e) {
      if (e.target === card || e.target === head || e.target === entries || e.target.classList.contains('wdc-empty')) {
        showWorkForm(day, null);
      }
    });

    week.appendChild(card);
  });
}

function showWorkForm(day, idx) {
  workEditTarget = { day: day, idx: idx };
  var form = document.getElementById('work-add-block');
  var dayLabel = document.getElementById('work-form-day');
  dayLabel.textContent = day.charAt(0).toUpperCase() + day.slice(1);
  form.classList.remove('hidden');

  if (idx !== null && workSchedule[day] && workSchedule[day][idx]) {
    // Editing
    var b = workSchedule[day][idx];
    document.getElementById('work-place').value = b.activity;
    document.getElementById('work-role').value = b.role || '';
    document.getElementById('work-start').value = b.start;
    document.getElementById('work-end').value = b.end;
    document.getElementById('save-work-btn').textContent = 'Update';
  } else {
    // New
    document.getElementById('work-place').value = '';
    document.getElementById('work-role').value = '';
    document.getElementById('work-start').value = '09:00';
    document.getElementById('work-end').value = '17:00';
    document.getElementById('save-work-btn').textContent = 'Add';
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('work-place').focus();
}

function hideWorkForm() {
  workEditTarget = null;
  document.getElementById('work-add-block').classList.add('hidden');
  renderWorkRoster();
}

function saveWorkBlock() {
  if (!workEditTarget) { alert('Select a day first'); return; }
  var day = workEditTarget.day;
  var place = document.getElementById('work-place').value.trim();
  var role = document.getElementById('work-role').value.trim();
  var s = document.getElementById('work-start').value;
  var e = document.getElementById('work-end').value;
  if (!place) { alert('Enter a workplace'); return; }
  if (!s || !e) { alert('Set start and end times'); return; }

  if (workEditTarget.idx !== null && workSchedule[day] && workSchedule[day][workEditTarget.idx]) {
    // Update
    var b = workSchedule[day][workEditTarget.idx];
    b.activity = place;
    b.role = role;
    b.start = s;
    b.end = e;
  } else {
    // New
    if (!workSchedule[day]) workSchedule[day] = [];
    workSchedule[day].push({ id:'w'+Date.now(), start:s, end:e, activity:place, role:role, category:'productive' });
  }

  workSchedule[day].sort(function(a,b) { return toMin(a.start) - toMin(b.start); });
  saveWorkSched();
  hideWorkForm();
  renderWorkRoster();
  renderDashboard();
}

// ===== MONTHLY CALENDAR =====
var mcalDate = new Date();
mcalDate.setDate(1);
var mcalSelected = null;

function renderMonthlyCal() {
  var grid = document.getElementById('mcal-grid');
  if (!grid) return;
  grid.innerHTML = '';

  var year = mcalDate.getFullYear();
  var month = mcalDate.getMonth();

  // Update label
  var label = document.getElementById('mcal-label');
  if (label) label.textContent = new Date(year, month).toLocaleString('default', { month:'long', year:'numeric' });

  var firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var daysInPrev = new Date(year, month, 0).getDate();

  // Weekday headers
  var wd = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  wd.forEach(function(d) {
    var h = document.createElement('div');
    h.className = 'mcal-day';
    h.style.fontWeight = '700';
    h.style.fontSize = '0.7rem';
    h.style.color = 'var(--muted)';
    h.style.cursor = 'default';
    h.style.minHeight = '24px';
    h.style.border = 'none';
    h.style.background = 'transparent';
    h.textContent = d;
    grid.appendChild(h);
  });

  var today = new Date();
  var todayStr = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');

  // Map weekday name (0=Sun) to schedule key
  var dayToWeekday = { 0:'sunday', 1:'monday', 2:'tuesday', 3:'wednesday', 4:'thursday', 5:'friday', 6:'saturday' };

  // Previous month days
  var sunOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0..Sun=6
  sunOffset = firstDay; // Keep Sun=0
  for (var i = firstDay - 1; i >= 0; i--) {
    var d = daysInPrev - i;
    var el = document.createElement('div');
    el.className = 'mcal-day mcal-other';
    el.textContent = d;
    grid.appendChild(el);
  }

  // Current month days
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    var dow = new Date(year, month, d).getDay(); // 0=Sun
    var weekday = dayToWeekday[dow];
    var blocks = schedule[weekday] || [];

    var el = document.createElement('div');
    el.className = 'mcal-day';
    if (dateStr === todayStr) el.classList.add('mcal-today');
    if (mcalSelected === dateStr) el.classList.add('mcal-selected');

    var num = document.createElement('span');
    num.className = 'mcal-num';
    num.textContent = d;
    el.appendChild(num);

    if (blocks.length) {
      var dots = document.createElement('span');
      dots.className = 'mcal-dots';
      // Show up to 3 colored dots representing different categories
      var catCounts = {};
      blocks.forEach(function(b) {
        var c = b.category || 'productive';
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
      var cats = Object.keys(catCounts);
      cats.slice(0, 3).forEach(function(c) {
        var dot = document.createElement('span');
        dot.className = 'mcal-dot';
        dot.style.background = 'var(--c-' + c + ')';
        if (catCounts[c] > 1) dot.title = CAT_LABEL[c] + ': ' + catCounts[c];
        dots.appendChild(dot);
      });
      if (cats.length > 3) {
        var more = document.createElement('span');
        more.className = 'mcal-dot';
        more.style.background = '#999';
        more.textContent = '+';
        more.style.fontSize = '0.55rem';
        more.style.display = 'inline-flex';
        more.style.alignItems = 'center';
        more.style.justifyContent = 'center';
        more.style.width = '6px';
        more.style.height = '6px';
        more.title = (cats.length - 3) + ' more';
        dots.appendChild(more);
      }
      el.appendChild(dots);
    }

    el.dataset.date = dateStr;
    el.addEventListener('click', function() {
      mcalSelected = this.dataset.date;
      renderMonthlyCal();
      renderMcalDetail(this.dataset.date);
    });

    grid.appendChild(el);
  }

  // Fill remaining cells
  var total = firstDay + daysInMonth;
  var remaining = 7 - (total % 7);
  if (remaining < 7) {
    for (var i = 1; i <= remaining; i++) {
      var el = document.createElement('div');
      el.className = 'mcal-day mcal-other';
      el.textContent = i;
      grid.appendChild(el);
    }
  }

  // Show detail for selected date or today
  if (mcalSelected) {
    renderMcalDetail(mcalSelected);
  } else {
    renderMcalDetail(todayStr);
  }
}

function renderMcalDetail(dateStr) {
  var detail = document.getElementById('mcal-detail');
  var title = document.getElementById('mcal-date-title');
  var blocksEl = document.getElementById('mcal-blocks');
  if (!detail) return;

  var parts = dateStr.split('-');
  var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  var dow = d.getDay();
  var dayToWeekday = { 0:'sunday', 1:'monday', 2:'tuesday', 3:'wednesday', 4:'thursday', 5:'friday', 6:'saturday' };
  var weekday = dayToWeekday[dow];
  var blocks = schedule[weekday] || [];

  var options = { weekday:'long', month:'long', day:'numeric', year:'numeric' };
  if (title) title.textContent = d.toLocaleDateString('en-US', options) + ' (' + weekday + ')';

  if (blocksEl) {
    blocksEl.innerHTML = '';
    if (!blocks.length) {
      blocksEl.innerHTML = '<div style="font-size:0.82rem;color:var(--muted);padding:8px 0;">No entries for this day</div>';
    } else {
      blocks.forEach(function(b, idx) {
        var el = document.createElement('div');
        el.className = 'mcal-blk';
        el.innerHTML = '<span class="mcal-catdot" style="background:var(--c-' + (b.category || 'productive') + ')"></span><div><strong>' + b.activity + '</strong> <span class="blk-time">' + to12(b.start) + ' - ' + to12(b.end) + '</span></div> <span class="blk-del" data-mcal-del="' + idx + '">✕</span>';
        el.querySelector('.blk-del').addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm('Delete "' + b.activity + '"?')) {
            schedule[weekday].splice(idx, 1);
            saveSched();
            renderMonthlyCal();
  renderWeekCards();
  renderDashboard();
            renderBalance();
          }
        });
        blocksEl.appendChild(el);
      });
    }
  }
}

function mcalAddBlock() {
  var parts = (mcalSelected || '').split('-');
  if (parts.length < 3) { alert('Select a date in the calendar first'); return; }
  var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  var dow = d.getDay();
  var dayToWeekday = { 0:'sunday', 1:'monday', 2:'tuesday', 3:'wednesday', 4:'thursday', 5:'friday', 6:'saturday' };
  var weekday = dayToWeekday[dow];

  var act = document.getElementById('mcal-activity').value.trim();
  var s = document.getElementById('mcal-start').value;
  var e = document.getElementById('mcal-end').value;
  var cat = document.getElementById('mcal-category').value;
  if (!act) { alert('Enter an activity'); return; }
  if (!s || !e) { alert('Set start and end times'); return; }
  schedule[weekday].push({ id:'m'+Date.now(), start:s, end:e, activity:act, category:cat });
  schedule[weekday].sort(function(a,b) { return toMin(a.start) - toMin(b.start); });
  saveSched();
  renderMonthlyCal();
  renderRoster();
  renderDashboard();
  renderBalance();
  document.getElementById('mcal-activity').value = '';
}

function mcalGo(step) {
  mcalDate.setMonth(mcalDate.getMonth() + step);
  renderMonthlyCal();
}

function mcalGoToday() {
  mcalDate = new Date();
  mcalDate.setDate(1);
  mcalSelected = null;
  renderMonthlyCal();
}

// ===== DAILY ROUTINES =====
function renderRoutinesTimeline() {
  var container = document.getElementById('routines-timeline');
  if (!container) return;
  container.innerHTML = '';

  var wake = toMin(user.wakeTime || '06:30');
  var sleep = toMin(user.sleepTime || '22:30');
  var activity = user.activityLevel || 'moderate';
  var isActive = activity === 'active' || activity === 'very_active';

  // Generate routines
  var routines = [];

  // Wake up
  routines.push({ time: user.wakeTime || '06:30', icon: '🌅', label: 'Wake Up', desc: 'Rise and shine!', highlight: true });

  // Morning routine
  var morningMin = wake + 15;
  routines.push({ time: fromMin(morningMin), icon: '🧴', label: 'Morning Hygiene', desc: 'Shower, brush teeth, skincare', highlight: false });

  // Breakfast
  var breakMin = wake + 45;
  routines.push({ time: fromMin(breakMin), icon: '🍳', label: 'Breakfast', desc: 'Fuel your body', highlight: true });

  // Morning work/study block
  var workStartMin = wake + 120;
  var workStart = fromMin(workStartMin);
  routines.push({ time: workStart, icon: '💼', label: 'Deep Work Block', desc: 'Focus on important tasks', highlight: false });

  // Lunch
  var lunchMin = toMin('12:00');
  if (lunchMin <= wake) lunchMin = toMin('12:00');
  routines.push({ time: '12:00', icon: '🥗', label: 'Lunch', desc: 'Midday meal & rest', highlight: true });

  // Afternoon work
  var afMin = toMin('14:00');
  routines.push({ time: '14:00', icon: '📋', label: 'Afternoon Tasks', desc: 'Lighter work or meetings', highlight: false });

  // Exercise
  var exMin = isActive ? toMin('17:00') : toMin('17:30');
  routines.push({ time: fromMin(exMin), icon: '🏋️', label: isActive ? 'Workout' : 'Light Movement', desc: isActive ? 'Exercise session' : 'Stretch or walk', highlight: false });

  // Dinner
  var dinnerMin = toMin('19:00');
  routines.push({ time: '19:00', icon: '🍲', label: 'Dinner', desc: 'Evening meal', highlight: true });

  // Wind down
  var windMin = sleep - 60;
  if (windMin < dinnerMin + 30) windMin = dinnerMin + 30;
  routines.push({ time: fromMin(windMin), icon: '📖', label: 'Wind Down', desc: 'Read, journal, meditation', highlight: false });

  // Sleep
  if (sleep < 60) sleep += 1440; // if past midnight
  routines.push({ time: user.sleepTime || '22:30', icon: '🌙', label: 'Bedtime', desc: 'Time to rest', highlight: true });

  routines.forEach(function(r) {
    var item = document.createElement('div');
    item.className = 'rt-item' + (r.highlight ? ' rt-highlight' : '');
    item.innerHTML = '<span class="rt-time">' + r.time + '</span><span class="rt-icon">' + r.icon + '</span><span class="rt-label">' + r.label + '</span><span class="rt-desc">' + r.desc + '</span>';
    container.appendChild(item);
  });
}

function fromMin(m) {
  if (m >= 1440) m -= 1440;
  if (m < 0) m += 1440;
  var h = Math.floor(m / 60);
  var mn = m % 60;
  return String(h).padStart(2, '0') + ':' + String(mn).padStart(2, '0');
}

// ===== REFLECTION =====
function loadReflection() {
  var r = user.reflection || { well:'', hard:'', improve:'' };
  document.getElementById('ref-well').value = r.well || '';
  document.getElementById('ref-hard').value = r.hard || '';
  document.getElementById('ref-improve').value = r.improve || '';
}

function saveReflection() {
  user.reflection = { well:document.getElementById('ref-well').value.trim(), hard:document.getElementById('ref-hard').value.trim(), improve:document.getElementById('ref-improve').value.trim() };
  saveUser();
  var msg = document.getElementById('ref-saved');
  msg.classList.add('show');
  setTimeout(function() { msg.classList.remove('show'); }, 2000);
}

// ===== MEALS TRACKER =====
var mealsData = {};
var mealDate = todayStr();

function todayStr() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }

function fmtDateShort(s) { var p = s.split('-'); var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(p[1],10)-1]; return m + ' ' + parseInt(p[2],10) + ', ' + p[0]; }

function loadMeals() {
  if (authToken) {
    return apiGet('baskug_meals').then(function(d) {
      if (d && typeof d === 'object') mealsData = d;
    }).catch(function() {
      try { var ld = localStorage.getItem('baskug_meals'); if (ld) mealsData = JSON.parse(ld); } catch(e) {}
    });
  }
  try { var d = localStorage.getItem('baskug_meals'); if (d) mealsData = JSON.parse(d); } catch(e) {}
  if (!mealsData || typeof mealsData !== 'object') mealsData = {};
}

function saveMeals() {
  if (authToken) { apiPut('baskug_meals', mealsData); }
  localStorage.setItem('baskug_meals', JSON.stringify(mealsData));
}

function renderMeals() {
  document.getElementById('meal-date-label').textContent = mealDate === todayStr() ? 'Today' : fmtDateShort(mealDate);
  var list = document.getElementById('meal-list');
  var meals = mealsData[mealDate] || [];
  var types = { breakfast:[], lunch:[], dinner:[], snack:[] };
  meals.forEach(function(m) { (types[m.type] || types.snack).push(m); });
  var calTotal = 0;
  meals.forEach(function(m) { calTotal += parseInt(m.calories) || 0; });
  document.getElementById('meal-stats').innerHTML = '<div class="fs-card"><div class="fs-val">' + meals.length + '</div><div class="fs-lbl">Meals</div></div><div class="fs-card"><div class="fs-val">' + (calTotal || '--') + '</div><div class="fs-lbl">Calories</div></div>';
  if (meals.length === 0) { list.innerHTML = '<p class="meal-empty">No meals logged for this day.</p>'; return; }
  var h = '';
  Object.keys(types).forEach(function(t) {
    if (types[t].length === 0) return;
    var icons = { breakfast:'🍳', lunch:'🥪', dinner:'🍝', snack:'🍪' };
    h += '<div class="meal-group"><h4>' + (icons[t] || '') + ' ' + t.charAt(0).toUpperCase() + t.slice(1) + '</h4>';
    types[t].forEach(function(m, i) {
      var idx = meals.indexOf(m);
      h += '<div class="meal-item"><span class="mi-time">' + m.time + '</span><span class="mi-food">' + escHtml(m.food) + '</span><span class="mi-cal">' + (m.calories ? m.calories + ' cal' : '') + '</span><button class="meal-del" data-idx="' + idx + '">&times;</button></div>';
    });
    h += '</div>';
  });
  list.innerHTML = h;
  list.querySelectorAll('.meal-del').forEach(function(btn) {
    btn.addEventListener('click', function() { deleteMeal(mealDate, parseInt(this.dataset.idx)); });
  });
}

function addMeal() {
  var type = document.getElementById('meal-type').value;
  var food = document.getElementById('meal-food').value.trim();
  var time = document.getElementById('meal-time').value;
  var cal = document.getElementById('meal-cal').value;
  if (!food) { alert('Enter what you ate.'); return; }
  if (!mealsData[mealDate]) mealsData[mealDate] = [];
  mealsData[mealDate].push({ type:type, food:food, time:time, calories:cal || '' });
  saveMeals();
  renderMeals();
  renderDashboard();
  document.getElementById('meal-food').value = '';
  document.getElementById('meal-cal').value = '';
}

function deleteMeal(date, idx) {
  if (mealsData[date]) { mealsData[date].splice(idx, 1); if (mealsData[date].length === 0) delete mealsData[date]; }
  saveMeals();
  renderMeals();
  renderDashboard();
}

function moveMealDate(d) {
  var d2 = new Date(mealDate);
  d2.setDate(d2.getDate() + d);
  mealDate = d2.getFullYear() + '-' + String(d2.getMonth()+1).padStart(2,'0') + '-' + String(d2.getDate()).padStart(2,'0');
  renderMeals();
}

function mealToday() { mealDate = todayStr(); renderMeals(); }

// ===== MEAL RECIPES =====
var RECIPES = {
  breakfast: [
    { icon:'🥯', name:'Sel Roti', cal:'~200 cal', goal:'⚡ Loss', desc:'Traditional Nepali ring-shaped rice doughnut, crispy outside & soft inside.', ing:'Rice flour, banana, sugar, ghee, cardamom, water', tags:'🥔 Carbs, 🍎 Fruits' },
    { icon:'🍚', name:'Chiura (Beaten Rice)', cal:'~320 cal', goal:'💪 Gain', desc:'Classic Nepali breakfast with beaten rice, curd, and pickle.', ing:'Chiura, yogurt, aloo achar, soybeans, green chili, fresh coriander', tags:'🥔 Carbs, 🥬 Fiber, 🥩 Protein' },
    { icon:'🥔', name:'Aloo Paratha', cal:'~380 cal', goal:'💪 Gain', desc:'Whole wheat flatbread stuffed with spiced mashed potatoes.', ing:'Whole wheat flour, potato, cumin, turmeric, ghee, green chili', tags:'🥔 Carbs, 🥩 Protein' },
    { icon:'🍳', name:'Nepali Breakfast Set', cal:'~450 cal', goal:'💪 Gain', desc:'Hearty traditional set with roti, egg curry, and veggie side.', ing:'Whole wheat roti, egg curry, seasonal vegetables, achar, ghee', tags:'🥩 Protein, 🥔 Carbs, 🥦 Veggies' },
    { icon:'🥐', name:'Juju Dhau with Puri', cal:'~280 cal', goal:'⚡ Loss', desc:'King of yogurts from Bhaktapur served with fried bread.', ing:'Juju dhau (sweet yogurt), puri, sugar, cardamom, pistachio', tags:'🥩 Protein, 🥔 Carbs' },
    { icon:'🥣', name:'Oatmeal with Honey', cal:'~220 cal', goal:'⚡ Loss', desc:'Warm oatmeal with Nepali honey and seasonal fruits.', ing:'Rolled oats, milk, honey, banana, apple, cinnamon, walnuts', tags:'🥬 Fiber, 🥔 Carbs, 🍎 Fruits' },
    { icon:'🥤', name:'Lassi & Sel', cal:'~340 cal', goal:'💪 Gain', desc:'Refreshing sweet lassi paired with sel roti.', ing:'Yogurt, water, sugar, cardamom, ice, sel roti', tags:'🥩 Protein, 🥔 Carbs, 🥑 Healthy Fats' },
    { icon:'🥑', name:'Mediterranean Avocado Bowl', cal:'~340 cal', goal:'⚡ Loss', desc:'Heart-healthy fats, fibre, and protein to start your day right.', ing:'Avocado, cherry tomatoes, feta, olives, whole grain toast, olive oil, lemon', tags:'🥑 Healthy Fats, 🥬 Fiber, 🥦 Veggies' },
    { icon:'🍳', name:'Japanese Tamago Gohan', cal:'~350 cal', goal:'💪 Gain', desc:'Silky egg over steamed rice — simple, nourishing, and high-protein.', ing:'Egg, steamed rice, soy sauce, mirin, nori, sesame seeds', tags:'🥩 Protein, 🥔 Carbs' },
    { icon:'🥛', name:'Greek Yoghurt Bowl', cal:'~250 cal', goal:'⚡ Loss', desc:'Probiotic-rich breakfast with nuts, seeds, and fresh fruit.', ing:'Greek yogurt, walnuts, pumpkin seeds, blueberries, honey, flaxseed', tags:'🥩 Protein, 🍎 Fruits, 🥑 Healthy Fats' },
    { icon:'🍳', name:'Tapsilog', cal:'~480 cal', goal:'💪 Gain', desc:'Filipino beef tapa with garlic rice and fried egg — protein-packed breakfast.', ing:'Beef sirloin, soy sauce, calamansi, garlic, rice, egg, vinegar', tags:'🥩 Protein, 🥔 Carbs' },
    { icon:'🍚', name:'Champorado', cal:'~220 cal', goal:'⚡ Loss', desc:'Filipino chocolate rice porridge — light, comforting, and naturally sweet.', ing:'Glutinous rice, dark cocoa powder, sugar, evaporated milk, pinch of salt', tags:'🥔 Carbs' }
  ],
  lunch: [
    { icon:'🍚', name:'Dal Bhat Tarkari', cal:'~600 cal', goal:'💪 Gain', desc:'The staple Nepali meal — lentil soup, rice, and curried vegetables.', ing:'Rice, red lentil, seasonal vegetables, turmeric, cumin, garlic, ghee', tags:'🥔 Carbs, 🥩 Protein, 🥦 Veggies, 🥬 Fiber' },
    { icon:'🍜', name:'Thukpa', cal:'~380 cal', goal:'⚡ Loss', desc:'Tibetan-Nepali noodle soup with vegetables and spices.', ing:'Noodles, vegetable broth, cabbage, carrot, soy sauce, ginger, garlic', tags:'🥔 Carbs, 🥦 Veggies' },
    { icon:'🥟', name:'Steamed Momo', cal:'~420 cal', goal:'💪 Gain', desc:'Nepali dumplings filled with spiced chicken, served with achar.', ing:'All-purpose flour, ground chicken, ginger, garlic, cumin, timmur, tomato achar', tags:'🥩 Protein, 🥔 Carbs, 🥦 Veggies' },
    { icon:'🥗', name:'Kwati', cal:'~280 cal', goal:'⚡ Loss', desc:'Mixed bean sprout soup — a protein-rich traditional Newari dish.', ing:'Mixed bean sprouts, cumin, garlic, ginger, turmeric, ghee, rice', tags:'🥩 Protein, 🥬 Fiber, 🥦 Veggies' },
    { icon:'🥘', name:'Aloo Tama', cal:'~320 cal', goal:'⚡ Loss', desc:'Bamboo shoot and potato curry with a tangy flavour.', ing:'Bamboo shoots, potato, black-eyed peas, cumin, turmeric, mustard oil', tags:'🥬 Fiber, 🥦 Veggies, 🥔 Carbs' },
    { icon:'🍝', name:'Chow Chow', cal:'~450 cal', goal:'💪 Gain', desc:'Nepali-style chow mein with vegetables and soy sauce.', ing:'Noodles, cabbage, carrot, bell pepper, soy sauce, chili sauce, egg', tags:'🥔 Carbs, 🥩 Protein, 🥦 Veggies' },
    { icon:'🍲', name:'Gundruk Soup', cal:'~180 cal', goal:'⚡ Loss', desc:'Fermented leafy green soup — tangy, probiotic, and comforting.', ing:'Dried gundruk, tomato, onion, garlic, ginger, chili, rice', tags:'🥦 Veggies, 🥬 Fiber' },
    { icon:'🥗', name:'Mediterranean Quinoa Bowl', cal:'~380 cal', goal:'⚡ Loss', desc:'Protein-rich plant bowl with clean Mediterranean ingredients.', ing:'Quinoa, cucumber, tomato, olives, red onion, chickpeas, tahini dressing', tags:'🥩 Protein, 🥬 Fiber, 🥦 Veggies' },
    { icon:'🍣', name:'Sushi Bowl (Chirashi)', cal:'~450 cal', goal:'💪 Gain', desc:'Omega-3 rich fish bowl with rice and fresh vegetables.', ing:'Salmon, tuna, sushi rice, avocado, cucumber, edamame, soy sauce, rice vinegar', tags:'🥩 Protein, 🥔 Carbs, 🥑 Healthy Fats' },
    { icon:'🍛', name:'Green Curry with Tofu', cal:'~350 cal', goal:'⚡ Loss', desc:'Thai-inspired light coconut curry packed with vegetables and plant protein.', ing:'Tofu, green curry paste, light coconut milk, broccoli, bell pepper, basil, brown rice', tags:'🥩 Protein, 🥦 Veggies, 🥬 Fiber' },
    { icon:'🍗', name:'Chicken Adobo', cal:'~480 cal', goal:'💪 Gain', desc:'Filipino soy-vinegar braised chicken — savory, tangy, and protein-rich.', ing:'Chicken thighs, soy sauce, vinegar, garlic, bay leaf, peppercorn, rice', tags:'🥩 Protein, 🥔 Carbs' },
    { icon:'🥘', name:'Sinigang na Baboy', cal:'~320 cal', goal:'⚡ Loss', desc:'Filipino sour tamarind soup with pork and vegetables — tangy and comforting.', ing:'Pork belly, tamarind, radish, okra, eggplant, tomato, taro, long chili', tags:'🥩 Protein, 🥦 Veggies, 🥬 Fiber' }
  ],
  dinner: [
    { icon:'🥟', name:'Chicken Momo', cal:'~520 cal', goal:'💪 Gain', desc:'Steamed dumplings with spiced chicken filling and sesame-tomato achar.', ing:'Dough, ground chicken, ginger, garlic, soy sauce, timmur, sesame seed, tomato', tags:'🥩 Protein, 🥔 Carbs, 🥦 Veggies' },
    { icon:'🍗', name:'Sekuwa', cal:'~480 cal', goal:'💪 Gain', desc:'Nepali-style barbecued meat marinated in traditional spices.', ing:'Chicken/pork, ginger, garlic, cumin, coriander, timmur, mustard oil, yogurt', tags:'🥩 Protein, 🥑 Healthy Fats' },
    { icon:'🍚', name:'Dal Bhat Tarkari', cal:'~650 cal', goal:'💪 Gain', desc:'Evening dal bhat with saag (spinach) and papad.', ing:'Rice, lentils, spinach, roasted papad, cucumber raita, lime pickle', tags:'🥔 Carbs, 🥩 Protein, 🥦 Veggies, 🥬 Fiber' },
    { icon:'🌮', name:'Chicken Choila', cal:'~350 cal', goal:'⚡ Loss', desc:'Spicy Newari smoked chicken salad — bold flavours, charred & tangy.', ing:'Smoked chicken, ginger, garlic, mustard oil, chili, lime, cilantro', tags:'🥩 Protein, 🥦 Veggies' },
    { icon:'🍜', name:'Wai Wai Soup', cal:'~220 cal', goal:'⚡ Loss', desc:'Quick Nepali instant noodle soup dressed up with fresh toppings.', ing:'Wai Wai noodles, egg, green onion, lime, chili powder, cilantro', tags:'🥔 Carbs, 🥩 Protein' },
    { icon:'🍚', name:'Yomari', cal:'~380 cal', goal:'💪 Gain', desc:'Traditional Newari steamed rice dumpling filled with jaggery & sesame.', ing:'Rice flour, chaku (jaggery), sesame seeds, ghee, coconut', tags:'🥔 Carbs, 🥑 Healthy Fats' },
    { icon:'🥘', name:'Chhwela & Roti', cal:'~580 cal', goal:'💪 Gain', desc:'Spiced buffalo meat salad served with whole wheat roti.', ing:'Buffalo meat, ginger, garlic, timmur, mustard oil, chili, roti', tags:'🥩 Protein, 🥔 Carbs' },
    { icon:'🐟', name:'Grilled Salmon with Asparagus', cal:'~380 cal', goal:'⚡ Loss', desc:'Omega-3 rich salmon with steamed greens — light, satisfying, and anti-inflammatory.', ing:'Salmon, asparagus, lemon, garlic, olive oil, cherry tomatoes, dill', tags:'🥩 Protein, 🥦 Veggies, 🥑 Healthy Fats' },
    { icon:'🥘', name:'Lean Turkey Chilli', cal:'~420 cal', goal:'💪 Gain', desc:'High-protein lean turkey chilli with beans — great for muscle gain.', ing:'Lean ground turkey, kidney beans, tomato, onion, cumin, chilli, brown rice', tags:'🥩 Protein, 🥬 Fiber, 🥦 Veggies' },
    { icon:'🍝', name:'Whole Wheat Pesto Pasta', cal:'~500 cal', goal:'💪 Gain', desc:'Complex carb pasta with homemade pesto and grilled chicken.', ing:'Whole wheat pasta, chicken breast, basil pesto, pine nuts, parmesan, cherry tomatoes', tags:'🥔 Carbs, 🥩 Protein, 🥑 Healthy Fats' },
    { icon:'🍗', name:'Chicken Inasal', cal:'~500 cal', goal:'💪 Gain', desc:'Filipino grilled chicken marinated in annatto, ginger, and lemongrass.', ing:'Chicken, annatto oil, ginger, lemongrass, calamansi, vinegar, garlic rice', tags:'🥩 Protein, 🥔 Carbs, 🥑 Healthy Fats' },
    { icon:'🥘', name:'Ginisang Monggo', cal:'~280 cal', goal:'⚡ Loss', desc:'Filipino mung bean soup with moringa and shrimp — light but filling.', ing:'Mung beans, shrimp, moringa leaves, tomato, garlic, onion, patis', tags:'🥩 Protein, 🥬 Fiber, 🥦 Veggies' }
  ],
  snack: [
    { icon:'🥟', name:'Chatamari', cal:'~200 cal', goal:'⚡ Loss', desc:'Newari rice crepe topped with egg, minced meat, and veggies.', ing:'Rice flour, egg, minced meat, onion, tomato, green chili, cilantro', tags:'🥔 Carbs, 🥩 Protein, 🥦 Veggies' },
    { icon:'🫓', name:'Bara', cal:'~180 cal', goal:'⚡ Loss', desc:'Traditional Newari lentil patty fried golden and crispy.', ing:'Black lentil, turmeric, cumin, ginger, garlic, ghee', tags:'🥩 Protein, 🥬 Fiber' },
    { icon:'🥟', name:'Wai Wai Sadheko', cal:'~250 cal', goal:'💪 Gain', desc:'Crunchy spicy Wai Wai mixed with fresh veggies and lemon.', ing:'Wai Wai noodles, onion, tomato, cucumber, lime, chili powder, cilantro', tags:'🥔 Carbs, 🥦 Veggies' },
    { icon:'🥟', name:'Samosa', cal:'~220 cal', goal:'💪 Gain', desc:'Crispy fried pastry filled with spiced potato and peas.', ing:'All-purpose flour, potato, peas, cumin, garam masala, coriander, oil', tags:'🥔 Carbs, 🥩 Protein' },
    { icon:'🥤', name:'Green Protein Smoothie', cal:'~220 cal', goal:'⚡ Loss', desc:'Low-calorie nutrient-dense smoothie for weight management.', ing:'Spinach, banana, almond milk, chia seeds, spirulina, ginger, lime', tags:'🍎 Fruits, 🥬 Fiber, 🥩 Protein' },
    { icon:'🥚', name:'Soy-Marinated Eggs', cal:'~180 cal', goal:'💪 Gain', desc:'High-protein Japanese-style eggs — perfect for muscle recovery.', ing:'Eggs, soy sauce, mirin, garlic, sesame seeds, chili flakes', tags:'🥩 Protein' },
    { icon:'🥑', name:'Cucumber & Tuna Boats', cal:'~150 cal', goal:'⚡ Loss', desc:'Ultra low-cal high-protein snack — refreshing and filling.', ing:'Cucumber, canned tuna, Greek yogurt, lemon, dill, black pepper', tags:'🥩 Protein, 🥦 Veggies' },
    { icon:'🥜', name:'Almond Butter Rice Cakes', cal:'~280 cal', goal:'💪 Gain', desc:'Calorie-dense clean snack for healthy weight gain.', ing:'Brown rice cakes, almond butter, banana, hemp seeds, cinnamon', tags:'🥔 Carbs, 🥑 Healthy Fats, 🍎 Fruits' },
    { icon:'🍌', name:'Turon (Banana Spring Roll)', cal:'~220 cal', goal:'💪 Gain', desc:'Filipino fried banana spring rolls with caramelized brown sugar.', ing:'Saba banana, brown sugar, lumpia wrapper, oil, jackfruit', tags:'🍎 Fruits, 🥔 Carbs' },
    { icon:'🫓', name:'Biko (Sticky Rice Cake)', cal:'~280 cal', goal:'💪 Gain', desc:'Filipino sweet sticky rice cake with coconut milk and brown sugar.', ing:'Glutinous rice, coconut milk, brown sugar, salt, toasted sesame', tags:'🥔 Carbs, 🥑 Healthy Fats' },
    { icon:'🍨', name:'Halo-Halo (Light)', cal:'~160 cal', goal:'⚡ Loss', desc:'Filipino shaved ice dessert with fruits and beans — light version.', ing:'Shaved ice, saba banana, macapuno, kaong, pinipig, milk, sugar', tags:'🍎 Fruits, 🥔 Carbs' },
    { icon:'🥗', name:'Lumpiang Shanghai', cal:'~180 cal', goal:'⚡ Loss', desc:'Filipino fried spring rolls with lean pork and vegetables.', ing:'Ground pork, carrot, onion, garlic, lumpia wrapper, soy sauce', tags:'🥩 Protein, 🥦 Veggies' }
  ],
  beverage: [
    { icon:'🥤', name:'Matcha Protein Smoothie', cal:'~200 cal', goal:'⚡ Loss', desc:'Antioxidant-rich matcha with plant protein for clean energy.', ing:'Matcha powder, spinach, banana, almond milk, vanilla protein, ice', tags:'🍎 Fruits, 🥩 Protein, 🥦 Veggies' },
    { icon:'🥛', name:'Banana Protein Shake', cal:'~380 cal', goal:'💪 Gain', desc:'High-calorie muscle-building shake with real ingredients.', ing:'Banana, whey protein, whole milk, peanut butter, honey, oats', tags:'🥩 Protein, 🍎 Fruits, 🥔 Carbs, 🥑 Healthy Fats' },
    { icon:'🥭', name:'Mango Lassi Smoothie', cal:'~220 cal', goal:'⚡ Loss', desc:'Creamy yogurt smoothie with fresh mango and a touch of cardamom.', ing:'Mango, Greek yogurt, ice, milk, sugar, cardamom', tags:'🍎 Fruits, 🥩 Protein' },
    { icon:'🥤', name:'Calamansi Juice', cal:'~40 cal', goal:'⚡ Loss', desc:'Filipino lime juice — vitamin C powerhouse, refreshing and alkalizing.', ing:'Calamansi, water, honey, ice, pinch of salt', tags:'🍎 Fruits' },
    { icon:'🥥', name:'Coconut Water with Chia', cal:'~120 cal', goal:'⚡ Loss', desc:'Hydrating electrolyte drink with fiber-rich chia seeds.', ing:'Coconut water, chia seeds, lime, mint, honey', tags:'🍎 Fruits, 🥬 Fiber' },
    { icon:'🥤', name:'Peanut Butter Chocolate Shake', cal:'~420 cal', goal:'💪 Gain', desc:'Calorie-dense gainer shake — protein, healthy fats, and carbs.', ing:'Peanut butter, cocoa powder, banana, whole milk, honey, oats', tags:'🥩 Protein, 🥑 Healthy Fats, 🍎 Fruits, 🥔 Carbs' },
    { icon:'🥤', name:'Wheatgrass Ginger Shot', cal:'~30 cal', goal:'⚡ Loss', desc:'Nutrient-dense wellness shot — detox, immunity, and energy.', ing:'Wheatgrass, ginger, lemon, cucumber, honey', tags:'🥦 Veggies, 🍎 Fruits' },
    { icon:'🥤', name:'Avocado Smoothie', cal:'~350 cal', goal:'💪 Gain', desc:'Creamy Filipino-style avocado shake with milk and sugar.', ing:'Avocado, milk, sugar, ice, vanilla', tags:'🥑 Healthy Fats, 🍎 Fruits' },
    { icon:'🫚', name:'Ginger Turmeric Tea', cal:'~25 cal', goal:'⚡ Loss', desc:'Anti-inflammatory herbal tea — great for digestion and immunity.', ing:'Fresh ginger, turmeric, honey, lemon, black pepper', tags:'🍎 Fruits' },
    { icon:'🥥', name:'Buko Pandan Drink', cal:'~150 cal', goal:'⚡ Loss', desc:'Filipino young coconut pandan drink — refreshing and naturally sweet.', ing:'Young coconut strips, pandan leaves, milk, sugar, sago pearls', tags:'🍎 Fruits' }
  ]
};

var MEAL_HEADERS = { breakfast:'🍳 Breakfast', lunch:'🥪 Lunch', dinner:'🍝 Dinner', snack:'🍪 Snacks', beverage:'🥤 Beverages' };

function renderRecipes() {
  var h = '';
  Object.keys(RECIPES).forEach(function(key) {
    h += '<div class="recipe-section"><div class="rs-head">' + MEAL_HEADERS[key] + '</div><div class="recipe-grid">';
    RECIPES[key].forEach(function(r) {
      var tagsHtml = '';
      if (r.tags) {
        r.tags.split(',').forEach(function(t) {
          tagsHtml += '<span class="rc-tag">' + t.trim() + '</span>';
        });
      }
      h += '<div class="recipe-card"><div class="rc-icon">' + r.icon + '</div><div class="rc-name">' + r.name + '</div><div class="rc-cal">' + r.goal + ' · ' + r.cal + '</div><div class="rc-tags">' + tagsHtml + '</div><div class="rc-desc">' + r.desc + '</div><div class="rc-ing"><strong>Ingredients:</strong> ' + r.ing + '</div></div>';
    });
    h += '</div></div>';
  });
  document.getElementById('meal-recipes-section').innerHTML = h;
}

function switchMealTab(tab) {
  document.querySelectorAll('.meal-tab').forEach(function(t) { t.classList.toggle('active', t.dataset.mtab === tab); });
  document.getElementById('meal-log-section').classList.toggle('hidden', tab !== 'log');
  document.getElementById('meal-recipes-section').classList.toggle('hidden', tab !== 'recipes');
  document.getElementById('meal-plan-section').classList.toggle('hidden', tab !== 'plan');
  if (tab === 'recipes') { renderRecipes(); initChat(); }
  if (tab === 'plan') { renderMealPlan(); }
}

// ===== RECIPE CHAT ASSISTANT =====
var RECIPE_QA = [
  { keywords:['acai','bowl','breakfast','amount','how much'], answer:'For a standard acai bowl, use 100g (about 2 frozen acai packets) as the base. Add 1/2 cup of liquid (almond milk or juice), 1 banana for sweetness, and blend until thick. Top with granola, fresh fruit, and a drizzle of honey.' },
  { keywords:['protein','powder','shake','scoop','how much'], answer:'A standard serving is 1 scoop (25-30g) of protein powder mixed with 250-300ml of liquid. For weight gain, use 2 scoops with milk. For weight loss, 1 scoop with water or almond milk works well.' },
  { keywords:['oats','oatmeal','portion','serving','how much'], answer:'For oatmeal, a standard serving is 1/2 cup (40-50g) of dry rolled oats. This makes about 1 cup cooked. For weight gain, use 3/4 cup with full milk. For weight loss, stick to 1/2 cup with water or almond milk.' },
  { keywords:['rice','portion','serving','how much','carb'], answer:'A standard serving of cooked rice is about 1/2 cup (100g). For weight gain, aim for 1 cup (200g) per meal. For weight loss, keep it to 1/3 cup (65g) and load up on vegetables instead.' },
  { keywords:['chicken','breast','portion','serving','how much'], answer:'A standard chicken breast serving is 150-200g (about the size of your palm). For weight gain, go for 200-250g. For weight loss, 120-150g is plenty. Bake, grill, or pan-sear for best results.' },
  { keywords:['substitute','swap','replace','alternative','instead'], answer:'Common substitutions: Greek yogurt for sour cream, almond milk for dairy milk, cauliflower rice for white rice, zucchini noodles for pasta, mashed banana for eggs in baking, applesauce for oil.' },
  { keywords:['calorie','calories','how many','nutrition'], answer:'Calorie needs vary by person. For weight loss, aim for 300-500 calories below maintenance (typically 1500-1800 for women, 2000-2200 for men). For weight gain, eat 300-500 above maintenance. Use the calorie estimates on recipe cards as a guide.' },
  { keywords:['meal prep','prep','prepare','make ahead','batch'], answer:'Great for meal prep: overnight oats (3-4 days), grilled chicken (4-5 days), quinoa/rice (4-5 days), roasted vegetables (3-4 days), soups (5 days). Store in airtight containers and reheat gently.' },
  { keywords:['vegetarian','vegan','plant','meatless','no meat'], answer:'Great plant protein sources: lentils (18g protein per cup), chickpeas (15g), tofu (20g per cup), tempeh (31g), edamame (17g), and seitan (25g). Pair with whole grains for complete protein.' },
  { keywords:['snack','healthy snack','between meals'], answer:'Healthy snack ideas: Apple with peanut butter (~200 cal), Greek yogurt with berries (~150 cal), Handful of almonds (~160 cal), Veggie sticks with hummus (~100 cal), Rice cake with avocado (~120 cal).' },
  { keywords:['water','hydrate','drink','fluid'], answer:'Aim for 8-10 glasses (2-2.5L) of water daily. More if you exercise. Tip: drink a glass before each meal — it aids digestion and helps with portion control. Herbal tea counts too!' },
  { keywords:['sleep','eat before bed','late night','dinner time'], answer:'Eat your last meal 2-3 hours before bed for better sleep. If hungry later, try: a small banana, chamomile tea, warm milk, or a few almonds. Avoid heavy, spicy, or sugary foods close to bedtime.' },
  { keywords:['sugar','sweetener','honey','maple','stevia'], answer:'Natural sweeteners: honey (64 cal/tbsp), maple syrup (52 cal/tbsp), stevia (0 cal), monk fruit (0 cal). For weight loss, stevia or monk fruit are best. For baking, honey or maple work well but reduce liquid slightly.' },
  { keywords:['oil','cooking oil','olive oil','coconut','butter'], answer:'Best cooking oils: olive oil (120 cal/tbsp) for low-heat, avocado oil (124 cal/tbsp) for high-heat, coconut oil (117 cal/tbsp) for baking. For weight loss, measure your oil — it\'s easy to overpour. A quick spray can save 100+ calories.' },
  { keywords:['portion','serving size','how much','eat','amount'], answer:'Portion guide: Protein = palm of your hand, Carbs = cupped hand, Vegetables = two fists, Fats = thumb size. Adjust portions up for weight gain, down for weight loss. Listen to your hunger cues!' },
  { keywords:['hello','hi','hey','help','assist'], answer:'Hi there! 👋 I\'m your recipe assistant. Ask me about ingredient amounts, substitutions, meal prep, nutrition tips, or any recipe question you have. I\'m here to help!' }
];

var FALLBACK = [
  'Great question! A general rule: for most ingredients, start with the portion size in the recipe and adjust to your needs. What specific recipe or ingredient are you curious about?',
  'That depends on your goals! For weight loss, focus on portion control and vegetables. For weight gain, add healthy fats and extra protein. Can you tell me more about what you\'re making?',
  'I\'d recommend checking the recipe card above for specific amounts, then adjust based on whether you\'re cooking for 1 or more people. What looks good to you?',
  'The key is listening to your body. Start with recommended portions, then add more if you\'re still hungry or having leftovers. What recipe are you thinking about?'
];

function findChatAnswer(query) {
  var q = query.toLowerCase();
  var best = null, bestScore = 0;
  RECIPE_QA.forEach(function(item) {
    var score = 0;
    item.keywords.forEach(function(kw) {
      if (q.indexOf(kw) !== -1) score++;
    });
    if (score > bestScore) { bestScore = score; best = item; }
  });
  return best ? best.answer : FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

var chatInited = false;

function initChat() {
  if (chatInited) return;
  chatInited = true;
  var chatBtn = document.getElementById('recipe-chat-btn');
  var chat = document.getElementById('recipe-chat');
  if (!chatBtn) return;

  chatBtn.onclick = function() {
    var isOpen = !chat.classList.contains('hidden');
    chat.classList.toggle('hidden', isOpen);
    chatBtn.textContent = isOpen ? '💬' : '✕';
    if (!isOpen && document.getElementById('rc-messages').children.length === 0) {
      addChatMsg('bot', '👋 Hi! Ask me anything about recipes, ingredients, nutrition, or meal prep. I\'m here to help!');
    }
  };

  document.getElementById('rc-close').onclick = function() {
    chat.classList.add('hidden');
    chatBtn.textContent = '💬';
  };

  document.getElementById('rc-send').onclick = sendChatMsg;
  document.getElementById('rc-query').onkeydown = function(e) {
    if (e.key === 'Enter') sendChatMsg();
  };
}

function sendChatMsg() {
  var input = document.getElementById('rc-query');
  var q = input.value.trim();
  if (!q) return;
  addChatMsg('user', q);
  input.value = '';
  var typing = addChatMsg('bot', 'thinking...', true);
  setTimeout(function() {
    typing.remove();
    addChatMsg('bot', findChatAnswer(q));
  }, 500 + Math.random() * 600);
}

function addChatMsg(who, text, isTyping) {
  var container = document.getElementById('rc-messages');
  var el = document.createElement('div');
  el.className = 'rc-msg ' + who + (isTyping ? ' typing' : '');
  el.textContent = text;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

// ===== MEAL PLAN =====
var MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'beverage'];
var MEAL_LABELS = { breakfast:'🍳 Breakfast', lunch:'🥪 Lunch', dinner:'🍝 Dinner', snack:'🍪 Snack', beverage:'🥤 Drink' };
var mpWeekOffset = 0;

function getWeekStart(offset) {
  var now = new Date();
  var day = now.getDay();
  var diff = now.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
  var monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0,0,0,0);
  return monday;
}

function getWeekDates(offset) {
  var monday = getWeekStart(offset);
  var dates = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(monday);
    d.setDate(monday.getDate() + i);
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    dates.push(y + '-' + m + '-' + day);
  }
  return dates;
}

function getMealPlan() {
  if (authToken) {
    var saved = localStorage.getItem('baskug_mealplan_cached');
    if (saved) { try { return JSON.parse(saved); } catch(e) {} }
    apiGet('baskug_mealplan').then(function(d) {
      if (d && typeof d === 'object') {
        localStorage.setItem('baskug_mealplan_cached', JSON.stringify(d));
      }
    }).catch(function() {});
  }
  try { return JSON.parse(localStorage.getItem('baskug_mealplan')) || {}; } catch(e) { return {}; }
}

function saveMealPlan(data) {
  if (authToken) { apiPut('baskug_mealplan', data); }
  localStorage.setItem('baskug_mealplan', JSON.stringify(data));
}

function getWeekKey(offset) {
  var monday = getWeekStart(offset);
  return monday.getFullYear() + '-W' + String(Math.ceil((monday.getTime() - new Date(monday.getFullYear(), 0, 1).getTime()) / 604800000)).padStart(2, '0');
}

function renderMealPlan() {
  var dates = getWeekDates(mpWeekOffset);
  var weekKey = getWeekKey(mpWeekOffset);
  var planData = getMealPlan();
  var weekPlan = planData[weekKey] || {};
  var weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Format week label
  var firstDate = new Date(dates[0] + 'T00:00:00');
  var lastDate = new Date(dates[6] + 'T00:00:00');
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var label = months[firstDate.getMonth()] + ' ' + firstDate.getDate() + ' - ' + months[lastDate.getMonth()] + ' ' + lastDate.getDate() + ', ' + firstDate.getFullYear();
  document.getElementById('mp-week-label').textContent = label;

  var h = '<div class="mp-grid">';

  // Header row
  h += '<div></div>';
  weekDays.forEach(function(d, i) {
    var isToday = dates[i] === todayStr();
    h += '<div class="mp-grid-header"' + (isToday ? ' style="color:var(--primary);font-weight:800"' : '') + '>' + d + (isToday ? ' <span style="font-size:0.55rem">●</span>' : '') + '</div>';
  });

  // Rows for each meal type
  MEAL_TYPES.forEach(function(type) {
    h += '<div class="mp-grid-label">' + MEAL_LABELS[type] + '</div>';
    dates.forEach(function(date, di) {
      var cell = (weekPlan[date] && weekPlan[date][type]) || null;
      if (cell) {
        var icon = cell.icon || '🍽️';
        h += '<div class="mp-cell has-meal" data-date="' + date + '" data-type="' + type + '">';
        h += '<button class="mp-cell-remove" data-date="' + date + '" data-type="' + type + '">✕</button>';
        h += '<div class="mp-cell-icon">' + icon + '</div>';
        h += '<div class="mp-cell-name">' + cell.name + '</div>';
        h += '<div class="mp-cell-cal">' + cell.cal + '</div>';
        h += '</div>';
      } else {
        h += '<div class="mp-cell empty" data-date="' + date + '" data-type="' + type + '"><span class="empty-icon">+</span><span class="empty-label">Add</span></div>';
      }
    });
  });

  h += '</div>';
  document.getElementById('mp-grid').innerHTML = h;

  // Wire up cell clicks
  document.querySelectorAll('.mp-cell').forEach(function(cell) {
    cell.addEventListener('click', function(e) {
      if (e.target.classList.contains('mp-cell-remove')) return;
      var date = this.dataset.date;
      var type = this.dataset.type;
      showMealPlanPicker(weekKey, date, type, planData);
    });
  });

  // Wire up remove buttons
  document.querySelectorAll('.mp-cell-remove').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var date = this.dataset.date;
      var type = this.dataset.type;
      if (planData[weekKey] && planData[weekKey][date]) {
        delete planData[weekKey][date][type];
        if (Object.keys(planData[weekKey][date]).length === 0) delete planData[weekKey][date];
      }
      saveMealPlan(planData);
      renderMealPlan();
    });
  });
}

function showMealPlanPicker(weekKey, date, type, planData) {
  var picker = document.getElementById('mp-cell-picker');
  var title = document.getElementById('mp-picker-title');
  title.textContent = MEAL_LABELS[type] + ' — ' + date;

  // Get recipes for this meal type + a "remove" option
  var recipes = RECIPES[type] || [];
  var list = document.getElementById('mp-picker-list');
  var h = '';

  // Current meal if any
  var current = (planData[weekKey] && planData[weekKey][date] && planData[weekKey][date][type]) || null;
  if (current) {
    h += '<div class="mp-picker-item remove-item" data-action="remove">✕ Remove ' + current.name + '</div>';
  }

  // "None" option
  h += '<div class="mp-picker-item" data-action="none" style="justify-content:center;color:var(--muted);font-size:0.82rem">— Skip this meal —</div>';

  recipes.forEach(function(r) {
    h += '<div class="mp-picker-item" data-action="set" data-icon="' + r.icon + '" data-name="' + escHtml(r.name) + '" data-cal="' + r.cal + '" data-goal="' + r.goal + '" data-ing="' + escHtml(r.ing) + '">';
    h += '<div class="ppi-head"><span class="ppi-icon">' + r.icon + '</span><div class="ppi-info"><div class="ppi-name">' + r.name + '</div><div class="ppi-meta"><span>' + r.goal + '</span><span>' + r.cal + '</span></div></div></div>';
    h += '<div class="ppi-desc">' + r.desc + '</div>';
    h += '</div>';
  });

  list.innerHTML = h;
  picker.classList.remove('hidden');
  picker.innerHTML = '<div class="mp-picker-inner"><div class="mp-picker-header"><span id="mp-picker-title2">' + title.textContent + '</span><button id="mp-picker-close2">&times;</button></div><div id="mp-picker-list2"></div></div>';
  document.getElementById('mp-picker-title2').textContent = title.textContent;
  document.getElementById('mp-picker-list2').innerHTML = list.innerHTML;

  // Wire up picker items
  document.querySelectorAll('#mp-picker-list2 .mp-picker-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var action = this.dataset.action;
      if (!planData[weekKey]) planData[weekKey] = {};
      if (!planData[weekKey][date]) planData[weekKey][date] = {};

      if (action === 'remove') {
        delete planData[weekKey][date][type];
        if (Object.keys(planData[weekKey][date]).length === 0) delete planData[weekKey][date];
      } else if (action === 'set') {
        planData[weekKey][date][type] = {
          name: this.dataset.name,
          icon: this.dataset.icon || '🍽️',
          cal: this.dataset.cal,
          goal: this.dataset.goal
        };
      } else if (action === 'none') {
        delete planData[weekKey][date][type];
        if (Object.keys(planData[weekKey][date]).length === 0) delete planData[weekKey][date];
      }

      saveMealPlan(planData);
      picker.innerHTML = '';
      picker.classList.add('hidden');
      renderMealPlan();
    });
  });

  // Close button
  document.getElementById('mp-picker-close2').addEventListener('click', function() {
    picker.innerHTML = '';
    picker.classList.add('hidden');
  });

  // Click outside to close
  picker.addEventListener('click', function(e) {
    if (e.target === picker) {
      picker.innerHTML = '';
      picker.classList.add('hidden');
    }
  });
}

// ===== WORKOUT TRACKER =====
var workoutData = {};
var woDate = todayStr();

function loadWorkouts() {
  if (authToken) {
    return apiGet('baskug_workouts').then(function(d) {
      if (d && typeof d === 'object') workoutData = d;
    }).catch(function() {
      try { var ld = localStorage.getItem('baskug_workouts'); if (ld) workoutData = JSON.parse(ld); } catch(e) {}
    });
  }
  try { var d = localStorage.getItem('baskug_workouts'); if (d) workoutData = JSON.parse(d); } catch(e) {}
  if (!workoutData || typeof workoutData !== 'object') workoutData = {};
}

function saveWorkouts() {
  if (authToken) { apiPut('baskug_workouts', workoutData); }
  localStorage.setItem('baskug_workouts', JSON.stringify(workoutData));
}

function renderWorkouts() {
  document.getElementById('workout-date-label').textContent = woDate === todayStr() ? 'Today' : fmtDateShort(woDate);
  var list = document.getElementById('workout-list');
  var wos = workoutData[woDate] || [];
  var icons = { cardio:'🏃', strength:'🏋️', pilates:'🧘', yoga:'🧘', walking:'🚶', sports:'⚽', other:'🎯' };
  if (wos.length === 0) { list.innerHTML = '<p class="wo-empty">No workouts logged for this day.</p>'; }
  else {
    list.innerHTML = wos.map(function(w, i) {
      return '<div class="wo-item"><span class="wo-icon">' + (icons[w.type] || '🏃') + '</span><div class="wo-info"><strong>' + escHtml(w.name) + '</strong><span>' + w.duration + ' min</span></div><span class="wo-badge ' + w.intensity + '">' + w.intensity + '</span><button class="wo-del" data-idx="' + i + '">&times;</button></div>';
    }).join('');
    list.querySelectorAll('.wo-del').forEach(function(btn) {
      btn.addEventListener('click', function() { deleteWorkout(woDate, parseInt(this.dataset.idx)); });
    });
  }
  var weekCount = 0, weekMin = 0;
  var today = new Date(woDate);
  var startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay());
  Object.keys(workoutData).forEach(function(d) {
    var dd = new Date(d);
    if (dd >= startOfWeek && dd <= today) {
      workoutData[d].forEach(function(w) { weekCount++; weekMin += parseInt(w.duration) || 0; });
    }
  });
  document.getElementById('workout-summary').innerHTML = '<div class="fs-card"><div class="fs-val">' + wos.length + '</div><div class="fs-lbl">Today</div></div><div class="fs-card"><div class="fs-val">' + weekCount + '</div><div class="fs-lbl">This Week</div></div><div class="fs-card"><div class="fs-val">' + weekMin + 'm</div><div class="fs-lbl">Total</div></div>';
}

function addWorkout() {
  var type = document.getElementById('wo-type').value;
  var name = document.getElementById('wo-name').value.trim();
  var dur = parseInt(document.getElementById('wo-duration').value);
  var intensity = document.getElementById('wo-intensity').value;
  if (!name) { alert('Enter the activity name.'); return; }
  if (!dur || dur < 1) { alert('Enter a valid duration.'); return; }
  if (!workoutData[woDate]) workoutData[woDate] = [];
  workoutData[woDate].push({ type:type, name:name, duration:dur, intensity:intensity });
  saveWorkouts();
  renderWorkouts();
  renderDashboard();
  document.getElementById('wo-name').value = '';
  document.getElementById('wo-duration').value = '';
}

function deleteWorkout(date, idx) {
  if (workoutData[date]) { workoutData[date].splice(idx, 1); if (workoutData[date].length === 0) delete workoutData[date]; }
  saveWorkouts();
  renderWorkouts();
  renderDashboard();
}

function moveWoDate(d) {
  var d2 = new Date(woDate);
  d2.setDate(d2.getDate() + d);
  woDate = d2.getFullYear() + '-' + String(d2.getMonth()+1).padStart(2,'0') + '-' + String(d2.getDate()).padStart(2,'0');
  renderWorkouts();
}

function woToday() { woDate = todayStr(); renderWorkouts(); }

var PILATES = [
  { name:'The Hundred', dur:'10 min', level:'Beginner', desc:'Classic Pilates warm-up — pumps arms while holding a curl to engage core and build breath control.', quick:'Hundred', video:'UaqpuUzs1i8' },
  { name:'Roll-Up', dur:'5 min', level:'Beginner', desc:'Slow spinal articulation from lying to seated — improves flexibility and strengthens abs.', quick:'Roll-Up', video:'FZNwIJ03fhQ' },
  { name:'Single Leg Circle', dur:'5 min', level:'Beginner', desc:'Circles with one leg to open hips and strengthen the lower abdominals and hip flexors.', quick:'Single Leg Circle', video:'pg4WRNkbnjA' },
  { name:'Rolling Like a Ball', dur:'5 min', level:'Beginner', desc:'Massages the spine while challenging balance and core control.', quick:'Rolling Ball', video:'V0cILYu8SVU' },
  { name:'Single Leg Stretch', dur:'5 min', level:'Intermediate', desc:'Alternating knee-to-chest with head and shoulders lifted — targets deep abs and coordination.', quick:'Single Leg Stretch', video:'Ad4lgW4ieAM' },
  { name:'Double Leg Stretch', dur:'5 min', level:'Intermediate', desc:'Both legs extend and circle back in — maximum core engagement and breath control.', quick:'Double Leg Stretch', video:'N-jZas9tMSU' },
  { name:'Criss-Cross', dur:'5 min', level:'Intermediate', desc:'Oblique-focused rotation with legs in tabletop — sculpts waistline and improves mobility.', quick:'Criss-Cross', video:'gzaCxDVQL90' },
  { name:'Saw', dur:'5 min', level:'Intermediate', desc:'Seated twist with reaching motion — stretches hamstrings, spine, and opens the ribcage.', quick:'Saw', video:'kJcSvQa2Mls' },
  { name:'Swan Dive', dur:'5 min', level:'Advanced', desc:'Prone back extension with arm reach — strengthens spine extensors and opens chest and shoulders.', quick:'Swan Dive', video:'Ab4eTe2R8z4' },
  { name:'Side Kick Series', dur:'8 min', level:'Intermediate', desc:'Lying on side with controlled leg lifts — targets glutes, outer thighs, and core stabilizers.', quick:'Side Kicks', video:'SLsjHhuf7Ao' },
  { name:'Teaser', dur:'5 min', level:'Advanced', desc:'V-shaped balance from lying to sitting — the ultimate test of core strength and control.', quick:'Teaser', video:'O5XRRrWUYNM' },
  { name:'Full Body Routine', dur:'30 min', level:'Mixed', desc:'Complete Pilates flow: Hundred → Roll-Up → Circles → Rolling → Stretches → Teaser → Cool Down.', quick:'Full Body', video:'C2HX2pNbUCM' }
];

function renderPilatesPresets() {
  var el = document.getElementById('pilates-presets');
  if (!el) return;
  el.innerHTML = PILATES.map(function(p) {
    var hasVideo = p.video ? 'play' : '';
    return '<div class="pilates-card" data-name="' + escHtml(p.quick) + ' Pilates" data-dur="30"><div class="pc-head"><span class="pc-icon">🧘</span><div><div class="pc-name">' + p.name + '</div><div class="pc-meta">' + p.dur + ' · ' + p.level + '</div></div>' + (hasVideo ? '<button class="pilates-video-btn" data-video="' + p.video + '" title="Watch tutorial">▶</button>' : '') + '</div><div class="pc-desc">' + p.desc + '</div><button class="btn-sm pilates-add">+ Quick Add</button></div>';
  }).join('');
  el.querySelectorAll('.pilates-add').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = this.closest('.pilates-card');
      var name = card.dataset.name;
      var dur = card.dataset.dur;
      if (!workoutData[woDate]) workoutData[woDate] = [];
      workoutData[woDate].push({ type:'pilates', name:name, duration:dur, intensity:'moderate' });
      saveWorkouts();
      renderWorkouts();
      renderDashboard();
    });
  });
  el.querySelectorAll('.pilates-video-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var videoId = this.dataset.video;
      openVideoPlayer(videoId);
    });
  });
}

function openVideoPlayer(videoId) {
  var modal = document.getElementById('video-modal');
  var frame = document.getElementById('video-frame');
  if (!modal || !frame) return;
  frame.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
  modal.classList.remove('hidden');
  bodyLock();
  var closeBtn = document.getElementById('video-close');
  if (closeBtn) closeBtn.onclick = closeVideoPlayer;
  modal.onclick = function(e) { if (e.target === modal) closeVideoPlayer(); };
  document.addEventListener('keydown', videoEscHandler);
}

function videoEscHandler(e) {
  if (e.key === 'Escape') closeVideoPlayer();
}

function closeVideoPlayer() {
  var modal = document.getElementById('video-modal');
  var frame = document.getElementById('video-frame');
  if (modal) modal.classList.add('hidden');
  if (frame) frame.src = '';
  bodyUnlock();
  document.removeEventListener('keydown', videoEscHandler);
}

// ===== WORKOUT PLAN =====
var workoutPlan = null;
var workoutDone = {};

try { var wd = localStorage.getItem('baskug_workout_done'); if (wd) workoutDone = JSON.parse(wd); } catch(e) {}

function switchWoTab(tab) {
  document.querySelectorAll('.dim-tab[data-wotab]').forEach(function(t) { t.classList.toggle('active', t.dataset.wotab === tab); });
  document.querySelectorAll('.wo-tab-content').forEach(function(s) { s.classList.toggle('hidden', s.dataset.wotab !== tab); });
  if (tab === 'plan' && workoutPlan) { renderWorkoutPlan(); renderMonthPlan(); }
}

// ===== WORKOUT PLAN MONTH VIEW =====
var wpMonthOffset = 0;

function renderMonthPlan() {
  var grid = document.getElementById('wp-month-grid');
  var label = document.getElementById('wp-month-label');
  var detail = document.getElementById('wp-month-detail');
  if (!grid) return;

  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + wpMonthOffset;
  if (month < 0) { month = 11; year--; }
  if (month > 11) { month = 0; year++; }
  var monthDate = new Date(year, month, 1);

  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  label.textContent = monthNames[month] + ' ' + year;

  var firstDay = monthDate.getDay(); // 0=Sun
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var startCol = firstDay === 0 ? 6 : firstDay - 1; // Mon=0

  // Generate plans for all weeks in this month
  var weekPlans = {};
  for (var d = 1; d <= daysInMonth; d++) {
    var date = new Date(year, month, d);
    var weekStart = wpGetWeekStart(date);
    var weekKey = wpFmtDate(weekStart);
    if (!weekPlans[weekKey]) {
      // Try to load from existing workoutPlan, or generate on the fly
      var existing = workoutPlan && workoutPlan.week_start === weekKey ? workoutPlan : null;
      if (existing) {
        weekPlans[weekKey] = existing;
      } else {
        // Generate a plan for this week using saved preferences if available
        var prefs = {};
        if (workoutPlan && workoutPlan.schedule) {
          var savedPlan = loadSavedPlanForWeek(weekKey);
          if (savedPlan) {
            weekPlans[weekKey] = savedPlan;
          }
        }
      }
    }
  }

  var html = '<div class="wp-month-grid">';
  html += '<div class="wp-mg-header"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>';
  html += '<div class="wp-mg-body">';

  // Empty cells before first day
  for (var i = 0; i < startCol; i++) {
    html += '<div class="wp-mg-cell empty"></div>';
  }

  for (var dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    var date = new Date(year, month, dayNum);
    var dateStr = wpFmtDate(date);
    var weekStart = wpGetWeekStart(date);
    var weekKey = wpFmtDate(weekStart);
    var dayOfWeek = DAYS[(date.getDay() + 6) % 7]; // Mon=0

    var plan = weekPlans[weekKey];
    var dayExs = plan && plan.plan ? plan.plan[dayOfWeek] : null;
    var count = dayExs ? dayExs.length : 0;
    var isToday = dateStr === wpFmtDate(new Date());
    var hasWorkout = count > 0;

    html += '<div class="wp-mg-cell' + (isToday ? ' today' : '') + (hasWorkout ? ' has-wo' : '') + '" data-date="' + dateStr + '" data-week="' + weekKey + '" data-day="' + dayOfWeek + '">';
    html += '<div class="wp-mg-daynum">' + dayNum + '</div>';
    if (hasWorkout) {
      html += '<div class="wp-mg-count">' + count + '</div>';
    }
    html += '</div>';
  }

  html += '</div></div>';
  grid.innerHTML = html;

  // Click day to show detail
  grid.querySelectorAll('.wp-mg-cell.has-wo').forEach(function(cell) {
    cell.addEventListener('click', function() {
      var dateStr = this.dataset.date;
      var weekKey = this.dataset.week;
      var dayOfWeek = this.dataset.day;
      showMonthDayDetail(dateStr, weekKey, dayOfWeek);
    });
  });
}

function loadSavedPlanForWeek(weekKey) {
  // Check localStorage for saved plans
  try {
    var saved = localStorage.getItem('baskug_workout_plan');
    if (saved) {
      var p = JSON.parse(saved);
      if (p.week_start === weekKey) return p;
    }
    // Try generating with current schedule if available
    var savedSched = localStorage.getItem('baskug_workout_schedule');
    if (savedSched) {
      var sched = JSON.parse(savedSched);
      var prefs = workoutPlan ? workoutPlan.preferences : {};
      var gen = wpGeneratePlan(prefs, sched);
      if (gen.week_start === weekKey) return gen;
    }
  } catch(e) {}
  return null;
}

function showMonthDayDetail(dateStr, weekKey, dayOfWeek) {
  var detail = document.getElementById('wp-month-detail');
  // Try to get plan for this week
  var plan = null;
  if (workoutPlan && workoutPlan.week_start === weekKey) {
    plan = workoutPlan;
  } else {
    plan = loadSavedPlanForWeek(weekKey);
  }

  var exs = plan && plan.plan ? plan.plan[dayOfWeek] : [];
  if (!exs || exs.length === 0) {
    detail.innerHTML = '<div class="add-card"><h4>' + dateStr + ' — Rest day</h4></div>';
  } else {
    var html = '<div class="add-card"><h4>' + dateStr + ' (' + dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1) + ')</h4>';
    html += exs.map(function(ex, i) {
      var checked = workoutDone && workoutDone[weekKey] && workoutDone[weekKey][dayOfWeek] && workoutDone[weekKey][dayOfWeek][ex.id] ? 'checked' : '';
      var eq = ex.equipment && ex.equipment.length > 0 ? ' · <span class="wp-ex-eq">' + escHtml(ex.equipment.join(', ')) + '</span>' : '';
      return '<div class="wp-ex"><label class="wp-ex-check' + (checked ? ' done' : '') + '"><input type="checkbox" data-week="' + weekKey + '" data-day="' + dayOfWeek + '" data-exid="' + ex.id + '" ' + checked + '><span class="wp-ex-num">' + (i+1) + '</span></label><div class="wp-ex-info"><div class="wp-ex-name">' + escHtml(ex.name) + '</div><div class="wp-ex-meta">' + ex.sets + '×' + ex.reps + ' · ' + ex.muscle + ' · ' + ex.rest + 's rest' + eq + '</div></div></div>';
    }).join('');
    html += '</div>';
    detail.innerHTML = html;

    // Wire checkboxes
    detail.querySelectorAll('.wp-ex-check input').forEach(function(cb) {
      cb.addEventListener('change', function() {
        var w = this.dataset.week;
        var day = this.dataset.day;
        var exId = this.dataset.exid;
        if (!workoutDone) workoutDone = {};
        if (!workoutDone[w]) workoutDone[w] = {};
        if (!workoutDone[w][day]) workoutDone[w][day] = {};
        if (this.checked) { workoutDone[w][day][exId] = true; this.parentElement.classList.add('done'); }
        else { delete workoutDone[w][day][exId]; this.parentElement.classList.remove('done'); }
        localStorage.setItem('baskug_workout_done', JSON.stringify(workoutDone));
      });
    });
  }
  detail.classList.remove('hidden');
}

function wpMonthNav(dir) {
  wpMonthOffset += dir;
  renderMonthPlan();
  document.getElementById('wp-month-detail').classList.add('hidden');
}

function wpMonthToday() {
  wpMonthOffset = 0;
  renderMonthPlan();
  document.getElementById('wp-month-detail').classList.add('hidden');
}

function loadWorkoutPlan() {
  if (authToken) {
    return fetch('/api/workout/plan', { headers: { 'Authorization': 'Bearer ' + authToken } })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.plan) { workoutPlan = d; return d; }
        return null;
      })
      .catch(function() {
        try { var lp = localStorage.getItem('baskug_workout_plan'); if (lp) workoutPlan = JSON.parse(lp); } catch(e) {}
        return null;
      });
  }
  try { var d = localStorage.getItem('baskug_workout_plan'); if (d) workoutPlan = JSON.parse(d); } catch(e) {}
  return Promise.resolve(workoutPlan);
}

function renderWorkoutPlan() {
  var container = document.getElementById('wp-week');
  var header = document.getElementById('wp-header');
  if (!workoutPlan || !workoutPlan.plan) {
    container.innerHTML = '<p class="wo-empty">Click <strong>Generate Plan</strong> to create your weekly workout plan.</p>';
    if (header) header.innerHTML = '';
    return;
  }

  var p = workoutPlan;
  var weekLabel = p.week_start ? 'Week of ' + fmtDateShort(p.week_start) + ' — ' + p.focus_label : 'This Week\'s Plan';
  header.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;"><div><strong>' + weekLabel + '</strong></div><button class="btn-sm" id="wp-regenerate">🔄 Regenerate</button></div>';

  var html = '';
  DAYS.forEach(function(d) {
    var dayEx = p.plan[d] || [];
    var icon = { monday:'🌙', tuesday:'🔥', wednesday:'🌊', thursday:'🌿', friday:'🎉', saturday:'🌟', sunday:'☀️' };
    html += '<div class="wp-day"><div class="wp-day-head" data-day="' + d + '"><span>' + icon[d] + ' ' + DAY_LABEL[d] + '</span><span class="wp-day-count">' + dayEx.length + ' exercises</span><span class="wp-day-toggle">▼</span></div>';
    html += '<div class="wp-day-body">';
    if (dayEx.length === 0) {
      html += '<p class="wo-empty" style="padding:0.5rem 0;">Rest day</p>';
    } else {
      html += dayEx.map(function(ex, i) {
        var checked = workoutDone && workoutDone[p.week_start] && workoutDone[p.week_start][d] && workoutDone[p.week_start][d][ex.id] ? 'checked' : '';
        var eq = ex.equipment && ex.equipment.length > 0 ? ' · <span class="wp-ex-eq">' + escHtml(ex.equipment.join(', ')) + '</span>' : '';
        return '<div class="wp-ex"><label class="wp-ex-check' + (checked ? ' done' : '') + '"><input type="checkbox" data-week="' + p.week_start + '" data-day="' + d + '" data-exid="' + ex.id + '" ' + checked + '><span class="wp-ex-num">' + (i+1) + '</span></label><div class="wp-ex-info"><div class="wp-ex-name">' + escHtml(ex.name) + '</div><div class="wp-ex-meta"><span class="wp-sr-editor" data-week="' + p.week_start + '" data-day="' + d + '" data-exid="' + ex.id + '"><button class="wp-sr-btn wp-sr-minus" data-target="sets">−</button><span class="wp-sr-val" data-field="sets">' + ex.sets + '</span><span class="wp-sr-x">×</span><button class="wp-sr-btn wp-sr-minus" data-target="reps">−</button><span class="wp-sr-val" data-field="reps">' + ex.reps + '</span><button class="wp-sr-btn wp-sr-plus" data-target="reps">+</button><button class="wp-sr-btn wp-sr-plus" data-target="sets">+</button></span> · ' + ex.muscle + ' · ' + ex.rest + 's rest' + eq + '</div></div></div>';
      }).join('');
    }
    html += '</div></div>';
  });

  container.innerHTML = html;

  // Day toggle
  container.querySelectorAll('.wp-day-head').forEach(function(head) {
    head.addEventListener('click', function() {
      var body = this.nextElementSibling;
      body.classList.toggle('open');
      this.querySelector('.wp-day-toggle').textContent = body.classList.contains('open') ? '▲' : '▼';
    });
    // Open by default
    head.nextElementSibling.classList.add('open');
    head.querySelector('.wp-day-toggle').textContent = '▲';
  });

  // Checkbox toggle
  container.querySelectorAll('.wp-ex-check input').forEach(function(cb) {
    cb.addEventListener('change', function() {
      var week = this.dataset.week;
      var day = this.dataset.day;
      var exId = this.dataset.exid;
      if (!workoutDone) workoutDone = {};
      if (!workoutDone[week]) workoutDone[week] = {};
      if (!workoutDone[week][day]) workoutDone[week][day] = {};
      if (this.checked) {
        workoutDone[week][day][exId] = true;
        this.parentElement.classList.add('done');
      } else {
        delete workoutDone[week][day][exId];
        this.parentElement.classList.remove('done');
      }
      localStorage.setItem('baskug_workout_done', JSON.stringify(workoutDone));
      if (authToken) {
        apiPut('baskug_workout_done', workoutDone);
      }
      updateWorkoutPlanProgress();
    });
  });

  // Sets/Reps adjust
  container.querySelectorAll('.wp-sr-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var editor = this.closest('.wp-sr-editor');
      var week = editor.dataset.week;
      var day = editor.dataset.day;
      var exId = editor.dataset.exid;
      var target = this.dataset.target;
      var valSpan = editor.querySelector('.wp-sr-val[data-field="' + target + '"]');
      var val = parseInt(valSpan.textContent);
      var delta = this.classList.contains('wp-sr-plus') ? 1 : -1;
      var newVal = Math.max(1, val + delta);
      if (target === 'reps') newVal = Math.max(1, Math.min(50, newVal));
      if (target === 'sets') newVal = Math.max(1, Math.min(20, newVal));
      valSpan.textContent = newVal;
      // Save to workoutPlan data
      if (workoutPlan && workoutPlan.plan && workoutPlan.plan[day]) {
        var ex = workoutPlan.plan[day].find(function(e) { return e.id === exId; });
        if (ex) {
          if (target === 'sets') ex.sets = newVal;
          if (target === 'reps') ex.reps = newVal;
          localStorage.setItem('baskug_workout_plan', JSON.stringify(workoutPlan));
        }
      }
    });
  });

  // Regenerate
  var regenBtn = document.getElementById('wp-regenerate');
  if (regenBtn) regenBtn.addEventListener('click', generateWorkoutPlan);

  updateWorkoutPlanProgress();
}

function updateWorkoutPlanProgress() {
  if (!workoutPlan || !workoutPlan.plan) return;
  var week = workoutPlan.week_start;
  var total = 0, done = 0;
  DAYS.forEach(function(d) {
    var exs = workoutPlan.plan[d] || [];
    exs.forEach(function(ex) {
      total++;
      if (workoutDone && workoutDone[week] && workoutDone[week][d] && workoutDone[week][d][ex.id]) done++;
    });
  });
  var pct = total > 0 ? Math.round(done / total * 100) : 0;
  var el = document.getElementById('wp-progress');
  if (!el) {
    var header = document.getElementById('wp-header');
    if (header && !document.getElementById('wp-progress')) {
      var prog = document.createElement('div');
      prog.id = 'wp-progress';
      prog.style.cssText = 'margin-bottom:0.75rem;';
      header.appendChild(prog);
      el = prog;
    }
  }
  if (el) {
    el.innerHTML = '<div style="display:flex;align-items:center;gap:0.5rem;"><div style="flex:1;height:6px;background:var(--border-primary);border-radius:3px;"><div style="width:' + pct + '%;height:100%;background:var(--primary, #7C5CFC);border-radius:3px;transition:width 0.3s;"></div></div><span class="type-mono-01-caps" style="font-size:12px;">' + done + '/' + total + ' (' + pct + '%)</span></div>';
  }
}

function generateWorkoutPlan() {
  // Clear stale plan data before generating
  workoutPlan = null;
  localStorage.removeItem('baskug_workout_plan');

  var prefs = {
    goal: document.getElementById('wp-goal').value,
    intensity: document.getElementById('wp-intensity').value
  };

  // Build per-day schedule from UI
  var schedule = {};
  DAYS.forEach(function(day) {
    var picker = document.querySelector('.wp-day-picker[data-day="' + day + '"]');
    if (!picker) { schedule[day] = { active: false, style: 'mixed' }; return; }
    var active = picker.querySelector('input[type="checkbox"]').checked;
    var style = picker.querySelector('.wp-day-style').value;
    schedule[day] = { active: active, style: style };
  });

  if (authToken) {
    // Server-side: syncs across devices
    var genBtn = document.getElementById('wp-gen-btn');
    if (genBtn) { genBtn.textContent = 'Generating...'; genBtn.disabled = true; }
    fetch('/api/workout/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
      body: JSON.stringify({ preferences: prefs, schedule: schedule })
    })
    .then(function(r) { return r.json(); })
    .then(function(plan) {
      if (plan && plan.plan) {
        workoutPlan = plan;
        localStorage.setItem('baskug_workout_plan', JSON.stringify(plan));
        renderWorkoutPlan();
        renderDashboard();
      } else if (plan.error) {
        alert('Error: ' + plan.error);
      }
    })
    .catch(function(err) {
      alert('Failed to generate plan: ' + err.message);
    })
    .finally(function() {
      if (genBtn) { genBtn.textContent = 'Generate Plan'; genBtn.disabled = false; }
    });
  } else {
    // Client-side: works offline
    var plan = wpGeneratePlan(prefs, schedule);
    workoutPlan = plan;
    localStorage.setItem('baskug_workout_plan', JSON.stringify(plan));
    renderWorkoutPlan();
    renderDashboard();
  }
}

// ===== ROUTINES =====
var routineData = [];
var routineDone = {};

function loadRoutines() {
  if (authToken) {
    return apiGet('baskug_routines').then(function(d) {
      if (Array.isArray(d)) routineData = d;
      return apiGet('baskug_routine_log');
    }).then(function(d) {
      if (d && typeof d === 'object') routineDone = d;
      initDefaults();
    }).catch(function() {
      try { var ld = localStorage.getItem('baskug_routines'); if (ld) routineData = JSON.parse(ld); } catch(e) {}
      try { var ld2 = localStorage.getItem('baskug_routine_log'); if (ld2) routineDone = JSON.parse(ld2); } catch(e) {}
      initDefaults();
    });
  }
  try { var d = localStorage.getItem('baskug_routines'); if (d) routineData = JSON.parse(d); } catch(e) {}
  try { var d = localStorage.getItem('baskug_routine_log'); if (d) routineDone = JSON.parse(d); } catch(e) {}
  initDefaults();
}

function initDefaults() {
  if (!Array.isArray(routineData)) routineData = [];
  if (!routineDone || typeof routineDone !== 'object') routineDone = {};
  if (routineData.length === 0) {
    routineData = [
      { id:'rm1', name:'Morning Routine', tasks:[ { id:'rt1', name:'Wake up by 7am' }, { id:'rt2', name:'Stretch for 5 min' }, { id:'rt3', name:'Drink water' }, { id:'rt4', name:'Make bed' } ] },
      { id:'re1', name:'Evening Routine', tasks:[ { id:'rt5', name:'Journal for 5 min' }, { id:'rt6', name:'Plan tomorrow' }, { id:'rt7', name:'No screens 30 min before bed' }, { id:'rt8', name:'Read for 15 min' } ] }
    ];
  }
}

function saveRoutines() {
  if (authToken) { apiPut('baskug_routines', routineData); apiPut('baskug_routine_log', routineDone); }
  localStorage.setItem('baskug_routines', JSON.stringify(routineData));
  localStorage.setItem('baskug_routine_log', JSON.stringify(routineDone));
}

function renderRoutines() {
  var container = document.getElementById('routines-list');
  if (routineData.length === 0) { container.innerHTML = '<p class="routines-empty">No routines yet. Create one below!</p>'; return; }
  var h = '';
  routineData.forEach(function(r, ri) {
    var total = r.tasks.length, done = 0;
    r.tasks.forEach(function(t) { if (routineDone[todayStr()] && routineDone[todayStr()][r.id + '-' + t.id]) done++; });
    var pct = total > 0 ? Math.round(done/total*100) : 0;
    h += '<div class="routine-card"><div class="rc-head"><h3>' + escHtml(r.name) + '</h3><button class="rc-del" data-ri="' + ri + '" title="Delete routine">&times;</button></div><div class="rc-progress"><div class="rc-bar" style="width:' + pct + '%;"></div></div><div style="font-size:0.72rem;color:var(--muted);margin-bottom:8px;">' + done + '/' + total + ' done (' + pct + '%)</div>';
    r.tasks.forEach(function(t, ti) {
      var key = r.id + '-' + t.id;
      var checked = routineDone[todayStr()] && routineDone[todayStr()][key] ? 'checked' : '';
      h += '<div class="rc-task"><input type="checkbox" ' + checked + ' data-ri="' + ri + '" data-ti="' + ti + '"><span class="rt-name' + (checked ? ' done' : '') + '">' + escHtml(t.name) + '</span></div>';
    });
    h += '<div class="rc-add-task"><input type="text" placeholder="Add task..." data-ri="' + ri + '"><button class="btn-sm rc-add-btn" data-ri="' + ri + '">+</button></div></div>';
  });
  container.innerHTML = h;
  container.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      var ri = parseInt(this.dataset.ri), ti = parseInt(this.dataset.ti);
      var r = routineData[ri], t = r.tasks[ti];
      var key = r.id + '-' + t.id;
      if (!routineDone[todayStr()]) routineDone[todayStr()] = {};
      if (this.checked) routineDone[todayStr()][key] = true;
      else delete routineDone[todayStr()][key];
      saveRoutines();
      renderRoutines();
      renderDashboard();
    });
  });
  container.querySelectorAll('.rc-add-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var ri = parseInt(this.dataset.ri);
      var input = this.parentElement.querySelector('input');
      var name = input.value.trim();
      if (!name) return;
      var t = { id:'rt'+Date.now(), name:name };
      routineData[ri].tasks.push(t);
      saveRoutines();
      renderRoutines();
      input.value = '';
    });
  });
  container.querySelectorAll('.rc-del').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var ri = parseInt(this.dataset.ri);
      if (confirm('Delete "' + routineData[ri].name + '" routine?')) {
        routineData.splice(ri, 1);
        saveRoutines();
        renderRoutines();
        renderDashboard();
      }
    });
  });
}

function addRoutine() {
  var name = document.getElementById('routine-name').value.trim();
  if (!name) { alert('Enter a routine name.'); return; }
  routineData.push({ id:'r'+Date.now(), name:name, tasks:[] });
  saveRoutines();
  renderRoutines();
  renderDashboard();
  document.getElementById('routine-name').value = '';
}

// ===== HOBBIES =====
var hobbyData = [];

function loadHobbies() {
  if (authToken) {
    return apiGet('baskug_hobbies').then(function(d) {
      if (Array.isArray(d)) hobbyData = d;
      if (hobbyData.length === 0) hobbyData = [
        { id:'h1', name:'Photography', sessions:[] },
        { id:'h2', name:'Reading', sessions:[] },
        { id:'h3', name:'Gaming', sessions:[] }
      ];
    }).catch(function() {
      try { var ld = localStorage.getItem('baskug_hobbies'); if (ld) hobbyData = JSON.parse(ld); } catch(e) {}
      initHobbies();
    });
  }
  try { var d = localStorage.getItem('baskug_hobbies'); if (d) hobbyData = JSON.parse(d); } catch(e) {}
  initHobbies();
}

function initHobbies() {
  if (!Array.isArray(hobbyData)) hobbyData = [];
  if (hobbyData.length === 0) {
    hobbyData = [
      { id:'h1', name:'Photography', sessions:[] },
      { id:'h2', name:'Reading', sessions:[] },
      { id:'h3', name:'Gaming', sessions:[] }
    ];
  }
}

function saveHobbies() {
  if (authToken) { apiPut('baskug_hobbies', hobbyData); }
  localStorage.setItem('baskug_hobbies', JSON.stringify(hobbyData));
}

function renderHobbies() {
  var container = document.getElementById('hobbies-list');
  if (hobbyData.length === 0) { container.innerHTML = '<p class="hobby-empty">No hobbies yet. Add one below!</p>'; return; }
  var h = '';
  hobbyData.forEach(function(hob, hi) {
    var totalMin = 0;
    hob.sessions.forEach(function(s) { totalMin += parseInt(s.duration) || 0; });
    h += '<div class="hobby-card"><div class="hc-head"><h3>' + escHtml(hob.name) + '</h3><span class="hc-hours">' + (totalMin >= 60 ? Math.round(totalMin/60*10)/10 + 'h' : totalMin + 'm') + '</span></div><div class="hc-sessions">';
    var recent = hob.sessions.slice(-5).reverse();
    if (recent.length === 0) { h += '<div style="font-size:0.78rem;color:var(--muted);">No sessions logged yet.</div>'; }
    else {
      recent.forEach(function(s, si) {
        var idx = hob.sessions.indexOf(s);
        h += '<div class="hc-session"><span class="hs-date">' + fmtDateShort(s.date) + '</span><span class="hs-dur">' + s.duration + 'm</span><span class="hs-notes">' + (s.notes ? escHtml(s.notes) : '') + '</span><button class="hobby-del-session" data-hi="' + hi + '" data-si="' + idx + '">&times;</button></div>';
      });
    }
    h += '</div><div class="hc-log"><input type="number" placeholder="min" class="hlog-dur" data-hi="' + hi + '"><input type="text" placeholder="Notes (optional)" class="hlog-notes" data-hi="' + hi + '"><button class="btn-sm hlog-btn" data-hi="' + hi + '">Log</button></div></div>';
  });
  container.innerHTML = h;
  container.querySelectorAll('.hlog-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var hi = parseInt(this.dataset.hi);
      var dur = parseInt(this.parentElement.querySelector('.hlog-dur').value);
      var notes = this.parentElement.querySelector('.hlog-notes').value.trim();
      if (!dur || dur < 1) { alert('Enter a valid duration.'); return; }
      hobbyData[hi].sessions.push({ date:todayStr(), duration:dur, notes:notes || '' });
      saveHobbies();
      renderHobbies();
      renderDashboard();
    });
  });
  container.querySelectorAll('.hobby-del-session').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var hi = parseInt(this.dataset.hi), si = parseInt(this.dataset.si);
      hobbyData[hi].sessions.splice(si, 1);
      saveHobbies();
      renderHobbies();
      renderDashboard();
    });
  });
}

function addHobby() {
  var name = document.getElementById('hobby-name').value.trim();
  if (!name) { alert('Enter a hobby name.'); return; }
  hobbyData.push({ id:'h'+Date.now(), name:name, sessions:[] });
  saveHobbies();
  renderHobbies();
  renderDashboard();
  document.getElementById('hobby-name').value = '';
}

function escHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ===== THEME =====
function initTheme() {
  var btn = document.getElementById('theme-toggle');
  var html = document.documentElement;
  function set(mode) {
    if (mode === 'dark') {
      html.setAttribute('data-theme','dark');
      document.body.setAttribute('data-theme','dark');
      btn.textContent = '☀';
    } else {
      html.removeAttribute('data-theme');
      document.body.removeAttribute('data-theme');
      btn.textContent = '🌙';
    }
  }
  function timeBasedTheme() {
    var h = new Date().getHours();
    return (h >= 18 || h < 6) ? 'dark' : 'light';
  }
  var saved = localStorage.getItem('baskug_theme');
  if (saved) {
    set(saved);
  } else {
    set(timeBasedTheme());
  }
  btn.addEventListener('click', function() {
    var cur = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    set(cur);
    localStorage.setItem('baskug_theme', cur);
  });
}

// ===== FIREBASE AUTH SYSTEM (Phone + Google) =====
var authConfirmResult = null;

function showAuthStep(step) {
  document.getElementById('auth-step-methods').classList.toggle('hidden', step !== 'methods');
  document.getElementById('auth-step-phone').classList.toggle('hidden', step !== 'phone');
  document.getElementById('auth-step-verify').classList.toggle('hidden', step !== 'verify');
  var title = document.getElementById('auth-title');
  var sub = document.getElementById('auth-sub');
  if (step === 'phone') { title.textContent = 'Phone Sign-In'; sub.textContent = 'Enter your number to receive a code'; }
  else if (step === 'verify') { title.textContent = 'Verify Code'; sub.textContent = ''; }
  else { title.textContent = 'Sign in to BASKUG LIFE'; sub.textContent = 'Sync your data across devices'; }
}

function showAuthError(msg) {
  var el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function firebasePhoneSignIn() {
  var codeEl = document.getElementById('auth-phone-code');
  var phoneEl = document.getElementById('auth-phone-input');
  var fullPhone = codeEl.value + phoneEl.value.trim();

  if (!phoneEl.value.trim()) { showAuthError('Please enter your phone number.'); return; }
  showAuthError('');

  var btn = document.getElementById('btn-send-code');
  btn.disabled = true; btn.textContent = '⏳ Sending code...';

  var verifier = new firebase.auth.RecaptchaVerifier('auth-recaptcha', { size: 'invisible' });

  firebase.auth().signInWithPhoneNumber(fullPhone, verifier)
    .then(function(confirmationResult) {
      authConfirmResult = confirmationResult;
      document.getElementById('auth-phone-display').textContent = fullPhone;
      showAuthStep('verify');
      btn.disabled = false; btn.textContent = 'Send Code';
    })
    .catch(function(e) {
      showAuthError(firebaseAuthErrorMessage(e));
      btn.disabled = false; btn.textContent = 'Send Code';
      verifier.reset();
    });
}

function firebaseVerifyCode() {
  var code = document.getElementById('auth-code-input').value.trim();
  if (!code) { showAuthError('Please enter the verification code.'); return; }
  showAuthError('');

  var btn = document.getElementById('btn-verify-code');
  btn.disabled = true; btn.textContent = '⏳ Verifying...';

  authConfirmResult.confirm(code)
    .then(function() {
      hideOverlay('view-auth');
    })
    .catch(function(e) {
      showAuthError(firebaseAuthErrorMessage(e));
      btn.disabled = false; btn.textContent = 'Verify';
    });
}

function firebaseGoogleSignIn() {
  showAuthError('');
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

function firebaseAuthErrorMessage(e) {
  var code = e.code || '';
  var map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/cancelled-popup-request': 'Sign-in cancelled.',
    'auth/invalid-phone-number': 'Invalid phone number. Please check and try again.',
    'auth/too-many-requests-phone': 'Too many SMS requests. Please try again later.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
    'auth/code-expired': 'Verification code expired. Please request a new one.',
    'auth/invalid-verification-code': 'Invalid verification code. Please check and try again.'
  };
  return map[code] || e.message || 'Authentication failed.';
}

function firebaseLogout() {
  firebase.auth().signOut().then(function() {
    fetch('/api/auth/logout', { method: 'POST' }).catch(function() {});
    authToken = null;
    localStorage.removeItem('baskug_token');
    localStorage.removeItem('baskug_workout_plan');
    localStorage.removeItem('baskug_workout_done');
    workoutPlan = null;
    workoutDone = {};
    user = {};
    needsProfile = false;
    document.body.removeAttribute('data-gender');
    document.getElementById('app-main').classList.remove('active');
    document.getElementById('app-main').classList.add('hidden');
    document.getElementById('main-nav').classList.add('hidden');
    document.getElementById('main-footer').classList.add('hidden');
    document.querySelectorAll('.dim.open').forEach(function(d) { d.classList.remove('open'); });
    openDim = null;
    showOverlay('view-hero');
    document.getElementById('view-auth').classList.remove('active');
  }).catch(function() {});
}

function onFirebaseAuth(firebaseUser) {
  if (firebaseUser) {
    firebaseUserCache = firebaseUser;
    firebaseUser.getIdToken().then(function(token) {
      authToken = token;
      localStorage.setItem('baskug_token', token);
      return fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      });
    }).then(function(r) { return r.json(); }).then(function(data) {
      if (data.user) {
        Object.assign(user, data.user);
        user.heightCm = user.height || '';
        user.weightKg = user.weight || '';
        user.phone = user.phone || '';
        localStorage.setItem('baskug_user', JSON.stringify(user));
        needsProfile = !user.name;
        return loadAllRemote();
      }
      throw new Error('No user data');
    }).then(function() {
      hideOverlay('view-hero');
      if (needsProfile) {
        showOverlay('view-setup');
      } else {
        enterApp();
      }
      firebaseUserResolve();
    }).catch(function(e) {
      console.error('Firebase auth setup error:', e);
      authToken = null;
      localStorage.removeItem('baskug_token');
      showOverlay('view-hero');
      firebaseUserResolve();
    });
  } else {
    firebaseUserCache = null;
    authToken = null;
    localStorage.removeItem('baskug_token');
    loadAll();
    firebaseUserResolve();
    if (user && user.name) {
      enterApp();
    } else {
      showOverlay('view-hero');
    }
  }
}

async function loadAllRemote() {
  try {
    var u = await apiGet('baskug_user');
    var s = await apiGet('baskug_schedule');
    var w = await apiGet('baskug_work');
    if (u && u.name) user = Object.assign(user, u);
    if (s && s.monday) schedule = s;
    if (w && typeof w === 'object') workSchedule = w;
  } catch(e) {}
  if (!schedule || !schedule.monday) schedule = JSON.parse(JSON.stringify(DEFAULT));
  if (!workSchedule || typeof workSchedule !== 'object') workSchedule = {};
  await loadMeals();
  await loadWorkouts();
  await loadRoutines();
  await loadHobbies();
  await loadSymptoms();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  loadAll();
  bodyLock();

  // Handle redirect result (for Google sign-in with redirect)
  firebase.auth().getRedirectResult().catch(function(e) {
    // Prevent error from showing if user just cancelled
    if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
    showAuthError(firebaseAuthErrorMessage(e));
  });

  // Firebase auth state listener (onIdTokenChanged also fires on token refresh)
  firebase.auth().onIdTokenChanged(function(user) {
    if (user) {
      user.getIdToken().then(function(t) { authToken = t; });
    }
    onFirebaseAuth(user);
  });

  // Show login/signup overlay
  safeListen('btn-get-started', 'click', function() {
    showAuthStep('methods');
    document.getElementById('auth-code-input').value = '';
    document.getElementById('auth-phone-input').value = '';
    showAuthError('');
    showOverlay('view-auth');
  });

  // Auth close
  safeListen('auth-close', 'click', function() { hideOverlay('view-auth'); });

  // Google sign-in
  safeListen('btn-auth-google', 'click', firebaseGoogleSignIn);

  // Phone sign-in — show phone step
  safeListen('btn-auth-phone', 'click', function() {
    showAuthStep('phone');
    showAuthError('');
  });

  // Send SMS code
  safeListen('btn-send-code', 'click', firebasePhoneSignIn);

  // Verify SMS code
  safeListen('btn-verify-code', 'click', firebaseVerifyCode);

  // Back from phone step
  safeListen('btn-back-methods', 'click', function() {
    showAuthStep('methods');
    showAuthError('');
  });

  // Back from verify step
  safeListen('btn-back-phone', 'click', function() {
    showAuthStep('phone');
    showAuthError('');
    authConfirmResult = null;
  });

  // Auth skip (continue without account)
  safeListen('auth-skip', 'click', function() {
    hideOverlay('view-auth');
    fillProfile();
    showOverlay('view-setup');
  });

  // Logout
  safeListen('btn-logout', 'click', function() {
    if (firebaseUserCache) {
      firebaseLogout();
    } else {
      // Non-authed user — just go back to hero
      authToken = null;
      localStorage.removeItem('baskug_token');
      localStorage.removeItem('baskug_workout_plan');
      localStorage.removeItem('baskug_workout_done');
      workoutPlan = null;
      workoutDone = {};
      user = {};
      needsProfile = false;
      document.body.removeAttribute('data-gender');
      document.getElementById('app-main').classList.remove('active');
      document.getElementById('app-main').classList.add('hidden');
      document.getElementById('main-nav').classList.add('hidden');
      document.getElementById('main-footer').classList.add('hidden');
      document.querySelectorAll('.dim.open').forEach(function(d) { d.classList.remove('open'); });
      openDim = null;
      showOverlay('view-hero');
      document.getElementById('view-auth').classList.remove('active');
    }
  });

  safeListen('profile-form', 'submit', saveProfile);
  safeListen('btn-edit-profile', 'click', function() {
    fillProfile();
    document.getElementById('app-main').classList.remove('active');
    showOverlay('view-setup');
  });
  safeListen('btn-update-body', 'click', function() {
    fillProfile();
    document.getElementById('app-main').classList.remove('active');
    showOverlay('view-setup');
  });

  // Widget cards & feature buttons → open dimension
  document.querySelectorAll('.widget-card, .feature-btn').forEach(function(el) {
    el.addEventListener('click', function() { openDimension(this.dataset.dim); });
  });

  // Carousel navigation
  initCarousel();

  // Back buttons → close dimension
  document.querySelectorAll('.dim-back').forEach(function(btn) {
    btn.addEventListener('click', function() { closeDimension(this.dataset.dim); });
  });

  safeListen('reset-week', 'click', resetWeek);

  // Planner tabs
  document.querySelectorAll('.planner-tab').forEach(function(t) {
    t.addEventListener('click', function() { switchPlannerTab(this.dataset.ptab); });
  });

  // Weekly planner form
  safeListen('save-week-btn', 'click', saveWeekBlock);
  safeListen('cancel-week-btn', 'click', hideWeekForm);

  // Work planner form
  safeListen('save-work-btn', 'click', saveWorkBlock);
  safeListen('cancel-work-btn', 'click', hideWorkForm);
  safeListen('mcal-prev', 'click', function() { mcalGo(-1); });
  safeListen('mcal-next', 'click', function() { mcalGo(1); });
  safeListen('mcal-today', 'click', mcalGoToday);
  safeListen('mcal-add-btn', 'click', mcalAddBlock);

  safeListen('save-reflection', 'click', saveReflection);

  // Date nav for meals & workouts
  document.querySelectorAll('.date-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = this.dataset.target;
      if (this.dataset.move) {
        var d = parseInt(this.dataset.move);
        if (target === 'meals') moveMealDate(d);
        if (target === 'workout') moveWoDate(d);
      } else if (this.classList.contains('date-today')) {
        if (target === 'meals') mealToday();
        if (target === 'workout') woToday();
      }
    });
  });
  safeListen('add-meal-btn', 'click', addMeal);
  document.querySelectorAll('.meal-tab').forEach(function(t) {
    t.addEventListener('click', function() { switchMealTab(this.dataset.mtab); });
  });
  var mpPrev = document.getElementById('mp-prev');
  var mpNext = document.getElementById('mp-next');
  var mpToday = document.getElementById('mp-today');
  if (mpPrev) mpPrev.addEventListener('click', function() { mpWeekOffset--; renderMealPlan(); });
  if (mpNext) mpNext.addEventListener('click', function() { mpWeekOffset++; renderMealPlan(); });
  if (mpToday) mpToday.addEventListener('click', function() { mpWeekOffset = 0; renderMealPlan(); });
  safeListen('add-wo-btn', 'click', addWorkout);
  // Workout tabs
  document.querySelectorAll('.dim-tab[data-wotab]').forEach(function(t) {
    t.addEventListener('click', function() { switchWoTab(this.dataset.wotab); });
  });
  safeListen('wp-gen-btn', 'click', generateWorkoutPlan);
  // Plan subtabs (week/month)
  document.querySelectorAll('.wp-subtab').forEach(function(t) {
    t.addEventListener('click', function() {
      document.querySelectorAll('.wp-subtab').forEach(function(st) { st.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.wp-plan-view').forEach(function(v) { v.classList.add('hidden'); });
      document.getElementById('wp-' + this.dataset.wpsub).classList.remove('hidden');
      if (this.dataset.wpsub === 'month' && workoutPlan) renderMonthPlan();
    });
  });
  safeListen('wp-mprev', 'click', function() { wpMonthNav(-1); });
  safeListen('wp-mnext', 'click', function() { wpMonthNav(1); });
  safeListen('wp-mtoday', 'click', wpMonthToday);
  safeListen('add-routine-btn', 'click', addRoutine);
  safeListen('add-hobby-btn', 'click', addHobby);

  safeListen('cal-prev', 'click', function() { calGo(-1); });
  safeListen('cal-next', 'click', function() { calGo(1); });
  safeListen('cal-today', 'click', calGoToday);
  safeListen('cal-setup-btn', 'click', toggleCycleSettings);
  safeListen('cal-save-settings', 'click', saveCycleSettings);
  safeListen('cal-cancel-settings', 'click', function() { document.getElementById('cycle-settings').classList.add('hidden'); });
  safeListen('symp-save', 'click', saveSympToday);

  safeListen('med-start-btn', 'click', startMeditation);

  safeListen('sp-stop', 'click', stopSound);

  // Double-click logo → reset everything
  var logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('dblclick', function() {
      if (confirm('Reset all data and start from the beginning?')) {
        localStorage.clear();
        location.reload();
      }
    });
  }
});
