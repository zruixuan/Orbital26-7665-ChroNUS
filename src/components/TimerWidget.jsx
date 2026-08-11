import { useEffect, useState } from 'react';
import styles from './TimerWidget.module.css';
import StudyStats from './StudyStats';
import { useTimerEngine } from '../hooks/useTimerEngine';
import { useFocusTasks } from '../hooks/useFocusTasks';

function TimerDialog({
    dialog,
    onClose,
    onDismiss
}) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setValue(dialog?.initialValue || '');
        setError('');
    }, [dialog]);

    useEffect(() => {
        if (!dialog) {
            return undefined;
        }

        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown
            );
        };
    }, [dialog, onClose]);

    if (!dialog) {
        return null;
    }

    const handleConfirm = () => {
        if (dialog.type === 'prompt') {
            const parsedValue = Number(value);

            if (
                !Number.isInteger(parsedValue) ||
                parsedValue < dialog.min ||
                parsedValue > dialog.max
            ) {
                setError(
                    `Enter a whole number from ${dialog.min} to ${dialog.max}.`
                );

                return;
            }

            onDismiss();
            dialog.onSubmit(parsedValue);
            return;
        }

        onDismiss();
        dialog.onConfirm?.();
    };

    return (
        <div
            className={styles.dialogOverlay}
            onMouseDown={onClose}
            role="presentation"
        >
            <div
                className={styles.dialogBox}
                onMouseDown={event =>
                    event.stopPropagation()
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="timer-dialog-title"
            >
                <button
                    className={styles.dialogClose}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>

                <div
                    className={`${styles.dialogIcon} ${
                        dialog.tone === 'danger'
                            ? styles.dialogIconDanger
                            : ''
                    }`}
                >
                    {dialog.type === 'prompt'
                        ? '✎'
                        : dialog.tone === 'danger'
                            ? '!'
                            : '✓'}
                </div>

                <h3
                    id="timer-dialog-title"
                    className={styles.dialogTitle}
                >
                    {dialog.title}
                </h3>

                <p className={styles.dialogMessage}>
                    {dialog.message}
                </p>

                {dialog.type === 'prompt' && (
                    <div
                        className={
                            styles.dialogInputGroup
                        }
                    >
                        <input
                            className={`${styles.dialogInput} ${
                                error
                                    ? styles.dialogInputError
                                    : ''
                            }`}
                            type="number"
                            min={dialog.min}
                            max={dialog.max}
                            value={value}
                            onChange={event => {
                                setValue(event.target.value);
                                setError('');
                            }}
                            onKeyDown={event => {
                                if (
                                    event.key === 'Enter'
                                ) {
                                    handleConfirm();
                                }
                            }}
                            autoFocus
                        />

                        <span>minutes</span>
                    </div>
                )}

                {error && (
                    <p className={styles.dialogError}>
                        {error}
                    </p>
                )}

                <div
                    className={styles.dialogActions}
                >
                    {dialog.type !== 'alert' && (
                        <button
                            className={
                                styles.dialogCancelBtn
                            }
                            onClick={onClose}
                        >
                            {dialog.cancelText}
                        </button>
                    )}

                    <button
                        className={`${styles.dialogConfirmBtn} ${
                            dialog.tone === 'danger'
                                ? styles.dialogDangerBtn
                                : ''
                        }`}
                        onClick={handleConfirm}
                    >
                        {dialog.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

function TimerWidget() {
    const {
        sessions,
        currentIndex,
        timerMode,
        setTimerMode,
        focusDuration,
        shortBreak,
        longBreak,
        isBreak,
        isActive,
        hasStarted,
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
    } = useTimerEngine();

    const {
        currentlyFocusingItems,
        toggleTaskCompletion
    } = useFocusTasks();

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');

        const remainingSeconds = (seconds % 60)
            .toString()
            .padStart(2, '0');

        return `${minutes}:${remainingSeconds}`;
    };

    const size = 320;
    const center = size / 2;
    const radius = 132;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset =
        circumference -
        progressRatio * circumference;

    return (
        <div
            className={
                styles.timerWidgetContainer
            }
        >
            <div className={styles.widgetLayout}>
                <div className={styles.timerCard}>
                    <div
                        className={
                            styles.sessionNavHeader
                        }
                    >
                        <button
                            className={
                                styles.iconButton
                            }
                            onClick={handlePrev}
                            aria-label="Previous session"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        <div
                            className={
                                styles.sessionTitleWrapper
                            }
                        >
                            <input
                                type="text"
                                value={
                                    sessions[currentIndex]
                                        .title
                                }
                                onChange={
                                    handleTitleChange
                                }
                                placeholder="Name your session..."
                                className={
                                    styles.sessionTitleInput
                                }
                            />
                        </div>

                        <button
                            className={
                                styles.iconButton
                            }
                            onClick={handleNext}
                            aria-label="Next session"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    <div
                        className={
                            styles.circleWrapper
                        }
                    >
                        <svg
                            className={styles.svgRing}
                            width={size}
                            height={size}
                        >
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke="#f5f5f7"
                                strokeWidth="14"
                            />

                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={
                                    isBreak
                                        ? '#34c759'
                                        : '#f15c22'
                                }
                                strokeWidth="14"
                                strokeDasharray={
                                    circumference
                                }
                                strokeDashoffset={
                                    strokeDashoffset
                                }
                                strokeLinecap="round"
                                style={{
                                    transform:
                                        'rotate(-90deg)',
                                    transformOrigin:
                                        '50% 50%',
                                    transition:
                                        'stroke-dashoffset 1s linear'
                                }}
                            />
                        </svg>

                        <div
                            className={
                                styles.circleContent
                            }
                        >
                            <div
                                className={
                                    styles.statusText
                                }
                            >
                                {isBreak
                                    ? isActive
                                        ? 'Break Time ☕️'
                                        : 'Break Paused'
                                    : !hasStarted
                                        ? 'Focus Time'
                                        : isActive
                                            ? 'Focusing...'
                                            : 'Paused'}
                            </div>

                            <h1
                                className={
                                    styles.timeDisplay
                                }
                            >
                                {formatTime(
                                    displaySeconds
                                )}
                            </h1>

                            {!hasStarted && (
                                <div
                                    className={
                                        styles.readyText
                                    }
                                >
                                    {isBreak
                                        ? 'Ready to recharge?'
                                        : 'Ready to focus?'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={styles.actionRow}
                    >
                        <button
                            className={
                                styles.startButton
                            }
                            onClick={toggleTimer}
                            style={{
                                background:
                                    !hasStarted
                                        ? isBreak
                                            ? '#34c759'
                                            : '#f15c22'
                                        : !isActive
                                            ? '#34c759'
                                            : '#1d1d1f'
                            }}
                        >
                            {isActive ? (
                                <>
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <rect
                                            x="6"
                                            y="4"
                                            width="4"
                                            height="16"
                                        />

                                        <rect
                                            x="14"
                                            y="4"
                                            width="4"
                                            height="16"
                                        />
                                    </svg>

                                    Pause
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>

                                    {hasStarted
                                        ? 'Resume'
                                        : isBreak
                                            ? 'Start Break'
                                            : 'Start Focus'}
                                </>
                            )}
                        </button>

                        <button
                            className={
                                styles.resetButton
                            }
                            onClick={resetTimer}
                            disabled={
                                !hasStarted &&
                                !isBreak
                            }
                            style={{
                                opacity:
                                    hasStarted ||
                                    isBreak
                                        ? 1
                                        : 0.4,
                                cursor:
                                    hasStarted ||
                                    isBreak
                                        ? 'pointer'
                                        : 'not-allowed'
                            }}
                            title={
                                isBreak
                                    ? 'Skip Break'
                                    : 'Reset Timer'
                            }
                        >
                            {isBreak ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polygon points="5 4 15 12 5 20 5 4" />
                                    <line
                                        x1="19"
                                        y1="5"
                                        x2="19"
                                        y2="19"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div
                        className={
                            styles.sessionDots
                        }
                    >
                        <span>
                            Session{' '}
                            {currentIndex + 1} of{' '}
                            {sessions.length}
                        </span>

                        {sessions.map(
                            (session, index) => (
                                <div
                                    key={session.id}
                                    className={
                                        index ===
                                        currentIndex
                                            ? styles.dotActive
                                            : styles.dot
                                    }
                                />
                            )
                        )}
                    </div>
                </div>

                <div
                    className={
                        styles.settingsCard
                    }
                >
                    <div
                        className={
                            styles.settingBlock
                        }
                    >
                        <label>Timer Mode</label>

                        <div
                            className={
                                styles.buttonGroup
                            }
                        >
                            <button
                                className={`${styles.modeBtn} ${
                                    timerMode ===
                                    'countdown'
                                        ? styles.modeBtnActive
                                        : ''
                                }`}
                                onClick={() =>
                                    setTimerMode(
                                        'countdown'
                                    )
                                }
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                    />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>

                                Countdown
                            </button>

                            <button
                                className={`${styles.modeBtn} ${
                                    timerMode ===
                                    'countup'
                                        ? styles.modeBtnActive
                                        : ''
                                }`}
                                onClick={() =>
                                    setTimerMode(
                                        'countup'
                                    )
                                }
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>

                                Count Up
                            </button>
                        </div>
                    </div>

                    <div
                        className={
                            styles.settingBlock
                        }
                    >
                        <label>Duration</label>

                        <div
                            className={
                                styles.buttonGroup
                            }
                        >
                            {[25, 50, 90].map(
                                minutes => (
                                    <button
                                        key={minutes}
                                        className={`${styles.durationBtn} ${
                                            focusDuration ===
                                            minutes
                                                ? styles.durationBtnActive
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleDurationChange(
                                                minutes
                                            )
                                        }
                                    >
                                        {minutes} min
                                    </button>
                                )
                            )}

                            <button
                                className={`${styles.durationBtn} ${
                                    ![25, 50, 90].includes(
                                        focusDuration
                                    )
                                        ? styles.durationBtnActive
                                        : ''
                                }`}
                                onClick={
                                    handleCustomDuration
                                }
                            >
                                Custom
                            </button>
                        </div>
                    </div>

                    <div
                        className={
                            styles.settingBlock
                        }
                    >
                        <label>
                            Break Settings
                        </label>

                        <div
                            className={
                                styles.menuList
                            }
                        >
                            <div
                                className={
                                    styles.menuItem
                                }
                                onClick={() =>
                                    handleBreakEdit(
                                        'short'
                                    )
                                }
                            >
                                <span>
                                    Short Break
                                </span>

                                <div
                                    className={
                                        styles.menuRight
                                    }
                                >
                                    {shortBreak} min

                                    <span
                                        className={
                                            styles.arrow
                                        }
                                    >
                                        ›
                                    </span>
                                </div>
                            </div>

                            <div
                                className={
                                    styles.menuItem
                                }
                                onClick={() =>
                                    handleBreakEdit(
                                        'long'
                                    )
                                }
                            >
                                <span>
                                    Long Break
                                </span>

                                <div
                                    className={
                                        styles.menuRight
                                    }
                                >
                                    {longBreak} min

                                    <span
                                        className={
                                            styles.arrow
                                        }
                                    >
                                        ›
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={styles.tipBox}
                    >
                        <span
                            className={styles.bulb}
                        >
                            💡
                        </span>

                        <span>
                            <b>Tip:</b> Take a{' '}
                            {shortBreak}-min break
                            after each focus session
                            to stay fresh!
                        </span>
                    </div>
                </div>
            </div>

            <div
                className={
                    styles.statsAndFocusContainer
                }
            >
                <div
                    className={
                        styles.statsWrapper
                    }
                >
                    <StudyStats />
                </div>

                <div
                    className={
                        styles.focusingWrapper
                    }
                >
                    <h2
                        className={
                            styles.focusingTitle
                        }
                    >
                        🎯 Currently Focusing On
                    </h2>

                    <div
                        className={
                            styles.focusingList
                        }
                    >
                        {currentlyFocusingItems.length >
                        0 ? (
                            currentlyFocusingItems.map(
                                item => (
                                    <div
                                        key={item.id}
                                        className={
                                            styles.focusingItem
                                        }
                                        style={{
                                            display:
                                                'flex',
                                            alignItems:
                                                'center',
                                            gap: '12px'
                                        }}
                                    >
                                        {item.type ===
                                            'task' && (
                                            <input
                                                type="checkbox"
                                                checked={
                                                    item.completed ||
                                                    false
                                                }
                                                onChange={() =>
                                                    toggleTaskCompletion(
                                                        item.id,
                                                        item.completed
                                                    )
                                                }
                                                style={{
                                                    width:
                                                        '18px',
                                                    height:
                                                        '18px',
                                                    cursor:
                                                        'pointer'
                                                }}
                                            />
                                        )}

                                        <div
                                            style={{
                                                flex: 1
                                            }}
                                        >
                                            <div
                                                className={
                                                    styles.focusingItemTitle
                                                }
                                                style={{
                                                    textDecoration:
                                                        item.completed
                                                            ? 'line-through'
                                                            : 'none',
                                                    opacity:
                                                        item.completed
                                                            ? 0.6
                                                            : 1
                                                }}
                                            >
                                                {item.type ===
                                                'event'
                                                    ? '📅 '
                                                    : ''}
                                                {item.title}
                                            </div>

                                            <div
                                                className={
                                                    styles.focusingItemTime
                                                }
                                            >
                                                {item.type ===
                                                'event'
                                                    ? `In Progress until ${
                                                        item.endTime.split(
                                                            ' '
                                                        )[1]
                                                    }`
                                                    : `Task due by ${
                                                        item.deadline.split(
                                                            ' '
                                                        )[1]
                                                    }`}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        ) : (
                            <div
                                className={
                                    styles.focusingEmpty
                                }
                            >
                                No immediate tasks or
                                events. Time for a
                                break! ☕️
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TimerDialog
                dialog={timerDialog}
                onClose={closeDialog}
                onDismiss={dismissDialog}
            />
        </div>
    );
}

export default TimerWidget;