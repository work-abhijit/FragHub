export const RATES = {
    pc: 80, // ₹80/hour
    ps5: 100, // ₹100/hour
};

export const MINIMUM_BILLING_MINUTES = 30;
export const GRACE_PERIOD_MINUTES = 5;
export const AUTO_END_PAUSED_MINUTES = 30;

export const MEMBERSHIP_TIERS = {
    bronze: {
        minSpent: 0,
        maxSpent: 4999,
        discountPercent: 0,
        gradient: 'from-amber-600 to-amber-800',
        label: 'BRONZE'
    },
    silver: {
        minSpent: 5000,
        maxSpent: 14999,
        discountPercent: 5,
        gradient: 'from-gray-400 to-gray-600',
        label: 'SILVER'
    },
    gold: {
        minSpent: 15000,
        maxSpent: 29999,
        discountPercent: 10,
        gradient: 'from-yellow-400 to-yellow-600',
        label: 'GOLD'
    },
    platinum: {
        minSpent: 30000,
        maxSpent: Infinity,
        discountPercent: 15,
        gradient: 'from-cyan-400 to-blue-600',
        label: 'PLATINUM'
    }
};
