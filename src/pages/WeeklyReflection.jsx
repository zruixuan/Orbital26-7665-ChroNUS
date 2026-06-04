import styles from "./WeeklyReflection.module.css";
import {
  FiEdit3,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClipboard,
  FiCheckCircle,
  FiStar,
  FiClock,
  FiAward,
  FiPlus,
  FiBarChart2,
  FiZap,
  FiSave,
} from "react-icons/fi";
import NavBar from "../components/NavBar";

function WeeklyReflection() {
  return (
    <div className={styles.reflectionPage}>
      <div className={styles.reflectionShell}>
        <NavBar />

        <main className={styles.container}>
          <div className={styles.reflectionHeader}>
            <div className={styles.reflectionTitleWrap}>
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
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
              Weekly Reflection
            </div>

            <button className={styles.weekSelector}>
              <FiChevronLeft />
              <FiCalendar />
              <span>1 – 7 June 2026</span>
              <FiChevronRight />
            </button>
          </div>

            <section className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.blueCard}`}>
                <div className={styles.statIcon}>📋</div>
                <div>
                <h2 style={{ color: "#257cc9" }}>27</h2>
                <p>Total Activities</p>
                <span className={styles.blueSub}>All tasks & events</span>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.greenCard}`}>
                <div className={styles.statIcon}>✅</div>
                <div>
                <h2 style={{ color: "#34a853" }}>20</h2>
                <p>Completed</p>
                <span className={styles.greenSub}>74% completion rate</span>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.orangeCard}`}>
                <div className={styles.statIcon}>⭐</div>
                <div>
                <h2 style={{ color: "#ff9800" }}>11</h2>
                <p>Important Done</p>
                <span className={styles.orangeSub}>Marked as important</span>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.grayCard}`}>
            <div className={styles.statIcon}>🗑️</div>

            <div>
                <h2 style={{ color: "#828080" }}>2</h2>
                <p>Overdue</p>
                <span className={styles.graySub}>
                Past the deadline
                </span>
            </div>
            </div>
            </section>
          
          <section className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiAward />
                  <h3>Weekly Achievements</h3>
                </div>

                <ul className={styles.achievementList}>
                  <li><FiCheckCircle />Completed CP2106 Mission Control #2</li>
                  <li><FiCheckCircle />Finished CS2040 Lecture Review</li>
                  <li><FiCheckCircle />Updated Dashboard UI and connected Firebase</li>
                  <li><FiCheckCircle />Organized tasks with Eisenhower Matrix</li>
                  <li><FiCheckCircle />Submitted Assignment 3</li>
                </ul>

                <div className={styles.addAchievement}>
                  <FiPlus />
                  <span>Add your own achievement</span>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiCalendar />
                  <h3>Looking Ahead (Next Week)</h3>
                </div>

                <div className={styles.nextList}>
                  <div className={styles.nextItem}>
                    <FiClock />
                    <div>
                      <strong>CP2106 Project Milestone</strong>
                      <p>Due: 12 Jun 2026 (Fri)</p>
                    </div>
                    <span>Event</span>
                  </div>

                  <div className={styles.nextItem}>
                    <FiClipboard />
                    <div>
                      <strong>CS2040 Assignment 2</strong>
                      <p>Due: 14 Jun 2026 (Sun)</p>
                    </div>
                    <span>Task</span>
                  </div>

                  <div className={styles.nextItem}>
                    <FiClock />
                    <div>
                      <strong>Orbital 26 Meeting</strong>
                      <p>Due: 16 Jun 2026 (Tue)</p>
                    </div>
                    <span>Event</span>
                  </div>
                </div>

                <button className={styles.viewSchedule}>View full schedule →</button>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <FiBarChart2 />
                <h3>Activities by Day</h3>
              </div>

              <div className={styles.legend}>
                <span><b className={styles.taskDot}></b>Tasks</span>
                <span><b className={styles.eventDot}></b>Events</span>
              </div>

              <div className={styles.dayChart}>
                {[
                  ["Mon", "1 Jun", 3, 2],
                  ["Tue", "2 Jun", 5, 3],
                  ["Wed", "3 Jun", 6, 2],
                  ["Thu", "4 Jun", 5, 3],
                  ["Fri", "5 Jun", 4, 1],
                  ["Sat", "6 Jun", 2, 1],
                  ["Sun", "7 Jun", 1, 0],
                ].map(([day, date, tasks, events]) => (
                  <div className={styles.dayRow} key={day}>
                    <div className={styles.dayLabel}>
                      <strong>{day}</strong>
                      <span>{date}</span>
                    </div>

                    <div className={styles.trackWrap}>
                      <div className={styles.trackLine}>
                        <span>Tasks</span>
                        <div className={styles.dots}>
                          {Array.from({ length: 12 }).map((_, i) => (
                            <b
                              key={i}
                              className={i < tasks ? styles.taskDot : styles.emptyDot}
                            />
                          ))}
                        </div>
                        <em>{tasks}</em>
                      </div>

                      <div className={styles.trackLine}>
                        <span>Events</span>
                        <div className={styles.dots}>
                          {Array.from({ length: 12 }).map((_, i) => (
                            <b
                              key={i}
                              className={i < events ? styles.eventDot : styles.emptyDot}
                            />
                          ))}
                        </div>
                        <em>{events}</em>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className={styles.productiveDay}>
                Most productive day: <strong>Thursday</strong>
              </p>
            </div>
          </section>

          <section className={styles.bottomGrid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <FiEdit3 />
                <h3>Reflection Questions</h3>
              </div>

              <div className={styles.questionGroup}>
                <label>1. What achievement are you most proud of this week?</label>
                <textarea placeholder="Share your proudest moment..." />
                <span>0/500</span>
              </div>

              <div className={styles.questionGroup}>
                <label>2. What challenges affected your productivity?</label>
                <textarea placeholder="Share the challenges you faced..." />
                <span>0/500</span>
              </div>

              <div className={styles.questionGroup}>
                <label>3. What is your main goal for next week?</label>
                <textarea placeholder="What will you focus on next week?" />
                <span>0/500</span>
              </div>

              <button className={styles.saveButton}>
                <FiSave />
                Save Reflection
              </button>
            </div>

            <div className={styles.card}>
              <div className={styles.aiHeader}>
                <div className={styles.cardTitle}>
                  <FiZap />
                  <h3>AI Reflection & Suggestions</h3>
                </div>
                <button>Generate New</button>
              </div>

              <div className={styles.aiBox}>
                <div className={styles.robot}>🤖</div>
                <div className={styles.aiText}>
                  <p>
                    Great job! You completed 74% of your activities this week and stayed
                    consistent throughout, especially on Thursday.
                  </p>
                  <p>
                    You handled important tasks well, but there are a few overdue items.
                    Try starting urgent tasks earlier to reduce last-minute rush.
                  </p>
                  <p>
                    Next week, focus on your key milestones and keep building on your
                    productive days! 💪
                  </p>

                  <div className={styles.aiTags}>
                    <span>Plan Ahead</span>
                    <span>Focus on Priorities</span>
                    <span>Stay Consistent</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default WeeklyReflection;