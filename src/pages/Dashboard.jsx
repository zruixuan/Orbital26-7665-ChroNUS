import { useState } from "react";
import { Link } from "react-router-dom"; 

function Dashboard() {
  // Get local time and tranfer to present date
  // To be used to check if an event is due today
  const today = new Date().toISOString().split('T')[0];

  // Task Management
  const [tasks, setTasks] = useState([
    // Mock tasks
    //TO BE MODIFIED
    { id: 1, title: "Finish CS2040S PS6", deadline: "2026-05-25", status: "pending" },
    { id: 2, title: "CS2040 Lecture Review", deadline: "2026-05-22", status: "completed" },
    { id: 3, title: "CP2106 Orbital Mission Control #2", deadline: today, status: "pending" },
    { id: 4, title: "CP2106 Orbital Web app development: Implement Dashbord feature", deadline: today, status: "pending" }
  ]);

  // Data Filtering
  // Only display tasks that is due today on the dashboard
  const todaysTasks = tasks.filter(task => task.deadline === today);

  // Component Render
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: "#f5f5f7", minHeight: "100vh", margin: "-20px" }}>
      
      {/* Global Navigation Bar (Center-aligned) */}
      <nav style={{ 
        backgroundColor: "rgba(0, 0, 0, 0.8)", 
        backdropFilter: "saturate(180%) blur(20px)",
        display: "flex", 
        justifyContent: "center", 
        gap: "40px", 
        padding: "14px 0", 
        position: "sticky", 
        top: 0, 
        zIndex: 100 
      }}>
        <span style={{ color: "#f5f5f7", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>ChroNUS</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer", transition: "color 0.3s" }}>Today</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>All Tasks</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>Timer</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>Weekly Reflection</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>Settings</span>


      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px" }}>
        
        <header style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.015em", margin: "0 0 10px 0" }}>
            Focus on Today.
          </h1>
          <p style={{ color: "#86868b", fontSize: "1.2rem", margin: 0, paddingTop: "20px" }}>
            Master your time. Master your mods.
          </p>
        </header>

        {/* Dashboard: Today's Tasks */}
        <section style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "18px", boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600" }}>Tasks for {today}</h2>
            <button style={{ backgroundColor: "#0071e3", color: "white", border: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
              + New Task
            </button>
          </div>

          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {todaysTasks.length > 0 ? (
              todaysTasks.map(task => (
                <li 
                  key={task.id} 
                  style={{ 
                    display: "flex",
                    alignItems: "center",
                    textDecoration: task.status === "completed" ? "line-through" : "none",
                    color: task.status === "completed" ? "#86868b" : "#1d1d1f",
                    padding: "16px 0",
                    borderBottom: "1px solid #d2d2d7",
                    fontSize: "1.1rem"
                  }}
                >
                  {/* Checkbox */}
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #0071e3", marginRight: "15px", backgroundColor: task.status === "completed" ? "#0071e3" : "transparent" }}></div>
                  {task.title}
                </li>
              ))
            ) : (
              // handing empty state
              <div style={{ textAlign: "center", padding: "40px 0", color: "#86868b" }}>
                You have a clear day ahead. Enjoy!
              </div>
            )}
          </ul>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;