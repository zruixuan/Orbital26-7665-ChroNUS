/* src/components/NavBar.jsx */

import styles from "../pages/Dashboard.module.css";
import logo from "../assets/icon.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";

function NavBar() {
  const [photoURL, setPhotoURL] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setPhotoURL(user?.photoURL || "");
      setDisplayName(user?.displayName || "");
    });

    const handleProfileUpdated = (event) => {
      setPhotoURL(event.detail?.photoURL || "");
      setDisplayName(event.detail?.displayName || "");
    };

    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      unsubscribe();
      window.removeEventListener(
        "profile-updated",
        handleProfileUpdated
      );
    };
  }, []);

  const userInitial =
    displayName?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className={styles.header}>
      {/* Logo Section */}
      <div className={styles.logo}>
        <img
        src={logo}
        alt="ChroNUS logo"
        style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />

        ChroNUS
      </div>

      {/* Navigation Links */}
      <nav className={styles.navLinks}>
  
  <NavLink
    to="/dashboard"
    className={({ isActive }) =>
      `${styles.navItem} ${isActive ? styles.active : ""}`
    }
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9"></rect>
      <rect x="14" y="3" width="7" height="5"></rect>
      <rect x="14" y="12" width="7" height="9"></rect>
      <rect x="3" y="16" width="7" height="5"></rect>
    </svg>

    Dashboard
  </NavLink>
  
  <NavLink
    to="/eisenhower"
    className={({ isActive }) =>
      `${styles.navItem} ${isActive ? styles.active : ""}`
    }
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
    
    Tasks
  </NavLink>
  
    <NavLink
    to="/timer"
    className={({ isActive }) =>
      `${styles.navItem} ${isActive ? styles.active : ""}`
    }
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
    Timer
  </NavLink>
  
  <NavLink
    to="/weekly-reflection"
    className={({ isActive }) =>
      `${styles.navItem} ${isActive ? styles.active : ""}`
    }
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    Weekly Reflections
  </NavLink>
  
  <NavLink
    to="/settings"
    className={({ isActive }) =>
      `${styles.navItem} ${isActive ? styles.active : ""}`
    }
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3"></circle>

      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>

    Settings
  </NavLink>
  
</nav>

      {/* User Actions & Avatar */}
      <div className={styles.userActions}>
        <svg style={{ cursor: "pointer" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
          <div className={styles.avatar}>
            {photoURL ? (
              <img
                src={photoURL}
                alt="User profile"
                className={styles.navAvatarImage}
              />
            ) : (
              <span className={styles.navAvatarInitial}>
                {userInitial}
              </span>
            )}
          </div>
      </div>
    </header>
  );
}

export default NavBar;