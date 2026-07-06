// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import TimelineItem from "../components/TimelineItem";
import NavBar from "../components/NavBar";
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../api/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRef } from "react";


const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const NUSMODS_ACAD_YEAR = "2026-2027";

const SEMESTER_START_DATES = {
  "2026-2027-1": "2026-08-10",
  "2026-2027-2": "2027-01-12",
};

const LESSON_TYPE_MAP = {
  LEC: "Lecture",
  TUT: "Tutorial",
  LAB: "Laboratory",
  REC: "Recitation",
  SEC: "Sectional Teaching",
};

const DAY_OFFSET = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

const formatNusmodsTime = (time) => {
  if (!time) return "00:00";
  return `${time.slice(0, 2)}:${time.slice(2)}`;
};

const getLessonDate = (semesterStartDate, week, day) => {
  const date = new Date(`${semesterStartDate}T00:00:00`);

  const recessWeekOffset = week >= 7 ? 7 : 0;

  date.setDate(
    date.getDate() + (week - 1) * 7 + recessWeekOffset + DAY_OFFSET[day]
  );

  return getLocalDateString(date);
};

const normalizeWeeks = (weeks) => {
  if (Array.isArray(weeks)) {
    return weeks;
  }

  if (typeof weeks === "number") {
    return [weeks];
  }

  if (weeks && typeof weeks === "object") {
    const result = [];

    if (weeks.start && weeks.end) {
      const interval = weeks.interval || 1;

      for (let week = weeks.start; week <= weeks.end; week += interval) {
        result.push(week);
      }

      return result;
    }
  }

  return [];
};

const parseNusmodsShareUrl = (urlText) => {
  const url = new URL(urlText.trim());

  const semMatch = url.pathname.match(/sem-(\d)/);
  const semester = semMatch ? Number(semMatch[1]) : 1;

  const modules = [];

  url.searchParams.forEach((value, moduleCode) => {
    if (!/^[A-Z]{2,4}\d{4}[A-Z]{0,3}$/.test(moduleCode)) return;

    const lessons = value
      .split(",")
      .map((part) => {
        const [lessonTypeAbbr, classNo] = part.split(":");

        return {
          lessonType: LESSON_TYPE_MAP[lessonTypeAbbr] || lessonTypeAbbr,
          classNo,
        };
      })
      .filter((lesson) => lesson.lessonType && lesson.classNo);

    modules.push({
      moduleCode,
      lessons,
    });
  });

  return {
    semester,
    modules,
  };
};

function Dashboard() {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  const currentFullTime = `${getLocalDateString(now)} ${currentTimeStr}`;

  const later = new Date(now);
  later.setHours(later.getHours() + 1);
  const laterHours = String(later.getHours()).padStart(2, '0');
  const laterMinutes = String(later.getMinutes()).padStart(2, '0');
  const timePlusOneHourStr = `${laterHours}:${laterMinutes}`;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateStr = getLocalDateString(selectedDate);

  // Carousel Dates
  const generateCarouselDates = (centerDate) => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const carouselDates = generateCarouselDates(selectedDate);
  const formattedSelectedText = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(selectedDate);

  const shiftDate = (days) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  // Go To Today  
  const goToToday = () => setSelectedDate(new Date());
  const isCurrentlyToday = selectedDateStr === getLocalDateString(now);

  // Jump To
  const [jumpDate, setJumpDate] = useState("");
  const isJumpDateValid = (() => {
    const reg = /^\d{4}-\d{2}-\d{2}$/;
    if (!reg.test(jumpDate)) return false;
    const [y, m, d] = jumpDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  })();

  const handleJumpChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8)
      value = value.slice(0, 8);
    if (value.length > 4)
      value = value.slice(0, 4) + "-" + value.slice(4);
    if (value.length > 7)
      value = value.slice(0, 7) + "-" + value.slice(7);
    setJumpDate(value);
  };

