import { useState } from 'react';
import styles from './StudyStats.module.css'; // 请确保路径正确

function StudyStats() {
  // 1. 下拉菜单状态 (Dropdown State)
  const [timeframe, setTimeframe] = useState("today");

  // 2. 模拟数据联动 (Mock Data Mapping)
  const statsData = {
    today: { focusTime: "2.5h", sessions: 4, streak: "1 day", tasks: 3 },
    week: { focusTime: "18h", sessions: 28, streak: "5 days", tasks: 15 },
    month: { focusTime: "65h", sessions: 110, streak: "12 days", tasks: 62 },
    year: { focusTime: "420h", sessions: 730, streak: "45 days", tasks: 380 },
  };

  const currentStats = statsData[timeframe];

  return (
    <div className={styles.statsContainer}>
      
      {/* 头部与下拉菜单 (Header & Dropdown) */}
      <div className={styles.statsHeader}>
        <h2 className={styles.statsTitle}>Study Stats</h2>
        <select 
          className={styles.timeSelect} 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* 2x2 数据网格 (2x2 Data Grid) */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Focus Time</div>
          <div className={styles.statValue}>{currentStats.focusTime}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Sessions</div>
          <div className={styles.statValue}>{currentStats.sessions}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Current Streak</div>
          <div className={styles.statValue}>{currentStats.streak}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tasks Done</div>
          <div className={styles.statValue}>{currentStats.tasks}</div>
        </div>
      </div>

    </div>
  );
}

export default StudyStats;