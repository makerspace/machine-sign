import './style.scss';
import { JSON, JsonObject, JsonProperty } from "ta-json";
import { render, Component } from 'inferno';
import { PreviewSign } from './view_preview';
import { Sign, Material, MaterialIcon } from './data';
import "classcat"
import { SettingsSign } from './view_settings';


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


function renderOptions(root: HTMLElement, sign: Sign) {
    ""
}

function renderPreview(root: HTMLElement, sign: Sign) {
    return `
    <div class="sign-root">
     
    `
}

const sign = new Sign();
sign.name = "Test";
sign.sections.allowedMaterials.enabled = true;
sign.sections.allowedMaterials.materials.push(new Material(MaterialIcon.SafetyGlasses));
sign.sections.allowedMaterials.materials.push(new Material(MaterialIcon.HearingProtection));

export class App extends Component {
    constructor(props: any) {
        super(props);
        this.state = props.sign;
    }

    onChange() {
        console.log("Changed");
        this.setState(this.state);
    }

    render() {
        return (
            <div class="app-root">
                <div id="settings">
                    <SettingsSign sign={this.state} onChange={ () => this.onChange() } />);
                </div>
                <div id="preview">
                    <PreviewSign sign={this.state} />);
                </div>
            </div>
        );
    }
}


render(
    <App sign={sign} />,
    document.getElementById("app-root")
);
