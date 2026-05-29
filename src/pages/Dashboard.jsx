/* src/pages/Dashboard.jsx */

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
            <div className={styles.dateItem}>
              <span style={{ fontSize: "0.8rem", color: "#86868b", marginBottom: "4px" }}>MON</span>
              <span style={{ fontSize: "1.4rem", fontWeight: "600" }}>26</span>
              <span style={{ fontSize: "0.8rem", color: "#86868b" }}>May</span>
            </div>
            <div className={styles.dateItem}>
              <span style={{ fontSize: "0.8rem", color: "#86868b", marginBottom: "4px" }}>TUE</span>
              <span style={{ fontSize: "1.4rem", fontWeight: "600" }}>27</span>
              <span style={{ fontSize: "0.8rem", color: "#86868b" }}>May</span>
            </div>
            <div className={`${styles.dateItem} ${styles.active}`}>
              <span style={{ fontSize: "0.8rem", color: "#f15c22", marginBottom: "4px", fontWeight: "600" }}>WED</span>
              <span style={{ fontSize: "1.8rem", fontWeight: "700" }}>28</span>
              <span style={{ fontSize: "0.8rem", color: "#f15c22" }}>May</span>
            </div>
            <div className={styles.dateItem}>
              <span style={{ fontSize: "0.8rem", color: "#86868b", marginBottom: "4px" }}>THU</span>
              <span style={{ fontSize: "1.4rem", fontWeight: "600" }}>29</span>
              <span style={{ fontSize: "0.8rem", color: "#86868b" }}>May</span>
            </div>
            <div className={styles.dateItem}>
              <span style={{ fontSize: "0.8rem", color: "#86868b", marginBottom: "4px" }}>FRI</span>
              <span style={{ fontSize: "1.4rem", fontWeight: "600" }}>30</span>
              <span style={{ fontSize: "0.8rem", color: "#86868b" }}>May</span>
            </div>
            <div className={styles.dateItem}>
              <span style={{ fontSize: "0.8rem", color: "#86868b", marginBottom: "4px" }}>SAT</span>
              <span style={{ fontSize: "1.4rem", fontWeight: "600" }}>31</span>
              <span style={{ fontSize: "0.8rem", color: "#86868b" }}>May</span>
            </div>
            <div className={styles.dateItem}>
              <span style={{ fontSize: "0.8rem", color: "#86868b", marginBottom: "4px" }}>SUN</span>
              <span style={{ fontSize: "1.4rem", fontWeight: "600" }}>1</span>
              <span style={{ fontSize: "0.8rem", color: "#86868b" }}>Jun</span>
            </div>
            <button style={{ border: "1px solid #eaeaea", background: "white", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#f15c22" }}>&gt;</button>
          </div>

          <div style={{ textAlign: "center", margin: "20px 0 30px 0", color: "#1d1d1f", fontWeight: "600", fontSize: "1.1rem" }}>
            Wednesday, 28 May 2025
          </div>

          {/* Timeline List */}
          <div className={styles.timelineCard}>
            {tasks.map((item, index) => (
              <TimelineItem 
                key={item.id} 
                item={item}
                index={index}
                isLast={index === tasks.length - 1}
                isInactive={checkIsInactive(item)} // 3. 修复：务必将计算出的状态传递给子组件
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