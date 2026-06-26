import { useState, useEffect } from 'react';
import styles from './TimerWidget.module.css';
import StudyStats from './StudyStats';

import { useTimerEngine } from '../hooks/useTimerEngine';
import { useFocusTasks } from '../hooks/useFocusTasks';

function TimerWidget() {
    const {
        sessions, currentIndex, timerMode, setTimerMode, 
        focusDuration, shortBreak, longBreak,
        isActive, hasStarted, displaySeconds, progressRatio,
        toggleTimer, resetTimer, handleDurationChange, 
        handleCustomDuration, handleBreakEdit,
        handlePrev, handleNext, handleTitleChange
    } = useTimerEngine();
    
    const { currentlyFocusingItems } = useFocusTasks();

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const size = 320;
    const center = size / 2;
    const radius = 132;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressRatio * circumference);

    return (
        <div className={styles.timerWidgetContainer}>

            <div className={styles.widgetLayout}>

                <div className={styles.timerCard}>
                    <div className={styles.sessionNavHeader}>
                        <button className={styles.iconButton} onClick={handlePrev}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                        <div className={styles.sessionTitleWrapper}>
                            <input type="text" value={sessions[currentIndex].title} onChange={handleTitleChange} placeholder="Name your session..." className={styles.sessionTitleInput} />
                        </div>
                        <button className={styles.iconButton} onClick={handleNext}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                    </div>
                    
                    <div className={styles.circleWrapper}>
                        <svg className={styles.svgRing} width={size} height={size}>
                            <circle cx={center} cy={center} r={radius} fill="none" stroke="#f5f5f7" strokeWidth="14" />
                            <circle cx={center} cy={center} r={radius} fill="none" stroke="#f15c22" strokeWidth="14" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }} />
                        </svg>
                        <div className={styles.circleContent}>
                            <div className={styles.statusText}>{!hasStarted ? "Focus Time" : (isActive ? "Focusing..." : "Paused")}</div>
                            <h1 className={styles.timeDisplay}>{formatTime(displaySeconds)}</h1>
                            {!hasStarted && <div className={styles.readyText}>Ready to focus?</div>}
                        </div>
                    </div>
                    
                    <div className={styles.actionRow}>
                        <button className={styles.startButton} onClick={toggleTimer} style={{ background: !hasStarted ? "#f15c22" : (!isActive ? "#34c759" : "#1d1d1f") }}>
                            {isActive ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause</> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> {hasStarted ? "Resume" : "Start Focus"}</>}
                        </button>
                        <button className={styles.resetButton} onClick={resetTimer} disabled={!hasStarted} style={{ opacity: hasStarted ? 1 : 0.4, cursor: hasStarted ? 'pointer' : 'not-allowed' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                        </button>
                    </div>
                    
                    <div className={styles.sessionDots}>
                        <span>Session {currentIndex + 1} of {sessions.length}</span>
                        {sessions.map((_, index) => <div key={index} className={index === currentIndex ? styles.dotActive : styles.dot} />)}
                    </div>
                </div>

                <div className={styles.settingsCard}>
                    <div className={styles.settingBlock}>
                        <label>Timer Mode</label>
                        <div className={styles.buttonGroup}>
                            <button className={`${styles.modeBtn} ${timerMode === "countdown" ? styles.modeBtnActive : ""}`} onClick={() => setTimerMode("countdown")}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Countdown
                            </button>
                            <button className={`${styles.modeBtn} ${timerMode === "countup" ? styles.modeBtnActive : ""}`} onClick={() => setTimerMode("countup")}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Count Up
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.settingBlock}>
                        <label>Duration</label>
                        <div className={styles.buttonGroup}>
                            {[25, 50, 90].map(mins => (
                                <button key={mins} className={`${styles.durationBtn} ${focusDuration === mins ? styles.durationBtnActive : ""}`} onClick={() => handleDurationChange(mins)}>{mins} min</button>
                            ))}
                            <button className={`${styles.durationBtn} ${![25, 50, 90].includes(focusDuration) ? styles.durationBtnActive : ""}`} onClick={handleCustomDuration}>Custom</button>
                        </div>
                    </div>
                    
                    <div className={styles.settingBlock}>
                        <label>Break Settings</label>
                        <div className={styles.menuList}>
                            <div className={styles.menuItem} onClick={() => handleBreakEdit('short')}>
                                <span>Short Break</span>
                                <div className={styles.menuRight}>{shortBreak} min <span className={styles.arrow}>›</span></div>
                            </div>
                            <div className={styles.menuItem} onClick={() => handleBreakEdit('long')}>
                                <span>Long Break</span>
                                <div className={styles.menuRight}>{longBreak} min <span className={styles.arrow}>›</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.tipBox}>
                        <span className={styles.bulb}>💡</span>
                        <span><b>Tip:</b> Take a {shortBreak}-min break after each focus session to stay fresh!</span>
                    </div>
                </div>

            </div>

            <div className={styles.statsAndFocusContainer}>

                <div className={styles.statsWrapper}>
                    <StudyStats />
                </div>

                <div className={styles.focusingWrapper}>
                    <h2 className={styles.focusingTitle}>🎯 Currently Focusing On</h2>

                    <div className={styles.focusingList}>
                        {currentlyFocusingItems.length > 0 ? (
                            currentlyFocusingItems.map(item => (
                                <div key={item.id} className={styles.focusingItem}>
                                    <div className={styles.focusingItemTitle}>{item.title}</div>
                                    <div className={styles.focusingItemTime}>
                                        {item.type === 'event'
                                            ? `In Progress until ${item.endTime.split(' ')[1]}`
                                            : `Task due by ${item.deadline.split(' ')[1]}`}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.focusingEmpty}>
                                No immediate tasks or events. Time for a break! ☕️
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}

export default TimerWidget;