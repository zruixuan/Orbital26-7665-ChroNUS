// src/hooks/useFocusTasks.js
import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../api/firebase";
import { onAuthStateChanged } from "firebase/auth";

const getLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useFocusTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        let unsubscribeSnapshot = null;
        
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }
            if (user) {
                const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
                unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
                    const firebaseTasks = [];
                    querySnapshot.forEach((doc) => firebaseTasks.push({ id: doc.id, ...doc.data() }));
                    setTasks(firebaseTasks);
                });
            } else {
                setTasks([]);
            }
        });
        
        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    const currentlyFocusingItems = useMemo(() => {
        if (!tasks.length) return [];

        const now = new Date();
        const todayStr = getLocalDateString(now);
        const currentFullTime = `${todayStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const currentEvents = tasks.filter(t =>
            t.type === "event" && t.startTime && t.endTime && t.startTime <= currentFullTime && t.endTime >= currentFullTime
        );

        const todayUncompletedTasks = tasks.filter(t =>
            t.type === "task" && !t.completed && t.deadline && t.deadline.startsWith(todayStr)
        );
        
        todayUncompletedTasks.sort((a, b) => a.deadline.localeCompare(b.deadline));
        const nextTaskDeadline = todayUncompletedTasks.length > 0 ? todayUncompletedTasks[0].deadline : null;
        const nextTasks = nextTaskDeadline ? todayUncompletedTasks.filter(t => t.deadline === nextTaskDeadline) : [];

        return [...currentEvents, ...nextTasks];
    }, [tasks]);

    return { currentlyFocusingItems };
};