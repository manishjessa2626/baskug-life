// Client-side workout plan generator (works offline, no auth needed)

var WP_EXERCISES = [
  { id:'wp_bench', name:'Barbell Bench Press', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['barbell','bench'] },
  { id:'wp_dumb_bench', name:'Dumbbell Bench Press', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','bench'] },
  { id:'wp_incline', name:'Incline Dumbbell Press', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','bench'] },
  { id:'wp_pushup', name:'Push-Ups', muscle:'Chest', style:'bodyweight', intensity:'all', focus:'push', equipment:[] },
  { id:'wp_decline_push', name:'Decline Push-Ups', muscle:'Chest', style:'bodyweight', intensity:'intermediate', focus:'push', equipment:[] },
  { id:'wp_chest_fly', name:'Dumbbell Chest Fly', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','bench'] },
  { id:'wp_wide_pushup', name:'Wide Push-Ups', muscle:'Chest', style:'bodyweight', intensity:'all', focus:'push', equipment:[] },
  { id:'wp_ohp', name:'Overhead Press', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['barbell','dumbbells'] },
  { id:'wp_lat_raise', name:'Dumbbell Lateral Raise', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells'] },
  { id:'wp_front_raise', name:'Dumbbell Front Raise', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells'] },
  { id:'wp_pike', name:'Pike Push-Ups', muscle:'Shoulders', style:'bodyweight', intensity:'intermediate', focus:'push', equipment:[] },
  { id:'wp_arnold', name:'Arnold Press', muscle:'Shoulders', style:'gym', intensity:'intermediate', focus:'push', equipment:['dumbbells'] },
  { id:'wp_shrug', name:'Dumbbell Shrugs', muscle:'Shoulders', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells'] },
  { id:'wp_deadlift', name:'Deadlift', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['barbell'] },
  { id:'wp_row', name:'Barbell Row', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['barbell'] },
  { id:'wp_dumb_row', name:'Dumbbell Row', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells','bench'] },
  { id:'wp_pullup', name:'Pull-Ups', muscle:'Back', style:'bodyweight', intensity:'all', focus:'pull', equipment:['pullup_bar'] },
  { id:'wp_chinup', name:'Chin-Ups', muscle:'Back', style:'bodyweight', intensity:'all', focus:'pull', equipment:['pullup_bar'] },
  { id:'wp_superman', name:'Superman Hold', muscle:'Back', style:'bodyweight', intensity:'all', focus:'pull', equipment:[] },
  { id:'wp_squat', name:'Barbell Back Squat', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['barbell','squat_rack'] },
  { id:'wp_goblet', name:'Goblet Squat', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['dumbbell','kettlebell'] },
  { id:'wp_lunge', name:'Walking Lunges', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:[] },
  { id:'wp_bulgarian', name:'Bulgarian Split Squat', muscle:'Legs', style:'gym', intensity:'intermediate', focus:'legs', equipment:['dumbbells','bench'] },
  { id:'wp_rdl', name:'Romanian Deadlift', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['dumbbells','barbell'] },
  { id:'wp_calf_raise', name:'Standing Calf Raise', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['dumbbells'] },
  { id:'wp_body_squat', name:'Bodyweight Squats', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:[] },
  { id:'wp_glute_bridge', name:'Glute Bridge', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:[] },
  { id:'wp_stepup', name:'Step-Ups', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:['bench','box'] },
  { id:'wp_wall_sit', name:'Wall Sit', muscle:'Legs', style:'bodyweight', intensity:'all', focus:'legs', equipment:[] },
  { id:'wp_bicep_curl', name:'Dumbbell Bicep Curl', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells'] },
  { id:'wp_hammer', name:'Hammer Curl', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['dumbbells'] },
  { id:'wp_skull', name:'Skull Crushers', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells','ez_bar','bench'] },
  { id:'wp_tri_pushdown', name:'Tricep Pushdown', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['cable','bands'] },
  { id:'wp_diamond', name:'Diamond Push-Ups', muscle:'Arms', style:'bodyweight', intensity:'all', focus:'push', equipment:[] },
  { id:'wp_bench_dip', name:'Bench Dips', muscle:'Arms', style:'bodyweight', intensity:'all', focus:'push', equipment:['bench'] },
  { id:'wp_overhead_tri', name:'Overhead Tricep Extension', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['dumbbells'] },
  { id:'wp_plank', name:'Plank', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_crunch', name:'Crunches', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_leg_raise', name:'Leg Raises', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_russian_twist', name:'Russian Twists', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:['dumbbell'] },
  { id:'wp_bicycle', name:'Bicycle Crunches', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_dead_bug', name:'Dead Bug', muscle:'Core', style:'bodyweight', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_jumping_jack', name:'Jumping Jacks', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[] },
  { id:'wp_burpee', name:'Burpees', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[] },
  { id:'wp_mountain', name:'Mountain Climbers', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[] },
  { id:'wp_high_knee', name:'High Knees', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[] },
  { id:'wp_jump_squat', name:'Jump Squats', muscle:'Cardio', style:'bodyweight', intensity:'intermediate', focus:'cardio', equipment:[] },
  { id:'wp_skipping', name:'Jump Rope', muscle:'Cardio', style:'bodyweight', intensity:'all', focus:'cardio', equipment:['rope'] },
  { id:'wp_tabata', name:'Tabata Circuit', muscle:'Full Body', style:'bodyweight', intensity:'all', focus:'cardio', equipment:[] },
  { id:'wp_thruster', name:'Dumbbell Thruster', muscle:'Full Body', style:'gym', intensity:'all', focus:'full_body', equipment:['dumbbells'] },
  { id:'wp_clean', name:'Dumbbell Clean', muscle:'Full Body', style:'gym', intensity:'intermediate', focus:'full_body', equipment:['dumbbells'] },
  { id:'wp_clean_press', name:'Dumbbell Clean & Press', muscle:'Full Body', style:'gym', intensity:'intermediate', focus:'full_body', equipment:['dumbbells'] },
  { id:'wp_burpee_pushup', name:'Burpee with Push-Up', muscle:'Full Body', style:'bodyweight', intensity:'intermediate', focus:'full_body', equipment:[] },
  { id:'wp_hundred', name:'The Hundred', muscle:'Core', style:'pilates', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_rollup', name:'Roll-Up', muscle:'Core', style:'pilates', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_leg_circle', name:'Single Leg Circle', muscle:'Legs', style:'pilates', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_swan', name:'Swan Dive Prep', muscle:'Back', style:'pilates', intensity:'intermediate', focus:'pull', equipment:[] },
  { id:'wp_side_kick', name:'Side Kicks', muscle:'Legs', style:'pilates', intensity:'all', focus:'legs', equipment:[] },
  { id:'wp_down_dog', name:'Downward Dog', muscle:'Full Body', style:'yoga', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_warrior2', name:'Warrior II', muscle:'Legs', style:'yoga', intensity:'all', focus:'legs', equipment:[] },
  { id:'wp_tree', name:'Tree Pose', muscle:'Legs', style:'yoga', intensity:'all', focus:'core', equipment:[] },
  { id:'wp_chaturanga', name:'Chaturanga', muscle:'Full Body', style:'yoga', intensity:'intermediate', focus:'push', equipment:[] },
  { id:'wp_bridge', name:'Bridge Pose', muscle:'Back', style:'yoga', intensity:'all', focus:'pull', equipment:[] },
  { id:'wp_boat', name:'Boat Pose', muscle:'Core', style:'yoga', intensity:'all', focus:'core', equipment:[] },

  // ========== GYM MACHINES ==========
  { id:'wp_leg_press_m', name:'Leg Press Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['Leg Press Machine'] },
  { id:'wp_leg_ext', name:'Leg Extension Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['Leg Extension Machine'] },
  { id:'wp_leg_curl', name:'Leg Curl Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['Leg Curl Machine'] },
  { id:'wp_hack_squat', name:'Hack Squat Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['Hack Squat Machine'] },
  { id:'wp_hip_abductor', name:'Hip Abductor Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['Hip Abductor Machine'] },
  { id:'wp_hip_adductor', name:'Hip Adductor Machine', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['Hip Adductor Machine'] },
  { id:'wp_smith_squat', name:'Smith Machine Squat', muscle:'Legs', style:'gym', intensity:'all', focus:'legs', equipment:['Smith Machine'] },
  { id:'wp_chest_press_m', name:'Chest Press Machine', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['Chest Press Machine'] },
  { id:'wp_pec_deck', name:'Pec Deck Machine', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['Pec Deck Machine'] },
  { id:'wp_cable_fly', name:'Cable Crossover Fly', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['Cable Crossover'] },
  { id:'wp_incline_chest_m', name:'Incline Chest Press Machine', muscle:'Chest', style:'gym', intensity:'all', focus:'push', equipment:['Chest Press Machine'] },
  { id:'wp_smith_incline', name:'Smith Machine Incline Press', muscle:'Chest', style:'gym', intensity:'intermediate', focus:'push', equipment:['Smith Machine'] },
  { id:'wp_lat_pulldown_m', name:'Lat Pulldown Machine', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['Lat Pulldown Machine'] },
  { id:'wp_seated_row_m', name:'Seated Cable Row Machine', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['Seated Row Machine'] },
  { id:'wp_tbar_row', name:'T-Bar Row Machine', muscle:'Back', style:'gym', intensity:'intermediate', focus:'pull', equipment:['T-Bar Row Machine'] },
  { id:'wp_assisted_pullup', name:'Assisted Pull-Up Machine', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['Assisted Pull-Up Machine'] },
  { id:'wp_cable_pullover', name:'Cable Pull-Over', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['Cable Crossover'] },
  { id:'wp_cable_face_pull', name:'Cable Face Pull', muscle:'Back', style:'gym', intensity:'all', focus:'pull', equipment:['Cable Crossover'] },
  { id:'wp_shoulder_press_m', name:'Shoulder Press Machine', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['Shoulder Press Machine'] },
  { id:'wp_cable_lat_raise', name:'Cable Lateral Raise', muscle:'Shoulders', style:'gym', intensity:'all', focus:'push', equipment:['Cable Crossover'] },
  { id:'wp_rev_pec_deck', name:'Reverse Pec Deck (Rear Delt)', muscle:'Shoulders', style:'gym', intensity:'all', focus:'pull', equipment:['Pec Deck Machine'] },
  { id:'wp_smith_ohp', name:'Smith Machine Overhead Press', muscle:'Shoulders', style:'gym', intensity:'intermediate', focus:'push', equipment:['Smith Machine'] },
  { id:'wp_cable_bicep', name:'Cable Bicep Curl', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['Cable Crossover'] },
  { id:'wp_cable_tri', name:'Cable Tricep Pushdown', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['Cable Crossover'] },
  { id:'wp_preacher_m', name:'Preacher Curl Machine', muscle:'Arms', style:'gym', intensity:'all', focus:'pull', equipment:['Preacher Curl Machine'] },
  { id:'wp_dip_m', name:'Assisted Dip Machine', muscle:'Arms', style:'gym', intensity:'all', focus:'push', equipment:['Assisted Dip Machine'] },
  { id:'wp_treadmill', name:'Treadmill', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['Treadmill'] },
  { id:'wp_elliptical', name:'Elliptical Trainer', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['Elliptical'] },
  { id:'wp_stairmaster', name:'StairMaster', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['StairMaster'] },
  { id:'wp_assault_bike', name:'Assault Bike', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['Assault Bike'] },
  { id:'wp_rowing_m', name:'Rowing Machine (Erg)', muscle:'Cardio', style:'gym', intensity:'all', focus:'cardio', equipment:['Rowing Machine'] },
  { id:'wp_cable_crunch', name:'Cable Crunch', muscle:'Core', style:'gym', intensity:'all', focus:'core', equipment:['Cable Crossover'] },
  { id:'wp_cable_woodchop', name:'Cable Woodchop', muscle:'Core', style:'gym', intensity:'all', focus:'core', equipment:['Cable Crossover'] },
  { id:'wp_roman_chair', name:'Roman Chair Back Extension', muscle:'Core', style:'gym', intensity:'all', focus:'pull', equipment:['Roman Chair'] },
];

var WP_FOCUS_ROTATION = ['push', 'pull', 'legs', 'full_body', 'core', 'push', 'pull', 'legs', 'full_body', 'cardio'];
var WP_FOCUS_LABEL = { push:'Push 💪', pull:'Pull 🔥', legs:'Legs 🦵', core:'Core 🧠', full_body:'Full Body ⚡', cardio:'Cardio ❤️' };

var WP_GOAL_REPS = {
  strength:     { sets:[3,4,5], reps:[5,6,8], rest:[90,120,150] },
  hypertrophy:  { sets:[3,4],   reps:[10,12,15], rest:[45,60,90] },
  endurance:    { sets:[2,3],   reps:[15,20,25], rest:[30,45] },
  general:      { sets:[3],      reps:[8,12], rest:[45,60,90] }
};

function wpGetISOWeek(date) {
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function wpSeededRandom(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function wpSeededShuffle(arr, seed) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(wpSeededRandom(seed + i) * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function wpSeededPick(arr, seed) {
  return arr[Math.floor(wpSeededRandom(seed) * arr.length)];
}

function wpGetWeekStart(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0,0,0,0);
  return d;
}

function wpFmtDate(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function wpGeneratePlan(prefs, schedule) {
  prefs = prefs || {};
  schedule = schedule || {};
  var now = new Date();
  var weekStart = wpGetWeekStart(now);
  var weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  var isoWeek = wpGetISOWeek(now);
  var seed = isoWeek * 1000;

  var goal = prefs.goal || 'general';
  var globalIntensity = prefs.intensity || 'intermediate';
  var focusIdx = (isoWeek - 1) % WP_FOCUS_ROTATION.length;
  var primaryFocus = WP_FOCUS_ROTATION[focusIdx];

  var DAY_NAMES = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  var plan = {};

  DAY_NAMES.forEach(function(dayName, idx) {
    var dayCfg = schedule[dayName] || { active: false, style: 'mixed' };
    if (!dayCfg.active) { plan[dayName] = []; return; }

    var dayStyle = dayCfg.style || 'mixed';
    var dayIntensity = dayCfg.intensity || globalIntensity;
    var daySeed = seed + idx * 100 + (isoWeek * 7);

    // For home style, rotate through balanced focuses
    var homeFocuses = ['core', 'full_body', 'push', 'pull', 'legs'];
    var dayFocus = dayCfg.focus || homeFocuses[(focusIdx + idx) % homeFocuses.length];

    if (dayStyle === 'home') {
      dayFocus = homeFocuses[(focusIdx + idx) % homeFocuses.length];
    }

    var dayExercises = wpFilterExercises(dayStyle, dayIntensity).filter(function(ex) {
      return ex.focus === dayFocus || ex.focus === 'full_body';
    });

    if (dayExercises.length < 3) {
      dayExercises = wpFilterExercises(dayStyle, dayIntensity).filter(function(ex) {
        return ex.focus === dayFocus || ex.focus === 'full_body' || ex.focus === 'core';
      });
    }

    if (dayExercises.length < 3) {
      dayExercises = wpFilterExercises('mixed', dayIntensity);
    }

    dayExercises = wpSeededShuffle(dayExercises, daySeed);
    var count = Math.min(6, Math.max(3, dayExercises.length));
    var selected = dayExercises.slice(0, count);
    var repScheme = WP_GOAL_REPS[goal] || WP_GOAL_REPS.general;

    plan[dayName] = selected.map(function(ex, ei) {
      return {
        id: ex.id + '_' + idx + '_' + ei,
        name: ex.name,
        muscle: ex.muscle,
        sets: wpSeededPick(repScheme.sets, daySeed + ei * 7),
        reps: wpSeededPick(repScheme.reps, daySeed + ei * 13 + 3),
        rest: wpSeededPick(repScheme.rest, daySeed + ei * 5 + 1),
        equipment: ex.equipment,
      };
    });
  });

  return {
    week_start: wpFmtDate(weekStart),
    week_end: wpFmtDate(weekEnd),
    iso_week: isoWeek,
    focus: primaryFocus,
    focus_label: WP_FOCUS_LABEL[primaryFocus] || primaryFocus,
    generated_at: new Date().toISOString(),
    plan: plan,
    preferences: prefs,
    schedule: schedule
  };
}

function wpFilterExercises(style, intensity) {
  return WP_EXERCISES.filter(function(ex) {
    // Home style: bodyweight, pilates, yoga, or exercises with home-friendly equipment
    if (style === 'home') {
      var homeOk = ex.style === 'bodyweight' || ex.style === 'pilates' || ex.style === 'yoga';
      if (!homeOk && ex.style === 'gym') {
        homeOk = ex.equipment.every(function(eq) {
          return ['Dumbbells','Resistance Bands','Jump Rope','Mat','Chair','Box','Bench'].indexOf(eq) >= 0;
        });
      }
      if (!homeOk) return false;
    } else {
      if (style === 'gym' && ex.style !== 'gym') return false;
      if (style === 'bodyweight' && ex.style !== 'bodyweight') return false;
      if (style === 'pilates' && ex.style !== 'pilates') return false;
      if (style === 'yoga' && ex.style !== 'yoga') return false;
    }
    if (intensity === 'beginner' && ex.intensity === 'advanced') return false;
    if (intensity === 'intermediate' && ex.intensity === 'advanced') return false;
    return true;
  });
}

// Generate with per-day style schedule
function wpGeneratePlanWithSchedule(prefs, schedule) {
  prefs = prefs || {};
  schedule = schedule || {};
  var now = new Date();
  var weekStart = wpGetWeekStart(now);
  var weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  var isoWeek = wpGetISOWeek(now);
  var seed = isoWeek * 1000;

  var goal = prefs.goal || 'general';
  var globalIntensity = prefs.intensity || 'intermediate';
  var focusIdx = (isoWeek - 1) % WP_FOCUS_ROTATION.length;
  var primaryFocus = WP_FOCUS_ROTATION[focusIdx];

  var DAY_NAMES = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  var plan = {};

  DAY_NAMES.forEach(function(dayName, idx) {
    var dayCfg = schedule[dayName] || { active: false, style: 'mixed' };
    if (!dayCfg.active) { plan[dayName] = []; return; }

    var dayStyle = dayCfg.style || 'mixed';
    var dayIntensity = dayCfg.intensity || globalIntensity;
    var dayFocus = dayCfg.focus || primaryFocus;
    var daySeed = seed + idx * 100 + (isoWeek * 7);

    // For home style, use core/full_body/cardio focus more often
    if (dayStyle === 'home') {
      var homeFocuses = ['core', 'full_body', 'push', 'pull', 'legs'];
      dayFocus = homeFocuses[(focusIdx + idx) % homeFocuses.length];
    }

    var dayExercises = wpFilterExercises(dayStyle, dayIntensity).filter(function(ex) {
      return ex.focus === dayFocus || ex.focus === 'full_body';
    });

    if (dayExercises.length < 3) {
      dayExercises = wpFilterExercises(dayStyle, dayIntensity).filter(function(ex) {
        return ex.focus === dayFocus || ex.focus === 'full_body' || ex.focus === 'core';
      });
    }

    if (dayExercises.length < 3) {
      dayExercises = wpFilterExercises('mixed', dayIntensity);
    }

    dayExercises = wpSeededShuffle(dayExercises, daySeed);
    var count = Math.min(6, Math.max(3, dayExercises.length));
    var selected = dayExercises.slice(0, count);
    var repScheme = WP_GOAL_REPS[goal] || WP_GOAL_REPS.general;

    plan[dayName] = selected.map(function(ex, ei) {
      return {
        id: ex.id + '_' + idx + '_' + ei,
        name: ex.name,
        muscle: ex.muscle,
        sets: wpSeededPick(repScheme.sets, daySeed + ei * 7),
        reps: wpSeededPick(repScheme.reps, daySeed + ei * 13 + 3),
        rest: wpSeededPick(repScheme.rest, daySeed + ei * 5 + 1),
        equipment: ex.equipment,
      };
    });
  });

  return {
    week_start: wpFmtDate(weekStart),
    week_end: wpFmtDate(weekEnd),
    iso_week: isoWeek,
    focus: primaryFocus,
    generated_at: new Date().toISOString(),
    plan: plan,
    preferences: prefs,
    schedule: schedule
  };
}
