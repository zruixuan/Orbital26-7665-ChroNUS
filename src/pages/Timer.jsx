// src/pages/Timer.jsx
import { useState, useEffect } from 'react';
import styles from './Timer.module.css';
import NavBar from '../components/NavBar';
import TimerWidget from '../components/TimerWidget';
import AchievementBoard from '../components/AchievementBoard';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import TimerHistoryModal from '../components/TimerHistoryModal'; // 🌟 引入刚写的弹窗

function Timer() {
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // 🌟 弹窗状态控制

    useEffect(() => {
        let unsubscribeSnapshot = null;

        // 监听认证状态 (Auth State Listener)
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }

            if (user) {
                const userRef = doc(db, "users", user.uid);
                // 实时监听用户数据 (Real-time Database Listener)
                unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUnlockedIds(data.unlockedAchievements || []);
                    }
                });
            } else {
                setUnlockedIds([]);
            }
        });

        // 清理函数 (Cleanup Function)
        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    // 预留历史记录处理逻辑 (Placeholder for future feature)
    const handleViewHistory = () => {
        console.log("History modal or navigation will be triggered here.");
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContainer}>
                <NavBar />
                <main className={styles.content}>
                    <header className={styles.header}>
                        <div>
                            {/* 标题部分保持不变 */}
                            <div className={styles.titleRow}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f15c22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <h1 className={styles.title}>Study Timer</h1>                            </div>
                            <p className={styles.subtitle}>Focus better. Achieve more.</p>
                        </div>

                        {/* 🌟 绑定点击事件，打开弹窗 */}
                        <button
                            className={styles.historyBtn}
                            onClick={() => setIsHistoryModalOpen(true)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Timer History
                        </button>
                    </header>

                    <section className={styles.timerSection}>
                        <TimerWidget />
                    </section>

                    <section className={styles.achievementsSection}>
                        <AchievementBoard userUnlockedIds={unlockedIds} />
                    </section>
                </main>
            </div>

            {/* 🌟 渲染弹窗 */}
            <TimerHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
            />
        </div>
    );
}

export default Timer;