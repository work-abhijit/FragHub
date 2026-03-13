import { RATES, MINIMUM_BILLING_MINUTES, GRACE_PERIOD_MINUTES, MEMBERSHIP_TIERS } from './constants';
import type { MembershipTier, StationType } from '../types';

export const calculateDuration = (startTime: number, endTime: number | null, pausedDurationSeconds: number, pausedStartTime?: number | null) => {
    const finalEndTime = endTime || Date.now();
    let totalPausedSeconds = pausedDurationSeconds;

    if (!endTime && pausedStartTime) {
        // Session is currently paused, include the ongoing pause time
        totalPausedSeconds += Math.floor((Date.now() - pausedStartTime) / 1000);
    }

    const durationSeconds = Math.max(0, Math.floor((finalEndTime - startTime) / 1000) - totalPausedSeconds);
    const durationMinutes = Math.floor(durationSeconds / 60);

    return { durationSeconds, durationMinutes };
};

export const calculateCost = (durationMinutes: number, type: StationType, discountPercent: number) => {
    if (durationMinutes < GRACE_PERIOD_MINUTES) {
        return { baseRate: 0, discount: 0, totalCost: 0 };
    }

    const billedMinutes = Math.max(durationMinutes, MINIMUM_BILLING_MINUTES);
    const hourlyRate = RATES[type];
    const billedHours = billedMinutes / 60;

    const baseRate = billedHours * hourlyRate;
    const discountAmount = (baseRate * discountPercent) / 100;
    const totalCost = baseRate - discountAmount;

    return {
        baseRate: Number(baseRate.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        totalCost: Number(totalCost.toFixed(2))
    };
};

export const determineMembershipTier = (totalSpent: number): MembershipTier => {
    if (totalSpent >= MEMBERSHIP_TIERS.platinum.minSpent) return 'platinum';
    if (totalSpent >= MEMBERSHIP_TIERS.gold.minSpent) return 'gold';
    if (totalSpent >= MEMBERSHIP_TIERS.silver.minSpent) return 'silver';
    return 'bronze';
};

export const getDiscountPercentage = (tier: MembershipTier): number => {
    return MEMBERSHIP_TIERS[tier].discountPercent;
};
