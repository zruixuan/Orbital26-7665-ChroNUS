// src/components/TimelineItem.jsx
import styles from '../pages/Dashboard.module.css'; 

function TimelineItem({ item, index, isLast, isInactive, onToggle, onCardClick }) {
  const isImportant = item.importance?.toLowerCase() === "important";
  const themeColor = isInactive ? "#d1d1d6" : "#f15c22"; 
  const textColor = isInactive ? "#86868b" : "#1d1d1f";

  const startTime = item.type === "event" && item.startTime ? item.startTime.split(' ')[1] : null;
  const endTime = item.type === "event" && item.endTime ? item.endTime.split(' ')[1] : null;
  const taskTime = item.type === "task" && item.deadline ? item.deadline.split(' ')[1] : null;

  const renderBadge = () => {
    if (item.type === "event") {
      return (
        <span style={{ 
          padding: "4px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "500",
          backgroundColor: isInactive ? "#f5f5f7" : "#fff4ed", 
          color: isInactive ? "#86868b" : "#f15c22", 
          border: isInactive ? "1px solid #e5e7eb" : "1px solid #ffe4d6",
          display: "inline-block"
        }}>
          Event
        </span>
      );
    }
    if (isInactive) {
      return <span style={{ padding: "4px 12px", borderRadius: "8px", backgroundColor: "#f0fdf4", color: "#16a34a", fontSize: "0.85rem", fontWeight: "500", border: "1px solid #dcfce7", display: "inline-block" }}>✓ Completed</span>;
    }
    return <span style={{ padding: "4px 12px", borderRadius: "8px", backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "0.85rem", fontWeight: "500", border: "1px solid #dbeafe", display: "inline-block" }}>Pending</span>;
  };

  return (
    <div 
      onClick={onCardClick}
      className={styles.itemCard}
      style={{ display: "flex", gap: "24px", minHeight: item.type === "event" ? "115px" : "90px", position: "relative" }}
    >
      
      {/* Left Column */}
      <div style={{ 
        width: "60px", flexShrink: 0, textAlign: "right", paddingTop: "6px",
        display: "flex", flexDirection: "column",
        justifyContent: item.type === "event" ? "space-between" : "flex-start",
        height: item.type === "event" ? "68px" : "auto" 
      }}>
        {item.type === "event" ? (
          <>
            <span style={{ color: themeColor, fontWeight: "600", fontSize: "1.1rem" }}>{startTime}</span>
            <span style={{ color: isInactive ? "#ef4444" : "#e5e7eb", fontWeight: "600", fontSize: "1.1rem" }}>{endTime}</span>
          </>
        ) : (
          <span style={{ color: themeColor, fontWeight: "600", fontSize: "1.1rem" }}>{taskTime}</span>
        )}
      </div>

      {/* Middle Column */}
      <div style={{ width: "32px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "4px" }}>
        {item.type === "event" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "68px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: themeColor, border: "2px solid #ffffff", boxShadow: `0 0 0 2px ${themeColor}`, boxSizing: "content-box" }} />
            <div style={{ width: "0px", flex: 1, borderLeft: `2px dashed ${themeColor}`, margin: "4px 0" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: themeColor, border: "2px solid #ffffff", boxShadow: `0 0 0 2px ${themeColor}`, boxSizing: "content-box" }} />
          </div>
        ) : (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              onToggle();
            }}
            className={styles.interactiveDot}
            style={{ 
              width: "20px", height: "20px", borderRadius: "50%", zIndex: 10, cursor: "pointer",
              backgroundColor: isInactive ? themeColor : "transparent", 
              border: `2.5px solid ${themeColor}`, 
              display: "flex", justifyContent: "center", alignItems: "center",
              boxShadow: "0 0 0 4px #ffffff", boxSizing: "content-box",
              position: "relative", padding: 0, outline: "none"
            }}
          >
            {isInactive && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>
        )}

        {!isLast && (
          <div style={{ width: "1px", flex: 1, backgroundColor: "#eaeaea", marginTop: item.type === "event" ? "8px" : "4px" }} />
        )}
      </div>

      {/* Right Column */}
      <div style={{ flex: 1, paddingBottom: "30px", paddingTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", minWidth: 0 }}>
        
        {/* Text Container */}
        <div style={{ color: textColor, textAlign: "left", flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            margin: "0 0 4px 0", 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            textDecoration: isInactive && item.type === "task" ? "line-through" : "none",
            wordBreak: "break-word",
            overflowWrap: "anywhere"
          }}>
            {item.title}
          </h3>
          
          {item.detail && (
            <div style={{ 
              margin: "0 0 10px 0", 
              fontSize: "0.95rem", 
              color: "#86868b", 
              lineHeight: "1.4", 
              textDecoration: isInactive && item.type === "task" ? "line-through" : "none",
              wordBreak: "break-word",
              overflowWrap: "anywhere"
            }}>
              {item.detail}
            </div>
          )}
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#86868b", fontSize: "0.9rem" }}>
            <span>{item.type === "task" ? "📋 Task" : "📅 Event"}</span>
            
            {item.importance && (
              <span style={{
                padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px", 
                backgroundColor: isImportant ? "#fee2e2" : "#f3f4f6",
                border: isImportant ? (isInactive ? "1px solid #e5e7eb" : "1px solid #fecaca") : "1px solid #e5e7eb",
              }}>
                <span>{isImportant ? "🔥" : "☕"}</span>
                <span style={{ color: (isImportant ? "#ef4444" : "#6b7280") }}>
                  {isImportant ? "Important" : "Unimportant"}
                </span>
              </span>
            )}
          </div>
        </div>
        
        {/* Badge Container*/}
        <div style={{ flexShrink: 0 }}>{renderBadge()}</div>
      </div>

    </div>
  );
}

export default TimelineItem;