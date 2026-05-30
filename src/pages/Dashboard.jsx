// src/pages/Dashboard.jsx

import { useState } from "react";
import styles from "./Dashboard.module.css";
import TimelineItem from "../components/TimelineItem";
import NavBar from "../components/NavBar"; 

function Dashboard() {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; 
  
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentFullTime = `${today} ${currentHours}:${currentMinutes}`;
  
  // ==========================================
  // 核心升级：动态生成日历数组 (Dynamic Date Generator)
  // ==========================================
  const generateCarouselDates = (centerDate) => {
    const dates = [];
    for (let i = -3; i <= 3; i++) { // 前后各推 3 天
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const carouselDates = generateCarouselDates(now);

  // 动态生成页面中部的格式化长日期 (例如: "Wednesday, 28 May 2025")
  const formattedTodayText = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(now);

  // Mock Data
  const [tasks] = useState([
    { 
      id: 1, type: "event", title: "CP2106 Orbital Mission Control #2", 
      detail: "Discuss core features with teammate",
      startTime: `${today} 10:00`, endTime: `${today} 12:00`,
      importance: "important"
    },
    { 
      id: 2, type: "task", title: "CS2040 Lecture Review", 
      detail: "Review graph traversal algorithms",
      deadline: `${today} 14:00`, completed: false,
      importance: "unimportant"
    },
    { 
      id: 3, type: "task", title: "CP2106 Orbital Web app development: Implement Dashboard feature", 
      detail: "Refactor data schema and UI components",
      deadline: `${today} 16:00`, completed: false,
      importance: "important" 
    },
    { 
      id: 4, type: "task", title: "Finish CS2040S PS6", 
      detail: "Implement amortized analysis for Union-Find",
      deadline: `${today} 23:59`, completed: true,
      importance: "important" 
    }
  ]);

  // Dynamic State Resolver
  const checkIsInactive = (item) => {
    if (item.type === "task") {
      return item.completed;
    }
    if (item.type === "event") {
      return item.endTime <= currentFullTime; 
    }
    return false;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.dashboardContainer}>
        
        {/* Inject Modular NavBar */}
        <NavBar />

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          
          <div className={styles.sectionTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f15c22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Timeline
          </div>

          {/* Date Carousel */}
          <div className={styles.dateCarousel}>
            <button style={{ border: "1px solid #eaeaea", background: "white", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#f15c22" }}>&lt;</button>
            
            {/* 动态映射渲染日历项 */}
            {carouselDates.map((dateObj, index) => {
              // 判断当前循环的日期是否是"今天"
              const isToday = dateObj.toDateString() === now.toDateString();
              
              // 格式化日期信息
              const shortDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj).toUpperCase(); // e.g., MON
              const dateNum = dateObj.getDate(); // e.g., 26
              const shortMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj); // e.g., May

              return (
                <div key={index} className={`${styles.dateItem} ${isToday ? styles.active : ''}`}>
                  <span style={{ 
                    fontSize: "0.8rem", 
                    color: isToday ? "#f15c22" : "#86868b", 
                    marginBottom: "4px", 
                    fontWeight: isToday ? "600" : "normal" 
                  }}>
                    {shortDay}
                  </span>
                  <span style={{ 
                    fontSize: isToday ? "1.8rem" : "1.4rem", 
                    fontWeight: isToday ? "700" : "600" 
                  }}>
                    {dateNum}
                  </span>
                  <span style={{ 
                    fontSize: "0.8rem", 
                    color: isToday ? "#f15c22" : "#86868b" 
                  }}>
                    {shortMonth}
                  </span>
                </div>
              );
            })}

            <button style={{ border: "1px solid #eaeaea", background: "white", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#f15c22" }}>&gt;</button>
          </div>

          {/* 动态插入今天的完整日期文本 */}
          <div style={{ textAlign: "center", margin: "20px 0 30px 0", color: "#1d1d1f", fontWeight: "600", fontSize: "1.1rem" }}>
            {formattedTodayText}
          </div>

          {/* Timeline List */}
          <div className={styles.timelineCard}>
            {tasks.map((item, index) => (
              <TimelineItem 
                key={item.id} 
                item={item}
                index={index}
                isLast={index === tasks.length - 1}
                isInactive={checkIsInactive(item)}
              />
            ))}
          </div>

          <button className={styles.addButton}>
            <span style={{ fontSize: "1.2rem" }}>+</span> Add Task / Event
          </button>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;