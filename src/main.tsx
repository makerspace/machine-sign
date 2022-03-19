import './style.scss';
import { JSON } from "ta-json";
import { render, Component } from 'inferno';
import { PreviewSign } from './view_preview';
import { Sign } from './data';
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




function SignItem({ item, onOpen }: any) {
    return (
        <li onClick={ onOpen }>
            <span>{ item.name }</span>
        </li>
    )
}

class SignSelector extends Component<any, {signs: Sign[] }> {
    constructor(props: any) {
        super(props);
        this.state = { signs: [] }
    }

    componentWillMount() {
        this.findSigns();
    }

    findSigns() {
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
                <h1>MakerSign</h1>
                <ul>
                    <li onClick={ () => this.props.onOpen(null) }>
                        <span>Create new sign</span>
                    </li>
                </ul>
                <ul>
                    { this.state.signs.map((item: any) => SignItem({ item: item, onOpen: () => this.props.onOpen(item.id) })) }
                </ul>
            </div>
        )
    }
}

class SignSelectorSmall extends SignSelector {
    componentDidUpdate(lastProps: any, lastState: any, snapshot: any) {
        if (lastProps.selectedId != this.props.selectedId) {
            this.findSigns();
        }
    }

    render() {
        return (
            <select class="sign-selector" value={this.props.selectedId != null ? this.props.selectedId : -1} onInput={e => { const id = Number((e.target as HTMLSelectElement).value); this.props.onOpen(id != -1 ? id : null); }}>
                { this.state.signs.map((item: any) => (<option value={item.id}>{item.name}</option>)) }
                <option value={-1}>Create new sign</option>
            </select>
        )
    }
}

// How often to save (at most). In milliseconds
const SavingInterval = 2000;

export class App extends Component<any, { sign: Sign | null, id: number | null }> {
    saving: boolean;
    debouncedSave = debounce(() => this.save(), SavingInterval);

    constructor(props: any) {
        super(props);
        this.state = { sign: null, id: null };
        this.openFromURL();
    }

    onChange() {
        console.log("Changed");
        this.setState({});
        this.debouncedSave();
    }

    componentWillMount() {
        window.onpopstate = () => this.openFromURL();
        // this.openFromURL();
    }

    openFromURL() {
        const matches = window.location.pathname.match(/\/(\d+)/);
        if (matches !== null) {
            this.open(Number(matches[1]), false);
        } else {
            this.setState({ sign: null, id: null });
        }
    }

    open(id: number|null, pushState: boolean = true) {
        if (this.state.id == id && id !== null) return;

        if (id === null) {
            // Create new
            if (this.state.id !== null && pushState) {
                history.pushState({}, "", `/`);
            }

            const sign = new Sign();
            sign.name = "Test";
            this.setState({ sign: sign, id: null });
        } else {
            fetch(`data/signs/${id}`).then(r => r.json()).then(json => {
                console.log("Got response " + json);
                const item = json.data;
                const sign = new Sign();
                initializeWithJson(sign, item.data);
                this.setState({ sign: sign, id: item.id});
                if (pushState) history.pushState({}, "", `/${id}`);
            }).catch(e => {
                console.error(e);
                this.setState({ sign: null, id: null});
                history.pushState({}, "", `/`);
            });
        }
    }

    save() {
        console.log("Saving");
        if (this.saving) return;
        if (this.state.sign === null) return;

        fetch(this.state.id !== null ? `data/signs/${this.state.id}` : 'data/signs', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.sign)
        }).then(r => r.json()).then(json => {
            if (this.state.id === null) {
                history.pushState({}, "", `/${json.data.id}`);
            }
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
                        <div class="sign-root">
                            <SignSelectorSmall selectedId={this.state.id} onOpen={ (id: number|null) => this.open(id) } />
                            <SettingsSign sign={this.state.sign} onChange={ () => this.onChange() } onSave={ () => this.save() } onDelete={ () => this.delete() } autosaved={this.state.id !== null} />
                        </div>
                    </div>
                    <div id="preview">
                        <PreviewSign sign={this.state.sign} id={this.state.id} />
                    </div>
                </div>
            );
        } else {
            return (
                <div class="app-root">
                    <SignSelector onOpen={ (id: number|null) => this.open(id) } />
                </div>
            )
        }
    }
}


render(
    <App />,
    document.getElementById("app-root")
);
