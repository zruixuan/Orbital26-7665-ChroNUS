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
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function WeeklyReflection() {
const navigate = useNavigate();
const [answers, setAnswers] = useState({
  proud: "",
  challenge: "",
  goal: "",
});

const [showAchievementModal, setShowAchievementModal] = useState(false);
const [customAchievements, setCustomAchievements] = useState([]);
const [newAchievement, setNewAchievement] = useState("");

const maxLength = 500;

const handleAnswerChange = (key, value) => {
  if (value.length <= maxLength) {
    setAnswers({
      ...answers,
      [key]: value,
    });
  }
};

const handleAddAchievement = () => {
  if (!newAchievement.trim()) return;

  setCustomAchievements([
    ...customAchievements,
    newAchievement.trim(),
  ]);

  setNewAchievement("");
  setShowAchievementModal(false);
};

const activities = [
  // Monday: 10 tasks + 2 events = 12
  ...Array.from({ length: 10 }).map((_, i) => ({
    title: `Monday Task ${i + 1}`,
    type: "task",
    date: "2026-06-01",
    completed: true,
    important: i < 3,
  })),
  ...Array.from({ length: 2 }).map((_, i) => ({
    title: `Monday Event ${i + 1}`,
    type: "event",
    date: "2026-06-01",
    completed: true,
    important: false,
  })),

  // Tuesday: 9 tasks + 3 events = 12
  ...Array.from({ length: 9 }).map((_, i) => ({
    title: `Tuesday Task ${i + 1}`,
    type: "task",
    date: "2026-06-02",
    completed: true,
    important: i < 2,
  })),
  ...Array.from({ length: 3 }).map((_, i) => ({
    title: `Tuesday Event ${i + 1}`,
    type: "event",
    date: "2026-06-02",
    completed: true,
    important: false,
  })),

  // Wednesday: 8 tasks + 4 events = 12
  ...Array.from({ length: 8 }).map((_, i) => ({
    title: `Wednesday Task ${i + 1}`,
    type: "task",
    date: "2026-06-03",
    completed: true,
    important: i < 2,
  })),
  ...Array.from({ length: 4 }).map((_, i) => ({
    title: `Wednesday Event ${i + 1}`,
    type: "event",
    date: "2026-06-03",
    completed: true,
    important: false,
  })),

  // Thursday: 6 tasks + 6 events = 12
  ...Array.from({ length: 6 }).map((_, i) => ({
    title: `Thursday Task ${i + 1}`,
    type: "task",
    date: "2026-06-04",
    completed: true,
    important: i < 2,
  })),
  ...Array.from({ length: 6 }).map((_, i) => ({
    title: `Thursday Event ${i + 1}`,
    type: "event",
    date: "2026-06-04",
    completed: true,
    important: false,
  })),

  // Friday: 10 tasks + 2 events = 12
  ...Array.from({ length: 10 }).map((_, i) => ({
    title: `Friday Task ${i + 1}`,
    type: "task",
    date: "2026-06-05",
    completed: true,
    important: i < 3,
  })),
  ...Array.from({ length: 2 }).map((_, i) => ({
    title: `Friday Event ${i + 1}`,
    type: "event",
    date: "2026-06-05",
    completed: true,
    important: false,
  })),

  // Saturday: 7 tasks + 5 events = 12
  ...Array.from({ length: 7 }).map((_, i) => ({
    title: `Saturday Task ${i + 1}`,
    type: "task",
    date: "2026-06-06",
    completed: true,
    important: i < 2,
  })),
  ...Array.from({ length: 5 }).map((_, i) => ({
    title: `Saturday Event ${i + 1}`,
    type: "event",
    date: "2026-06-06",
    completed: true,
    important: false,
  })),

  // Sunday: 5 tasks + 7 events = 12
  ...Array.from({ length: 5 }).map((_, i) => ({
    title: `Sunday Task ${i + 1}`,
    type: "task",
    date: "2026-06-07",
    completed: true,
    important: i < 1,
  })),
  ...Array.from({ length: 7 }).map((_, i) => ({
    title: `Sunday Event ${i + 1}`,
    type: "event",
    date: "2026-06-07",
    completed: true,
    important: false,
  })),

  // Next week priorities: 5 items
  {
    title: "CP2106 Project Milestone",
    type: "event",
    date: "2026-06-12",
    completed: false,
    important: false,
  },
  {
    title: "CS2040 Assignment 2",
    type: "task",
    date: "2026-06-14",
    completed: false,
    important: false,
  },
  {
    title: "Orbital 26 Meeting",
    type: "event",
    date: "2026-06-16",
    completed: false,
    important: false,
  },
  {
    title: "MA1521 Quiz",
    type: "task",
    date: "2026-06-18",
    completed: false,
    important: false,
  },
  {
    title: "Team Progress Check",
    type: "event",
    date: "2026-06-20",
    completed: false,
    important: false,
  },
];

const weeklyAchievements = activities.filter(
  item => item.type === "task" && item.completed
);

const formatDueDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
};

