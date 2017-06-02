import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import App from './App';
class CanvasComponent extends React.Component {

  
  constructor(props) {
    super(props);
  }

  updateCanvas = () => {
      console.log('update canvas')
        const ctx = this.refs.canvas.getContext('2d');
        if (this.props.img !== undefined) {
                var img = new Image;
                img.src = this.props.img;
                img.onload = function () {
                  var height = img.height;
                  var width = img.width;
                  console.log(img.width, img.height)
                  // ctx.drawImage(img, 0, 0, img.width,    img.height,     // source rectangle
                  //  0, 0, 500, 300);
                  var canvas = ctx.canvas ;
                  var hRatio = canvas.width / img.width;
                  var vRatio = canvas.height / img.height;
                  var ratio = Math.min(hRatio, vRatio);
                  var centerShift_x = (canvas.width - img.width * ratio) / 2;
                  var centerShift_y = (canvas.height - img.height * ratio) / 2;
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);  
                //  context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

                }
        }
    }
    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    

    render() {
        return (
            <canvas ref="canvas" width={500} height={300}/>
        );
    }
}

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
    console.log('mounted')
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
      //  if (sender.tab) this.setState({ url: sender.tab.url, title: sender.tab.title })
      console.log('request', request)
        switch(request.type) {
          case 'dragSelect': sendResponse('got it');
          case 'parentWindow': sendResponse('parent window')
        }
      });

    chrome.tabs.query({active: true, highlighted: true}, (tabs) => {
    this.setState({title: tabs[0].title, url: tabs[0].url})
    console.log('tab', tabs[0])
    chrome.tabs.captureVisibleTab(tabs[0].windowId, {format: "png"}, (data) => {
      console.log('png')
      this.setState({img: data})
   })


    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, (response) => {
    });
  });  

  


  

}

  render() {
    const { store } = this.props;
    return (
      <div>
        <CanvasComponent img={this.state.img}></CanvasComponent>
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