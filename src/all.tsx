import './style.scss';
import * as React from 'react'
import { Component } from 'react';
import { PreviewSign } from './view_preview';
import { Sign, PaperSize } from './data';
import "classcat"
import { createRoot } from 'react-dom/client';

function initializeWithJson(obj: any, json: any) {
    // TODO: Handle list
    for (var prop in obj) {
        if (!json.hasOwnProperty(prop)) {
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

function groupByTwo<T>(ls: Array<T>): Array<Array<T>> {
    const res: T[][] = [];
    for (let i = 0; i < ls.length; i += 1) {
        if (i % 2 == 0) res.push([]);
        res[res.length - 1]!.push(ls[i]!);
    }
    return res;
}

interface SignWithID {
    sign: Sign;
    id: number;
}
export class App extends Component<{}, { signs: SignWithID[], visible_signs: SignWithID[] }> {

    constructor(props: any) {
        super(props);
        this.state = { signs: [], visible_signs: [] };
    }

    override componentWillMount() {
        fetch("data/signs").then(response => {

            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error " + response.status);
            }
        }).then(json => {
            console.log(json.data);
            Promise.all(json.data.map((v: any) => fetch("data/signs/" + v.id).then((v: Response) => v.json()))).then(signs => {
                console.log(signs);
                this.setState({
                    visible_signs: [], signs: signs.map((item: any) => {
                        const sign = new Sign();
                        initializeWithJson(sign, item.data.data);
                        return { sign: sign, id: item.data.id };
                    }).filter(item => item.sign.paperSize == PaperSize.A5)
                });
            });
        });
    }

    removeSign(sign: SignWithID) {
        const index = this.state.visible_signs.indexOf(sign);
        if (index > -1) {
            this.state.visible_signs.splice(index, 1);
            this.setState(this.state);
        }
    }

    addSign(sign: SignWithID) {
        const index = this.state.visible_signs.indexOf(sign);
        if (index > -1) return;

        this.state.visible_signs.push(sign);
        this.setState(this.state);
    }

    override render() {
        return (
            <div className="all-root">
                <div className="sign-selector-all">
                    {this.state.signs.map((sign) => (
                        <div key={sign.id}>
                            <input type="checkbox" checked={this.state.visible_signs.indexOf(sign) != -1} value="{sign.name} ({sign.model})" onChange={ev => {
                                if (ev.target.checked) { this.addSign(sign); } else { this.removeSign(sign); }
                            }}></input>
                            <span>{sign.sign.name} ({sign.sign.model})</span>
                        </div>
                    ))}
                </div>
                <div id="preview">
                    {
                        groupByTwo(this.state.visible_signs).map(inner => (
                            <div className="page">
                                {inner.map(sign => (<PreviewSign key={sign.id} sign={sign.sign} id={sign.id} />))}
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

const container = document.getElementById('app-root');
const root = createRoot(container!);
root.render(<App />);

