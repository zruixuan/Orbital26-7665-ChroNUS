import styles from './TimerWidget.module.css';

function TimerWidget() {
  // 放大圆环比例 (Enlarge ring proportions)
  const size = 320; // SVG 整体宽高
  const center = size / 2; // 圆心坐标
  const radius = 140; // 将半径从 110 扩大到 140
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * 0.9); 

  return (
    <div className={styles.widgetLayout}>
      
      {/* Left: Timer Card (独立的表盘卡片) */}
      <div className={styles.timerCard}>
        <div className={styles.togglePill}>
          <button className={styles.activePill}>Pomodoro</button>
          <button className={styles.inactivePill}>Custom</button>
        </div>

        <div className={styles.circleWrapper}>
          <svg className={styles.svgRing} width={size} height={size}>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#f5f5f7" strokeWidth="12" />
            <circle 
              cx={center} cy={center} r={radius} fill="none" stroke="#f15c22" strokeWidth="12"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          
          <div className={styles.circleContent}>
            <div className={styles.statusText}>Focus Time</div>
            {/* 时间数字同步放大以匹配大圆环 */}
            <h1 className={styles.timeDisplay}>25:00</h1>
            <div className={styles.readyText}>Ready to focus?</div>
          </div>
        </div>

        <div className={styles.actionRow}>
          <button className={styles.startButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Start Focus
          </button>
          <button className={styles.resetButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
          </button>
        </div>

        <div className={styles.sessionDots}>
          <span>Session 1 of 4</span>
          <div className={styles.dotActive} />
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
      </div>

      {/* Right: Settings Card (独立的设置卡片) */}
      <div className={styles.settingsCard}>
        
        <div className={styles.settingBlock}>
          <label>Timer Mode</label>
          <div className={styles.buttonGroup}>
            <button className={`${styles.modeBtn} ${styles.modeBtnActive}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Countdown
            </button>
            <button className={styles.modeBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              Count Up
            </button>
          </div>
        </div>

        <div className={styles.settingBlock}>
          <label>Duration</label>
          <div className={styles.buttonGroup}>
            <button className={`${styles.durationBtn} ${styles.durationBtnActive}`}>25 min</button>
            <button className={styles.durationBtn}>50 min</button>
            <button className={styles.durationBtn}>90 min</button>
            <button className={styles.durationBtn}>Custom</button>
          </div>
        </div>

        <div className={styles.settingBlock}>
          <label>Break Settings</label>
          <div className={styles.menuList}>
            <div className={styles.menuItem}>
              <span>Short Break</span>
              <div className={styles.menuRight}>5 min <span className={styles.arrow}>›</span></div>
            </div>
            <div className={styles.menuItem}>
              <span>Long Break</span>
              <div className={styles.menuRight}>15 min <span className={styles.arrow}>›</span></div>
            </div>
          </div>
        </div>

        <div className={styles.tipBox}>
          <span className={styles.bulb}>💡</span>
          <span><b>Tip:</b> Take a 5-min break after each focus session to stay fresh!</span>
        </div>

      </div>
    </div>
  );
}

export default TimerWidget;