const nextWeekStart = new Date("2026-06-08");
const nextWeekEnd = new Date("2026-06-15");

const nextWeekItems = activities
  .filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= nextWeekStart && itemDate < nextWeekEnd;
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 3)
  .map((item) => ({
    title: item.title,
    due: formatDueDate(item.date),
    type: item.type,
  }));

const totalActivities = activities.length;
const completedActivities = activities.filter(item => item.completed).length;
const importantDone = activities.filter(item => item.completed && item.important).length;
const overdue = activities.filter(item => !item.completed && new Date(item.date) < new Date("2026-06-05")).length;

const completionRate = Math.round((completedActivities / totalActivities) * 100);
const productivityScore = Math.min(100, completionRate + importantDone * 2 - overdue * 5);

const DOT_COUNT = 10;

const weekDays = [
  { day: "Monday", shortDay: "Mon", date: "1 Jun", fullDate: "2026-06-01" },
  { day: "Tuesday", shortDay: "Tue", date: "2 Jun", fullDate: "2026-06-02" },
  { day: "Wednesday", shortDay: "Wed", date: "3 Jun", fullDate: "2026-06-03" },
  { day: "Thursday", shortDay: "Thu", date: "4 Jun", fullDate: "2026-06-04" },
  { day: "Friday", shortDay: "Fri", date: "5 Jun", fullDate: "2026-06-05" },
  { day: "Saturday", shortDay: "Sat", date: "6 Jun", fullDate: "2026-06-06" },
  { day: "Sunday", shortDay: "Sun", date: "7 Jun", fullDate: "2026-06-07" },
];

const activitiesByDay = weekDays.map((dayItem) => {
  const dayActivities = activities.filter(
    (item) => item.date === dayItem.fullDate && item.completed
  );

  const tasks = dayActivities.filter((item) => item.type === "task").length;
  const events = dayActivities.filter((item) => item.type === "event").length;

  return {
    ...dayItem,
    tasks,
    events,
    total: tasks + events,
  };
});

const maxTotal = Math.max(...activitiesByDay.map((item) => item.total));

const mostProductiveDays = activitiesByDay
  .filter((item) => item.total === maxTotal && maxTotal > 0)
  .map((item) => item.day);

const productiveDayText = mostProductiveDays.join(" & ");

const overdueText =
  overdue === 0
    ? "You have no overdue items this week. Great job!"
    : `You still have ${overdue} overdue item${overdue > 1 ? "s" : ""} that need attention.`;

