// src/components/TimerHistoryModal.jsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db, auth } from "../api/firebase";
import styles from "./TimerHistoryModal.module.css";

const convertToDate = (value) => {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = convertToDate(value);

  if (!date) return "Unknown date";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value) => {
  const date = convertToDate(value);

  if (!date) return "--:--";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimestamp = (value) => {
  const date = convertToDate(value);
  return date ? date.getTime() : 0;
};

function TimerHistoryModal({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    const user = auth.currentUser;

    if (!user) {
      setSessions([]);
      setTotalMinutes(0);
      setLoadError("Please log in to view your timer history.");
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    setLoadError("");

    const userRef = doc(db, "users", user.uid);

    const unsubscribeUser = onSnapshot(
      userRef,
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          setTotalMinutes(
            documentSnapshot.data().totalFocusMinutes || 0
          );
        } else {
          setTotalMinutes(0);
        }
      },
      (error) => {
        console.error("Load total focus time error:", error);
      }
    );

    const sessionsQuery = query(
      collection(db, "sessions"),
      where("userId", "==", user.uid)
    );

    const unsubscribeSessions = onSnapshot(
      sessionsQuery,
      (snapshot) => {
        const fetchedSessions = snapshot.docs.map((sessionDoc) => ({
          id: sessionDoc.id,
          ...sessionDoc.data(),
        }));

        fetchedSessions.sort(
          (firstSession, secondSession) =>
            getTimestamp(secondSession.startTime) -
            getTimestamp(firstSession.startTime)
        );

        setSessions(fetchedSessions);
        setIsLoading(false);
      },
      (error) => {
        console.error("Load timer history error:", error);
        setLoadError(
          "Failed to load timer history. Please try again."
        );
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeSessions();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modalBox}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="timer-history-title"
      >
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f15c22"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="9" />
            </svg>

            <h3 id="timer-history-title">Timer History</h3>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close timer history"
          >
            ×
          </button>
        </div>

        <div className={styles.totalSummary}>
          <div className={styles.totalIcon} aria-hidden="true">
            🔥
          </div>

          <div>
            <div className={styles.totalLabel}>
              Total Focus Time
            </div>

            <div className={styles.totalValue}>
              {totalMinutes}
              <span> minutes</span>
            </div>
          </div>
        </div>

        <div className={styles.historyList}>
          {isLoading ? (
            <div className={styles.messageState}>
              <div className={styles.spinner} />
              <p>Loading timer history...</p>
            </div>
          ) : loadError ? (
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>!</div>
              <p>{loadError}</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⏱</div>
              <p>No study sessions yet.</p>
              <span>Start a timer session to build your history.</span>
            </div>
          ) : (
            sessions.map((session) => {
              const isAbandoned = session.status === "abandoned";

              const durationText = isAbandoned
                ? `${session.completedDuration || 0}/${
                    session.targetDuration || 0
                  } min`
                : `${session.duration || 0} min`;

              const hasCompletedItems =
                (session.completedTasks?.length || 0) > 0 ||
                (session.completedEvents?.length || 0) > 0;

              return (
                <div
                  key={session.id}
                  className={styles.historyItem}
                >
                  <div className={styles.itemMain}>
                    <span className={styles.itemType}>
                      {session.timerMode === "countdown"
                        ? "⏳ Countdown"
                        : "⏱ Count Up"}
                    </span>

                    <span className={styles.itemDate}>
                      {formatDate(session.startTime)}
                    </span>
                  </div>

                  <div className={styles.timeRange}>
                    {formatTime(session.startTime)}
                    <span>–</span>
                    {formatTime(session.endTime)}
                  </div>

                  <div className={styles.itemDetails}>
                    <div
                      className={`${styles.durationBadge} ${
                        isAbandoned ? styles.abandonedBadge : ""
                      }`}
                    >
                      {durationText}
                    </div>

                    <div className={styles.linkedTasks}>
                      {hasCompletedItems ? (
                        <span className={styles.taskDone}>
                          ✓ Tasks/Events completed
                        </span>
                      ) : (
                        <span className={styles.noTask}>
                          No tasks linked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerHistoryModal;