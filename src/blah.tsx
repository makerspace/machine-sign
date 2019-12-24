import { render, Component } from 'inferno';

class MyComponent extends Component {
    state: any;
    constructor(props: any) {
      super(props);
      this.state = {
          counter: 0
      };
    }
    render() {
      return (
          <div>
            <h1>Header!</h1>
            <span>Counter is at: { this.state.counter }</span>
          </div>
      );
    }
}

const message = "Hello world";

render(
    <MyComponent message={ message } />,
    document.getElementById("machine-name")
);