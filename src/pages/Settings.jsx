import styles from "./Settings.module.css";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import {
  signOut,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { auth } from "../api/firebase";

import {
  FiUser,
  FiUserCheck,
  FiLock,
  FiLogOut,
  FiHelpCircle,
  FiMessageSquare,
  FiAlertTriangle,
  FiMail,
  FiInfo,
  FiChevronRight,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

const PROFILE_AVATARS = [
  {
    id: "avatar-1",
    src: "/avatars/avatar-1.jpg",
    alt: "Orange character avatar",
  },
  {
    id: "avatar-2",
    src: "/avatars/avatar-2.jpg",
    alt: "Blue character avatar",
  },
  {
    id: "avatar-3",
    src: "/avatars/avatar-3.jpg",
    alt: "Green character avatar",
  },
  {
    id: "avatar-4",
    src: "/avatars/avatar-4.jpg",
    alt: "Purple character avatar",
  },
  {
    id: "avatar-5",
    src: "/avatars/avatar-5.jpg",
    alt: "Yellow character avatar",
  },
  {
    id: "avatar-6",
    src: "/avatars/avatar-6.jpg",
    alt: "Pink character avatar",
  },
];

const HELP_CENTRE_ITEMS = [
  {
    id: "create-entry",
    question: "How do I create a task or event?",
    answer: (
      <>
        <p>
          Open the <strong>Dashboard</strong> and click the button for adding a
          new entry.
        </p>

        <p>
          Choose either <strong>Task</strong> or <strong>Event</strong>,
          complete the required fields, and click <strong>Save</strong>.
        </p>
      </>
    ),
  },

  {
    id: "task-event-difference",
    question: "What is the difference between a task and an event?",
    answer: (
      <>
        <p>
          <strong>Tasks</strong> represent work that must be completed before a
          deadline, such as assignments, revision, or project work.
        </p>

        <p>
          <strong>Events</strong> represent scheduled activities with a
          specific start and end time, such as classes, examinations, meetings,
          or appointments.
        </p>

        <p>
          ChroNUS separates them because tasks focus on{" "}
          <strong>completion and deadlines</strong>, while events focus on{" "}
          <strong>when an activity happens</strong>.
        </p>
      </>
    ),
  },

  {
    id: "task-fields",
    question: "What information should I enter for a task?",
    answer: (
      <>
        <p>Enter the following information:</p>

        <ul>
          <li>Task title</li>
          <li>Optional details or subtasks</li>
          <li>Due date</li>
          <li>Importance level</li>
          <li>Deadline time</li>
        </ul>

        <p>
          The deadline shows when the task must be completed. ChroNUS also uses
          this information to determine whether the task is urgent.
        </p>
      </>
    ),
  },

  {
    id: "event-fields",
    question: "What information should I enter for an event?",
    answer: (
      <>
        <p>Enter the following information:</p>

        <ul>
          <li>Event title</li>
          <li>Optional details</li>
          <li>Date</li>
          <li>Importance level</li>
          <li>Start time</li>
          <li>End time</li>
        </ul>

        <p>
          Events are designed for activities that happen during a fixed period,
          such as a lecture, examination, appointment, or group meeting.
        </p>
      </>
    ),
  },

  {
    id: "importance",
    question: "What does Important or Unimportant mean?",
    answer: (
      <>
        <p>
          Select <strong>Important</strong> for activities that have a
          meaningful impact on your studies or require special attention.
        </p>

        <p>
          Select <strong>Unimportant</strong> for lower-priority activities
          that have less impact on your academic goals.
        </p>

        <p>
          This setting helps ChroNUS organise your workload and generate clearer
          priority and weekly reflection summaries.
        </p>
      </>
    ),
  },

  {
    id: "eisenhower",
    question: "How does the Eisenhower Matrix work?",
    answer: (
      <>
        <p>
          The Eisenhower Matrix organises tasks according to their{" "}
          <strong>urgency</strong> and <strong>importance</strong>.
        </p>

        <ul>
          <li>
            <strong>Urgent &amp; Important:</strong> tasks requiring immediate
            attention.
          </li>

          <li>
            <strong>Important &amp; Not Urgent:</strong> valuable tasks that
            should be planned in advance.
          </li>

          <li>
            <strong>Urgent &amp; Not Important:</strong> time-sensitive tasks
            with relatively lower impact.
          </li>

          <li>
            <strong>Not Urgent &amp; Not Important:</strong> low-priority tasks
            that can be postponed or avoided.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "urgent-setting",
    question: "Can I change when a task is considered urgent?",
    answer: (
      <>
        <p>
          Yes. Open the <strong>Eisenhower Matrix</strong> page and click{" "}
          <strong>Urgency Settings</strong>.
        </p>

        <p>
          You can choose how many days before its deadline a task should be
          marked as urgent.
        </p>

        <p>
          This means the urgency range is customisable rather than fixed by the
          system.
        </p>
      </>
    ),
  },

  {
    id: "weekly-reflection",
    question: "What is Weekly Reflection?",
    answer: (
      <>
        <p>
          Weekly Reflection summarises your tasks and events for the selected
          week.
        </p>

        <p>It helps you review:</p>

        <ul>
          <li>Completed work</li>
          <li>Daily activity patterns</li>
          <li>Weekly achievements</li>
          <li>Productivity</li>
          <li>Upcoming priorities</li>
        </ul>

        <p>
          You can switch between different weeks to review earlier records and
          compare your progress over time.
        </p>
      </>
    ),
  },

  {
    id: "profile",
    question: "How do I update my profile?",
    answer: (
      <>
        <p>
          Open <strong>Settings</strong>, update your display name, and select
          one of the built-in avatars.
        </p>

        <p>
          Click <strong>Save Changes</strong> to store your updated profile
          information.
        </p>

        <p className={styles.helpAnswerNote}>
          Your account email cannot be changed.
        </p>
      </>
    ),
  },

  {
    id: "password",
    question: "How do I change my password?",
    answer: (
      <>
        <p>
          Open <strong>Settings</strong> and click{" "}
          <strong>Change Password</strong>.
        </p>

        <ol>
          <li>Enter your current password.</li>
          <li>Enter a new password containing at least six characters.</li>
          <li>Confirm the new password.</li>
        </ol>

        <p className={styles.helpAnswerNote}>
          Your new password must be different from your current password.
        </p>
      </>
    ),
  },
];

function Settings() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [profileStatus, setProfileStatus] = useState("idle");
  const [profileMessage, setProfileMessage] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordStatus, setPasswordStatus] = useState("idle");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [openHelpItem, setOpenHelpItem] = useState("create-entry");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState("confirm");
  const [logoutMessage, setLogoutMessage] = useState(
    "Are you sure you want to log out?"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      setCurrentUser(user);
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoPreview(user.photoURL || "");
    });

    return unsubscribe;
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (!currentUser) {
      setProfileStatus("error");
      setProfileMessage("No signed-in user was found.");
      setShowProfileModal(true);
      return;
    }

    const trimmedDisplayName = displayName.trim();

    if (!trimmedDisplayName) {
      setProfileStatus("error");
      setProfileMessage("Display name cannot be empty.");
      setShowProfileModal(true);
      return;
    }

    setProfileStatus("saving");
    setProfileMessage("Saving your profile...");
    setShowProfileModal(true);

    try {
      const finalPhotoURL =
        selectedAvatar || currentUser.photoURL || "";

      await updateProfile(currentUser, {
        displayName: trimmedDisplayName,
        photoURL: finalPhotoURL || null,
      });

      await currentUser.reload();

      const updatedUser = auth.currentUser;

      setCurrentUser(updatedUser);
      setDisplayName(updatedUser?.displayName || "");
      setPhotoPreview(updatedUser?.photoURL || "");
      setSelectedAvatar("");

      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: {
            photoURL: updatedUser?.photoURL || "",
            displayName: updatedUser?.displayName || "",
          },
        })
      );

      setProfileStatus("success");
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileStatus("error");
      setProfileMessage(
        "Failed to update your profile. Please try again."
      );
    }
  };

  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("idle");
    setPasswordMessage("");
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (passwordStatus === "loading") {
      return;
    }

    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("idle");
    setPasswordMessage("");
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      setPasswordStatus("error");
      setPasswordMessage("No signed-in user was found.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus("error");
      setPasswordMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus("error");
      setPasswordMessage(
        "The new password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("error");
      setPasswordMessage("The new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordStatus("error");
      setPasswordMessage(
        "The new password must be different from your current password."
      );
      return;
    }

    setPasswordStatus("loading");
    setPasswordMessage("Updating your password...");

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordStatus("success");
      setPasswordMessage(
        "Your password has been updated successfully."
      );
    } catch (error) {
      console.error("Password update error:", error);

      setPasswordStatus("error");

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        setPasswordMessage("Your current password is incorrect.");
      } else if (error.code === "auth/weak-password") {
        setPasswordMessage(
          "The new password is too weak. Please choose a stronger password."
        );
      } else if (error.code === "auth/too-many-requests") {
        setPasswordMessage(
          "Too many attempts. Please wait a moment and try again."
        );
      } else if (error.code === "auth/requires-recent-login") {
        setPasswordMessage(
          "Please log out, sign in again, and then change your password."
        );
      } else {
        setPasswordMessage(
          "Failed to update your password. Please try again."
        );
      }
    }
  };

  const openHelpCentre = () => {
    setOpenHelpItem("create-entry");
    setShowHelpModal(true);
  };

  const closeHelpCentre = () => {
    setShowHelpModal(false);
  };

  const toggleHelpItem = (itemId) => {
    setOpenHelpItem((currentItem) =>
      currentItem === itemId ? "" : itemId
    );
  };

  const openLogoutModal = () => {
    setLogoutStatus("confirm");
    setLogoutMessage("Are you sure you want to log out?");
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    setLogoutStatus("loading");
    setLogoutMessage("Signing out from your account...");

    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);

      setLogoutStatus("error");
      setLogoutMessage("Failed to log out. Please try again.");
    }
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsShell}>
        <NavBar />

        <main className={styles.container}>
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

          <section className={styles.settingsGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiUser />
                  <h3>Profile</h3>
                </div>

                <div className={styles.profileContent}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatarPreview}>
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile"
                          className={styles.avatarImage}
                        />
                      ) : (
                        <span>
                          {displayName
                            ? displayName
                                .trim()
                                .split(/\s+/)
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "U"}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className={styles.changePhotoButton}
                      onClick={() =>
                        setShowAvatarPicker((current) => !current)
                      }
                      disabled={profileStatus === "saving"}
                    >
                      <FiUserCheck />
                      Choose Avatar
                    </button>

                    {showAvatarPicker && (
                      <div className={styles.avatarPicker}>
                        <p className={styles.avatarPickerTitle}>
                          Select a profile avatar
                        </p>

                        <div className={styles.avatarGrid}>
                          {PROFILE_AVATARS.map((avatar) => {
                            const absoluteAvatarURL =
                              `${window.location.origin}${avatar.src}`;

                            const isSelected =
                              selectedAvatar === absoluteAvatarURL ||
                              (!selectedAvatar &&
                                currentUser?.photoURL === absoluteAvatarURL);

                            return (
                              <button
                                key={avatar.id}
                                type="button"
                                className={`${styles.avatarOption} ${
                                  isSelected
                                    ? styles.selectedAvatar
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedAvatar(absoluteAvatarURL);
                                  setPhotoPreview(absoluteAvatarURL);
                                  setShowAvatarPicker(false);
                                  setProfileStatus("idle");
                                  setProfileMessage("");
                                }}
                                disabled={profileStatus === "saving"}
                                aria-label={`Select ${avatar.alt}`}
                              >
                                <img
                                  src={avatar.src}
                                  alt={avatar.alt}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.profileFields}>
                    <div className={styles.formGroup}>
                      <label htmlFor="displayName">
                        Display Name
                      </label>

                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        maxLength={40}
                        onChange={(event) => {
                          setDisplayName(event.target.value);
                          setProfileStatus("idle");
                          setProfileMessage("");
                        }}
                        disabled={profileStatus === "saving"}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                      />

                      <p>Email cannot be changed</p>
                    </div>
                  </div>
                </div>

                <div className={styles.profileFooter}>
                  <div className={styles.saveArea}>
                    <button
                      type="button"
                      className={styles.saveButton}
                      onClick={handleSaveProfile}
                      disabled={profileStatus === "saving"}
                    >
                      {profileStatus === "saving" ? (
                        <>
                          <span
                            className={styles.buttonSpinner}
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiLock />
                  <h3>Account</h3>
                </div>

                <div className={styles.settingList}>
                  <button
                    type="button"
                    className={styles.settingRow}
                    onClick={openPasswordModal}
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
                    onClick={openLogoutModal}
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

            <div className={styles.rightColumn}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiHelpCircle />
                  <h3>Help &amp; Support</h3>
                </div>

                <div className={styles.settingList}>
                  <button
                    type="button"
                    className={styles.settingRow}
                    onClick={openHelpCentre}
                  >
                    <span className={styles.rowIcon}>
                      <FiHelpCircle />
                    </span>

                    <span className={styles.rowContent}>
                      <strong>Help Centre</strong>

                      <small>
                        Find guides and frequently asked questions
                      </small>
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

                      <small>
                        Let us know if something is not working
                      </small>
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

                      <small>
                        Get in touch with our support team
                      </small>
                    </span>

                    <FiChevronRight className={styles.chevron} />
                  </button>
                </div>
              </div>

              <div
                className={`${styles.card} ${styles.aboutCard}`}
              >
                <div className={styles.cardTitle}>
                  <FiInfo />
                  <h3>About ChroNUS</h3>
                </div>

                <p className={styles.aboutText}>
                  A smart study planner that helps students manage
                  tasks, priorities, schedules, and weekly
                  reflections.
                </p>

                <div className={styles.version}>
                  Version 1.0.0
                </div>
              </div>
            </div>
          </section>

          {showHelpModal && (
            <div
              className={styles.modalOverlay}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeHelpCentre();
                }
              }}
            >
              <div
                className={styles.helpModalBox}
                role="dialog"
                aria-modal="true"
                aria-labelledby="help-centre-title"
              >
                <div className={styles.helpModalHeader}>
                  <div className={styles.helpModalTitle}>
                    <div className={styles.helpModalIcon}>
                      <FiHelpCircle />
                    </div>

                    <div className={styles.helpModalTitleText}>
                      <h3>Help Centre</h3>

                      <p>
                        Learn how to use the main features of ChroNUS.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.helpCloseButton}
                    onClick={closeHelpCentre}
                    aria-label="Close Help Centre"
                  >
                    <FiX />
                  </button>
                </div>

                <div className={styles.helpModalBody}>
                  {HELP_CENTRE_ITEMS.map((item) => {
                    const isOpen =
                      openHelpItem === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`${styles.helpItem} ${
                          isOpen
                            ? styles.helpItemOpen
                            : ""
                        }`}
                      >
                        <button
                          type="button"
                          className={styles.helpQuestion}
                          onClick={() =>
                            toggleHelpItem(item.id)
                          }
                          aria-expanded={isOpen}
                        >
                          <span>{item.question}</span>

                          <FiChevronDown
                            className={`${
                              styles.helpQuestionIcon
                            } ${
                              isOpen
                                ? styles.helpQuestionIconOpen
                                : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div
                            className={styles.helpAnswer}
                          >
                            <div>{item.answer}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className={styles.helpModalFooter}>
                  <p>
                    Still need help? Use Contact Us to reach
                    the ChroNUS team.
                  </p>

                  <button
                    type="button"
                    className={styles.helpDoneButton}
                    onClick={closeHelpCentre}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {showLogoutModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalBox}>
                <div className={styles.modalIcon}>
                  {logoutStatus === "loading" ? (
                    <span
                      className={styles.modalSpinner}
                    ></span>
                  ) : logoutStatus === "error" ? (
                    "❌"
                  ) : (
                    <FiLogOut />
                  )}
                </div>

                <h3>
                  {logoutStatus === "loading"
                    ? "Logging Out"
                    : logoutStatus === "error"
                    ? "Logout Failed"
                    : "Log Out"}
                </h3>

                <p>{logoutMessage}</p>

                {logoutStatus === "confirm" && (
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() =>
                        setShowLogoutModal(false)
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}

                {logoutStatus === "error" && (
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() =>
                        setShowLogoutModal(false)
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {showPasswordModal && (
            <div
              className={styles.modalOverlay}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closePasswordModal();
                }
              }}
            >
              <div className={styles.passwordModalBox}>
                <div className={styles.passwordModalHeader}>
                  <div
                    className={styles.passwordModalIcon}
                  >
                    <FiLock />
                  </div>

                  <div>
                    <h3>Change Password</h3>

                    <p>
                      Enter your current password and choose a
                      new one.
                    </p>
                  </div>
                </div>

                {passwordStatus === "success" ? (
                  <div className={styles.passwordResult}>
                    <div
                      className={styles.passwordSuccessIcon}
                    >
                      ✓
                    </div>

                    <h3>Password Updated</h3>

                    <p>{passwordMessage}</p>

                    <button
                      type="button"
                      className={
                        styles.passwordPrimaryButton
                      }
                      onClick={closePasswordModal}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.passwordForm}>
                      <div
                        className={styles.passwordField}
                      >
                        <label htmlFor="currentPassword">
                          Current Password
                        </label>

                        <input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          placeholder="Enter your current password"
                          autoComplete="current-password"
                          onChange={(event) => {
                            setCurrentPassword(
                              event.target.value
                            );
                            setPasswordStatus("idle");
                            setPasswordMessage("");
                          }}
                          disabled={
                            passwordStatus === "loading"
                          }
                        />
                      </div>

                      <div
                        className={styles.passwordField}
                      >
                        <label htmlFor="newPassword">
                          New Password
                        </label>

                        <input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          placeholder="Enter a new password"
                          autoComplete="new-password"
                          onChange={(event) => {
                            setNewPassword(
                              event.target.value
                            );
                            setPasswordStatus("idle");
                            setPasswordMessage("");
                          }}
                          disabled={
                            passwordStatus === "loading"
                          }
                        />

                        <small>
                          Use at least 6 characters.
                        </small>
                      </div>

                      <div
                        className={styles.passwordField}
                      >
                        <label htmlFor="confirmPassword">
                          Confirm New Password
                        </label>

                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          placeholder="Enter the new password again"
                          autoComplete="new-password"
                          onChange={(event) => {
                            setConfirmPassword(
                              event.target.value
                            );
                            setPasswordStatus("idle");
                            setPasswordMessage("");
                          }}
                          disabled={
                            passwordStatus === "loading"
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              handleChangePassword();
                            }
                          }}
                        />
                      </div>
                    </div>

                    {passwordMessage && (
                      <p
                        className={`${
                          styles.passwordMessage
                        } ${
                          passwordStatus === "error"
                            ? styles.passwordErrorMessage
                            : styles.passwordLoadingMessage
                        }`}
                      >
                        {passwordMessage}
                      </p>
                    )}

                    <div
                      className={
                        styles.passwordModalActions
                      }
                    >
                      <button
                        type="button"
                        className={
                          styles.passwordCancelButton
                        }
                        onClick={closePasswordModal}
                        disabled={
                          passwordStatus === "loading"
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className={
                          styles.passwordPrimaryButton
                        }
                        onClick={handleChangePassword}
                        disabled={
                          passwordStatus === "loading"
                        }
                      >
                        {passwordStatus === "loading" ? (
                          <>
                            <span
                              className={
                                styles.passwordButtonSpinner
                              }
                            ></span>
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {showProfileModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.profileModalBox}>
                <div
                  className={`${
                    styles.profileModalIcon
                  } ${
                    profileStatus === "success"
                      ? styles.profileModalSuccess
                      : profileStatus === "error"
                      ? styles.profileModalError
                      : styles.profileModalLoading
                  }`}
                >
                  {profileStatus === "saving" ? (
                    <span
                      className={styles.modalSpinner}
                    ></span>
                  ) : profileStatus === "success" ? (
                    <FiUser />
                  ) : (
                    <FiAlertTriangle />
                  )}
                </div>

                <h3>
                  {profileStatus === "saving"
                    ? "Saving Profile"
                    : profileStatus === "success"
                    ? "Profile Updated"
                    : "Update Failed"}
                </h3>

                <p>{profileMessage}</p>

                {profileStatus !== "saving" && (
                  <button
                    type="button"
                    className={styles.profileModalButton}
                    onClick={() => {
                      setShowProfileModal(false);

                      if (
                        profileStatus === "success"
                      ) {
                        setProfileStatus("idle");
                        setProfileMessage("");
                      }
                    }}
                  >
                    {profileStatus === "success"
                      ? "Done"
                      : "Close"}
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;