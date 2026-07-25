// src/hooks/useTimerEngine.js
import { useState, useEffect } from 'react';
import { checkAndUnlockAchievements } from '../services/achievementEngine';
import { auth, db } from "../api/firebase";
import { collection, addDoc } from 'firebase/firestore';

export const useTimerEngine = () => {
    const [sessions, setSessions] = useState([
        { id: 1, title: "Lesson Focus", duration: 25 },
        { id: 2, title: "Project Development", duration: 50 },
        { id: 3, title: "Reading Time", duration: 25 }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const focusDuration = sessions[currentIndex]?.duration || 25;

    const [timerMode, setTimerMode] = useState("countdown");
    const [shortBreak, setShortBreak] = useState(5);
    const [longBreak, setLongBreak] = useState(15);

    const [isBreak, setIsBreak] = useState(false);

    const currentDuration = isBreak ? shortBreak : focusDuration;
    const initialTime = currentDuration * 60;

    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) setTimeLeft(currentDuration * 60);
    }, [focusDuration, shortBreak, isBreak, hasStarted, currentDuration]);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            clearInterval(interval);
            setIsActive(false);

            const endTime = new Date();
            const startTime = new Date(endTime.getTime() - currentDuration * 60000);

            setTimeout(() => {
                if (!isBreak) {
                    const startBreak = window.confirm("Focus session completed! ☕️ Do you want to start a short break now?");
                    if (startBreak) {
                        setIsBreak(true);
                        setTimeLeft(shortBreak * 60);
                        setIsActive(true);
                        setHasStarted(true);
                    } else {
                        setIsBreak(false);
                        setHasStarted(false);
                        setTimeLeft(focusDuration * 60);
                    }
                } else {
                    alert("Break is over! Ready to focus again?");
                    setIsBreak(false);
                    setHasStarted(false);
                    setTimeLeft(focusDuration * 60);
                }
            }, 50);

            if (!isBreak && auth.currentUser) {
                const sessionData = {
                    duration: focusDuration,
                    isPomodoro: timerMode === "countdown" && focusDuration === 25,
                    timerMode: timerMode,
                    startTime: startTime,
                    endTime: endTime,
                    completedTasks: [],
                    completedEvents: []
                };

                addDoc(collection(db, "sessions"), {
                    ...sessionData,
                    userId: auth.currentUser.uid,
                    createdAt: new Date()
                }).then(() => {
                    return checkAndUnlockAchievements(auth.currentUser.uid, sessionData);
                }).then(newlyUnlocked => {
                    if (newlyUnlocked && newlyUnlocked.length > 0) {
                        setTimeout(() => alert(`🎉 You unlocked ${newlyUnlocked.length} new achievement(s)!`), 500);
                    }
                }).catch(error => {
                    console.error("Failed to save session:", error);
                });
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, focusDuration, shortBreak, timerMode, isBreak, currentDuration]);


    const toggleTimer = () => {
        if (!hasStarted) setHasStarted(true);
        setIsActive(!isActive);
    };

    const resetTimer = async () => {
        if (isBreak) {
            if (window.confirm("Skip the rest of your break and start focusing now?")) {
                setIsBreak(false);
                setHasStarted(true);
                setIsActive(true);
                setTimeLeft(focusDuration * 60);
            }
            return;
        } const isProgressMade = hasStarted && timeLeft < initialTime;

        if (isProgressMade && !window.confirm("Discard progress?")) return;

        let abandonedSessionData = null;
        if (isProgressMade && timerMode === "countdown" && !isBreak) {
            const completedSeconds = initialTime - timeLeft;
            const completedMinutes = Math.round(completedSeconds / 60);

            if (completedSeconds > 0) {
                const endTime = new Date();
                const startTime = new Date(endTime.getTime() - (completedSeconds * 1000));

                abandonedSessionData = {
                    targetDuration: focusDuration,
                    completedDuration: completedMinutes,
                    status: 'abandoned',
                    isPomodoro: false,
                    timerMode: timerMode,
                    startTime: startTime,
                    endTime: endTime
                };
            }
        }

        setIsActive(false);
        setHasStarted(false);
        setIsBreak(false);
        setTimeLeft(focusDuration * 60);

        if (abandonedSessionData && auth.currentUser) {
            addDoc(collection(db, "sessions"), {
                ...abandonedSessionData,
                userId: auth.currentUser.uid,
                createdAt: new Date()
            }).catch(error => {
                console.error("Failed to save abandoned session:", error);
            });
        }
    };

    const switchSession = (newIndex) => {
        if (hasStarted && !isBreak) {
            if (!window.confirm("Switching sessions will discard current progress. Continue?")) return;
        }
        setCurrentIndex(newIndex);
        setIsActive(false);
        setHasStarted(false);
        setIsBreak(false);
        setTimeLeft(sessions[newIndex].duration * 60);
    };

    const handlePrev = () => switchSession(currentIndex > 0 ? currentIndex - 1 : sessions.length - 1);
    const handleNext = () => switchSession(currentIndex < sessions.length - 1 ? currentIndex + 1 : 0);

    const handleDurationChange = (minutes) => {
        if (hasStarted && !isBreak) {
            if (!window.confirm("Changing duration will reset your current progress. Continue?")) return;
        }

        const updated = [...sessions];
        updated[currentIndex].duration = minutes;
        setSessions(updated);

        setIsActive(false);
        setHasStarted(false);
        if (!isBreak) setTimeLeft(minutes * 60);
    };

    const handleCustomDuration = () => {
        const input = window.prompt("Enter custom duration in minutes (1-180):", focusDuration);
        const parsed = parseInt(input, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 180) {
            handleDurationChange(parsed);
        }
    };

    const handleBreakEdit = (type) => {
        const currentVal = type === 'short' ? shortBreak : longBreak;
        const input = window.prompt(`Enter ${type} break duration in minutes:`, currentVal);
        const parsed = parseInt(input, 10);
        if (!isNaN(parsed) && parsed > 0) {
            type === 'short' ? setShortBreak(parsed) : setLongBreak(parsed);
        }
    };

    const handleTitleChange = (e) => {
        const updated = [...sessions];
        updated[currentIndex].title = e.target.value;
        setSessions(updated);
    };

    const displaySeconds = timerMode === "countdown" ? timeLeft : (initialTime - timeLeft);
    const progressRatio = timerMode === "countdown" ? (timeLeft / initialTime) : ((initialTime - timeLeft) / initialTime);

    return {
        sessions, currentIndex, timerMode, setTimerMode, focusDuration, shortBreak, longBreak,
        isBreak,
        timeLeft, isActive, hasStarted, initialTime, displaySeconds, progressRatio,
        toggleTimer, resetTimer, handleDurationChange, handleCustomDuration, handleBreakEdit,
        handlePrev, handleNext, handleTitleChange
    };
};