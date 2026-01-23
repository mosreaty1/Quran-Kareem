// Visitor Counter Script
'use strict';

class VisitorCounter {
    constructor() {
        this.storageKeys = {
            totalVisits: 'quran_total_visits',
            todayVisits: 'quran_today_visits',
            lastVisitDate: 'quran_last_visit_date',
            sessionId: 'quran_session_id'
        };

        this.init();
    }

    // Initialize visitor counter
    init() {
        this.recordVisit();
        this.displayStats();
        this.simulateOnlineUsers();

        // Update online users every 30 seconds
        setInterval(() => this.simulateOnlineUsers(), 30000);
    }

    // Generate unique session ID
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get current session ID or create new one
    getSessionId() {
        let sessionId = sessionStorage.getItem(this.storageKeys.sessionId);
        if (!sessionId) {
            sessionId = this.generateSessionId();
            sessionStorage.setItem(this.storageKeys.sessionId, sessionId);
        }
        return sessionId;
    }

    // Check if this is a new session
    isNewSession() {
        const sessionId = sessionStorage.getItem(this.storageKeys.sessionId);
        return !sessionId;
    }

    // Get today's date as string
    getTodayDate() {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    }

    // Record visit
    recordVisit() {
        // Only record if new session
        if (!this.isNewSession()) {
            return;
        }

        // Get or create session ID
        this.getSessionId();

        const today = this.getTodayDate();
        const lastVisitDate = localStorage.getItem(this.storageKeys.lastVisitDate);

        // Increment total visits
        let totalVisits = parseInt(localStorage.getItem(this.storageKeys.totalVisits) || '0');
        totalVisits++;
        localStorage.setItem(this.storageKeys.totalVisits, totalVisits.toString());

        // Handle today's visits
        if (lastVisitDate === today) {
            // Same day - increment today's visits
            let todayVisits = parseInt(localStorage.getItem(this.storageKeys.todayVisits) || '0');
            todayVisits++;
            localStorage.setItem(this.storageKeys.todayVisits, todayVisits.toString());
        } else {
            // New day - reset today's visits
            localStorage.setItem(this.storageKeys.todayVisits, '1');
            localStorage.setItem(this.storageKeys.lastVisitDate, today);
        }
    }

    // Get visit statistics
    getStats() {
        const totalVisits = parseInt(localStorage.getItem(this.storageKeys.totalVisits) || '0');
        const todayVisits = parseInt(localStorage.getItem(this.storageKeys.todayVisits) || '0');

        return {
            total: totalVisits,
            today: todayVisits
        };
    }

    // Simulate online users (random number based on time)
    simulateOnlineUsers() {
        const hour = new Date().getHours();
        let baseUsers = 0;

        // Simulate more users during peak hours (8 AM - 11 PM)
        if (hour >= 8 && hour <= 23) {
            baseUsers = Math.floor(Math.random() * 15) + 5; // 5-20 users
        } else {
            baseUsers = Math.floor(Math.random() * 8) + 2; // 2-10 users
        }

        // Add some randomness
        const onlineUsers = baseUsers + Math.floor(Math.random() * 3);

        // Update display
        const onlineElement = document.getElementById('online-users');
        if (onlineElement) {
            this.animateNumber(onlineElement, onlineUsers);
        }

        return onlineUsers;
    }

    // Animate number change
    animateNumber(element, targetNumber) {
        const currentNumber = parseInt(element.textContent) || 0;
        if (currentNumber === targetNumber) return;

        const duration = 1000; // 1 second
        const steps = 20;
        const stepValue = (targetNumber - currentNumber) / steps;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentNumber + (stepValue * currentStep));
            element.textContent = newValue;

            if (currentStep >= steps) {
                element.textContent = targetNumber;
                clearInterval(interval);
            }
        }, stepDuration);
    }

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Display statistics
    displayStats() {
        const stats = this.getStats();

        const totalElement = document.getElementById('total-visits');
        const todayElement = document.getElementById('today-visits');

        if (totalElement) {
            totalElement.textContent = this.formatNumber(stats.total);
        }

        if (todayElement) {
            todayElement.textContent = this.formatNumber(stats.today);
        }
    }

    // Reset statistics (for testing)
    reset() {
        localStorage.removeItem(this.storageKeys.totalVisits);
        localStorage.removeItem(this.storageKeys.todayVisits);
        localStorage.removeItem(this.storageKeys.lastVisitDate);
        sessionStorage.removeItem(this.storageKeys.sessionId);
        this.init();
    }
}

// Initialize visitor counter when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.visitorCounter = new VisitorCounter();
});
