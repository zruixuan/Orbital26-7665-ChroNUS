// src/pages/Dashboard.jsx

import { useState } from "react";
import { useEffect } from "react";
import styles from "./Dashboard.module.css";
import TimelineItem from "../components/TimelineItem";
import NavBar from "../components/NavBar"; 
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../api/firebase";
import { auth } from "../api/firebase"; 
import { onAuthStateChanged } from "firebase/auth";

const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Dashboard() {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  const currentFullTime = `${getLocalDateString(now)} ${currentTimeStr}`;

  const later = new Date(now);
  later.setHours(later.getHours() + 1);
  const laterHours = String(later.getHours()).padStart(2, '0');
  const laterMinutes = String(later.getMinutes()).padStart(2, '0');
  const timePlusOneHourStr = `${laterHours}:${laterMinutes}`;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateStr = getLocalDateString(selectedDate);
  
  // Dynamic Date Generator
  const generateCarouselDates = (centerDate) => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const carouselDates = generateCarouselDates(selectedDate);
  const formattedSelectedText = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(selectedDate);

  const shiftDate = (days) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  // Go to Today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isCurrentlyToday = selectedDateStr === getLocalDateString(now);

  // Mock Data
  const tutorialTasks = [
    { 
      id: 1, type: "event", 
      title: "CP2106 Orbital Mission Control #2", 
      detail: "Discuss core features with teammate",
      startTime: `${getLocalDateString(now)} 10:00`, 
      endTime: `${getLocalDateString(now)} 12:00`,
      importance: "Important"
    },
    { 
      id: 2, type: "task", 
      title: "CS2040 Lecture Review", 
      detail: "Review graph traversal algorithms",
      deadline: `${getLocalDateString(now)} 14:00`, 
      completed: false,
      importance: "Unimportant"
    },
    { 
      id: 3, type: "task", 
      title: "CP2106 Orbital Web app development: Implement Dashboard feature", 
      detail: "Refactor data schema and UI components",
      deadline: `${getLocalDateString(now)} 16:00`, 
      completed: false,
      importance: "important" 
    },
    { 
      id: 4, type: "task", 
      title: "Finish CS2040S PS6", 
      detail: "Implement amortized analysis for Union-Find",
      deadline: `${getLocalDateString(now)} 23:59`, 
      completed: true,
      importance: "important" 
    }
  ];

  const [tasks, setTasks] = useState(tutorialTasks); 

  // Real-time Firebase Sync with Auth
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "tasks"), 
          where("userId", "==", user.uid)
        );
        
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const firebaseTasks = [];
          querySnapshot.forEach((doc) => {
            firebaseTasks.push({ id: doc.id, ...doc.data() });
          });
          setTasks([...tutorialTasks, ...firebaseTasks]); 
        });

        return () => unsubscribeSnapshot();
      } else {
        setTasks(tutorialTasks);
      }
    });

    return () => unsubscribeAuth();
  }, []); 
  const displayTasks = tasks
    .filter(item => {
      const itemDateString = item.type === "event" ? item.startTime : item.deadline;
      return itemDateString.split(' ')[0] === selectedDateStr;
    })
    .sort((a, b) => {
      const timeA = a.type === "event" ? a.startTime : a.deadline;
      const timeB = b.type === "event" ? b.startTime : b.deadline;
      return timeA.localeCompare(timeB);
    });

  // Form State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "task", // Default setting: Task
    title: "",
    detail: "",
    importance: "Unimportant",
    date: selectedDateStr,
    time1: currentTimeStr,
    time2: timePlusOneHourStr,
  });

  // Handle Input Change
  const handleOpenModal = () => {
    setFormData(prev => ({ ...prev, date: selectedDateStr }));
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Add Item
  const handleAddItem = async () => {
    if (!formData.title.trim()) return alert("Title cannot be empty!"); 

    const currentUser = auth.currentUser;
    if (!currentUser) {
      return alert("You must be logged in to add a task!");
    }

    const newItem = {
      userId: currentUser.uid,
      type: formData.type, 
      title: formData.title, 
      detail: formData.detail, 
      importance: formData.importance,
    };

    if (formData.type === "task") {
      newItem.completed = false;
      newItem.deadline = `${formData.date} ${formData.time1}`;
    } else {
      newItem.startTime = `${formData.date} ${formData.time1}`;
      newItem.endTime = `${formData.date} ${formData.time2}`;
    }

    try {
      await addDoc(collection(db, "tasks"), newItem);
      
      setIsModalOpen(false);
      setFormData({ type: "task", title: "", detail: "", importance: "important", date: selectedDateStr, time1: currentTimeStr, time2: timePlusOneHourStr });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Visuals
  const checkIsInactive = (item) => {
    if (item.type === "task") return item.completed;
    if (item.type === "event") return item.endTime <= currentFullTime; 
    return false;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.dashboardContainer}>
        <NavBar />
        <main className={styles.mainContent}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            
            <div className={styles.sectionTitle} style={{ margin: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f15c22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Timeline
            </div>

            {/* Today Button */}
            <button 
              onClick={goToToday}
              disabled={isCurrentlyToday} // disable the button if it's today alr
              style={{
                padding: "6px 14px",
                borderRadius: "12px",
                border: "none",
                background: isCurrentlyToday ? "transparent" : "rgba(241, 92, 34, 0.1)",
                color: isCurrentlyToday ? "transparent" : "#f15c22", 
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: isCurrentlyToday ? "default" : "pointer",
                transition: "all 0.3s ease",
                pointerEvents: isCurrentlyToday ? "none" : "auto"
              }}
            >
              Today
            </button>
            
          </div>


          {/* Date Carousel */}
          <div className={styles.dateCarousel}>
            <button onClick={() => shiftDate(-1)} style={{ border: "1px solid #eaeaea", background: "white", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#f15c22", transition: "all 0.2s" }}>&lt;</button>
            
            {carouselDates.map((dateObj, index) => {
              const isSelected = dateObj.toDateString() === selectedDate.toDateString();
              
              const shortDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj).toUpperCase();
              const dateNum = dateObj.getDate();
              const shortMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);

              return (
                <div 
                  key={index} 
                  onClick={() => setSelectedDate(dateObj)} 
                  className={`${styles.dateItem} ${isSelected ? styles.active : ''}`}
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                >
                  <span style={{ fontSize: "0.8rem", color: isSelected ? "#f15c22" : "#86868b", marginBottom: "4px", fontWeight: isSelected ? "600" : "normal" }}>{shortDay}</span>
                  <span style={{ fontSize: isSelected ? "1.8rem" : "1.4rem", fontWeight: isSelected ? "700" : "600" }}>{dateNum}</span>
                  <span style={{ fontSize: "0.8rem", color: isSelected ? "#f15c22" : "#86868b" }}>{shortMonth}</span>
                </div>
              );
            })}

            <button onClick={() => shiftDate(1)} style={{ border: "1px solid #eaeaea", background: "white", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#f15c22", transition: "all 0.2s" }}>&gt;</button>
          </div>

          <div style={{ textAlign: "center", margin: "20px 0 30px 0", color: "#1d1d1f", fontWeight: "600", fontSize: "1.1rem" }}>
            {formattedSelectedText}
          </div>

          {/* Timeline List */}
          <div className={styles.timelineCard}>
            {displayTasks.length > 0 ? (
              displayTasks.map((item, index) => (
                <TimelineItem 
                  key={item.id} 
                  item={item}
                  index={index}
                  isLast={index === displayTasks.length - 1}
                  isInactive={checkIsInactive(item)}
                />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#86868b" }}>No tasks or events scheduled. Time to relax! ☕️</div>
            )}
          </div>

          <button className={styles.addButton} onClick={handleOpenModal}>
            <span style={{ fontSize: "1.2rem" }}>+</span> Add Task / Event
          </button>

        </main>
      </div>

      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(6px)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.95)", padding: "30px", borderRadius: "24px",
            width: "90%", maxWidth: "400px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            fontFamily: "'Nunito', sans-serif"
          }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#2b1d16", fontWeight: "800" }}>New Entry</h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button onClick={() => setFormData({ ...formData, type: "task" })} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", background: formData.type === "task" ? "#f15c22" : "#f0f0f5", color: formData.type === "task" ? "white" : "#86868b" }}>Task</button>
              <button onClick={() => setFormData({ ...formData, type: "event" })} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", background: formData.type === "event" ? "#f15c22" : "#f0f0f5", color: formData.type === "event" ? "white" : "#86868b" }}>Event</button>
            </div>

            <input name="title" placeholder="Title (e.g. CS2040S PS)" value={formData.title} onChange={handleInputChange} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "12px", border: "1px solid #ddd", boxSizing: "border-box" }} />
            <input name="detail" placeholder="Details or Subtasks" value={formData.detail} onChange={handleInputChange} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "12px", border: "1px solid #ddd", boxSizing: "border-box" }} />
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #ddd" }} />
              <select name="importance" value={formData.importance} onChange={handleInputChange} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #ddd", background: "white" }}>
                <option value="important">Important</option>
                <option value="unimportant">Unimportant</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "25px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.8rem", color: "#86868b", marginLeft: "4px" }}>{formData.type === "task" ? "Deadline" : "Start Time"}</label>
                <input type="time" name="time1" value={formData.time1} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ddd", boxSizing: "border-box" }} />
              </div>
              {formData.type === "event" && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", color: "#86868b", marginLeft: "4px" }}>End Time</label>
                  <input type="time" name="time2" value={formData.time2} onChange={handleInputChange} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ddd", boxSizing: "border-box" }} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#f0f0f5", color: "#86868b", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAddItem} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#2b1d16", color: "white", fontWeight: "700", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;