import './style.scss';
import { JSON, JsonObject, JsonProperty } from "ta-json";
import { render, Component } from 'inferno';
import { PreviewSign } from './view_preview';
import { Sign, PaperSize } from './data';
import "classcat"
import { SettingsSign } from './view_settings';
import { debounce } from 'ts-debounce';

function initializeWithJson(obj: any, json: any) {
    // TODO: Handle list
    for(var prop in obj) {
        if(!json.hasOwnProperty(prop)) {
            continue;
        }

        console.assert(typeof obj[prop] === typeof json[prop]);
        if (typeof obj[prop] === 'object' && !Array.isArray(obj[prop])) {
            initializeWithJson(obj[prop], json[prop]);
        } else {
            obj[prop] = json[prop];
        }
    }
}

export class App extends Component {

    constructor(props: any) {
        super(props);
        this.state = { signs: [] };
    }

    componentWillMount() {
        fetch("data/signs").then(response => {

            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error " + response.status);
            }
        }).then(json => {
            console.log(json.data);
            Promise.all(json.data.map((v:any) => fetch("data/signs/" + v.id).then((v:Response) => v.json()))).then(signs => {
                console.log(signs);
                this.setState({signs: signs.map((item:any) => {
                    const sign = new Sign();
                    initializeWithJson(sign, item.data.data);
                    return { sign: sign, id: item.data.id };
                }).filter(item => item.sign.paperSize == PaperSize.A5)});
            });
        });
    }

    render() {
        return (
            <div class="app-root">
                <div id="preview">
                {
                    this.state.signs.map((sign:any) => (
                            <PreviewSign sign={sign.sign} id={sign.id} />
                    ))
                }
                </div>
            </div>
        );
    }
}


render(
    <App />,
    document.getElementById("app-root")
);
