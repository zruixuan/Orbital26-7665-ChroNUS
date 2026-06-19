// src/pages/Timer.jsx
import styles from './Timer.module.css';
import NavBar from '../components/NavBar';
import TimerWidget from '../components/TimerWidget';
import LandmarkCard from '../components/LandmarkCard';

function Timer() {
  const landmarks = [
    { id: 1, title: 'UTown', subtitle: 'The Heart of Campus', current: 2, target: 5, unlocked: false, grad: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { id: 2, title: 'Central Library', subtitle: 'Knowledge Hub', current: 20, target: 20, unlocked: true, grad: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
    { id: 3, title: 'Yusof Ishak House', subtitle: 'Historical Landmark', current: 18, target: 30, unlocked: false, grad: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
    { id: 4, title: 'Kent Ridge Hall', subtitle: 'Residential College', current: 18, target: 50, unlocked: false, grad: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
    { id: 5, title: 'NUS Museum', subtitle: 'Heritage & Culture', current: 18, target: 80, unlocked: false, grad: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)' },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContainer}>
        <NavBar />
        
        <main className={styles.content}>
          <div className={styles.header}>
            <div>
              <div className={styles.titleRow}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f15c22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <h1 className={styles.title}>Study Timer</h1>
              </div>
              <p className={styles.subtitle}>Focus better. Achieve more.</p>
            </div>
            <button className={styles.historyBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Timer History
            </button>
          </div>

          <TimerWidget />

          <div className={styles.statsRow}>
            <div className={styles.statsPanel}>
              <div className={styles.panelHeader}>
                <h3>Study Stats</h3>
                <span className={styles.dropdown}>Today ▾</span>
              </div>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.iconBlue}>⏱️</div>
                  <div className={styles.metricVal}>2h 35m</div>
                  <div className={styles.metricLabel}>Focus Time</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.iconPurple}>📅</div>
                  <div className={styles.metricVal}>4</div>
                  <div className={styles.metricLabel}>Sessions</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.iconOrange}>🔥</div>
                  <div className={styles.metricVal}>1</div>
                  <div className={styles.metricLabel}>Day Streak</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.iconGreen}>✅</div>
                  <div className={styles.metricVal}>85%</div>
                  <div className={styles.metricLabel}>Focus Rate</div>
                </div>
              </div>
            </div>

            <div className={styles.chartPanel}>
              <div className={styles.panelHeader}>
                <h3>Total Focus Time</h3>
                <span className={styles.dropdown}>This Month ▾</span>
              </div>
              <div className={styles.chartContent}>
                <div>
                  <h2 className={styles.chartTotal}>18h 42m</h2>
                  <span className={styles.trendGreen}>+4h 12m vs last month</span>
                </div>
                <div className={styles.mockChart}>
                  {[3, 5, 2, 8, 4, 9, 6, 3, 7, 5, 8, 4].map((h, i) => (
                    <div key={i} className={styles.chartBar} style={{ height: `${h * 10}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.landmarksSection}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Unlock NUS Landmarks</h3>
                <p style={{ margin: '4px 0 0 0', color: '#86868b', fontSize: '0.9rem' }}>Study more to unlock iconic places around NUS!</p>
              </div>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
            
            <div className={styles.landmarkGallery}>
              {landmarks.map(lm => (
                <LandmarkCard 
                  key={lm.id}
                  title={lm.title}
                  subtitle={lm.subtitle}
                  currentHours={lm.current}
                  targetHours={lm.target}
                  isUnlocked={lm.unlocked}
                  imageGradient={lm.grad}
                />
              ))}
              
              <div className={`${styles.card} ${styles.comingSoon}`}>
                <div className={styles.locked}>🔒</div>
                <h4 style={{ margin: '8px 0 4px', color: '#1d1d1f' }}>More to come</h4>
                <p style={{ margin: 0, color: '#86868b', fontSize: '0.85rem' }}>Stay tuned!</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Timer;