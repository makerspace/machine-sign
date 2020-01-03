import { Access, Sign, SafetyIcon } from './data';

export const safetyIcon2svg : { [id: number]: string } = {};
safetyIcon2svg[SafetyIcon.SafetyGlasses] = "static/images/safety_icons/safety-glasses.svg";
safetyIcon2svg[SafetyIcon.ProtectiveGloves] = "static/images/safety_icons/protection-gloves.svg";
safetyIcon2svg[SafetyIcon.HearingProtection] = "static/images/safety_icons/silhouette-with-safety-headphone.svg";

export const safetyIcon2name : { [id: number]: string } = {};
safetyIcon2name[SafetyIcon.SafetyGlasses] = "Safety Glasses";
safetyIcon2name[SafetyIcon.ProtectiveGloves] = "Protective Gloves";
safetyIcon2name[SafetyIcon.HearingProtection] = "Hearing Protection";

export const iconAllowedMaterial = "static/images/zondicons/checkmark-outline.svg";
export const iconProhibitedMaterial = "static/images/zondicons/close-outline.svg";
export const iconCleanup = "static/images/zondicons/trash.svg";
export const iconDelete = "static/images/zondicons/trash.svg";

export function ColorClass(sign: Sign) {
    if (sign.outOfOrder) return "sign-status-outoforder";
    switch(sign.access) {
        case Access.CourseRequired:
        return "sign-access-course";
        case Access.UsableByEveryone:
        return "sign-access-everyone";
        case Access.UsableByEveryoneCareful:
        return "sign-access-everyone-careful";
    }
}