import styles from "./Settings.module.css";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

import {
  FiSettings,
  FiUser,
  FiUpload,
  FiLock,
  FiLogOut,
  FiHelpCircle,
  FiMessageSquare,
  FiAlertTriangle,
  FiMail,
  FiInfo,
  FiChevronRight,
} from "react-icons/fi";

function Settings() {
  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsShell}>
        <NavBar />

        <main className={styles.container}>
          {/* Page title */}
          <div className={styles.settingsHeader}>
            <div className={styles.settingsTitleWrap}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f15c22"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.12.37.18.75.18 1.14s-.06.77-.18 1.14A1.65 1.65 0 0 0 20.91 13H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z" />
            </svg>

            Settings
            </div>
          </div>

          {/* Main settings content */}
          <section className={styles.settingsGrid}>
            {/* Left column */}
            <div className={styles.leftColumn}>
              {/* Profile card */}
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiUser />
                  <h3>Profile</h3>
                </div>

                <div className={styles.profileContent}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatarPreview}>
                      <span>ZR</span>
                    </div>

                    <button
                      type="button"
                      className={styles.changePhotoButton}
                    >
                      <FiUpload />
                      Change Photo
                    </button>
                  </div>

                  <div className={styles.profileFields}>
                    <div className={styles.formGroup}>
                      <label htmlFor="displayName">Display Name</label>

                      <input
                        id="displayName"
                        type="text"
                        defaultValue="Zhang Ruixuan"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>

                      <input
                        id="email"
                        type="email"
                        defaultValue="example@u.nus.edu"
                        disabled
                      />

                      <p>Email cannot be changed</p>
                    </div>
                  </div>
                </div>

                <div className={styles.profileFooter}>
                  <button
                    type="button"
                    className={styles.saveButton}
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Account card */}
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiLock />
                  <h3>Account</h3>
                </div>

                <div className={styles.settingList}>
                  <button
                    type="button"
                    className={styles.settingRow}
                  >
                    <span className={styles.rowIcon}>
                      <FiLock />
                    </span>

                    <span className={styles.rowContent}>
                      <strong>Change Password</strong>
                      <small>
                        Update your password to keep your account secure
                      </small>
                    </span>

                    <FiChevronRight className={styles.chevron} />
                  </button>

                  <button
                    type="button"
                    className={`${styles.settingRow} ${styles.logoutRow}`}
                  >
                    <span className={styles.rowIcon}>
                      <FiLogOut />
                    </span>

                    <span className={styles.rowContent}>
                      <strong>Log Out</strong>
                      <small>
                        Sign out from your account on this device
                      </small>
                    </span>

                    <FiChevronRight className={styles.chevron} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightColumn}>
              {/* Help and support card */}
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiHelpCircle />
                  <h3>Help &amp; Support</h3>
                </div>

                <div className={styles.settingList}>
                  <button
                    type="button"
                    className={styles.settingRow}
                  >
                    <span className={styles.rowIcon}>
                      <FiHelpCircle />
                    </span>

                    <span className={styles.rowContent}>
                      <strong>Help Centre</strong>
                      <small>Find guides and frequently asked questions</small>
                    </span>

                    <FiChevronRight className={styles.chevron} />
                  </button>

                  <button
                    type="button"
                    className={styles.settingRow}
                  >
                    <span className={styles.rowIcon}>
                      <FiMessageSquare />
                    </span>

                    <span className={styles.rowContent}>
                      <strong>Send Feedback</strong>
                      <small>Share your thoughts with us</small>
                    </span>

                    <FiChevronRight className={styles.chevron} />
                  </button>

                  <button
                    type="button"
                    className={styles.settingRow}
                  >
                    <span className={styles.rowIcon}>
                      <FiAlertTriangle />
                    </span>

                    <span className={styles.rowContent}>
                      <strong>Report a Problem</strong>
                      <small>Let us know if something is not working</small>
                    </span>

                    <FiChevronRight className={styles.chevron} />
                  </button>

                  <button
                    type="button"
                    className={styles.settingRow}
                  >
                    <span className={styles.rowIcon}>
                      <FiMail />
                    </span>

                    <span className={styles.rowContent}>
                      <strong>Contact Us</strong>
                      <small>Get in touch with our support team</small>
                    </span>

                    <FiChevronRight className={styles.chevron} />
                  </button>
                </div>
              </div>

              {/* About card */}
              <div className={`${styles.card} ${styles.aboutCard}`}>
                <div className={styles.cardTitle}>
                  <FiInfo />
                  <h3>About ChroNUS</h3>
                </div>

                <p className={styles.aboutText}>
                  A smart study planner that helps students manage tasks,
                  priorities, schedules, and weekly reflections.
                </p>

                <div className={styles.version}>
                  Version 1.0.0
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;