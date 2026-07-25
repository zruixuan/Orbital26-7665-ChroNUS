import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './StudyStats.module.css';

const formatPreciseTime = (totalMinutes) => {
  if (totalMinutes === 0) return "0 min";
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins} min`;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
};

const getStartDate = (timeframe) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0); 

  switch (timeframe) {
    case 'week':
      start.setDate(start.getDate() - start.getDay());
      break;
    case 'month':
      start.setDate(1);
      break;
    case 'year':
      start.setMonth(0, 1);
      break;
    case 'today':
    default:
      break;
  }
  return start;
};

function StudyStats() {
  const [timeframe, setTimeframe] = useState("today");
  
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let unsubSessions = null;
    let unsubTasks = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const qSessions = query(collection(db, "sessions"), where("userId", "==", user.uid));
        unsubSessions = onSnapshot(qSessions, (snapshot) => {
          const fetchedSessions = [];
          snapshot.forEach(doc => fetchedSessions.push({ id: doc.id, ...doc.data() }));
          setSessions(fetchedSessions);
        });

        const qTasks = query(collection(db, "tasks"), where("userId", "==", user.uid));
        unsubTasks = onSnapshot(qTasks, (snapshot) => {
          const fetchedTasks = [];
          snapshot.forEach(doc => fetchedTasks.push({ id: doc.id, ...doc.data() }));
          setTasks(fetchedTasks);
        });
      } else {
        setSessions([]);
        setTasks([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubSessions) unsubSessions();
      if (unsubTasks) unsubTasks();
    };
  }, []);

  const currentStats = useMemo(() => {
    const startDate = getStartDate(timeframe);
    
    const validSessions = sessions.filter(s => {
      if (!s.startTime) return false;
      const sessionDate = typeof s.startTime.toDate === 'function' ? s.startTime.toDate() : new Date(s.startTime);
      return sessionDate >= startDate;
    });

    let totalMinutes = 0;
    let completedSessionCount = 0;
    const activeDaysSet = new Set(); 

    validSessions.forEach(s => {
      const mins = s.status === 'abandoned' ? (s.completedDuration || 0) : (s.duration || 0);
      totalMinutes += mins;
      
      if (s.status !== 'abandoned') {
        completedSessionCount += 1;
      }

      const sessionDate = typeof s.startTime.toDate === 'function' ? s.startTime.toDate() : new Date(s.startTime);
      const dateString = sessionDate.toISOString().split('T')[0];
      activeDaysSet.add(dateString);
    });

    const completedTasksCount = tasks.filter(t => {
      if (!t.completed) return false;
      if (t.deadline) {
         const taskDate = new Date(t.deadline);
         return taskDate >= startDate;
      }
      return true; 
    }).length;

    return {
      focusTime: formatPreciseTime(totalMinutes),
      sessions: completedSessionCount,
      activeDays: activeDaysSet.size,
      tasks: completedTasksCount
    };
  }, [sessions, tasks, timeframe]);

  return (
    <div className={styles.statsContainer}>
      
      <div className={styles.statsHeader}>
        <h2 className={styles.statsTitle}>Study Stats</h2>
        <select 
          className={styles.timeSelect} 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Focus Time</div>
          <div className={styles.statValue}>{currentStats.focusTime}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Sessions</div>
          <div className={styles.statValue}>{currentStats.sessions}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Days</div>
          <div className={styles.statValue}>{currentStats.activeDays} {currentStats.activeDays === 1 ? 'day' : 'days'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tasks Done</div>
          <div className={styles.statValue}>{currentStats.tasks}</div>
        </div>
      </div>

    </div>
  );
}

export default StudyStats;