const recommendation =
  overdue > 0
    ? "Try starting urgent tasks earlier next week to reduce last-minute pressure and keep your schedule more balanced."
    : "Keep your current pace and continue reviewing your weekly priorities regularly.";
  
  
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
                <h2 style={{ color: "#257cc9" }}>{totalActivities}</h2>
                <p>Total Activities</p>
                <span className={styles.blueSub}>All tasks & events</span>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.greenCard}`}>
                <div className={styles.statIcon}>✅</div>
                <div>
                <h2 style={{ color: "#34a853" }}>{completedActivities}</h2>
                <p>Completed</p>
                <span className={styles.greenSub}>{completionRate}% completion rate</span>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.orangeCard}`}>
                <div className={styles.statIcon}>⭐</div>
                <div>
                <h2 style={{ color: "#828080" }}>{overdue}</h2>
                <p>Important Done</p>
                <span className={styles.orangeSub}>Marked as important</span>
                </div>
            </div>

            <div className={`${styles.statCard} ${styles.grayCard}`}>
            <div className={styles.statIcon}>🗑️</div>

            <div>
                <h2 style={{ color: "#828080" }}>{overdue}</h2>
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
                  {weeklyAchievements.map((item) => (
                    <li key={item.title}>
                      <FiCheckCircle />
                      <span>Completed {item.title}</span>
                    </li>
                  ))}

                  {customAchievements.map((item, index) => (
                    <li key={`custom-${index}`}>
                      <FiCheckCircle />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={styles.addAchievement}
                  onClick={() => setShowAchievementModal(true)}
                >
                  <FiPlus />
                  <span>Add your own achievement</span>
                </button>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FiCalendar />
                  <h3>Upcoming Priorities (Next Week)</h3>
                </div>

                <div className={styles.nextList}>
                  {nextWeekItems.map((item) => (
                    <div className={styles.nextItem} key={`${item.title}-${item.due}`}>
                      <div className={styles.priorityBar}></div>

                      {item.type === "event" ? <FiClock /> : <FiClipboard />}

                      <div>
                        <strong>{item.title}</strong>
                        <p>Due: {item.due}</p>
                      </div>

                      <span>
                        {item.type === "event" ? "Event" : "Task"}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                    className={styles.viewSchedule}
                    onClick={() => {
                        navigate("/dashboard");
                        setTimeout(() => {
                        window.scrollTo(0, 0);
                        }, 0);
                    }}
                    >
                    View full schedule →
                </button>
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
                {activitiesByDay.map(({ shortDay, date, tasks, events }) => (
                  <div className={styles.dayRow} key={shortDay}>
                    <div className={styles.dayLabel}>
                      <strong>{shortDay}</strong>
                      <span>{date}</span>
                    </div>

                    <div className={styles.trackWrap}>
                      <div className={styles.trackLine}>
                        <span>Tasks</span>

                        <div className={styles.dots}>
                          {Array.from({ length: DOT_COUNT }).map((_, i) => (
                            <b
                              key={i}
                              className={
                                i < Math.min(tasks, DOT_COUNT)
                                  ? styles.taskDot
                                  : styles.emptyDot
                              }
                            />
                          ))}
                        </div>

                        <em>{tasks}</em>
                      </div>

                      <div className={styles.trackLine}>
                        <span>Events</span>

                        <div className={styles.dots}>
                          {Array.from({ length: DOT_COUNT }).map((_, i) => (
                            <b
                              key={i}
                              className={
                                i < Math.min(events, DOT_COUNT)
                                  ? styles.eventDot
                                  : styles.emptyDot
                              }
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
                Most productive day{mostProductiveDays.length > 1 ? "s" : ""}:{" "}
                <strong>{productiveDayText || "No completed activities"}</strong>
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
            <label>
                1. What achievement are you most proud of this week?
            </label>

            <textarea
                value={answers.proud}
                maxLength={500}
                onChange={(e) => handleAnswerChange("proud", e.target.value)}
                placeholder="Share your proudest moment..."
            />

            <span>{answers.proud.length}/500</span>
            </div>

            <div className={styles.questionGroup}>
            <label>
                2. What challenges affected your productivity?
            </label>

            <textarea
                value={answers.challenge}
                maxLength={500}
                onChange={(e) => handleAnswerChange("challenge", e.target.value)}
                placeholder="Share the challenges you faced..."
            />

            <span>{answers.challenge.length}/500</span>
            </div>

            <div className={styles.questionGroup}>
            <label>
                3. What is your main goal for next week?
            </label>

            <textarea
                value={answers.goal}
                maxLength={500}
                onChange={(e) => handleAnswerChange("goal", e.target.value)}
                placeholder="What will you focus on next week?"
            />

            <span>{answers.goal.length}/500</span>
            </div>
            
              <button className={styles.saveButton}>
                Save Reflection
              </button>
            </div>

            <div className={`${styles.card} ${styles.aiCard}`}>
              <div className={styles.aiCoachHeader}>
                <div className={styles.aiAvatar}>🤖</div>

                <div>
                  <h3>AI Weekly Coach ✨</h3>
                  <p>Powered by Orbital AI</p>
                </div>
              </div>

              <div className={styles.scoreBox}>
                <div className={styles.scoreTop}>
                  <span>Productivity Score</span>
                  <strong>{productivityScore} <em>/ 100</em></strong>
                </div>

                <div className={styles.scoreBar}>
                  <div
                    className={styles.scoreFill}
                    style={{ width: `${productivityScore}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.aiPointList}>
                <div className={styles.aiPoint}>
                  <span className={styles.greenCircle}>✓</span>
                  <p>You completed {completionRate}% of your activities this week. Keep it up!</p>
                </div>

                <div className={styles.aiPoint}>
                  <span className={styles.blueCircle}>↗</span>
                  <p>
                    Your most productive day{mostProductiveDays.length > 1 ? "s were" : " was"}{" "}
                    {productiveDayText || "not available yet"}.
                  </p>
                </div>

                <div className={styles.aiPoint}>
                  <span className={styles.yellowCircle}>!</span>
                  <p>{overdueText}</p>
                </div>
              </div>

              <div className={styles.recommendBox}>
                <h4>💡 Recommendation</h4>
                <p>{recommendation}</p>
              </div>

              <button className={styles.generateButton}>
                Generate Again
              </button>
            </div>
          </section>
        
        {showAchievementModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.modalHeader}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f15c22"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 21h8"/>
                  <path d="M12 17v4"/>
                  <path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/>
                  <path d="M5 6H3a2 2 0 0 0 2 4"/>
                  <path d="M19 6h2a2 2 0 0 1-2 4"/>
                </svg>
                <h3>Add Your Own Achievement</h3>
              </div>

              <textarea
                className={styles.modalInput}
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Enter your achievement..."
              />

              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowAchievementModal(false)}
                >
                  Cancel
                </button>

                <button
                  className={styles.addBtn}
                  onClick={handleAddAchievement}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        
        </main>
      </div>
    </div>
  );
}

export default WeeklyReflection;