import React from 'react';
export interface SpotlightStyle {
    padding?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    borderRadius?: number;
    shape?: 'rounded-rect' | 'circle' | 'pill';
    borderWidth?: number;
    borderColor?: string;
    glowColor?: string;
    glowOpacity?: number;
    glowRadius?: number;
    overlayColor?: string;
    springDamping?: number;
    springStiffness?: number;
}
export interface Step {
    key: string;
    title: string;
    description: string;
    getRef?: () => React.RefObject<any>;
    allowInteraction?: boolean;
    spotlightStyle?: SpotlightStyle;
    renderCustomCard?: (props: {
        currentStepIndex: number;
        totalSteps: number;
        onNext: () => void;
        onSkip: () => void;
        isAnimating: boolean;
        step: Step;
    }) => React.ReactNode;
}
export interface ProfileTourProps {
    visible: boolean;
    onComplete?: () => void;
    onSkip?: () => void;
    steps: Step[];
    initialStepKey?: string;
    scrollViewRef: React.RefObject<any>;
    children: React.ReactNode;
    spotlightStyle?: SpotlightStyle;
}
declare const ProfileTour: React.FC<ProfileTourProps>;
export default ProfileTour;
//# sourceMappingURL=ProfileTour.d.ts.map