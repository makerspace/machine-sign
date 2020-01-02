
export enum SafetyIcon {
    HearingProtection,
    ProtectiveGloves,
    SafetyGlasses,
}

export enum MaterialIcon {
    SafetyGlasses,
    ProtectionGloves,
    HearingProtection,
}

export class Material {
    label: string;
    icon: MaterialIcon;

    constructor(icon: MaterialIcon, label: string = "") {
        this.label = label;
        this.icon = icon;
    }
}

export class SafetyItem {
    label: string;
    icon: SafetyIcon;

    constructor(icon: SafetyIcon, label: string = "") {
        this.label = label;
        this.icon = icon;
    }
}

export enum Access {
    UsableByEveryone,
    UsableByEveryoneCareful,
    CourseRequired,
}

export class Sign {
    protected __type__ = "Sign";
    name: string = "";
    model: string = "";
    access: Access = Access.UsableByEveryone;
    outOfOrder: boolean = false;
    outOfOrderReason: string = "";
    sections: Sections = new Sections();
}

export abstract class Section {
    protected __type__ = "Sign";
    customHeader: string = null;
    enabled: boolean = false;

    header() {
        return this.customHeader || this.defaultHeader();
    }
    abstract defaultHeader (): string;
}

export class SectionOutOfOrder extends Section {
    constructor() {
        super();
        this.__type__ = "SignOutOfOrder";
    }
    reason: string = "";
    defaultHeader () {
        return "Out Of Order";
    }
}

export class SectionSafety extends Section {
    constructor() {
        super();
        this.__type__ = "SectionSafety";
    }
    icons: SafetyItem[] = new Array<SafetyItem>();
    defaultHeader () {
        return "Safety";
    }
}

export class SectionMaterials extends Section {
    constructor() {
        super();
        this.__type__ = "SectionMaterials";
    }
    allowed: boolean = false;
    materials: Material[] = new Array<Material>();
    defaultHeader () {
        return this.allowed ? "Allowed Materials" : "Prohibited Materials";
    }
}

export class SectionFreeText extends Section {
    constructor() {
        super();
        this.__type__ = "SectionFreeText";
    }
    contents: string = "";
    defaultHeader () {
        return "";
    }
}

export class Sections {
    allowedMaterials: SectionMaterials = new SectionMaterials();
    prohibitedMaterials: SectionMaterials = new SectionMaterials();
    quickStart: SectionFreeText = new SectionFreeText();
    outOfOrder : SectionOutOfOrder = new SectionOutOfOrder();

    constructor() {
        this.allowedMaterials.allowed = true;
        this.prohibitedMaterials.allowed = false;
        this.quickStart.customHeader = "Quick Start";
    }
}