const React = require('react'); // Required for jsx transform.

class Client extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loaded: false };

    this.ws_ = null;
  }

  componentDidMount() {
    this.ws_ = new WebSocket(`ws://${window.location.host}/`);
    this.ws_.onmessage = message => {
      let data;
      try {
        data = JSON.parse(message.data);
      } catch (e) {
        console.error(e);
        return;
      }
      const topic = data['topic'];
      switch (topic) {
        case 'welcome':
          this.setState(() => ({ loaded: true }));
          break;
        default:
          console.log(`Unrecognized topic: ${topic}`);
      }
    };
  }

  componentWillUnmount() {
    this.ws_.close();
  }

  render() {
    return (
      <div>
        {!this.state.loaded && (
          <div id="connecting">Connecting to server...</div>
        )}
        {this.state.loaded && <div id="done">Done!</div>}
      </div>
    );
  }
}

module.exports = Client;
