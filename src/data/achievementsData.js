// src/data/achievementsData.js

export const achievementsData = [
  // -----------------------------------------------------
  // 📚 Libraries (Total Study Time)
  // -----------------------------------------------------
  { id: "lib_1", type: "total_time", requirement: 1, title: "Medicine and Science Library", description: "Total study time reached 1 hour.", icon: "/achievements/med-sci-lib.png" },
  { id: "lib_10", type: "total_time", requirement: 10, title: "Wan Boo Sow Chinese Library", description: "Total study time reached 10 hours.", icon: "/achievements/chinese-lib.png" },
  { id: "lib_50", type: "total_time", requirement: 50, title: "Hon Sui Sen Memorial Library", description: "Total study time reached 50 hours.", icon: "/achievements/hss-lib.png" },
  { id: "lib_100", type: "total_time", requirement: 100, title: "C J Koh Law Library", description: "Total study time reached 100 hours.", icon: "/achievements/law-lib.png" },
  { id: "lib_500", type: "total_time", requirement: 500, title: "Central Library", description: "Total study time reached 500 hours. A true scholar!", icon: "/achievements/central-lib.png" },

  // -----------------------------------------------------
  // 🏰 Halls (Single Session Duration)
  // -----------------------------------------------------
  { id: "hall_10m", type: "single_time", requirement: 10/60, title: "Sheares Hall", description: "Focused for 10 mins in a single session.", icon: "/achievements/sheares.png" },
  { id: "hall_30m", type: "single_time", requirement: 30/60, title: "King Edward VII Hall", description: "Focused for 30 mins in a single session.", icon: "/achievements/ke7.png" },
  { id: "hall_1h", type: "single_time", requirement: 1, title: "Eusoff Hall", description: "Focused for 1 hour in a single session.", icon: "/achievements/eusoff.png" },
  { id: "hall_2h", type: "single_time", requirement: 2, title: "Raffles Hall", description: "Focused for 2 hours in a single session.", icon: "/achievements/raffles.png" },
  { id: "hall_5h", type: "single_time", requirement: 5, title: "Kent Ridge Hall", description: "Focused for 5 hours in a single session.", icon: "/achievements/kent-ridge.png" },
  { id: "hall_8h", type: "single_time", requirement: 8, title: "Temasek Hall", description: "Focused for 8 hours in a single session.", icon: "/achievements/temasek.png" },

  // -----------------------------------------------------
  // 🏠 Houses (Tasks in Single Session)
  // -----------------------------------------------------
  { id: "house_1", type: "single_tasks", requirement: 1, title: "Pioneer House", description: "Completed 1 task in a single session.", icon: "/achievements/pioneer.png" },
  { id: "house_3", type: "single_tasks", requirement: 3, title: "LightHouse", description: "Completed 3 tasks in a single session.", icon: "/achievements/lighthouse.png" },
  { id: "house_5", type: "single_tasks", requirement: 5, title: "Helix House", description: "Completed 5 tasks in a single session.", icon: "/achievements/helix.png" },
  { id: "house_10", type: "single_tasks", requirement: 10, title: "Valour House", description: "Completed 10 tasks in a single session.", icon: "/achievements/valour.png" },

  // -----------------------------------------------------
  // 🎓 Colleges (Pomodoro Count)
  // -----------------------------------------------------
  { id: "col_1", type: "pomodoro", requirement: 1, title: "Tembusu College", description: "Completed 1 Pomodoro session.", icon: "/achievements/tembusu.png" },
  { id: "col_3", type: "pomodoro", requirement: 3, title: "CAPT", description: "Completed 3 Pomodoro sessions.", icon: "/achievements/capt.png" },
  { id: "col_5", type: "pomodoro", requirement: 5, title: "RVRC", description: "Completed 5 Pomodoro sessions.", icon: "/achievements/rvrc.png" },
  { id: "col_10", type: "pomodoro", requirement: 10, title: "RC4", description: "Completed 10 Pomodoro sessions.", icon: "/achievements/rc4.png" },
  { id: "col_20", type: "pomodoro", requirement: 20, title: "Acacia College", description: "Completed 20 Pomodoro sessions.", icon: "/achievements/acacia.png" },

  // -----------------------------------------------------
  // 👻 Hidden Achievements (隐藏成就)
  // -----------------------------------------------------
  { id: "hide_freshman", type: "hidden", isHidden: true, title: "Freshman", description: "Completed at least one countup and one countdown session.", icon: "/achievements/freshman.png" },
  { id: "hide_final_week", type: "hidden", isHidden: true, title: "Final Week", description: "Studied for 7 consecutive days.", icon: "/achievements/final-week.png" },
  { id: "hide_night_owl", type: "hidden", isHidden: true, title: "Night Owl", description: "Studied for 2 hours between 12 AM and 4 AM.", icon: "/achievements/night-owl.png" },
  { id: "hide_early_bird", type: "hidden", isHidden: true, title: "Early Bird", description: "Studied for 1 hour between 4 AM and 7 AM.", icon: "/achievements/early-bird.png" },
  { id: "hide_cap_5", type: "hidden", isHidden: true, title: "CAP 5.0", description: "Accumulated 500 hours of total study time.", icon: "/achievements/cap-5.png" },
  { id: "hide_welcome_back", type: "hidden", isHidden: true, title: "Welcome Back", description: "Returned to study after a 1-week break.", icon: "/achievements/welcome-back.png" },
  { id: "hide_nice_break", type: "hidden", isHidden: true, title: "Nice to Have a Break", description: "Accumulated 10 hours of study in a single day.", icon: "/achievements/nice-break.png" },
];