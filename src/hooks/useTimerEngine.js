// src/hooks/useTimerEngine.js
import { useState, useEffect } from 'react';
import { checkAndUnlockAchievements } from '../services/achievementEngine';
import { auth, db } from "../api/firebase";
import { collection, addDoc } from 'firebase/firestore';

export const useTimerEngine = () => {
    const [sessions, setSessions] = useState([
        { id: 1, title: "Lesson Focus" },
        { id: 2, title: "Project Development" },
        { id: 3, title: "Reading Time" }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [timerMode, setTimerMode] = useState("countdown");
    const [focusDuration, setFocusDuration] = useState(25);
    const [shortBreak, setShortBreak] = useState(5);
    const [longBreak, setLongBreak] = useState(15);

    const initialTime = focusDuration * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) setTimeLeft(focusDuration * 60);
    }, [focusDuration, hasStarted]);

     useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            clearInterval(interval);
            setIsActive(false);
            setHasStarted(false);

            (async () => {
                const endTime = new Date();
                const startTime = new Date(endTime.getTime() - focusDuration * 60000);

                const sessionData = {
                    duration: focusDuration,
                    isPomodoro: timerMode === "countdown" && focusDuration === 25,
                    timerMode: timerMode,
                    startTime: startTime,
                    endTime: endTime,
                    completedTasks: [], 
                    completedEvents: []
                };

                if (auth.currentUser) {
                    try {
                        await addDoc(collection(db, "sessions"), {
                            ...sessionData,
                            userId: auth.currentUser.uid,
                            createdAt: new Date()
                        });

                        const newlyUnlocked = await checkAndUnlockAchievements(auth.currentUser.uid, sessionData);
                        if (newlyUnlocked.length > 0) {
                            alert(`Session completed! 🎉 You unlocked ${newlyUnlocked.length} new achievement(s)!`);
                        } else {
                            alert("Session completed! Time for a break.");
                        }
                    } catch (error) {
                        console.error("Failed to save session:", error);
                    }
                } else {
                    alert("Session completed! Time for a break.");
                }
            })();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, focusDuration, timerMode]);


    const toggleTimer = () => {
        if (!hasStarted) setHasStarted(true);
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        if (hasStarted && timeLeft < initialTime && !window.confirm("Discard progress?")) return;
        setIsActive(false); 
        setHasStarted(false); 
        setTimeLeft(initialTime);
    };

    const handleDurationChange = (minutes) => {
        if (hasStarted) {
            if (!window.confirm("Changing duration will reset your current progress. Continue?")) return;
        }
        setFocusDuration(minutes);
        setIsActive(false);
        setHasStarted(false);
        setTimeLeft(minutes * 60);
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

    const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sessions.length - 1));
    const handleNext = () => setCurrentIndex((prev) => (prev < sessions.length - 1 ? prev + 1 : 0));
    const handleTitleChange = (e) => {
        const updated = [...sessions];
        updated[currentIndex].title = e.target.value;
        setSessions(updated);
    };

    const displaySeconds = timerMode === "countdown" ? timeLeft : (initialTime - timeLeft);
    const progressRatio = timerMode === "countdown" ? (timeLeft / initialTime) : ((initialTime - timeLeft) / initialTime);

    return {
        sessions, currentIndex, timerMode, setTimerMode, focusDuration, shortBreak, longBreak,
        timeLeft, isActive, hasStarted, initialTime, displaySeconds, progressRatio,
        toggleTimer, resetTimer, handleDurationChange, handleCustomDuration, handleBreakEdit,
        handlePrev, handleNext, handleTitleChange
    };
};