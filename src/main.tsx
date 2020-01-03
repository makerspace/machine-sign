import './style.scss';
import { JSON, JsonObject, JsonProperty } from "ta-json";
import { render, Component } from 'inferno';
import { PreviewSign } from './view_preview';
import { Sign } from './data';
import "classcat"
import { SettingsSign } from './view_settings';


console.log("Hi");

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




function SignItem({ item, onOpen }: any) {
    return (
        <li>
            <span>{ item.name }</span>
            <button onClick={ onOpen }>Open</button>
        </li>
    )
}

class SignSelector extends Component {
    constructor(props: any) {
        super(props);
        this.state = { signs: [] }
    }

    componentWillMount() {
        fetch("data/signs").then(response => {

            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error " + response.status);
            }
        }).then(json => {
            this.setState({ signs: json.data });
        });
    }

    render() {
        return (
            <div class="sign-selector">
                <ul>
                    { this.state.signs.map((item: any) => SignItem({ item: item, onOpen: () => this.props.onOpen(item) })) }
                    <li>
                        <span>Create new sign</span>
                        <button onClick={ () => this.props.onOpen(null) }>Create</button>
                    </li>
                </ul>
            </div>
        )
    }
}

export class App extends Component {
    saving: boolean;

    constructor(props: any) {
        super(props);
        this.state = { sign: null, id: null };
    }

    onChange() {
        console.log("Changed");
        this.setState({});
    }

    open(item: any) {
        if (item === null) {
            // Create new

            const sign = new Sign();
            sign.name = "Test";
            this.setState({ sign: sign, id: null });
        } else {
            fetch(`data/signs/${item.id}`).then(r => r.json()).then(json => {
                console.log("Got response " + json);
                const item = json.data;
                const sign = new Sign();
                initializeWithJson(sign, item.data);
                this.setState({ sign: sign, id: item.id});
            });
        }
    }

    save() {
        if (this.saving) return;
        if (this.state.sign === null) return;

        fetch(this.state.id !== null ? `data/signs/${this.state.id}` : 'data/signs', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.sign)
        }).then(r => r.json()).then(json => {
            this.setState({ id: json.data.id });
        }).finally(() => {
            this.saving = false;
        });
    }

    delete() {

    }

    render() {
        if (this.state.sign != null) {
            return (
                <div class="app-root">
                    <div id="settings">
                        <SettingsSign sign={this.state.sign} onChange={ () => this.onChange() } onSave={ () => this.save() } onDelete={ () => this.delete() } />
                    </div>
                    <div id="preview">
                        <PreviewSign sign={this.state.sign} />
                    </div>
                </div>
            );
        } else {
            return (
                <div class="app-root">
                    <SignSelector onOpen={ (item: any) => this.open(item) } />
                </div>
            )
        }
    }
}


render(
    <App />,
    document.getElementById("app-root")
);
