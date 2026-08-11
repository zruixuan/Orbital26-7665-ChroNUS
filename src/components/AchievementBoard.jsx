// src/components/AchievementBoard.jsx
"use client";
import { useState } from 'react';
import { achievementsData } from '../data/achievementsData';
import styles from './AchievementBoard.module.css'; 

const PLACEHOLDER_IMG = "/achievements/hidden-placeholder.png";

function AchievementBoard({ userUnlockedIds = [] }) {
  const [selectedAch, setSelectedAch] = useState(null);

  const closeModal = () => setSelectedAch(null);

  return (
    <div className={styles.boardContainer}>
      <h2 className={styles.boardTitle}>Campus Milestones</h2>
      
      <div className={styles.grid}>
        {achievementsData.map((ach) => {
          const isUnlocked = userUnlockedIds.includes(ach.id);
          const isSecret = ach.isHidden && !isUnlocked;

          const displayTitle = isSecret ? "???" : ach.title;
          const displayDesc = isSecret ? "???" : ach.description;
          const displayIcon = isSecret ? PLACEHOLDER_IMG : ach.icon;

          return (
            <div 
              key={ach.id} 
              className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
              onClick={() => setSelectedAch(ach)} 
            >
              <div className={styles.iconWrapper}>
                <img 
                  src={displayIcon} 
                  alt={displayTitle} 
                  className={styles.iconImage}
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

      {selectedAch && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>×</button>
            
            <img 
              src={selectedAch.icon} 
              alt={selectedAch.title} 
              className={styles.modalImage} 
            />
            <h2 className={styles.modalTitle}>{selectedAch.title}</h2>
            
            <div className={styles.modalDetails}>
              <div className={styles.detailSection}>
                <strong>Requirement: </strong>
                <span>
                  {(!userUnlockedIds.includes(selectedAch.id) && selectedAch.isHidden) 
                    ? "???" 
                    : selectedAch.description}
                </span>
              </div>
              
              <div className={styles.detailSection}>
                <strong>Introduction: </strong>
                <span>
                  {userUnlockedIds.includes(selectedAch.id) 
                    ? selectedAch.introduction 
                    : "???"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AchievementBoard;
