import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import App from './App';



export default class Root extends Component {

  state = { message: 'asda' }

  // static propTypes = {
  //   store: PropTypes.object.isRequired
  // };
  constructor(props) {
    super(props);
    this.state = {
      url: '...',
      title: '...'
    };
  }

  componentDidMount() {
  //   console.log('didmount')
  //   chrome.runtime.onMessage.addListener(
  //     (request, sender, sendResponse) => {
  //      if (sender.tab) this.setState({ url: sender.tab.url, title: sender.tab.title })
  //       console.log(sender.tab ?
  //         "from a content script:" + sender.tab.url :
  //         "from the extension");
  //       // this.setState({message: request.greeting})            
  //       if (request.greeting == "hello")
  //         sendResponse({ farewell: "goodbye" });
  //     });
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    this.setState({title: tabs[0].title, url: tabs[0].url})
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, (response) => {
      console.log('root / popup response',response);
    });
  });  

}

  render() {
    const { store } = this.props;
    return (
      <div>
        <div>{this.state.title}</div>
        <div>{this.state.url}</div>
        <textarea name="" id="" cols="60" rows="10" placeholder='remark'></textarea> <br/>
        <textarea name="" id="" cols="60" rows="10" placeholder='snippet'></textarea> <br/>
        <button>Submit</button>
      </div>

    )
  }
}
{/*<Provider store={store}>
  <App />
</Provider>*/}