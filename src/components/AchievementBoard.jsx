// src/components/AchievementBoard.jsx
import { achievementsData } from '../data/achievementsData';
import styles from './AchievementBoard.module.css'; 

// 占位图路径（放在 public 文件夹下）
const PLACEHOLDER_IMG = "/achievements/hidden-placeholder.png";

function AchievementBoard({ userUnlockedIds = [] }) {
  return (
    <div className={styles.boardContainer}>
      <h2 className={styles.boardTitle}>Campus Milestones</h2>
      
      <div className={styles.grid}>
        {achievementsData.map((ach) => {
          const isUnlocked = userUnlockedIds.includes(ach.id);
          const isSecret = ach.isHidden && !isUnlocked;

          // 务实的 UI 渲染策略：未解锁的隐藏成就显示占位符
          const displayTitle = isSecret ? "???" : ach.title;
          const displayDesc = isSecret ? "???" : ach.description;
          const displayIcon = isSecret ? PLACEHOLDER_IMG : ach.icon;

          return (
            <div 
              key={ach.id} 
              className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.iconWrapper}>
                <img 
                  src={displayIcon} 
                  alt={displayTitle} 
                  className={styles.iconImage}
                  // 如果未解锁，图片加上灰度滤镜 (Grayscale filter)
                  style={{ filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(50%)' }} 
                />
              </div>
              <div className={styles.infoWrapper}>
                <h3 className={styles.achTitle}>{displayTitle}</h3>
                <p className={styles.achDesc}>{displayDesc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AchievementBoard;