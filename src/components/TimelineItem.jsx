// src/components/TimelineItem.jsx
import styles from '../pages/Dashboard.module.css'; 

function TimelineItem({ item, isInactive, onToggle, onCardClick }) {
  const isEvent = item.type === "event";
  const isImportant = item.importance?.toLowerCase() === "important";

  const startTimeStr = item.type === "event" && item.startTime ? item.startTime.split(' ')[1] : (item.deadline ? item.deadline.split(' ')[1] : "00:00");
  const endTimeStr = item.type === "event" && item.endTime ? item.endTime.split(' ')[1] : startTimeStr;

  const timeDisplay = isEvent ? `${startTimeStr} - ${endTimeStr}` : startTimeStr;

  const isCompleted = item.type === "task" && isInactive;
  const isPending = item.type === "task" && !isInactive;

  let themeColor = "#f15c22"; 
  let badgeBg = "#fff4ed";
  let badgeBorder = "#ffe4d6";
  let badgeText = "#f15c22";

  if (isCompleted) {
    themeColor = "#10b981"; 
    badgeBg = "#f0fdf4";
    badgeBorder = "#dcfce7";
    badgeText = "#16a34a";
  } else if (isPending) {
    themeColor = "#3b82f6"; 
    badgeBg = "#eff6ff";
    badgeBorder = "#dbeafe";
    badgeText = "#2563eb";
  }

  return (
    <div 
      onClick={onCardClick}
      className={styles.itemCard}
      style={{ 
        position: "relative",
        display: "flex", 
        alignItems: "center",
        backgroundColor: "#ffffff",
        border: "1px solid #eaeaea",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        borderLeft: `5px solid ${themeColor}`, 
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", width: "100%", gap: "24px" }}>
        
        <div style={{ 
          width: "145px", 
          flexShrink: 0, 
          display: "flex",             
          justifyContent: "center",    
          alignItems: "center",        
          color: themeColor, 
          fontWeight: "600", 
          fontSize: "1.05rem",
        }}>
          {timeDisplay}
        </div>

        <div style={{ 
          flex: 1, 
          minWidth: 0,
          textAlign: "left"  
        }}>
          <h3 style={{ 
            margin: "0 0 6px 0", 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            color: "#1d1d1f",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word"
          }}>
            {item.title}
          </h3>
          
          {item.detail && (
            <p style={{ 
              margin: "0 0 12px 0", 
              fontSize: "0.95rem", 
              color: "#86868b", 
              lineHeight: "1.4",
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordBreak: "break-word"
            }}>
              {item.detail}
            </p>
          )}
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Event/Task */}
            <span style={{ 
              display: "inline-flex", alignItems: "center", gap: "4px",
              fontSize: "0.8rem", color: "#6b7280", backgroundColor: "#f3f4f6", 
              padding: "2px 8px", borderRadius: "6px" 
            }}>
              {isEvent ? "📅 Event" : "📋 Task"}
            </span>
            
            {item.importance && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                fontSize: "0.8rem", padding: "2px 8px", borderRadius: "6px",
                backgroundColor: isImportant ? "#fee2e2" : "#f3f4f6",
                color: isImportant ? "#ef4444" : "#6b7280"
              }}>
                <span>{isImportant ? "🔥" : "☕"}</span>
                {isImportant ? "Important" : "Unimportant"}
              </span>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start" }}>
          {isEvent ? (
            <span style={{ 
              padding: "6px 14px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600",
              backgroundColor: badgeBg, color: badgeText, border: `1px solid ${badgeBorder}`
            }}>
              Event
            </span>
          ) : (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); 
                onToggle();
              }}
              style={{ 
                padding: "6px 14px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600",
                backgroundColor: badgeBg, color: badgeText, border: `1px solid ${badgeBorder}`,
                cursor: "pointer", transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.opacity = 0.8}
              onMouseLeave={(e) => e.target.style.opacity = 1}
            >
              {isCompleted ? "✓ Completed" : "Pending"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default TimelineItem;