/* src/components/NavBar.jsx */

import styles from "../pages/Dashboard.module.css";

function NavBar() {
  return (
    <nav className={styles.navBar}>
        <span style={{ color: "#f5f5f7", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>ChroNUS</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer", transition: "color 0.3s" }}>Today</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>All Tasks</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>Timer</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>Weekly Reflection</span>
        <span style={{ color: "#a1a1a6", fontSize: "14px", cursor: "pointer" }}>Settings</span>
    </nav>
  );
}

export default NavBar;