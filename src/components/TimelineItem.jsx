/* src/components/TimelineItem.jsx */

function TimelineItem({ item, index, isLast, isInactive }) {
  const displayTime = item.type === "event" ? item.startTime : item.deadline;

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  return (
    <div style={{ display: "flex", gap: "15px", minHeight: "80px" }}>
      
      <div style={{ width: "50px", textAlign: "right", paddingTop: "2px" }}>
        <span style={{ color: isInactive ? "#d2d2d7" : "#1d1d1f", fontWeight: "500", fontSize: "1rem" }}>
          {displayTime}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ 
          width: "16px", height: "16px", borderRadius: "50%", zIndex: 2,
          backgroundColor: isInactive ? "#d2d2d7" : "white",
          
          border: isInactive 
            ? "3px solid #d2d2d7"
            : "3px solid #e97a24",
          
          boxSizing: "content-box"
        }} />
        {!isLast && (
          <div style={{ width: "0px", flex: 1, borderLeft: "2px dashed #e5e7eb", margin: "-2px 0" }} />
        )}
      </div>

      <div style={{ flex: 1, paddingBottom: "30px", paddingTop: "-2px" }}>
        <div style={{ 
          textDecoration: isInactive ? "line-through" : "none", 
          color: isInactive ? "#86868b" : "#1d1d1f" 
        }}>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "1.1rem", fontWeight: "600" }}>{item.title}</h3>
          
          {item.type === "event" && (
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#86868b" }}>
              ⏱ {item.startTime} - {item.endTime}
            </p>
          )}
          
          {item.type === "task" && (
            <span style={{ 
              display: "inline-block", padding: "2px 8px", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "500", marginTop: "4px",
              
              ...(isInactive 
                ? { backgroundColor: "#f5f5f7", color: "#86868b" } 
                : (currentTime > item.deadline)
                  ? { backgroundColor: "#ffebee", color: "#d32f2f" }
                  : { backgroundColor: "#e3f2fd", color: "#0071e3" }
              )
            }}>
              Due by {item.deadline}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}

export default TimelineItem;