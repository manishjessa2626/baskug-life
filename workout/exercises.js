// Exercise library and weekly plan generator

var EXERCISES = [
  // ========== CHEST (push) ==========
  { id:'ex_bench', name:'Barbell Bench Press', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['barbell','bench'], demo:null },
  { id:'ex_dumb_bench', name:'Dumbbell Bench Press', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','bench'], demo:null },
  { id:'ex_incline', name:'Incline Dumbbell Press', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','bench'], demo:null },
  { id:'ex_pushup', name:'Push-Ups', muscle:'Chest', style:'bodyweight', intensity:'all', focus:'push', equipment:[], demo:null },
  { id:'ex_decline', name:'Decline Push-Ups', muscle:'Chest', style:'bodyweight', intensity:'intermediate', focus:'push', equipment:[], demo:null },
  { id:'ex_chest_fly', name:'Dumbbell Chest Fly', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','bench'], demo:null },
  { id:'ex_chest_dip', name:'Chest Dips', muscle:'Chest', style:'bodyweight', intensity:'advanced', focus:'push', equipment:['dip_bars'], demo:null },
  { id:'ex_wide_pushup', name:'Wide Push-Ups', muscle:'Chest', style:'bodyweight', intensity:'all', focus:'push', equipment:[], demo:null },

  // ========== SHOULDERS (push) ==========
  { id:'ex_ohp', name:'Overhead Press', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['barbell','dumbbells'], demo:null },
  { id:'ex_lat_raise', name:'Dumbbell Lateral Raise', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells'], demo:null },
  { id:'ex_front_raise', name:'Dumbbell Front Raise', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells'], demo:null },
  { id:'ex_face_pull', name:'Face Pull', muscle:'Shoulders', style:'gym', intensity:'all', focus:'pull', equipment:['cable','bands'], demo:null },
  { id:'ex_pike', name:'Pike Push-Ups', muscle:'Shoulders', style:'bodyweight', intensity:'intermediate', focus:'push', equipment:[], demo:null },
  { id:'ex_arnold', name:'Arnold Press', muscle:'Shoulders', style:'gym', intensity:'intermediate', focus:'push', equipment:['dumbbells'], demo:null },
  { id:'ex_shrug', name:'Dumbbell Shrugs', muscle:'Shoulders', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells'], demo:null },

  // ========== BACK (pull) ==========
  { id:'ex_deadlift', name:'Deadlift', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['barbell'], demo:null },
  { id:'ex_row', name:'Barbell Row', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['barbell'], demo:null },
  { id:'ex_dumb_row', name:'Dumbbell Row', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells','bench'], demo:null },
  { id:'ex_pullup', name:'Pull-Ups', muscle:'Back', style:'bodyweight', intensity:'all', focus:'pull', equipment:['pullup_bar'], demo:null },
  { id:'ex_chinup', name:'Chin-Ups', muscle:'Back', style:'bodyweight', intensity:'all', focus:'pull', equipment:['pullup_bar'], demo:null },
  { id:'ex_lat_pulldown', name:'Lat Pulldown', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['cable'], demo:null },
  { id:'ex_seated_row', name:'Seated Cable Row', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['cable'], demo:null },
  { id:'ex_superman', name:'Superman Hold', muscle:'Back', style:'bodyweight', intensity:'all', focus:'pull', equipment:[], demo:null },
  { id:'ex_renegade', name:'Renegade Rows', muscle:'Back', style:'bodyweight', intensity:'intermediate', focus:'pull', equipment:['dumbbells'], demo:null },

  // ========== LEGS ==========
  { id:'ex_squat', name:'Barbell Back Squat', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['barbell','squat_rack'], demo:null },
  { id:'ex_front_squat', name:'Front Squat', muscle:'Legs', style:'gym', intensity:'intermediate', focus:'legs', equipment:['barbell'], demo:null },
  { id:'ex_goblet', name:'Goblet Squat', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['dumbbell','kettlebell'], demo:null },
  { id:'ex_lunge', name:'Walking Lunges', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:[], demo:null },
  { id:'ex_bulgarian', name:'Bulgarian Split Squat', muscle:'Legs', style:'gym', intensity:'intermediate', focus:'legs', equipment:['dumbbells','bench'], demo:null },
  { id:'ex_rdl', name:'Romanian Deadlift', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['dumbbells','barbell'], demo:null },
  { id:'ex_leg_press', name:'Leg Press', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['leg_press'], demo:null },
  { id:'ex_calf_raise', name:'Standing Calf Raise', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['dumbbells'], demo:null },
  { id:'ex_body_squat', name:'Bodyweight Squats', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:[], demo:null },
  { id:'ex_glute_bridge', name:'Glute Bridge', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:[], demo:null },
  { id:'ex_stepup', name:'Step-Ups', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:['bench','box'], demo:null },
  { id:'ex_wall_sit', name:'Wall Sit', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:[], demo:null },

  // ========== ARMS (biceps — pull) ==========
  { id:'ex_bicep_curl', name:'Dumbbell Bicep Curl', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells'], demo:null },
  { id:'ex_hammer', name:'Hammer Curl', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells'], demo:null },
  { id:'ex_preacher', name:'Preacher Curl', muscle:'Arms', style:'gym', intensity:'intermediate', focus:'pull', equipment:['barbell','ez_bar'], demo:null },
  { id:'ex_inverted_row', name:'Inverted Row', muscle:'Arms', style:'bodyweight', intensity:'all', focus:'pull', equipment:['bar'], demo:null },

  // ========== ARMS (triceps — push) ==========
  { id:'ex_skull', name:'Skull Crushers', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','ez_bar','bench'], demo:null },
  { id:'ex_tri_pushdown', name:'Tricep Pushdown', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['cable','bands'], demo:null },
  { id:'ex_diamond', name:'Diamond Push-Ups', muscle:'Arms', style:'bodyweight', intensity:'all', focus:'push', equipment:[], demo:null },
  { id:'ex_bench_dip', name:'Bench Dips', muscle:'Arms', style:'bodyweight', intensity:'all', focus:'push', equipment:['bench'], demo:null },
  { id:'ex_overhead_tri', name:'Overhead Tricep Extension', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells'], demo:null },

  // ========== CORE ==========
  { id:'ex_plank', name:'Plank', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[], demo:null },
  { id:'ex_crunch', name:'Crunches', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[], demo:null },
  { id:'ex_leg_raise', name:'Leg Raises', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[], demo:null },
  { id:'ex_russian_twist', name:'Russian Twists', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:['dumbbell'], demo:null },
  { id:'ex_bicycle', name:'Bicycle Crunches', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[], demo:null },
  { id:'ex_hanging_leg', name:'Hanging Leg Raise', muscle:'Core', style:'bodyweight', intensity:'advanced', focus:'core', equipment:['pullup_bar'], demo:null },
  { id:'ex_pallof', name:'Pallof Press', muscle:'Core', style:'gym', intensity:'all', focus:'core', equipment:['cable','bands'], demo:null },
  { id:'ex_dead_bug', name:'Dead Bug', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[], demo:null },

  // ========== CARDIO ==========
  { id:'ex_jumping_jack', name:'Jumping Jacks', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[], demo:null },
  { id:'ex_burpee', name:'Burpees', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[], demo:null },
  { id:'ex_mountain', name:'Mountain Climbers', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[], demo:null },
  { id:'ex_high_knee', name:'High Knees', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[], demo:null },
  { id:'ex_jump_squat', name:'Jump Squats', muscle:'Cardio', style:'bodyweight', intensity:'intermediate', focus:'cardio', equipment:[], demo:null },
  { id:'ex_rowing', name:'Rowing Machine', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['rower'], demo:null },
  { id:'ex_bike', name:'Stationary Bike', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['bike'], demo:null },
  { id:'ex_skipping', name:'Jump Rope', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:['rope'], demo:null },

  // ========== PILATES ==========
  { id:'ex_hundred', name:'The Hundred', muscle:'Core', style:'pilates', intensity:'all', focus:'core', equipment:[], demo:'UaqpuUzs1i8' },
  { id:'ex_rollup', name:'Roll-Up', muscle:'Core', style:'pilates', intensity:'all', focus:'core', equipment:[], demo:'FZNwIJ03fhQ' },
  { id:'ex_leg_circle', name:'Single Leg Circle', muscle:'Legs', style:'pilates', intensity:'all', focus:'core', equipment:[], demo:'pg4WRNkbnjA' },
  { id:'ex_swan', name:'Swan Dive Prep', muscle:'Back', style:'pilates', intensity:'intermediate', focus:'pull', equipment:[], demo:null },
  { id:'ex_side_kick', name:'Side Kicks', muscle:'Legs', style:'pilates', intensity:'all', focus:'legs', equipment:[], demo:null },

  // ========== YOGA ==========
  { id:'ex_down_dog', name:'Downward Dog', muscle:'Full Body', style:'yoga', intensity:'all', focus:'core', equipment:[], demo:null },
  { id:'ex_warrior2', name:'Warrior II', muscle:'Legs', style:'yoga', intensity:'all', focus:'legs', equipment:[], demo:null },
  { id:'ex_tree', name:'Tree Pose', muscle:'Legs', style:'yoga', intensity:'all', focus:'core', equipment:[], demo:null },
  { id:'ex_chaturanga', name:'Chaturanga', muscle:'Full Body', style:'yoga', intensity:'intermediate', focus:'push', equipment:[], demo:null },
  { id:'ex_bridge', name:'Bridge Pose', muscle:'Back', style:'yoga', intensity:'all', focus:'pull', equipment:[], demo:null },
  { id:'ex_boat', name:'Boat Pose', muscle:'Core', style:'yoga', intensity:'all', focus:'core', equipment:[], demo:null },

  // ========== FULL BODY ==========
  { id:'ex_clean', name:'Dumbbell Clean', muscle:'Full Body', style:'gym', intensity:'intermediate', focus:'full_body', equipment:['dumbbells'], demo:null },
  { id:'ex_clean_press', name:'Dumbbell Clean & Press', muscle:'Full Body', style:'gym', intensity:'intermediate', focus:'full_body', equipment:['dumbbells'], demo:null },
  { id:'ex_thruster', name:'Dumbbell Thruster', muscle:'Full Body', style:'gym', intensity:'all', focus:'full_body', equipment:['dumbbells'], demo:null },
  { id:'ex_burpee_pushup', name:'Burpee with Push-Up', muscle:'Full Body', style:'bodyweight', intensity:'intermediate', focus:'full_body', equipment:[], demo:null },
  { id:'ex_tabata', name:'Tabata Circuit', muscle:'Full Body', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[], demo:null },

  // ========== GYM MACHINES (Legs) ==========
  { id:'ex_leg_press_m', name:'Leg Press Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['leg_press_machine'], demo:null },
  { id:'ex_leg_ext', name:'Leg Extension Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['leg_extension_machine'], demo:null },
  { id:'ex_leg_curl', name:'Leg Curl Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['leg_curl_machine'], demo:null },
  { id:'ex_hack_squat', name:'Hack Squat Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['hack_squat_machine'], demo:null },
  { id:'ex_hip_abductor', name:'Hip Abductor Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['hip_abductor_machine'], demo:null },
  { id:'ex_hip_adductor', name:'Hip Adductor Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['hip_adductor_machine'], demo:null },
  { id:'ex_smith_squat', name:'Smith Machine Squat', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['smith_machine'], demo:null },
  { id:'ex_chest_press_m', name:'Chest Press Machine', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['chest_press_machine'], demo:null },
  { id:'ex_pec_deck', name:'Pec Deck Machine', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['pec_deck_machine'], demo:null },
  { id:'ex_cable_fly', name:'Cable Crossover Fly', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['cable_crossover'], demo:null },
  { id:'ex_incline_chest_m', name:'Incline Chest Press Machine', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['chest_press_machine'], demo:null },
  { id:'ex_smith_incline', name:'Smith Machine Incline Press', muscle:'Chest', style:'gym', intensity:'intermediate', focus:'push', equipment:['smith_machine','bench'], demo:null },
  { id:'ex_lat_pulldown_m', name:'Lat Pulldown Machine', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['lat_pulldown_machine'], demo:null },
  { id:'ex_seated_row_m', name:'Seated Cable Row Machine', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['seated_row_machine'], demo:null },
  { id:'ex_tbar_row', name:'T-Bar Row Machine', muscle:'Back', style:'gym', intensity:'intermediate', focus:'pull', equipment:['tbar_row_machine'], demo:null },
  { id:'ex_assisted_pullup', name:'Assisted Pull-Up Machine', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['assisted_pullup_machine'], demo:null },
  { id:'ex_cable_pullover', name:'Cable Pull-Over', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['cable_crossover'], demo:null },
  { id:'ex_cable_face_pull', name:'Cable Face Pull', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['cable_crossover'], demo:null },
  { id:'ex_shoulder_press_m', name:'Shoulder Press Machine', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['shoulder_press_machine'], demo:null },
  { id:'ex_cable_lat_raise', name:'Cable Lateral Raise', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['cable_crossover'], demo:null },
  { id:'ex_rev_pec_deck', name:'Reverse Pec Deck (Rear Delt)', muscle:'Shoulders', style:'gym', intensity:'all', focus:'pull', equipment:['pec_deck_machine'], demo:null },
  { id:'ex_smith_ohp', name:'Smith Machine Overhead Press', muscle:'Shoulders', style:'gym', intensity:'intermediate', focus:'push', equipment:['smith_machine'], demo:null },
  { id:'ex_cable_bicep', name:'Cable Bicep Curl', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['cable_crossover'], demo:null },
  { id:'ex_cable_tri', name:'Cable Tricep Pushdown', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['cable_crossover'], demo:null },
  { id:'ex_preacher_m', name:'Preacher Curl Machine', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['preacher_curl_machine'], demo:null },
  { id:'ex_dip_m', name:'Assisted Dip Machine', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['assisted_dip_machine'], demo:null },
  { id:'ex_treadmill', name:'Treadmill', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['treadmill'], demo:null },
  { id:'ex_elliptical', name:'Elliptical Trainer', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['elliptical'], demo:null },
  { id:'ex_stairmaster', name:'StairMaster', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['stairmaster'], demo:null },
  { id:'ex_assault_bike', name:'Assault Bike', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['assault_bike'], demo:null },
  { id:'ex_rowing_m', name:'Rowing Machine (Erg)', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['rowing_machine'], demo:null },
  { id:'ex_cable_crunch', name:'Cable Crunch', muscle:'Core', style:'gym', intensity:'all', focus:'core', equipment:['cable_crossover'], demo:null },
  { id:'ex_cable_woodchop', name:'Cable Woodchop', muscle:'Core', style:'gym', intensity:'all', focus:'core', equipment:['cable_crossover'], demo:null },
  { id:'ex_roman_chair', name:'Roman Chair Back Extension', muscle:'Core', style:'gym', intensity:'all', focus:'pull', equipment:['roman_chair'], demo:null },
];

// Weekly focus rotation based on ISO week number
var FOCUS_ROTATION = ['push', 'pull', 'legs', 'full_body', 'core', 'push', 'pull', 'legs', 'full_body', 'cardio'];
var FOCUS_LABEL = { push:'Push 💪', pull:'Pull 🔥', legs:'Legs 🦵', core:'Core 🧠', full_body:'Full Body ⚡', cardio:'Cardio ❤️' };

// Rep schemes by goal
var GOAL_REPS = {
  strength:     { sets:[3,4,5], reps:[5,6,8], rest:[90,120,150] },
  hypertrophy:  { sets:[3,4],   reps:[10,12,15], rest:[45,60,90] },
  endurance:    { sets:[2,3],   reps:[15,20,25], rest:[30,45] },
  general:      { sets:[3],      reps:[8,12], rest:[45,60,90] }
};

// Returns ISO week number
function getISOWeek(date) {
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Pseudo-random number based on seed
function seededRandom(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Shuffle array with seed
function seededShuffle(arr, seed) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(seededRandom(seed + i) * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// Pick a random element from array with seed
function seededPick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

// Get the Monday of the current week
function getWeekStart(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0,0,0,0);
  return d;
}

// Format date as YYYY-MM-DD
function fmtDate(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// Generate a complete weekly workout plan
function generatePlan(userPrefs, options) {
  options = options || {};
  var now = options.date || new Date();
  var weekStart = getWeekStart(now);
  var weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  var isoWeek = getISOWeek(now);
  var seed = isoWeek * 1000 + (options.userSeed || 0);

  // User preferences with defaults
  var prefs = userPrefs || {};
  var goal = prefs.goal || 'general';
  var style = prefs.style || 'mixed';
  var intensity = prefs.intensity || 'intermediate';
  var daysPerWeek = Math.min(7, Math.max(1, parseInt(prefs.days_per_week)) || 5);
  var equipment = prefs.equipment || [];

  // Determine focus for this week
  var focusIdx = (isoWeek - 1) % FOCUS_ROTATION.length;
  var primaryFocus = FOCUS_ROTATION[focusIdx];
  var secondaryFocus = FOCUS_ROTATION[(focusIdx + 1) % FOCUS_ROTATION.length];

  // Decide day split based on goal and days
  var dayMap = assignDays(daysPerWeek, primaryFocus, secondaryFocus, seed);

  // Filter exercises
  var available = filterExercises(style, intensity, equipment, primaryFocus, secondaryFocus);

  // Build plan
  var plan = {};
  var DAY_NAMES = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  dayMap.forEach(function(assign, idx) {
    var dayName = DAY_NAMES[idx];
    if (!assign) { plan[dayName] = []; return; }

    var focus = assign.focus;
    var daySeed = seed + idx * 100;

    var dayExercises = available.filter(function(ex) {
      return ex.focus === focus || ex.focus === 'full_body';
    });

    if (dayExercises.length < 3) {
      dayExercises = available.filter(function(ex) {
        return ex.focus === focus || ex.focus === 'full_body' || ex.focus === 'core';
      });
    }

    dayExercises = seededShuffle(dayExercises, daySeed);

    // Select 4-6 exercises per day
    var count = Math.min(6, Math.max(3, dayExercises.length));
    var selected = dayExercises.slice(0, count);

    var repScheme = GOAL_REPS[goal] || GOAL_REPS.general;

    plan[dayName] = selected.map(function(ex, ei) {
      var eqLabels = ex.equipment.map(function(eq) { return getEquipmentLabel(eq); });
      return {
        id: ex.id + '_' + idx + '_' + ei,
        name: ex.name,
        muscle: ex.muscle,
        sets: seededPick(repScheme.sets, daySeed + ei * 7),
        reps: seededPick(repScheme.reps, daySeed + ei * 13 + 3),
        rest: seededPick(repScheme.rest, daySeed + ei * 5 + 1),
        equipment: eqLabels,
        demo: ex.demo
      };
    });
  });

  return {
    week_start: fmtDate(weekStart),
    week_end: fmtDate(weekEnd),
    iso_week: isoWeek,
    focus: primaryFocus,
    focus_label: FOCUS_LABEL[primaryFocus],
    generated_at: new Date().toISOString(),
    plan: plan,
    preferences: prefs
  };
}

function assignDays(days, primaryFocus, secondaryFocus, seed) {
  var FOCUS_SPLITS = {
    push:       { A:'push', B:'core' },
    pull:       { A:'pull', B:'core' },
    legs:       { A:'legs', B:'push' },
    full_body:  { A:'full_body', B:'core' },
    core:       { A:'core', B:'full_body' },
    cardio:     { A:'cardio', B:'full_body' }
  };

  var split = FOCUS_SPLITS[primaryFocus] || { A:primaryFocus, B:secondaryFocus };

  var map = [];
  for (var i = 0; i < 7; i++) {
    map.push(null);
  }

  var patterns = {
    3: [0,2,4],           // Mon, Wed, Fri
    4: [0,1,3,5],         // Mon, Tue, Thu, Sat
    5: [0,1,2,4,5],       // Mon, Tue, Wed, Fri, Sat
    6: [0,1,2,3,4,5],     // Mon-Fri + Sat
    7: [0,1,2,3,4,5,6]    // All week
  };

  var slots = patterns[days] || patterns[5];
  var focusCycle = [split.A, split.B, split.A, split.B, split.A, split.B, split.A];
  var shuffledCycle = seededShuffle(focusCycle, seed);

  slots.forEach(function(slot, si) {
    map[slot] = { focus: shuffledCycle[si % shuffledCycle.length] };
  });

  return map;
}

function filterExercises(style, intensity, equipment, primaryFocus, secondaryFocus) {
  var matches = EXERCISES.filter(function(ex) {
    // Style filter
    if (style === 'gym' && ex.style !== 'gym') return false;
    if (style === 'bodyweight' && ex.style !== 'bodyweight') return false;
    if (style === 'pilates' && ex.style !== 'pilates') return false;
    if (style === 'yoga' && ex.style !== 'yoga') return false;

    // Intensity filter
    if (intensity === 'beginner' && ex.intensity === 'advanced') return false;
    if (intensity === 'intermediate' && ex.intensity === 'advanced') return false;

    // Equipment filter
    if (ex.equipment.length > 0 && style === 'gym') {
      // For gym style, check if user has the equipment
      if (equipment.length > 0) {
        var hasAll = ex.equipment.every(function(eq) {
          return equipment.indexOf(eq) >= 0;
        });
        if (!hasAll) return false;
      }
    }

    return true;
  });

  if (matches.length < 10) {
    // Fallback: include everything matching intensity and primary focus
    matches = EXERCISES.filter(function(ex) {
      if (intensity === 'beginner' && ex.intensity === 'advanced') return false;
      return true;
    });
  }

  return matches;
}

var EQUIPMENT_LABELS = {
  barbell: 'Barbell', bench: 'Bench', dumbbells: 'Dumbbells', squat_rack: 'Squat Rack',
  cable: 'Cable Machine', bands: 'Resistance Bands', pullup_bar: 'Pull-Up Bar',
  dip_bars: 'Dip Bars', ez_bar: 'EZ Bar', rower: 'Rowing Machine', bike: 'Stationary Bike',
  rope: 'Jump Rope', kettlebell: 'Kettlebell', leg_press: 'Leg Press Machine',
  leg_press_machine: 'Leg Press Machine', leg_extension_machine: 'Leg Extension Machine',
  leg_curl_machine: 'Leg Curl Machine', hack_squat_machine: 'Hack Squat Machine',
  hip_abductor_machine: 'Hip Abductor Machine', hip_adductor_machine: 'Hip Adductor Machine',
  smith_machine: 'Smith Machine', chest_press_machine: 'Chest Press Machine',
  pec_deck_machine: 'Pec Deck Machine', cable_crossover: 'Cable Crossover',
  lat_pulldown_machine: 'Lat Pulldown Machine', seated_row_machine: 'Seated Row Machine',
  tbar_row_machine: 'T-Bar Row Machine', assisted_pullup_machine: 'Assisted Pull-Up Machine',
  shoulder_press_machine: 'Shoulder Press Machine', preacher_curl_machine: 'Preacher Curl Machine',
  assisted_dip_machine: 'Assisted Dip Machine', treadmill: 'Treadmill',
  elliptical: 'Elliptical Trainer', stairmaster: 'StairMaster', assault_bike: 'Assault Bike',
  rowing_machine: 'Rowing Machine', roman_chair: 'Roman Chair', box: 'Box', bench_box: 'Bench'
};

// Add equipment label helper
function getEquipmentLabel(eq) { return EQUIPMENT_LABELS[eq] || eq; }

module.exports = { generatePlan, EXERCISES, FOCUS_ROTATION, FOCUS_LABEL, getEquipmentLabel };
