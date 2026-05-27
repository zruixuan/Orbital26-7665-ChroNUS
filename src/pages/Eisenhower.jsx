import NavBar from "../components/NavBar";
import styles from "./Eisenhower.module.css";
import { useState } from "react";

function Eisenhower() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      category: "task",
      title: "Finish Assignment",
      detail: "Complete exercises",
      subject: "Study",
      date: "2026-05-26",
      deadline: "23:59",
      importance: "important",
      status: "pending",
    },

    {
      id: 2,
      category: "event",
      title: "Orbital Meeting",
      detail: "Frontend discussion",
      subject: "Work",
      date: "2026-05-26",
      deadline: "14:00",
      importance: "important",
      status: "pending",
    },

    {
      id: 3,
      category: "task",
      title: "Buy groceries",
      detail: "Milk and bread",
      subject: "Personal",
      date: "2026-05-30",
      deadline: "18:00",
      importance: "not-important",
      status: "pending",
    }
  ]);

  const [urgentDays, setUrgentDays] = useState(3);

  const [showUrgentMenu, setShowUrgentMenu] = useState(false);

  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const today = new Date();

  const isUrgent = (task) => {
    const taskDate = new Date(task.date);

    const diffTime = taskDate - today;

    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= urgentDays;
  };

  const importantUrgent = tasks.filter(
    task =>
      task.importance === "important" &&
      isUrgent(task)
  );

  const importantNotUrgent = tasks.filter(
    task =>
      task.importance === "important" &&
      !isUrgent(task) 
  );

  const notImportantUrgent = tasks.filter(
    task =>
      task.importance === "not-important" &&
      isUrgent(task)
  );

  const notImportantNotUrgent = tasks.filter(
    task =>
      task.importance === "not-important" &&
      !isUrgent(task)
  ); 

  const urgentTasks = tasks.filter(task => isUrgent(task));
  const importantTasks = tasks.filter(task => task.importance === "important");
  
  const overdueTasks = tasks.filter(task => {
    const taskDateTime = new Date(`${task.date}T${task.deadline}`);
    return taskDateTime < today;
  });

  const totalTasks = tasks.length;

  return (
    <div className={styles.page}>
      <NavBar />

      <main className={styles.container}>
        <section className={styles.header}>
          <div>
            <h1 className={styles.title}>Eisenhower Matrix</h1>
            <div className={styles.subtitleRow}>
              <p className={styles.subtitle}>
                Organize tasks visually with the Eisenhower Matrix.
              </p>

              <div className={styles.tipBadge}>
                ⓘ Customize what counts as “urgent” using the settings button.
              </div>
            </div>
          </div>

        <div className={styles.headerActions}>
          <button
            className={styles.settingButton}
            onClick={() => setShowUrgentMenu(!showUrgentMenu)}
          >
            <i className="ri-settings-3-line"></i>
            <span>Urgent = ⚙️ within {urgentDays} days</span>
          </button>

          {showUrgentMenu && (
            <div className={styles.urgentDropdown}>
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
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
        </section>

        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.redCard}`}>
            <div className={styles.statIcon}>⏰</div>
            <div>
              <h2>{urgentTasks.length}</h2>
              <p>Urgent Tasks</p>
              <span className={styles.redSub}>
                Due in {urgentDays} day{urgentDays > 1 ? "s" : ""} or less
              </span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.orangeCard}`}>
            <div className={styles.statIcon}>☆</div>
            <div>
              <h2>{importantTasks.length}</h2>
              <p>Important Tasks</p>
              <span className={styles.orangeSub}>Marked as important</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purpleCard}`}>
            <div className={styles.statIcon}>📅</div>
            <div>
              <h2>{overdueTasks.length}</h2>
              <p>Overdue Tasks</p>
              <span className={styles.purpleSub}>Past the deadline</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.blueCard}`}>
            <div className={styles.statIcon}>📋</div>
            <div>
              <h2>{totalTasks}</h2>
              <p>Total Tasks</p>
              <span className={styles.blueSub}>All tasks</span>
            </div>
          </div>
        </section>

        <section className={styles.filterTabs}>
          <button className={styles.activeTab}>All</button>
          <button>Urgent</button>
          <button>Important</button>
          <button>Overdue</button>
        </section>

        <div className={styles.matrixLabels}>
          <span>Urgent</span>
          <span>Not Urgent</span>
        </div>

        <div className={styles.matrixWrapper}>
          <div className={styles.verticalLabels}>
            <span>Important</span>
            <span>Not Important</span>
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

              {importantUrgent.map(task => (
                <div className={styles.taskWrapper} key={task.id}>
                  <div
                    className={styles.task}
                    onClick={() =>
                      setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                    }
                  >
                    <div className={styles.taskLeft}>
                      <div className={styles.redDot}></div>
                      <span>{task.title}</span>
                    </div>

                    <span>
                      Due: {task.date} {task.deadline}
                    </span>
                  </div>

                  {expandedTaskId === task.id && (
                    <div className={styles.taskPopover}>
                      <div className={styles.popoverHeader}>
                        <div className={styles.popoverIcon}>🗓️</div>
                        <h3>{task.title}</h3>
                        <button
                          className={styles.popoverClose}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTaskId(null);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className={styles.popoverBody}>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📚</span>
                          <div>
                            <p className={styles.infoLabel}>Subject</p>
                            <p className={styles.infoValue}>{task.subject}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⭐</span>
                          <div>
                            <p className={styles.infoLabel}>Importance</p>
                            <span className={styles.orangeBadge}>
                              {task.importance}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🏷️</span>
                          <div>
                            <p className={styles.infoLabel}>Category</p>
                            <p className={styles.infoValue}>{task.category}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🔵</span>
                          <div>
                            <p className={styles.infoLabel}>Status</p>
                            <span className={styles.blueBadge}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📅</span>
                          <div>
                            <p className={styles.infoLabel}>Date</p>
                            <p className={styles.infoValue}>{task.date}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⏰</span>
                          <div>
                            <p className={styles.infoLabel}>Deadline</p>
                            <p className={styles.infoValue}>{task.deadline}</p>
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
                  )}
                </div>
              ))}

              <div className={styles.quadrantFooter}>
                <span className={styles.redFooter}>3 TASKS</span>
                <span className={styles.footerNote}>Focus on these now</span>
              </div>
            </div>

            <div className={`${styles.quadrant} ${styles.schedule}`}>
              <div className={styles.quadrantHeader}>
                <div className={styles.quadrantTitleRow}>
                  <div
                    className={`${styles.quadrantIcon} ${styles.greenIcon}`}
                  >
                    ★
                  </div>

                  <div>
                    <h2>Important & Not Urgent</h2>
                    <p>Schedule</p>
                  </div>
                </div>
              </div>

              {importantNotUrgent.map(task => (
                <div className={styles.taskWrapper} key={task.id}>
                  <div
                    key={task.id}
                    className={styles.task}
                    onClick={() =>
                      setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                    }
                  >
                  <div className={styles.taskLeft}>
                    <div className={styles.greenDot}></div>
                    <span>{task.title}</span>
                  </div>

                  <span>
                    Due: {task.date} {task.deadline}
                  </span>

                  {expandedTaskId === task.id && (
                    <div className={styles.taskPopover}>
                      <div className={styles.popoverHeader}>
                        <div className={styles.popoverIcon}>🗓️</div>
                        <h3>{task.title}</h3>
                        <button
                          className={styles.popoverClose}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTaskId(null);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className={styles.popoverBody}>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📚</span>
                          <div>
                            <p className={styles.infoLabel}>Subject</p>
                            <p className={styles.infoValue}>{task.subject}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⭐</span>
                          <div>
                            <p className={styles.infoLabel}>Importance</p>
                            <span className={styles.orangeBadge}>
                              {task.importance}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🏷️</span>
                          <div>
                            <p className={styles.infoLabel}>Category</p>
                            <p className={styles.infoValue}>{task.category}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🔵</span>
                          <div>
                            <p className={styles.infoLabel}>Status</p>
                            <span className={styles.blueBadge}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📅</span>
                          <div>
                            <p className={styles.infoLabel}>Date</p>
                            <p className={styles.infoValue}>{task.date}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⏰</span>
                          <div>
                            <p className={styles.infoLabel}>Deadline</p>
                            <p className={styles.infoValue}>{task.deadline}</p>
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
                  )}
                 </div>
                </div>
              ))}

              <div className={styles.quadrantFooter}>
                <span className={styles.greenFooter}>3 TASKS</span>
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

              {notImportantUrgent.map(task => (
                <div className={styles.taskWrapper} key={task.id}>
                  <div
                    key={task.id}
                    className={styles.task}
                    onClick={() =>
                      setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                    }
                  >
                  <div className={styles.taskLeft}>
                    <div className={styles.blueDot}></div>
                    <span>{task.title}</span>
                  </div>

                  <span>
                    Due: {task.date} {task.deadline}
                  </span>

                  {expandedTaskId === task.id && (
                    <div className={styles.taskPopover}>
                      <div className={styles.popoverHeader}>
                        <div className={styles.popoverIcon}>🗓️</div>
                        <h3>{task.title}</h3>
                        <button
                          className={styles.popoverClose}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTaskId(null);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className={styles.popoverBody}>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📚</span>
                          <div>
                            <p className={styles.infoLabel}>Subject</p>
                            <p className={styles.infoValue}>{task.subject}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⭐</span>
                          <div>
                            <p className={styles.infoLabel}>Importance</p>
                            <span className={styles.orangeBadge}>
                              {task.importance}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🏷️</span>
                          <div>
                            <p className={styles.infoLabel}>Category</p>
                            <p className={styles.infoValue}>{task.category}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🔵</span>
                          <div>
                            <p className={styles.infoLabel}>Status</p>
                            <span className={styles.blueBadge}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📅</span>
                          <div>
                            <p className={styles.infoLabel}>Date</p>
                            <p className={styles.infoValue}>{task.date}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⏰</span>
                          <div>
                            <p className={styles.infoLabel}>Deadline</p>
                            <p className={styles.infoValue}>{task.deadline}</p>
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
                  )}
                </div>
                </div>
              ))}

              <div className={styles.quadrantFooter}>
                <span className={styles.blueFooter}>2 TASKS</span>
                <span className={styles.footerNote}>
                  Try to delegate or reduce
                </span>
              </div>
            </div>

            <div className={`${styles.quadrant} ${styles.delete}`}>
              <div className={styles.quadrantHeader}>
                <div className={styles.quadrantTitleRow}>
                  <div
                    className={`${styles.quadrantIcon} ${styles.orangeIcon}`}
                  >
                    ×
                  </div>

                  <div>
                    <h2>Not Important & Not Urgent</h2>
                    <p>Eliminate</p>
                  </div>
                </div>
              </div>

              {notImportantNotUrgent.map(task => (
                <div className={styles.taskWrapper} key={task.id}>
                  <div
                    key={task.id}
                    className={styles.task}
                    onClick={() =>
                      setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
                    }
                  >
                  <div className={styles.taskLeft}>
                    <div className={styles.orangeDot}></div>
                    <span>{task.title}</span>
                  </div>

                  <span>
                    Due: {task.date} {task.deadline}
                  </span>

                  {expandedTaskId === task.id && (
                    <div className={styles.taskPopover}>
                      <div className={styles.popoverHeader}>
                        <div className={styles.popoverIcon}>🗓️</div>
                        <h3>{task.title}</h3>
                        <button
                          className={styles.popoverClose}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTaskId(null);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className={styles.popoverBody}>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📚</span>
                          <div>
                            <p className={styles.infoLabel}>Subject</p>
                            <p className={styles.infoValue}>{task.subject}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⭐</span>
                          <div>
                            <p className={styles.infoLabel}>Importance</p>
                            <span className={styles.orangeBadge}>
                              {task.importance}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🏷️</span>
                          <div>
                            <p className={styles.infoLabel}>Category</p>
                            <p className={styles.infoValue}>{task.category}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>🔵</span>
                          <div>
                            <p className={styles.infoLabel}>Status</p>
                            <span className={styles.blueBadge}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>📅</span>
                          <div>
                            <p className={styles.infoLabel}>Date</p>
                            <p className={styles.infoValue}>{task.date}</p>
                          </div>
                        </div>
                        <div className={styles.popoverInfo}>
                          <span className={styles.infoIcon}>⏰</span>
                          <div>
                            <p className={styles.infoLabel}>Deadline</p>
                            <p className={styles.infoValue}>{task.deadline}</p>
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
                  )}
                </div>
                </div>
              ))}

              <div className={styles.quadrantFooter}>
                <span className={styles.orangeFooter}>3 TASKS</span>
                <span className={styles.footerNote}>
                  Eliminate or do later
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.howItWorks}>
          <h2>How It Works</h2>

          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon1} ${styles.redInfoIcon}`}>
                ⏰
              </div>
              <div className={styles.infoText}>
                <h3>Urgent</h3>
                <p>Tasks due within 3 days or overdue</p>
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
  );
}

export default Eisenhower;