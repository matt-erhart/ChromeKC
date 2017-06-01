import React, { Component } from 'react';
import { render } from 'react-dom';
import Rx from 'rxjs';


class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.state = { dragSelect: {x: null, y: null, width: null, height: null},
    display: 'none' }
  }


  componentDidMount() {
    const mouseDown$ = Rx.Observable.fromEvent(document, 'mousedown')
    const mouseUp$ = Rx.Observable.fromEvent(document,   'mouseup')
    const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove')
    let body = document.getElementsByTagName("body")[0];

    const dragSelect$ = mouseDown$.mergeMap(downData => {
      body.style.userSelect = 'none'
      this.setState({display: 'block', dragSelect: {x: null, y: null, width: null, height: null}})
      return mouseMove$.takeUntil(mouseUp$)
        .do(moveData => {
          
          const {offsetX, offsetY, clientX, clientY} = downData;
                    const w = (moveData.clientX-clientX); //dragging right positive
                    const h = ( moveData.clientY-clientY); //dragging down positive
                    const x = w < 0? clientX + w: clientX; 
                    const y = h < 0? clientY + h: clientY;
                    const width = Math.abs(w);
                    const height = Math.abs(h);
                    const dragSelect = {x, y, width, height}
                    this.setState({dragSelect})
                    console.log(dragSelect)
        }).finally(moveData => {body.style.userSelect='auto'; this.setState({display: 'none'}); console.log('finally',moveData)})
    }).subscribe()
  }

  render() {
    const {x,y,width,height} = this.state.dragSelect;
    return (
          // <div style={{position:'fixed', color: 'grey', left: x, top: y, width: width, height: height}}></div>
          // <div style={{position:'absolute', outlineColor: 'blue',backgroundColor:'black', left: x, top: y, width: width, height: height}}>&nbsp;</div>
          <svg style={{position: 'fixed', left: 0, top:0, z: 1, display: this.state.display }} x={0} y={0} width={window.innerWidth} height={window.innerHeight} ><rect stroke={'black'} x={x} y={y} width={width} height={height} fill={'none'}></rect></svg>
    );
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('inject',request)
    if (request.greeting == "hello")
      sendResponse('he1y');
  });

window.addEventListener('load', () => {
  const injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react-example';
  injectDOM.style.textAlign = 'center';
  document.body.appendChild(injectDOM);
  render(<InjectApp />, injectDOM);
});

console.log('hey12')
