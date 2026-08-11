import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { checkAndUnlockAchievements } from '../services/achievementEngine';
import { auth, db } from '../api/firebase';

export const useTimerEngine = () => {
    const [sessions, setSessions] = useState([
        { id: 1, title: 'Lesson Focus', duration: 25 },
        { id: 2, title: 'Project Development', duration: 50 },
        { id: 3, title: 'Reading Time', duration: 25 }
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timerMode, setTimerMode] = useState('countdown');
    const [shortBreak, setShortBreak] = useState(5);
    const [longBreak, setLongBreak] = useState(15);
    const [isBreak, setIsBreak] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [timerDialog, setTimerDialog] = useState(null);

    const focusDuration = sessions[currentIndex]?.duration || 25;
    const currentDuration = isBreak ? shortBreak : focusDuration;
    const initialTime = currentDuration * 60;

    const [timeLeft, setTimeLeft] = useState(initialTime);

    const closeDialog = () => {
        const onCancel = timerDialog?.onCancel;
        setTimerDialog(null);
        onCancel?.();
    };

    const dismissDialog = () => {
        setTimerDialog(null);
    };

    const showAlert = (title, message, confirmText = 'Done') => {
        setTimerDialog({
            type: 'alert',
            title,
            message,
            confirmText
        });
    };

    const showConfirm = (title, message, onConfirm, options = {}) => {
        setTimerDialog({
            type: 'confirm',
            title,
            message,
            confirmText: options.confirmText || 'Continue',
            cancelText: options.cancelText || 'Cancel',
            tone: options.tone || 'primary',
            onConfirm,
            onCancel: options.onCancel
        });
    };

    const showPrompt = ({
        title,
        message,
        initialValue,
        max,
        onSubmit
    }) => {
        setTimerDialog({
            type: 'prompt',
            title,
            message,
            initialValue: String(initialValue),
            min: 1,
            max,
            confirmText: 'Save',
            cancelText: 'Cancel',
            onSubmit
        });
    };

    useEffect(() => {
        if (!hasStarted) {
            setTimeLeft(currentDuration * 60);
        }
    }, [
        focusDuration,
        shortBreak,
        isBreak,
        hasStarted,
        currentDuration
    ]);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(previous => previous - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);

            const endTime = new Date();
            const startTime = new Date(
                endTime.getTime() - currentDuration * 60000
            );

            if (!isBreak) {
                showConfirm(
                    'Focus session completed!',
                    'Would you like to start a short break now?',
                    () => {
                        setIsBreak(true);
                        setTimeLeft(shortBreak * 60);
                        setIsActive(true);
                        setHasStarted(true);
                    },
                    {
                        confirmText: 'Start Break',
                        cancelText: 'Not Now',
                        onCancel: () => {
                            setIsBreak(false);
                            setHasStarted(false);
                            setTimeLeft(focusDuration * 60);
                        }
                    }
                );
            } else {
                showAlert(
                    'Break completed!',
                    'Ready to focus again?'
                );

                setIsBreak(false);
                setHasStarted(false);
                setTimeLeft(focusDuration * 60);
            }

            if (!isBreak && auth.currentUser) {
                const sessionData = {
                    duration: focusDuration,
                    isPomodoro:
                        timerMode === 'countdown' &&
                        focusDuration === 25,
                    timerMode,
                    startTime,
                    endTime,
                    completedTasks: [],
                    completedEvents: []
                };

                addDoc(collection(db, 'sessions'), {
                    ...sessionData,
                    userId: auth.currentUser.uid,
                    createdAt: new Date()
                })
                    .then(() => {
                        return checkAndUnlockAchievements(
                            auth.currentUser.uid,
                            sessionData
                        );
                    })
                    .then(newlyUnlocked => {
                        if (newlyUnlocked?.length > 0) {
                            showAlert(
                                'Achievement unlocked!',
                                `You unlocked ${newlyUnlocked.length} new achievement(s).`
                            );
                        }
                    })
                    .catch(error => {
                        console.error(
                            'Failed to save session:',
                            error
                        );
                    });
            }
        }

        return () => clearInterval(interval);
    }, [
        isActive,
        timeLeft,
        focusDuration,
        shortBreak,
        timerMode,
        isBreak,
        currentDuration
    ]);

    const toggleTimer = () => {
        if (!hasStarted) {
            setHasStarted(true);
        }

        setIsActive(previous => !previous);
    };

    const performReset = async isProgressMade => {
        let abandonedSessionData = null;

        if (
            isProgressMade &&
            timerMode === 'countdown' &&
            !isBreak
        ) {
            const completedSeconds = initialTime - timeLeft;
            const completedMinutes = Math.round(
                completedSeconds / 60
            );

            if (completedSeconds > 0) {
                const endTime = new Date();
                const startTime = new Date(
                    endTime.getTime() - completedSeconds * 1000
                );

                abandonedSessionData = {
                    targetDuration: focusDuration,
                    completedDuration: completedMinutes,
                    status: 'abandoned',
                    isPomodoro: false,
                    timerMode,
                    startTime,
                    endTime
                };
            }
        }

        setIsActive(false);
        setHasStarted(false);
        setIsBreak(false);
        setTimeLeft(focusDuration * 60);

        if (abandonedSessionData && auth.currentUser) {
            addDoc(collection(db, 'sessions'), {
                ...abandonedSessionData,
                userId: auth.currentUser.uid,
                createdAt: new Date()
            }).catch(error => {
                console.error(
                    'Failed to save abandoned session:',
                    error
                );
            });
        }
    };

    const resetTimer = () => {
        if (isBreak) {
            showConfirm(
                'Skip break?',
                'Skip the rest of your break and start focusing now?',
                () => {
                    setIsBreak(false);
                    setHasStarted(true);
                    setIsActive(true);
                    setTimeLeft(focusDuration * 60);
                },
                {
                    confirmText: 'Start Focus'
                }
            );

            return;
        }

        const isProgressMade =
            hasStarted && timeLeft < initialTime;

        if (isProgressMade) {
            showConfirm(
                'Discard progress?',
                'Your current focus progress will be saved as an abandoned session.',
                () => performReset(true),
                {
                    confirmText: 'Discard',
                    tone: 'danger'
                }
            );

            return;
        }

        performReset(false);
    };

    const performSessionSwitch = newIndex => {
        setCurrentIndex(newIndex);
        setIsActive(false);
        setHasStarted(false);
        setIsBreak(false);
        setTimeLeft(sessions[newIndex].duration * 60);
    };

    const switchSession = newIndex => {
        if (hasStarted && !isBreak) {
            showConfirm(
                'Switch session?',
                'Switching sessions will discard your current progress.',
                () => performSessionSwitch(newIndex),
                {
                    confirmText: 'Switch',
                    tone: 'danger'
                }
            );

            return;
        }

        performSessionSwitch(newIndex);
    };

    const handlePrev = () => {
        const newIndex =
            currentIndex > 0
                ? currentIndex - 1
                : sessions.length - 1;

        switchSession(newIndex);
    };

    const handleNext = () => {
        const newIndex =
            currentIndex < sessions.length - 1
                ? currentIndex + 1
                : 0;

        switchSession(newIndex);
    };

    const applyDurationChange = minutes => {
        setSessions(previous =>
            previous.map((session, index) =>
                index === currentIndex
                    ? { ...session, duration: minutes }
                    : session
            )
        );

        setIsActive(false);
        setHasStarted(false);

        if (!isBreak) {
            setTimeLeft(minutes * 60);
        }
    };

    const handleDurationChange = minutes => {
        if (hasStarted && !isBreak) {
            showConfirm(
                'Change duration?',
                'Changing the duration will reset your current progress.',
                () => applyDurationChange(minutes),
                {
                    confirmText: 'Change',
                    tone: 'danger'
                }
            );

            return;
        }

        applyDurationChange(minutes);
    };

    const handleCustomDuration = () => {
        showPrompt({
            title: 'Custom duration',
            message:
                'Enter a focus duration between 1 and 180 minutes.',
            initialValue: focusDuration,
            max: 180,
            onSubmit: handleDurationChange
        });
    };

    const handleBreakEdit = type => {
        const isShort = type === 'short';

        showPrompt({
            title: isShort
                ? 'Short break'
                : 'Long break',
            message:
                'Enter a break duration between 1 and 180 minutes.',
            initialValue: isShort
                ? shortBreak
                : longBreak,
            max: 180,
            onSubmit: value => {
                if (isShort) {
                    setShortBreak(value);
                } else {
                    setLongBreak(value);
                }
            }
        });
    };

    const handleTitleChange = event => {
        const value = event.target.value;

        setSessions(previous =>
            previous.map((session, index) =>
                index === currentIndex
                    ? { ...session, title: value }
                    : session
            )
        );
    };

    const displaySeconds =
        timerMode === 'countdown'
            ? timeLeft
            : initialTime - timeLeft;

    const progressRatio =
        timerMode === 'countdown'
            ? timeLeft / initialTime
            : (initialTime - timeLeft) / initialTime;

    return {
        sessions,
        currentIndex,
        timerMode,
        setTimerMode,
        focusDuration,
        shortBreak,
        longBreak,
        isBreak,
        timeLeft,
        isActive,
        hasStarted,
        initialTime,
        displaySeconds,
        progressRatio,
        timerDialog,
        closeDialog,
        dismissDialog,
        toggleTimer,
        resetTimer,
        handleDurationChange,
        handleCustomDuration,
        handleBreakEdit,
        handlePrev,
        handleNext,
        handleTitleChange
    };
};