/* src/pages/Dashboard.jsx */

import { useState } from "react";
import { Link } from "react-router-dom"; 
import styles from "./Dashboard.module.css";
import NavBar from "../components/NavBar";
import TimelineItem from "../components/TimelineItem";



function Dashboard() {
  // Get local time and tranfer to present date
  // To be used to check if an event is due today
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  // Task Management
  // Support tasks and events
  const [tasks, setTasks] = useState([
    //TO BE MODIFIED

    // Mock tasks and events
    { id: 1, type: "task", title: "Finish CS2040S PS6", date: today, deadline: "23:59", status: "pending" },
    { id: 2, type: "task", title: "CS2040 Lecture Review", date:today, deadline: "14:00", status: "completed" },
    { id: 3, type: "event", title: "CP2106 Orbital Mission Control #2", date: today, startTime: "10:00", endTime: "12:00"},
    { id: 4, type: "task", title: "CP2106 Orbital Web app development: Implement Dashbord feature", date:today, deadline: "16:00", status: "pending" }
  ]);

  // Data Filtering
  // Only display tasks that is due today on the dashboard
  const todaysTimeline = tasks
    .filter(task => task.date === today)
    .sort((a, b) => {
      const timeA = a.type === "event" ? a.startTime : a.deadline;
      const timeB = b.type === "event" ? b.startTime : b.deadline;
      return timeA.localeCompare(timeB);
    });

    // Visual State Resolver
    const isFinished = (item) => {
      if (item.type === "task") {
        return item.status === "completed";
      }
      if (item.type === "event") {
        return item.endTime < currentTime;
      }
      return false;
    };

  // Component Render
  return (
    <div className={styles.dashboardContainer}>
      
      {/* Use the Navigation Bar */}
      <NavBar />

      <main style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", margin: "0 0 5px 0" }}>Timeline</h1>
          <p style={{ color: "#86868b", fontSize: "1.1rem", margin: 0, paddingTop: "20px" }}>{today}</p>
        </header>

        <section style={{ backgroundColor: "#ffffff", padding: "30px 20px", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          {todaysTimeline.length > 0 ? (
            todaysTimeline.map((item, index) => (
              <TimelineItem 
                key={item.id} 
                item={item}
                index={index}
                isLast={index === todaysTimeline.length - 1}
                isInactive={isFinished(item)} 
              />
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#86868b" }}>No events scheduled for today.</div>
          )}
        </section>

      </main>
    </div>
  );
}

function handleAddTask() {
  if (taskTitle.trim() === "" || taskDeadline === "") {
    alert("Please enter task title and deadline!");
    return;
  }

  const newTask = {
    id: Date.now(),
    type: "task",
    title: taskTitle,
    category: taskCategory,
    deadline: taskDeadline,
    completed: false,
  };

  setTasks([...tasks, newTask]);

  setTaskTitle("");
  setTaskDeadline("");
  setTaskCategory("Study");
}

export default Dashboard;