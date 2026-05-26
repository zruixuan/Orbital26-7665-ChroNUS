import NavBar from "../components/NavBar";
import styles from "./Eisenhower.module.css";

function Eisenhower() {
  return (
    <div className={styles.page}>
      <NavBar />

      <main className={styles.container}>
        <section className={styles.header}>
          <div>
            <h1 className={styles.title}>Eisenhower Matrix</h1>
            <p className={styles.subtitle}>
              Visualize and prioritize your tasks by urgency and importance.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.settingButton}>⚙ Matrix Settings</button>
            <button className={styles.settingButton}>
              ⓘ Urgent = within 3 days
            </button>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.redCard}`}>
            <div className={styles.statIcon}>⏰</div>
            <div>
              <h2>4</h2>
              <p>Urgent Tasks</p>
              <span className={styles.redSub}>Due in 3 days or less</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.orangeCard}`}>
            <div className={styles.statIcon}>☆</div>
            <div>
              <h2>7</h2>
              <p>Important Tasks</p>
              <span className={styles.orangeSub}>Marked as important</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purpleCard}`}>
            <div className={styles.statIcon}>📅</div>
            <div>
              <h2>1</h2>
              <p>Overdue Tasks</p>
              <span className={styles.purpleSub}>Past the deadline</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.blueCard}`}>
            <div className={styles.statIcon}>📋</div>
            <div>
              <h2>12</h2>
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

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.redDot}></div>
                  <span>Finish CS2040 Assignment</span>
                </div>
                <span>Due Today</span>
              </div>

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.redDot}></div>
                  <span>Prepare for CS2101 Quiz</span>
                </div>
                <span>Due Tomorrow</span>
              </div>

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.redDot}></div>
                  <span>Submit Lab Report</span>
                </div>
                <span>Due in 2 days</span>
              </div>

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

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.greenDot}></div>
                  <span>Study for Midterms</span>
                </div>
                <span>Due in 10 days</span>
              </div>

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.greenDot}></div>
                  <span>Work on Final Project</span>
                </div>
                <span>Due in 14 days</span>
              </div>

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.greenDot}></div>
                  <span>Read Research Papers</span>
                </div>
                <span>Due in 1 week</span>
              </div>

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

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.blueDot}></div>
                  <span>Reply to Club Emails</span>
                </div>
                <span>Due Today</span>
              </div>

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.blueDot}></div>
                  <span>Buy Groceries</span>
                </div>
                <span>Due Tomorrow</span>
              </div>

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

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.orangeDot}></div>
                  <span>Browse Social Media</span>
                </div>
                <span>No Deadline</span>
              </div>

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.orangeDot}></div>
                  <span>Watch YouTube Videos</span>
                </div>
                <span>No Deadline</span>
              </div>

              <div className={styles.task}>
                <div className={styles.taskLeft}>
                  <div className={styles.orangeDot}></div>
                  <span>Online Shopping</span>
                </div>
                <span>No Deadline</span>
              </div>

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
              <div className={`${styles.infoIcon} ${styles.redInfoIcon}`}>
                ⏰
              </div>
              <div className={styles.infoText}>
                <h3>Urgent</h3>
                <p>Tasks due within 3 days or overdue</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.orangeInfoIcon}`}>
                ★
              </div>
              <div className={styles.infoText}>
                <h3>Important</h3>
                <p>Tasks marked as important in Dashboard</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.grayInfoIcon}`}>
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