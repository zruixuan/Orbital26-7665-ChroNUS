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
import { useState, useEffect } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../api/firebase";

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

const handleAddAchievement = async () => {
  if (!newAchievement.trim()) return;

  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  const updatedAchievements = [
    ...customAchievements,
    newAchievement.trim(),
  ];

  setCustomAchievements(updatedAchievements);
  setNewAchievement("");
  setShowAchievementModal(false);

  const weekKey = formatDateKey(currentWeekStart);
  const reflectionId = `${currentUser.uid}_${weekKey}`;

  try {
    await setDoc(
      doc(db, "weeklyReflections", reflectionId),
      {
        userId: currentUser.uid,
        weekStart: weekKey,
        customAchievements: updatedAchievements,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Save achievement error:", error);
    alert("Failed to save achievement.");
  }
};

const [activities, setActivities] = useState([]);
const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      setCurrentUser(null);
      setActivities([]);
      return;
    }

    setCurrentUser(user);

    const activitiesQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const activityData = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.title,
          detail: data.detail,
          type: data.type,
          date: data.type === "event" ? data.startTime : data.deadline,
          completed: data.type === "event" ? true : data.completed,
          important: data.importance?.toLowerCase() === "important",
        };
      });

      console.log("Weekly activities:", activityData);

      setActivities(activityData);
    });

    return () => unsubscribeActivities();
  });

  return () => unsubscribeAuth();
}, []);

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const [currentWeekStart, setCurrentWeekStart] = useState(
  getStartOfWeek(new Date())
);

useEffect(() => {
  const loadReflection = async () => {
    setAnswers({
      proud: "",
      challenge: "",
      goal: "",
    });
    setCustomAchievements([]);

    if (!currentUser) return;

    const weekKey = formatDateKey(currentWeekStart);
    const reflectionId = `${currentUser.uid}_${weekKey}`;

    const docSnap = await getDoc(
      doc(db, "weeklyReflections", reflectionId)
    );

    if (docSnap.exists()) {
      const data = docSnap.data();

      setAnswers({
        proud: data.proud || "",
        challenge: data.challenge || "",
        goal: data.goal || "",
      });

      setCustomAchievements(data.customAchievements || []);
    }
  };

  loadReflection();
}, [currentUser, currentWeekStart]);

const currentWeekEnd = addDays(currentWeekStart, 7);

const currentWeekActivities = activities.filter((item) => {
  if (!item.date) return false;
  const itemDate = new Date(item.date.replace(" ", "T"));
  return itemDate >= currentWeekStart && itemDate < currentWeekEnd;
});

const nextWeekStart = currentWeekEnd;
const nextWeekEnd = addDays(currentWeekEnd, 7);

const goPreviousWeek = () => {
  setCurrentWeekStart((prev) => addDays(prev, -7));
};

const goNextWeek = () => {
  setCurrentWeekStart((prev) => addDays(prev, 7));
};

const formatWeekRange = (startDate) => {
  const endDate = addDays(startDate, 6);

  const startText = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const endText = endDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startText} – ${endText}`;
};

const formatDueDate = (dateString) => {
  const date = new Date(dateString.replace(" ", "T"));

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
};

const weeklyAchievements = currentWeekActivities.filter(
  (item) => item.type === "task" && item.completed
);

const nextWeekItems = activities
  .filter((item) => {
    const itemDate = new Date(item.date.replace(" ", "T"));
    return itemDate >= nextWeekStart && itemDate < nextWeekEnd;
  })
  .sort(
    (a, b) =>
      new Date(a.date.replace(" ", "T")) -
      new Date(b.date.replace(" ", "T"))
  )
  .slice(0, 3)
  .map((item) => ({
    title: item.title,
    due: formatDueDate(item.date),
    type: item.type,
  }));

const now = new Date();
  
const totalActivities = currentWeekActivities.length;

const completedActivities = currentWeekActivities.filter(
  (item) => item.completed
).length;

const importantDone = currentWeekActivities.filter(
  (item) => item.completed && item.important
).length;

const overdue = currentWeekActivities.filter(
  (item) =>
    item.type === "task" &&
    !item.completed &&
    new Date(item.date.replace(" ", "T")) < now
).length;

const completionRate =
  totalActivities === 0
    ? 0
    : Math.round((completedActivities / totalActivities) * 100);

const productivityScore = Math.min(
  100,
  Math.max(0, completionRate + importantDone * 2 - overdue * 5)
);

const DOT_COUNT = 10;

const weekDays = Array.from({ length: 7 }).map((_, index) => {
  const dateObj = addDays(currentWeekStart, index);

  return {
    day: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
    shortDay: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
    date: dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    fullDate: formatDateKey(dateObj),
  };
});

const activitiesByDay = weekDays.map((dayItem) => {
  const dayActivities = currentWeekActivities.filter(
    (item) =>
      item.date?.split(" ")[0] === dayItem.fullDate &&
      item.completed
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

const saveReflection = async () => {
  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

  const weekKey = formatDateKey(currentWeekStart);
  const reflectionId = `${currentUser.uid}_${weekKey}`;

  try {
    await setDoc(
      doc(db, "weeklyReflections", reflectionId),
      {
        userId: currentUser.uid,
        weekStart: weekKey,

        proud: answers.proud,
        challenge: answers.challenge,
        goal: answers.goal,

        updatedAt: new Date(),
      },
      { merge: true }
    );

    alert("Reflection saved!");
  } catch (error) {
    console.error("Save reflection error:", error);
    alert("Failed to save reflection.");
  }
};

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

              <div className={styles.weekSelector}>
                <button type="button" onClick={goPreviousWeek}>
                  <FiChevronLeft />
                </button>

                <FiCalendar />

                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "14px",
                    color: "#111827",
                  }}>
                  {formatWeekRange(currentWeekStart)}
                </span>

                <button type="button" onClick={goNextWeek}>
                  <FiChevronRight />
                </button>
              </div>
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
                <h2 style={{ color: "#daab54" }}>{importantDone}</h2>
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
                    <li key={item.id}>
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
            
            <button
              className={styles.saveButton}
              onClick={saveReflection}
            >
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