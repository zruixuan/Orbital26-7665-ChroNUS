// src/components/TimerHistoryModal.jsx
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import styles from './TimerHistoryModal.module.css';

const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const d = typeof dateObj.toDate === 'function' ? dateObj.toDate() : new Date(dateObj);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateObj) => {
    if (!dateObj) return '';
    const d = typeof dateObj.toDate === 'function' ? dateObj.toDate() : new Date(dateObj);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

function TimerHistoryModal({ isOpen, onClose }) {
    const [sessions, setSessions] = useState([]);
    const [totalMinutes, setTotalMinutes] = useState(0);

    useEffect(() => {
        if (!isOpen || !auth.currentUser) return;

        const userRef = doc(db, "users", auth.currentUser.uid);
        const unsubUser = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setTotalMinutes(docSnap.data().totalFocusMinutes || 0);
            }
        });

        const q = query(collection(db, "sessions"), where("userId", "==", auth.currentUser.uid));
        const unsubSessions = onSnapshot(q, (snapshot) => {
            const fetched = [];
            snapshot.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
            
            fetched.sort((a, b) => b.startTime.toDate() - a.startTime.toDate());
            setSessions(fetched);
        });

        return () => { unsubUser(); unsubSessions(); };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                
                <div className={styles.modalHeader}>
                    <h2>Timer History</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.totalSummary}>
                    <div className={styles.totalIcon}>🔥</div>
                    <div>
                        <div className={styles.totalLabel}>Total Focus Time</div>
                        <div className={styles.totalValue}>{totalMinutes} <span>minutes</span></div>
                    </div>
                </div>

                <div className={styles.historyList}>
                    {sessions.length === 0 ? (
                        <p className={styles.emptyState}>No study sessions yet. Time to start focusing!</p>
                    ) : (
                        sessions.map(session => (
                            <div key={session.id} className={styles.historyItem}>
                                <div className={styles.itemMain}>
                                    <span className={styles.itemType}>
                                        {session.timerMode === 'countdown' ? '⏳ Countdown' : '⏱️ Count Up'}
                                    </span>
                                    <span className={styles.itemDate}>
                                        {formatDate(session.startTime)} ({formatTime(session.startTime)} - {formatTime(session.endTime)})
                                    </span>
                                </div>
                                <div className={styles.itemDetails}>
                                    <div className={styles.durationBadge}>
                                        {session.duration} min
                                    </div>
                                    <div className={styles.linkedTasks}>
                                        {(session.completedTasks?.length > 0 || session.completedEvents?.length > 0) ? 
                                            <span className={styles.taskDone}>✓ Tasks/Events completed</span> : 
                                            <span className={styles.noTask}>No tasks linked</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}

export default TimerHistoryModal;