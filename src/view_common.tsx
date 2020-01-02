import { Access, Sign, MaterialIcon } from './data';

export const materialIcon2svg : { [id: number]: string } = {};
materialIcon2svg[MaterialIcon.SafetyGlasses] = "images/safety_icons/safety-glasses.svg";
materialIcon2svg[MaterialIcon.ProtectionGloves] = "images/safety_icons/protection-gloves.svg";
materialIcon2svg[MaterialIcon.HearingProtection] = "images/safety_icons/silhouette-with-safety-headphone.svg";

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