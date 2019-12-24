import './style.scss';
import { JSON, JsonObject, JsonProperty } from "ta-json";
import { render } from 'inferno';
import './blah.tsx';

console.log("Hi");

function initializeWithJson(obj: any, json: any) {
    // TODO: Handle list
    for(var prop in obj) {
        if(!json.hasOwnProperty(prop)) {
            continue;
        }

        if (typeof obj[prop] === 'object') {
            initializeWithJson(obj[prop], json[prop]);
        } else {
            console.assert(typeof obj[prop] === typeof json[prop]);
            obj[prop] = json[prop];
        }
    }
}

enum SafetyIcon {
    HearingProtection,
    ProtectiveGloves,
}

class Material {
    label: String;
}

enum Access {
    UsableByEveryone,
    UsableByEveryoneCareful,
    CourseRequired,
}

class Sign {
    protected __type__ = "Sign";
    name: String = "";
    access: Access = Access.UsableByEveryone;
    outOfOrder: Boolean = false;
    sections: Sections = new Sections();
}

abstract class Section {
    protected __type__ = "Sign";
    header: String = null;
    enabled: Boolean = false;

    abstract defaultHeader (): String;
}

class SectionOutOfOrder extends Section {
    constructor() {
        super();
        this.__type__ = "SignOutOfOrder";
    }
    reason: String = "";
    defaultHeader () {
        return "Out Of Order";
    }
}

class SectionSafety extends Section {
    constructor() {
        super();
        this.__type__ = "SectionSafety";
    }
    icons: SafetyIcon[] = new Array<SafetyIcon>();
    defaultHeader () {
        return "Safety";
    }
}

class SectionMaterials extends Section {
    constructor() {
        super();
        this.__type__ = "SectionMaterials";
    }
    allowed: Boolean = false;
    materials: Material[] = new Array<Material>();
    defaultHeader () {
        return this.allowed ? "Allowed Materials" : "Prohibited Materials";
    }
}

class FreeTextSection extends Section {
    constructor() {
        super();
        this.__type__ = "FreeTextSection";
    }
    contents: String = "";
    defaultHeader () {
        return "";
    }
}

class Sections {
    allowedMaterials: SectionMaterials = new SectionMaterials();
    prohibitedMaterials: SectionMaterials = new SectionMaterials();
    quickStart: FreeTextSection = new FreeTextSection();
    outOfOrder : SectionOutOfOrder;

    constructor() {
        this.allowedMaterials.allowed = true;
        this.prohibitedMaterials.allowed = false;
        this.quickStart.header = "Quick Start";
    }
}

function renderOptions(root: HTMLElement, sign: Sign) {
    ""
}

function renderPreview(root: HTMLElement, sign: Sign) {
    return `
    <div class="sign-root">
     
    `
}