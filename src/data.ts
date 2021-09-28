
export enum SafetyIcon {
    HearingProtection,
    ProtectiveGloves,
    SafetyGlasses,
    FaceShield,
    GasMask,
    TightClothing,
    GenericNo,
    GenericOK,
    WeldingMask,
}

export enum PaperSize {
    A4,
    A5,
}

export interface Material {
    label: string;
    //icon: MaterialIcon;
}

export interface SafetyItem {
    label: string;
    icon: SafetyIcon;
}

export interface CleanupItem {
    label: string;
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
    courseURL: string = "";
    outOfOrder: boolean = false;
    outOfOrderReason: string = "";
    wikiURL: string = "";
    slackChannel: string = "";
    paperSize: PaperSize = PaperSize.A4;
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

export class SectionCleanup extends Section {
    items: CleanupItem[] = new Array<CleanupItem>();

    defaultHeader() {
        return "Cleanup";
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
    safety : SectionSafety = new SectionSafety();
    cleanup: SectionCleanup = new SectionCleanup();
    quickStart: SectionFreeText = new SectionFreeText();
    outOfOrder : SectionOutOfOrder = new SectionOutOfOrder();

    constructor() {
        this.allowedMaterials.allowed = true;
        this.prohibitedMaterials.allowed = false;
        this.quickStart.customHeader = "Quick Start";
    }
}