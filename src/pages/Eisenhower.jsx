import NavBar from "../components/NavBar";
import styles from "./Eisenhower.module.css";
import { useState, useEffect } from "react";

import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../api/firebase";
import { FiTrash2 } from "react-icons/fi";

function Eisenhower() {
  const [tasks, setTasks] = useState([]);
  const [urgentDays, setUrgentDays] = useState(3);
  const [showUrgentMenu, setShowUrgentMenu] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user logged in");
        setTasks([]);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));

        const taskList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (item) =>
              item.type === "task" &&
              item.userId === user.uid
          );

        setTasks(taskList);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const today = new Date();

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOverdueText = (deadlineString) => {
  const deadline = new Date(deadlineString);
  const diffMs = today - deadline;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return ` ❗️ ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} overdue`;
  }

  if (diffHours < 24) {
    return ` ❗️ ${diffHours} hour${diffHours > 1 ? "s" : ""} overdue`;
  }

  return ` ❗️ ${diffDays} day${diffDays > 1 ? "s" : ""} overdue`;
};

  const isUrgent = (task) => {
    const deadline = new Date(task.deadline);
    const diffTime = deadline - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= urgentDays;
  };

  const isImportant = (task) =>
    task.importance?.toLowerCase() === "important";

  const isUnimportant = (task) =>
    task.importance?.toLowerCase() === "unimportant";

  const displayImportance = (task) =>
    isImportant(task) ? "Important" : "Unimportant";

  let filteredTasks = tasks.filter(
  (task) => !task.completed
);

  if (activeFilter === "urgent") {
    filteredTasks = tasks.filter((task) => isUrgent(task));
  }

  if (activeFilter === "important") {
    filteredTasks = tasks.filter((task) => isImportant(task));
  }

  if (activeFilter === "overdue") {
    filteredTasks = tasks.filter((task) => {
      const deadline = new Date(task.deadline);

      return deadline < today && !task.completed;
    });
  }

  const importantUrgent = filteredTasks.filter(
    (task) => isImportant(task) && isUrgent(task)
  );

  const importantNotUrgent = filteredTasks.filter(
    (task) => isImportant(task) && !isUrgent(task)
  );

  const notImportantUrgent = filteredTasks.filter(
    (task) => isUnimportant(task) && isUrgent(task)
  );

  const notImportantNotUrgent = filteredTasks.filter(
    (task) => isUnimportant(task) && !isUrgent(task)
  );

  const urgentTasks = tasks.filter(
    (task) => !task.completed && isUrgent(task)
  );

  const importantTasks = tasks.filter(
    (task) => !task.completed && isImportant(task)
  );

  const overdueTasks = tasks.filter((task) => {
    const deadline = new Date(task.deadline);

    return deadline < today && !task.completed;
  });

  const totalTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const renderTask = (task, dotClass) => (
    <div className={styles.taskWrapper} key={task.id}>
      <div
        className={styles.task}
        onClick={() => setSelectedTask(task)}
      >
        <div className={styles.taskLeft}>
          <div className={dotClass}></div>
          <span>{task.title}</span>
        </div>

        <span
          className={
            new Date(task.deadline) < today && !task.completed
              ? styles.overdueText
              : ""
          }
        >
          {new Date(task.deadline) < today && !task.completed
            ? getOverdueText(task.deadline)
            : `Due: ${formatDateTime(task.deadline)}`}
        </span>
      </div>
    </div>
  );

  const renderPopover = (task) => (
    <div className={styles.taskPopover}>
      <div className={styles.popoverHeader}>
        <div className={styles.popoverIcon}>📝</div>
        <h3>{task.title}</h3>

        <button
          className={styles.popoverClose}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTask(null);
          }}
        >
          ×
        </button>
      </div>

      <div className={styles.popoverBody}>
        <div className={styles.popoverInfo}>
          <span className={styles.infoIcon}>⭐</span>
          <div>
            <p className={styles.infoLabel}>Importance</p>
            <span className={styles.orangeBadge}>
              {displayImportance(task)}
            </span>
          </div>
        </div>

        <div className={styles.popoverInfo}>
          <span className={styles.infoIcon}>🔵</span>
          <div>
            <p className={styles.infoLabel}>Completion</p>
            <span
              className={
                task.completed
                  ? styles.completedBadge
                  : styles.pendingBadge
              }
            >
              {task.completed ? "true" : "false"}
            </span>
          </div>
        </div>

        <div className={`${styles.popoverInfo} ${styles.fullWidthInfo}`}>
          <span className={styles.infoIcon}>⏰</span>
          <div>
            <p className={styles.infoLabel}>Deadline</p>
            <p className={styles.infoValue}>
              {formatDateTime(task.deadline)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.popoverDetail}>
        <p className={styles.detailLabel}>Detail</p>
        <div className={styles.detailBox}>
          {task.detail}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.eisenhowerShell}>
      <NavBar />

      <main className={styles.container}>
          <div>
            <div className={styles.sectionTitle}>
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
                <path d="M4 4h7v7H4z"/>
                <path d="M13 4h7v7h-7z"/>
                <path d="M4 13h7v7H4z"/>
                <path d="M13 13h7v7h-7z"/>
              </svg>

              Eisenhower Matrix
            </div>
          </div>

        <div className={styles.urgentRow}>
          <div className={styles.headerActions}>
            <button
              className={styles.settingButton}
              onClick={() => setShowUrgentMenu(!showUrgentMenu)}
            >
              <i className="ri-settings-3-line"></i>

              <span>
                Urgent = ⚙️ within {urgentDays} day
                {urgentDays > 1 ? "s" : ""}
              </span>
            </button>

            {showUrgentMenu && (
              <div className={styles.urgentDropdown}>
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      setUrgentDays(day);
                      setShowUrgentMenu(false);
                    }}
                  >
                    {day} Day{day > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.redCard}`}>
            <div className={styles.statIcon}>⏰</div>
            <div>
              <h2 style={{ color: "#f44336" }}>{urgentTasks.length}</h2>
              <p>Urgent Tasks</p>
              <span className={styles.redSub}>
                Due in {urgentDays} day{urgentDays > 1 ? "s" : ""} or less
              </span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.orangeCard}`}>
            <div className={styles.statIcon}>⭐️</div>
            <div>
              <h2 style={{ color: "#ff9800" }}>{importantTasks.length}</h2>
              <p>Important Tasks</p>
              <span className={styles.orangeSub}>Marked as important</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purpleCard}`}>
            <div className={styles.statIcon}>🗑️</div>
            <div>
              <h2 style={{ color: "#828080" }}>{overdueTasks.length}</h2>
              <p>Overdue Tasks</p>
              <span className={styles.purpleSub}>Past the deadline</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.blueCard}`}>
            <div className={styles.statIcon}>📋</div>
            <div>
              <h2 style={{ color: "#257cc9" }}>{totalTasks}</h2>
              <p>Total Tasks</p>
              <span className={styles.blueSub}>All tasks</span>
            </div>
          </div>
        </section>

        <section className={styles.filterTabs}>
          <button
            className={activeFilter === "all" ? styles.activeTab : ""}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>

          <button
            className={activeFilter === "urgent" ? styles.activeTab : ""}
            onClick={() => setActiveFilter("urgent")}
          >
            Urgent
          </button>

          <button
            className={activeFilter === "important" ? styles.activeTab : ""}
            onClick={() => setActiveFilter("important")}
          >
            Important
          </button>

          <button
            className={activeFilter === "overdue" ? styles.activeTab : ""}
            onClick={() => setActiveFilter("overdue")}
          >
            Overdue
          </button>
        </section>

        <div className={styles.matrixLabels}>
          <span>Urgent</span>
          <span>Not Urgent</span>
        </div>

        <div className={styles.matrixWrapper}>
          <div className={styles.verticalLabels}>
            <span>Important</span>
            <span>Unimportant</span>
          </div>

          <section className={styles.matrix}>
            <div className={`${styles.quadrant} ${styles.doFirst}`}>
              <div className={styles.quadrantHeader}>
                <div className={styles.quadrantTitleRow}>
                  <div className={`${styles.quadrantIcon} ${styles.redIcon}`}>
                    ⏰
                  </div>

                  <div>
                    <h2>Important & Urgent</h2>
                    <p>Do first</p>
                  </div>
                </div>
              </div>

              <div className={styles.taskList}>
                {importantUrgent.map((task) =>
                  renderTask(task, styles.redDot)
                )}
              </div>

              <div className={styles.quadrantFooter}>
                <span className={styles.redFooter}>
                  {importantUrgent.length} TASKS
                </span>
                <span className={styles.footerNote}>Focus on these now</span>
              </div>
            </div>

            <div className={`${styles.quadrant} ${styles.schedule}`}>
              <div className={styles.quadrantHeader}>
                <div className={styles.quadrantTitleRow}>
                  <div className={`${styles.quadrantIcon} ${styles.greenIcon}`}>
                    ★
                  </div>

                  <div>
                    <h2>Important & Not Urgent</h2>
                    <p>Schedule</p>
                  </div>
                </div>
              </div>

              <div className={styles.taskList}>
                {importantNotUrgent.map((task) =>
                  renderTask(task, styles.greenDot)
                )}
              </div>

              <div className={styles.quadrantFooter}>
                <span className={styles.greenFooter}>
                  {importantNotUrgent.length} TASKS
                </span>
                <span className={styles.footerNote}>
                  Plan and schedule these
                </span>
              </div>
            </div>

            <div className={`${styles.quadrant} ${styles.delegate}`}>
              <div className={styles.quadrantHeader}>
                <div className={styles.quadrantTitleRow}>
                  <div className={`${styles.quadrantIcon} ${styles.blueIcon}`}>
                    ⚑
                  </div>

                  <div>
                    <h2>Not Important & Urgent</h2>
                    <p>Delegate or reduce</p>
                  </div>
                </div>
              </div>

              <div className={styles.taskList}>
                {notImportantUrgent.map((task) =>
                  renderTask(task, styles.blueDot)
                )}
              </div>

              <div className={styles.quadrantFooter}>
                <span className={styles.blueFooter}>
                  {notImportantUrgent.length} TASKS
                </span>
                <span className={styles.footerNote}>
                  Try to delegate or reduce
                </span>
              </div>
            </div>

            <div className={`${styles.quadrant} ${styles.delete}`}>
              <div className={styles.quadrantHeader}>
                <div className={styles.quadrantTitleRow}>
                  <div className={`${styles.quadrantIcon} ${styles.orangeIcon}`}>
                    ×
                  </div>

                  <div>
                    <h2>Not Important & Not Urgent</h2>
                    <p>Eliminate</p>
                  </div>
                </div>
              </div>

              <div className={styles.taskList}>
                {notImportantNotUrgent.map((task) =>
                  renderTask(task, styles.orangeDot)
                )}
              </div>

              <div className={styles.quadrantFooter}>
                <span className={styles.orangeFooter}>
                  {notImportantNotUrgent.length} TASKS
                </span>
                <span className={styles.footerNote}>
                  Eliminate or do later
                </span>
              </div>
            </div>
          </section>
        </div>

         {selectedTask && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedTask(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {renderPopover(selectedTask)}
            </div>
          </div>
        )}       

        <section className={styles.howItWorks}>
          <h2>How It Works</h2>

          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon1} ${styles.redInfoIcon}`}>
                ⏰
              </div>

              <div className={styles.infoText}>
                <h3>Urgent</h3>
                <p>
                  Tasks due within {urgentDays} day
                  {urgentDays > 1 ? "s" : ""} or overdue
                </p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon1} ${styles.orangeInfoIcon}`}>
                ★
              </div>

              <div className={styles.infoText}>
                <h3>Important</h3>
                <p>Tasks marked as important in Dashboard</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon1} ${styles.grayInfoIcon}`}>
                ⊞
              </div>

              <div className={styles.infoText}>
                <h3>Auto Sorting</h3>
                <p>Tasks are automatically placed in the matrix</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}

export default Eisenhower;