import NavBar from "../components/NavBar";
import styles from "./Eisenhower.module.css";

function Eisenhower() {
  return (
    <div className={styles.page}>
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
            <button className={styles.settingButton}>ⓘ Urgent = within 3 days</button>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.redCard}`}>
            <div className={styles.statIcon}>⏰</div>
            <div>
              <h2>4</h2>
              <p>Urgent Tasks</p>
              <span>Due in 3 days or less</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.orangeCard}`}>
            <div className={styles.statIcon}>☆</div>
            <div>
              <h2>7</h2>
              <p>Important Tasks</p>
              <span>Marked as important</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purpleCard}`}>
            <div className={styles.statIcon}>📅</div>
            <div>
              <h2>1</h2>
              <p>Overdue Tasks</p>
              <span>Past the deadline</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.blueCard}`}>
            <div className={styles.statIcon}>📋</div>
            <div>
              <h2>12</h2>
              <p>Total Tasks</p>
              <span>All tasks</span>
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
                    !
                    </div>

                    <div>
                    <h2>Important & Urgent</h2>
                    <p>Do first</p>
                    </div>
                </div>

                </div>

                <div className={styles.task}>Finish CS2040 Assignment <span>Due Today</span></div>
                <div className={styles.task}>Prepare for CS2101 Quiz <span>Due Tomorrow</span></div>
                <div className={styles.task}>Submit Lab Report <span>Due in 2 days</span></div>
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

                <div className={styles.task}>Study for Midterms <span>Due in 10 days</span></div>
                <div className={styles.task}>Work on Final Project <span>Due in 14 days</span></div>
                <div className={styles.task}>Read Research Papers <span>Due in 1 week</span></div>
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

                <div className={styles.task}>Reply to Club Emails <span>Due Today</span></div>
                <div className={styles.task}>Buy Groceries <span>Due Tomorrow</span></div>
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

                <div className={styles.task}>Browse Social Media <span>No Deadline</span></div>
                <div className={styles.task}>Watch YouTube Videos <span>No Deadline</span></div>
                <div className={styles.task}>Online Shopping <span>No Deadline</span></div>
            </div>
            </section>
        </div>
      </main>
    </div>
  );
}

export default Eisenhower;