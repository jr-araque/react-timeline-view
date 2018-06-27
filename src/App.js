import React, { Component } from 'react';
import Timeline from 'react-visjs-timeline'
import './App.css';


class App extends Component {

  static defaultProps = {
    options: {
      width: '100%',
      height: '300px',
      stack: false,
      showMajorLabels: true,
      showCurrentTime: true,
      zoomMin: 1000000,
      type: 'background',
      format: {
        minorLabels: {
          minute: 'h:mma',
          hour: 'ha'
        }
      }
    },
    items: [{
      start: new Date(2010, 7, 15),
      end: new Date(2010, 8, 2),  // end is optional
      content: 'Trajectory A',
    }],
    groups: [{
      id: 1,
      content: 'Group A',
    }]
  }
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">SVG Route Component</h1>
        </header>
        <div className="App-container">
          <div style={{ height: '100%', width: '60%', margin: '0 auto 0 auto', overflowX:'auto' }}>
            <Timeline options={this.props.options} items={this.props.items} groups={this.props.groups}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
