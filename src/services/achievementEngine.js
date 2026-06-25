// src/services/achievementEngine.js
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore"; 
import { db } from "../api/firebase";

const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const getDaysDiff = (d1, d2) => Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));

export const checkAndUnlockAchievements = async (userId, sessionData) => {
  if (!userId) return [];

  const userRef = doc(db, "users", userId);
  try {
    const userSnap = await getDoc(userRef);
    
    // 🚨 阻断点 1 修复：不要使用 if (!userSnap.exists()) return []; 
    // 如果是新用户或者 users 表还没初始化该 uid 的文档，直接返回 [] 会导致后面永远无法创建该用户的成就记录。
    const userData = userSnap.exists() ? userSnap.data() : {}; 
    
    const currentUnlocked = userData.unlockedAchievements || [];
    const newlyUnlocked = [];
    const { duration, isPomodoro, timerMode, startTime, endTime } = sessionData;

    // -----------------------------------------------------
    // 1. 状态计算与更新 (State Calculations)
    // -----------------------------------------------------
    const newTotalMinutes = (userData.totalFocusMinutes || 0) + duration;
    const newPomodoroCount = (userData.pomodoroCount || 0) + (isPomodoro ? 1 : 0);
    
    // 🚨 阻断点 2 修复：极其防御性的日期对象转换 (Defensive Parsing)
    // Firestore 在某些本地缓存或特定序列化场景下，userData.lastStudyDate 并不带 .toDate() 方法。
    // 如果直接调用 .toDate() 会引发 TypeError 导致整个 try 块中断。
    let lastDate = null;
    if (userData.lastStudyDate) {
      lastDate = typeof userData.lastStudyDate.toDate === 'function' 
        ? userData.lastStudyDate.toDate() 
        : new Date(userData.lastStudyDate);
    }

    let newStreak = userData.currentStreak || 0;
    let newTodayMinutes = userData.todayStudyMinutes || 0;
    const isReturning = lastDate && getDaysDiff(lastDate, endTime) >= 7;

    if (!lastDate) {
      newStreak = 1;
      newTodayMinutes = duration;
    } else if (isSameDay(lastDate, endTime)) {
      newTodayMinutes += duration;
    } else if (getDaysDiff(lastDate, endTime) === 1) {
      newStreak += 1; 
      newTodayMinutes = duration;
    } else {
      newStreak = 1; 
      newTodayMinutes = duration;
    }

    const usedCountdown = userData.hasUsedCountdown || timerMode === "countdown";
    const usedCountup = userData.hasUsedCountup || timerMode === "countup";

    // -----------------------------------------------------
    // 2. 核心判定规则引擎 (Evaluation Rules Engine)
    // -----------------------------------------------------
    const unlock = (id) => { if (!currentUnlocked.includes(id)) newlyUnlocked.push(id); };
    const totalHours = newTotalMinutes / 60;
    const todayHours = newTodayMinutes / 60;

    // 📚 Libraries (Total)
    if (totalHours >= 1) unlock("lib_1");
    if (totalHours >= 10) unlock("lib_10");
    if (totalHours >= 50) unlock("lib_50");
    if (totalHours >= 100) unlock("lib_100");
    if (totalHours >= 500) unlock("lib_500");

    // 🏰 Halls (Single) —— 你的 10min 和 11min 会完美命中这里
    if (duration >= 10) unlock("hall_10m");
    if (duration >= 30) unlock("hall_30m");
    if ((duration / 60) >= 1) unlock("hall_1h");
    if ((duration / 60) >= 2) unlock("hall_2h");
    if ((duration / 60) >= 5) unlock("hall_5h");
    if ((duration / 60) >= 8) unlock("hall_8h");

    // 🎓 Colleges (Pomodoro)
    if (newPomodoroCount >= 1) unlock("col_1");
    if (newPomodoroCount >= 3) unlock("col_3");
    if (newPomodoroCount >= 5) unlock("col_5");
    if (newPomodoroCount >= 10) unlock("col_10");
    if (newPomodoroCount >= 20) unlock("col_20");

    // 👻 Hidden Achievements (隐藏成就)
    if (usedCountdown && usedCountup) unlock("hide_freshman");
    if (newStreak >= 7) unlock("hide_final_week");
    if (totalHours >= 500) unlock("hide_cap_5");
    if (isReturning) unlock("hide_welcome_back");
    if (todayHours >= 10) unlock("hide_nice_break");

    // 安全解析时间窗逻辑
    if (startTime && typeof startTime.getHours === 'function') {
      const startHour = startTime.getHours();
      if ((duration / 60) >= 2 && (startHour >= 0 && startHour < 4)) unlock("hide_night_owl");
      if ((duration / 60) >= 1 && (startHour >= 4 && startHour < 7)) unlock("hide_early_bird");
    }

    // -----------------------------------------------------
    // 3. 将最新状态推回 Firebase
    // -----------------------------------------------------
    const updatePayload = {
      totalFocusMinutes: newTotalMinutes,
      pomodoroCount: newPomodoroCount,
      lastStudyDate: endTime, 
      currentStreak: newStreak,
      todayStudyMinutes: newTodayMinutes,
      hasUsedCountdown: usedCountdown,
      hasUsedCountup: usedCountup
    };

    if (newlyUnlocked.length > 0) {
      updatePayload.unlockedAchievements = arrayUnion(...newlyUnlocked);
    }
    
    // 强制使用 setDoc + merge 确保万无一失
    await setDoc(userRef, updatePayload, { merge: true });

    return newlyUnlocked; 
  } catch (error) {
    // 🚨 核心新增：安装“探头”，如果发生任何意外，控制台会立刻打印出具体的报错行和原因！
    console.error("🚨 Achievement Engine Critical Error:", error);
    return [];
  }
};