const jumpCalendarRef = useRef(null);
const [showJumpCalendar, setShowJumpCalendar] = useState(false);
const [jumpCalendarMonth, setJumpCalendarMonth] = useState(new Date());

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      jumpCalendarRef.current &&
      !jumpCalendarRef.current.contains(event.target)
    ) {
      setShowJumpCalendar(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const getJumpCalendarDays = () => {
  const year = jumpCalendarMonth.getFullYear();
  const month = jumpCalendarMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;

  const startDate = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
};

const shiftJumpCalendarMonth = (monthOffset) => {
  setJumpCalendarMonth((prev) => {
    const next = new Date(prev);
    next.setMonth(prev.getMonth() + monthOffset);
    return next;
  });
};

const handleCalendarDateClick = (dateObj) => {
  setJumpDate(getLocalDateString(dateObj));
  setShowJumpCalendar(false);
};

  const handleJumpConfirm = () => {
    if (!isJumpDateValid)
      return;
    const [y, m, d] = jumpDate.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d));
    setJumpDate("");
  };

  // Mock Data 
  const tutorialTasks = [
    {
      id: 1, type: "event",
      title: "CP2106 Orbital Mission Control #2",
      detail: "Discuss core features with teammate",
      startTime: `${getLocalDateString(now)} 10:00`,
      endTime: `${getLocalDateString(now)} 12:00`,
      importance: "Important"
    },
    {
      id: 2, type: "task",
      title: "CS2040 Lecture Review",
      detail: "Review graph traversal algorithms",
      deadline: `${getLocalDateString(now)} 14:00`,
      completed: false,
      importance: "Unimportant"
    },
    {
      id: 3, type: "task",
      title: "CP2106 Orbital Web app development: Implement Dashboard feature",
      detail: "Refactor data schema and UI components",
      deadline: `${getLocalDateString(now)} 16:00`,
      completed: false,
      importance: "Important"
    },
    {
      id: 4, type: "task",
      title: "Finish CS2040S PS6",
      detail: "Implement amortized analysis for Union-Find",
      deadline: `${getLocalDateString(now)} 23:59`,
      completed: true,
      importance: "Important"
    },
    {
      id: 5, type: "event",
      title: "Night walk",
      detail: "Take your time and have a rest",
      startTime: `${getLocalDateString(now)} 23:00`,
      endTime: `${getLocalDateString(now)} 23:59`,
      importance: "Unimportant"
    }
  ];

  const [tasks, setTasks] = useState(tutorialTasks);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const firebaseTasks = [];
          querySnapshot.forEach((doc) => {
            firebaseTasks.push({ id: doc.id, ...doc.data() });
          });
          setTasks([...tutorialTasks, ...firebaseTasks]);
        });
        return () => unsubscribeSnapshot();
      } else {
        setTasks(tutorialTasks);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Filtering and Sorting 
  const displayTasks = tasks
    .filter(item => {
      const itemDateString = item.type === "event" ? item.startTime : item.deadline;
      if (!itemDateString) return false;
      return itemDateString.split(' ')[0] === selectedDateStr;
    })
    .sort((a, b) => {
      const timeA = a.type === "event" ? a.startTime : a.deadline;
      const timeB = b.type === "event" ? b.startTime : b.deadline;
      return (timeA || "").localeCompare(timeB || "");
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nusmodsUrl, setNusmodsUrl] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const [isClearingImported, setIsClearingImported] = useState(false);

  const [showClearImportedModal, setShowClearImportedModal] = useState(false);

  const [showImportedModal, setShowImportedModal] = useState(false);

  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState({
    type: "task",
    title: "",
    detail: "",
    importance: "Unimportant",
    date: selectedDateStr,
    time1: currentTimeStr,
    time2: timePlusOneHourStr,
  });

  const handleOpenModal = () => {
    setEditingItemId(null);
    setFormData({ type: "task", title: "", detail: "", importance: "Unimportant", date: selectedDateStr, time1: currentTimeStr, time2: timePlusOneHourStr });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleCompletion = async (taskId, currentStatus) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));

    if (typeof taskId === "string") {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { completed: !currentStatus });
      } catch (error) {
        console.error("Firebase Update Error: ", error);
      }
    }
  };

  const handleCardClick = (item) => {
    try {
      setEditingItemId(item.id);

      const deadline = item.deadline || `${selectedDateStr} ${currentTimeStr}`;
      const startTime = item.startTime || `${selectedDateStr} ${currentTimeStr}`;
      const endTime = item.endTime || `${selectedDateStr} ${timePlusOneHourStr}`;

      setFormData({
        type: item.type || "task",
        title: item.title || "",
        detail: item.detail || "",
        importance: item.importance || "Unimportant",
        date: item.type === "task" ? deadline.split(" ")[0] : startTime.split(" ")[0],
        time1: item.type === "task" ? deadline.split(" ")[1] : startTime.split(" ")[1],
        time2: item.type === "event" ? endTime.split(" ")[1] : timePlusOneHourStr,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Data parse error in handleCardClick:", error);
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItemId) return;

    const idToDelete = editingItemId;
    setIsModalOpen(false);
    setEditingItemId(null);

    setTasks(prev => prev.filter(t => t.id !== idToDelete));

    if (typeof idToDelete === "string") {
      try {
        const itemRef = doc(db, "tasks", idToDelete);
        await deleteDoc(itemRef);
      } catch (error) {
        console.error("Firebase Delete Error: ", error);
      }
    }
  };

  const handleSaveItem = async () => {
    if (!formData.title.trim()) return alert("Title cannot be empty!");

    const itemData = {
      type: formData.type,
      title: formData.title,
      detail: formData.detail,
      importance: formData.importance,
    };

    if (auth.currentUser) {
      itemData.userId = auth.currentUser.uid;
    }

    if (formData.type === "task") {
      const existingTask = tasks.find(t => t.id === editingItemId);
      itemData.completed = existingTask ? existingTask.completed : false;
      itemData.deadline = `${formData.date} ${formData.time1}`;
    } else {
      itemData.startTime = `${formData.date} ${formData.time1}`;
      itemData.endTime = `${formData.date} ${formData.time2}`;
    }

    const currentEditingId = editingItemId;
    setIsModalOpen(false);
    setEditingItemId(null);

    try {
      if (currentEditingId) {
        if (typeof currentEditingId === "string") {
          const itemRef = doc(db, "tasks", currentEditingId);
          await updateDoc(itemRef, itemData);
        } else {
          setTasks(prev => prev.map(t => t.id === currentEditingId ? { ...itemData, id: t.id } : t));
        }
      } else {
        if (auth.currentUser) {
          await addDoc(collection(db, "tasks"), itemData);
        } else {
          setTasks(prev => [...prev, { ...itemData, id: Date.now() }]);
        }
      }
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  const handleImportNusmods = async () => {
    if (!auth.currentUser) {
      setImportStatus("Please log in before importing your NUSMods timetable.");
      return;
    }

    if (!nusmodsUrl.trim()) {
      setImportStatus("Please paste a NUSMods share link first.");
      return;
    }

    setIsImporting(true);
    setImportStatus("Importing timetable from NUSMods...");

    try {
      const { semester, modules } = parseNusmodsShareUrl(nusmodsUrl);

      if (modules.length === 0) {
        setImportStatus("No modules were found in this NUSMods link.");
        setIsImporting(false);
        return;
      }

      const semesterStartDate =
        SEMESTER_START_DATES[`${NUSMODS_ACAD_YEAR}-${semester}`];

      if (!semesterStartDate) {
        setImportStatus("Semester start date is not configured yet.");
        setIsImporting(false);
        return;
      }

      const existingImportKeys = new Set(
        tasks
          .filter((item) => item.importSource === "nusmods" && item.importKey)
          .map((item) => item.importKey)
      );

      let importedCount = 0;
      let skippedCount = 0;

      for (const mod of modules) {
        const response = await fetch(
          `https://api.nusmods.com/v2/${NUSMODS_ACAD_YEAR}/modules/${mod.moduleCode}.json`
        );

        if (!response.ok) {
          console.warn(`Failed to fetch ${mod.moduleCode}`);
          continue;
        }

        const moduleInfo = await response.json();

        const semesterInfo = moduleInfo.semesterData?.find(
          (sem) => sem.semester === semester
        );

        if (!semesterInfo?.timetable) continue;

        for (const selectedLesson of mod.lessons) {
          const matchedLessons = semesterInfo.timetable.filter(
            (lesson) =>
              lesson.lessonType === selectedLesson.lessonType &&
              String(lesson.classNo) === String(selectedLesson.classNo)
          );

          for (const lesson of matchedLessons) {
            const weeks = normalizeWeeks(lesson.weeks);

            for (const week of weeks) {
              const lessonDate = getLessonDate(
                semesterStartDate,
                week,
                lesson.day
              );

              const normalizeWeeks = (weeks) => {
                if (Array.isArray(weeks)) {
                  return weeks;
                }

                if (typeof weeks === "number") {
                  return [weeks];
                }

                if (weeks && typeof weeks === "object") {
                  const result = [];

                  if (weeks.start && weeks.end) {
                    const interval = weeks.interval || 1;

                    for (let week = weeks.start; week <= weeks.end; week += interval) {
                      result.push(week);
                    }

                    return result;
                  }
                }

                return [];
              };

              const startTime = formatNusmodsTime(lesson.startTime);
              const endTime = formatNusmodsTime(lesson.endTime);

              const importKey = [
                NUSMODS_ACAD_YEAR,
                semester,
                mod.moduleCode,
                lesson.lessonType,
                lesson.classNo,
                week,
                lesson.day,
                lesson.startTime,
                lesson.endTime,
              ].join("-");

              if (existingImportKeys.has(importKey)) {
                skippedCount += 1;
                continue;
              }

              const eventData = {
                type: "event",
                title: `${mod.moduleCode} ${lesson.lessonType}${lesson.classNo ? ` [${lesson.classNo}]` : ""}`,
                detail: `${moduleInfo.title || ""}${
                  lesson.venue ? ` · ${lesson.venue}` : ""
                }`,
                startTime: `${lessonDate} ${startTime}`,
                endTime: `${lessonDate} ${endTime}`,
                importance: "Important",
                userId: auth.currentUser.uid,

                importSource: "nusmods",
                importKey,
                moduleCode: mod.moduleCode,
                lessonType: lesson.lessonType,
                classNo: lesson.classNo,
                venue: lesson.venue || "",
                acadYear: NUSMODS_ACAD_YEAR,
                semester,
                nusmodsWeek: week,
              };

              await addDoc(collection(db, "tasks"), eventData);

              existingImportKeys.add(importKey);
              importedCount += 1;
            }
          }
        }
      }

      setImportStatus(
        `Imported ${importedCount} class events. Skipped ${skippedCount} duplicates.`
      );
      setNusmodsUrl("");
    } catch (error) {
      console.error("NUSMods import error:", error);
      setImportStatus(
        `Import failed: ${error.message || "Please check whether the link is valid."}`
      );
    } finally {
      setIsImporting(false);
    }
  };
  
  const importedItems = tasks.filter(
  (item) =>
    item.importSource === "nusmods" &&
    item.userId === auth.currentUser?.uid
);

const importedClassGroups = importedItems.reduce((groups, item) => {
  const groupKey = [
    item.moduleCode || "Unknown Module",
    item.lessonType || "Class",
    item.classNo || "",
  ].join("-");

  if (!groups[groupKey]) {
    groups[groupKey] = {
      key: groupKey,
      moduleCode: String(item.moduleCode || "Unknown Module").trim(),
      lessonType: String(item.lessonType || "Class").trim(),
      classNo: String(item.classNo || "").trim(),
      venue: String(item.venue || "").trim(),
      items: [],
    };
  }

  groups[groupKey].items.push(item);
  return groups;
}, {});

const importedClassList = Object.values(importedClassGroups).sort((a, b) =>
  `${a.moduleCode} ${a.lessonType}`.localeCompare(
    `${b.moduleCode} ${b.lessonType}`
  )
);

const cleanImportedText = (value) => {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/[\u00A0\u1680\u180E\u2000-\u200F\u2028\u2029\u202F\u205F\u2060\u3000\uFEFF]/g, "")
    .trim();
};

const formatImportedClassTitle = (group) => {
  const rawModuleCode = cleanImportedText(group.moduleCode);
  const rawLessonType = cleanImportedText(group.lessonType);
  const rawClassNo = cleanImportedText(group.classNo);

  const moduleMatch = rawModuleCode.match(/[A-Z]{2,4}\d{4}[A-Z]{0,3}/);
  const moduleCode = moduleMatch ? moduleMatch[0] : rawModuleCode;

  return `${moduleCode} ${rawLessonType}${rawClassNo ? `[${rawClassNo}]` : ""}`;
};

const handleClearImported = () => {
  if (!auth.currentUser) {
    setImportStatus("Please log in before clearing imported classes.");
    return;
  }

  if (importedItems.length === 0) {
    setImportStatus("No imported NUSMods classes to clear.");
    return;
  }

  setShowClearImportedModal(true);
};

const confirmClearImported = async () => {
  setIsClearingImported(true);
  setImportStatus("Clearing imported NUSMods classes...");

  try {
    const itemsToDelete = importedItems.filter(
      (item) => typeof item.id === "string"
    );

    await Promise.all(
      itemsToDelete.map((item) => deleteDoc(doc(db, "tasks", item.id)))
    );

    setImportStatus(`Cleared ${itemsToDelete.length} imported class events.`);
    setShowClearImportedModal(false);
  } catch (error) {
    console.error("Clear imported classes error:", error);
    setImportStatus("Failed to clear imported classes. Please try again.");
  } finally {
    setIsClearingImported(false);
  }
};

const handleDeleteImportedGroup = async (group) => {
  if (!auth.currentUser) {
    setImportStatus("Please log in before managing imported classes.");
    return;
  }

  const confirmed = window.confirm(
    `Remove ${group.moduleCode} ${group.lessonType}${
      group.classNo ? ` [${group.classNo}]` : ""
    } from your imported timetable?`
  );

  if (!confirmed) return;

  try {
    const itemsToDelete = group.items.filter(
      (item) => typeof item.id === "string"
    );

    await Promise.all(
      itemsToDelete.map((item) => deleteDoc(doc(db, "tasks", item.id)))
    );

    setImportStatus(`Removed ${formatImportedClassTitle(group)}.`);
  } catch (error) {
    console.error("Delete imported group error:", error);
    setImportStatus("Failed to remove this imported class. Please try again.");
  }
};

  const checkIsInactive = (item) => {
    if (item.type === "task") return item.completed;
    if (item.type === "event" && item.endTime) return item.endTime <= currentFullTime;
    return false;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.dashboardContainer}>
        <NavBar />
          <main className={styles.mainContent}>

            <div className={styles.timelineHeaderRow}>
              <div className={styles.sectionTitle} style={{ margin: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f15c22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Timeline
              </div>

              <div className={styles.timelineHeaderActions}>

                <button
                  onClick={goToToday}
                  disabled={isCurrentlyToday}
                  className={styles.todayButton}
                >
                  <span className={styles.todayIcon}>
                    <svg
                    style={{ transform: "translateY(2px)", marginRight: "5px" }}
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 0 1 15.5-6.2" />
                      <path d="M19 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-15.5 6.2" />
                      <path d="M5 21v-5h5" />
                    </svg>
                  </span>
                  Go to Today
                </button>

                <div className={styles.jumpActionGroup} ref={jumpCalendarRef}>
                  <div className={styles.jumpBox}>
                    <span className={styles.buttonIcon}></span>

                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={jumpDate}
                      onChange={handleJumpChange}
                      className={styles.jumpInput}
                    />

                    <button
                      type="button"
                      onClick={() => setShowJumpCalendar((prev) => !prev)}
                      className={styles.calendarIconButton}
                    >
                      📅
                    </button>

                    {showJumpCalendar && (
                      <div className={styles.jumpCalendarPanel}>
                        <div className={styles.jumpCalendarHeader}>
                          <button
                            type="button"
                            onClick={() => shiftJumpCalendarMonth(-1)}
                            className={styles.calendarMonthButton}
                          >
                            &lt;
                          </button>

                          <span className={styles.jumpCalendarTitle}>
                            {new Intl.DateTimeFormat("en-US", {
                              month: "long",
                              year: "numeric",
                            }).format(jumpCalendarMonth)}
                          </span>

                          <button
                            type="button"
                            onClick={() => shiftJumpCalendarMonth(1)}
                            className={styles.calendarMonthButton}
                          >
                            &gt;
                          </button>
                        </div>

                        <div className={styles.jumpCalendarWeekdays}>
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>

                        <div className={styles.jumpCalendarGrid}>
                          {getJumpCalendarDays().map((dateObj) => {
                            const dateString = getLocalDateString(dateObj);
                            const isCurrentMonth =
                              dateObj.getMonth() === jumpCalendarMonth.getMonth();
                            const isToday = dateString === getLocalDateString(new Date());
                            const isSelected = dateString === jumpDate;

                            return (
                              <button
                                key={dateString}
                                type="button"
                                onClick={() => handleCalendarDateClick(dateObj)}
                                className={`${styles.jumpCalendarDay} ${
                                  !isCurrentMonth ? styles.outsideMonthDay : ""
                                } ${isToday ? styles.todayCalendarDay : ""} ${
                                  isSelected ? styles.selectedCalendarDay : ""
                                }`}
                              >
                                {dateObj.getDate()}
                              </button>
                            );
                          })}
                        </div>

                        <div className={styles.jumpCalendarFooter}>
                          <button
                            type="button"
                            onClick={() => {
                              setJumpDate("");
                              setShowJumpCalendar(false);
                            }}
                            className={styles.calendarClearButton}
                          >
                            Clear
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowJumpCalendar(false)}
                            className={styles.calendarConfirmButton}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleJumpConfirm}
                    disabled={!isJumpDateValid}
                    className={styles.confirmButton}
                  >
                    Jump
                  </button>
                </div>

              </div>
            </div>

            <div className={styles.dateCarousel}>
              <button
                onClick={() => shiftDate(-1)}
                className={styles.carouselArrowButton}
              >
                &lt;
              </button>

              {carouselDates.map((dateObj, index) => {
                const isSelected = dateObj.toDateString() === selectedDate.toDateString();
                const shortDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj).toUpperCase();
                const dateNum = dateObj.getDate();
                const shortMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(dateObj)}
                    className={`${styles.dateItem} ${isSelected ? styles.active : ''}`}
                  >
                    <span style={{ fontSize: "0.8rem", color: isSelected ? "#f15c22" : "#86868b", marginBottom: "4px", fontWeight: isSelected ? "600" : "normal" }}>
                      {shortDay}
                    </span>

                    <span style={{ fontSize: isSelected ? "1.8rem" : "1.4rem", fontWeight: isSelected ? "700" : "600" }}>
                      {dateNum}
                    </span>

                    <span style={{ fontSize: "0.8rem", color: isSelected ? "#f15c22" : "#86868b" }}>
                      {shortMonth}
                    </span>
                  </div>
                );
              })}

              <button
                onClick={() => shiftDate(1)}
                className={styles.carouselArrowButton}
              >
                &gt;
              </button>
            </div>

            <div className={styles.selectedDateText}>
              {formattedSelectedText}
            </div>

            <div className={styles.timelineCard}>
              {displayTasks.length > 0 ? (
                displayTasks.map((item) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    isInactive={checkIsInactive(item)}
                    onToggle={() => handleToggleCompletion(item.id, item.completed)}
                    onCardClick={() => handleCardClick(item)}
                  />
                ))
              ) : (
                <div className={styles.emptyTimelineText}>
                  No tasks or events scheduled. Time to relax! ☕️
                </div>
              )}
            </div>

            <div className={styles.importCard}>
              <div className={styles.importHeader}>
                <div className={styles.importIconCircle}>
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 16l-4-4-4 4" />
                    <path d="M12 12v9" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    <path d="M16 16l-4-4-4 4" />
                  </svg>
                </div>

                <h3>Import from NUSMods</h3>
                <p>Paste your NUSMods share link to import the whole semester timetable.</p>
              </div>

              <div className={styles.importInputRow}>
                <input
                  value={nusmodsUrl}
                  onChange={(e) => setNusmodsUrl(e.target.value)}
                  placeholder="Paste NUSMods share link here..."
                  className={styles.importInput}
                />

                <button
                  type="button"
                  onClick={handleImportNusmods}
                  disabled={isImporting}
                  className={styles.importButton}
                >
                  {isImporting ? "Importing..." : "Import"}
                </button>
              </div>

              {importStatus && (
                <p className={styles.importStatus}>{importStatus}</p>
              )}
            </div>

            <div className={styles.dashboardActionArea}>
              <div className={styles.importManageRow}>
                <button
                  type="button"
                  onClick={handleClearImported}
                  disabled={isClearingImported || importedItems.length === 0}
                  className={styles.clearImportedButton}
                >
                  <span className={styles.clearImportedIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v5" />
                      <path d="M14 11v5" />
                    </svg>
                  </span>

                  {isClearingImported ? "Clearing..." : "Clear Imported"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowImportedModal(true)}
                  className={styles.manageImportedButton}
                >
                  <span className={styles.manageImportedIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M7 8h10" />
                      <path d="M7 12h10" />
                      <path d="M7 16h6" />
                    </svg>
                  </span>

                  Manage Imported Classes
                </button>
              </div>

              <button className={styles.addButton} onClick={handleOpenModal}>
                <span className={styles.addButtonIcon}>+</span>
                Add Task / Event
              </button>
            </div>
          </main>
      </div>

      {showClearImportedModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.clearModalBox}>
            <div className={styles.clearModalIcon}>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </div>

            <h2 className={styles.clearModalTitle}>
              Clear imported classes?
            </h2>

            <p className={styles.clearModalText}>
              This will remove all NUSMods imported class events from your timeline.
              Your manually added tasks and events will not be affected.
            </p>

            <div className={styles.clearModalCount}>
              {importedItems.length} imported class events will be removed.
            </div>

            <div className={styles.clearModalButtons}>
              <button
                type="button"
                onClick={() => setShowClearImportedModal(false)}
                disabled={isClearingImported}
                className={styles.clearModalCancelButton}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmClearImported}
                disabled={isClearingImported}
                className={styles.clearModalConfirmButton}
              >
                {isClearingImported ? "Clearing..." : "Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportedModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.importedModalBox}>
            <div className={styles.importedModalHeader}>
              <div>
                <h2 className={styles.importedModalTitle}>
                  Imported Classes
                </h2>

                <p className={styles.importedModalSubtitle}>
                  Manage classes imported from your NUSMods timetable.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowImportedModal(false)}
                className={styles.importedCloseButton}
              >
                ×
              </button>
            </div>

            {importedClassList.length > 0 ? (
              <div className={styles.importedClassList}>
                {importedClassList.map((group) => (
                  <div key={group.key} className={styles.importedClassCard}>
                    <div className={styles.importedClassInfo}>
                      <div className={styles.importedClassTitle}>{formatImportedClassTitle(group)}</div>

                      <div className={styles.importedClassMeta}>
                        {group.items.length} class events
                        {group.venue ? ` · ${group.venue}` : ""}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteImportedGroup(group)}
                      className={styles.importedRemoveButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyImportedBox}>
                No imported NUSMods classes yet.
              </div>
            )}

            <div className={styles.importedModalFooter}>
              <button
                type="button"
                onClick={() => setShowImportedModal(false)}
                className={styles.importedModalCloseBottomButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>
              {editingItemId ? "Edit Entry" : "New Entry"}
            </h2>

            <div className={styles.modalTypeRow}>
              <button
                onClick={() => setFormData({ ...formData, type: "task" })}
                className={`${styles.modalTypeButton} ${
                  formData.type === "task" ? styles.modalTypeButtonActive : ""
                }`}
              >
                Task
              </button>

              <button
                onClick={() => setFormData({ ...formData, type: "event" })}
                className={`${styles.modalTypeButton} ${
                  formData.type === "event" ? styles.modalTypeButtonActive : ""
                }`}
              >
                Event
              </button>
            </div>

            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.modalInput}
            />

            <input
              name="detail"
              placeholder="Details or Subtasks"
              value={formData.detail}
              onChange={handleInputChange}
              className={styles.modalInput}
            />

            <div className={styles.modalTwoColumnRow}>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={styles.modalInput}
              />

              <select
                name="importance"
                value={formData.importance}
                onChange={handleInputChange}
                className={styles.modalInput}
              >
                <option value="Important">Important</option>
                <option value="Unimportant">Unimportant</option>
              </select>
            </div>

            <div className={styles.modalTimeRow}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>
                  {formData.type === "task" ? "Deadline" : "Start Time"}
                </label>

                <input
                  type="time"
                  name="time1"
                  value={formData.time1}
                  onChange={handleInputChange}
                  className={styles.modalInput}
                />
              </div>

              {formData.type === "event" && (
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>End Time</label>

                  <input
                    type="time"
                    name="time2"
                    value={formData.time2}
                    onChange={handleInputChange}
                    className={styles.modalInput}
                  />
                </div>
              )}
            </div>

            <div className={styles.modalButtonRow}>
              {editingItemId && (
                <button
                  onClick={handleDeleteItem}
                  className={styles.deleteButton}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer" }}
                >
                  Remove
                </button>
              )}

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItemId(null);
                }}
                className={styles.modalSecondaryButton}
              >
                Cancel
              </button>

              <button
                onClick={handleSaveItem}
                className={styles.modalSaveButton}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;