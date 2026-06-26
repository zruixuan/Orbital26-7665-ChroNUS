import styles from './LandmarkCard.module.css';

function LandmarkCard({ title, subtitle, currentHours, targetHours, isUnlocked, imageGradient }) {
  const progressPercent = Math.min((currentHours / targetHours) * 100, 100);

  const displayHours = Math.floor(currentHours);
  const decimalPart = currentHours - displayHours;
  const displayMinutes = Math.round(decimalPart * 60);

  return (
    <div className={styles.card}>
      <div 
        className={styles.imageArea} 
        style={{ background: imageGradient || 'linear-gradient(135deg, #e2e2e2, #f5f5f5)' }}
      >
        <div className={styles.statusBadge}>
          {isUnlocked ? (
            <span className={styles.unlocked}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Unlocked
            </span>
          ) : (
            <span className={styles.locked}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
          )}
        </div>
      </div>

      <div className={styles.infoArea}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.subtitle}>{subtitle}</p>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercent}%`, backgroundColor: isUnlocked ? '#22c55e' : '#f15c22' }} 
            />
          </div>
          <div className={styles.progressText}>
            <span style={{ color: isUnlocked ? '#22c55e' : '#f15c22', fontWeight: '600' }}>
              {displayHours}h {displayMinutes > 0 ? `${displayMinutes}m` : ''}
            </span>
            <span style={{ color: '#86868b' }}> / {targetHours}h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandmarkCard;