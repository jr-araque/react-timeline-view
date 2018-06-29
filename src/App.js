import React, { Component } from 'react';
import { routes } from './routes';
import moment from 'moment';
import './App.css';

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const TIMELINE_WIDTH = 2000;
const UPDATE_INTERVAL = 1 * SECONDS;

const currentPeriod = {
  start: moment().startOf('day'),
  end: moment().endOf('day'),
};

/**
 * SVG
 */
class SvgGridWrapper extends Component {
  state = {
    intervalPosition: [],
  };

  updateGrid() {
    const {width} = this.props;
    const {start, end} = currentPeriod;

    const timeDiff = end.diff(start, this.props.interval);

    const relativePeriodToPixels = width/timeDiff;

    console.log(relativePeriodToPixels);

    let grid = [];
    for (let i = 0; i <= width; i = i + relativePeriodToPixels) {
      grid.push(i);
    }
    this.setState({grid});
  }

  componentDidMount() {
    this.updateGrid();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.width !== this.props.width) {
      this.updateGrid();
    }
  }

  render() {
    const y1 = 0, y2 = this.props.height * 0.05;
    return (
      <g>
        {
          this.state.grid &&
          this.state.grid.map(
            val => {
             return (
              <React.Fragment key={val}>
                <line
                  x1={val}
                  y1={0}
                  x2={val}
                  y2={this.props.height * 0.05}
                  strokeWidth="1"
                  stroke={this.props.lineColor}
                />
                { this.props.interval === 'hours' &&
                  <line
                    x1={val}
                    y1={0}
                    x2={val}
                    y2={this.props.height}
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    stroke={this.props.lineColor}
                  />
                }
              </React.Fragment>
             )
            })
        }
      </g>
    );
  }
}

class SvgNowLineIndicator extends Component {
  interval = null;
  state = {
    position: 150,
  };

  calculateNowLinePosition = () => {
    const {width, height} = this.props;
    const {start, end} = currentPeriod;

    const timeDiff = end.diff(start, 'seconds');
    const currentDiff = moment().diff(start, 'seconds');

    const relativePeriodToPixels = timeDiff/width;
    const currentPeriodToPixels = currentDiff/relativePeriodToPixels;

    this.setState({position: currentPeriodToPixels});
  };

  componentDidMount() {
    if (this.props.width !== undefined) {
      this.interval = setInterval(
        this.calculateNowLinePosition,
        UPDATE_INTERVAL);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const y1 = 0, y2 = this.props.height;
    const x1 = this.state.position;
    const x2 = x1;
    return (<line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" stroke="rgb(255,0,0)">Something</line>);
  }
}

const SvgRouteItemRow = ({route, index, children}) => {
  return (
    <rect x="0" y={index * 100} width="100%" height="100" stroke="darkgray" >
      {children}
    </rect>
  )
};

const SvgTimeLineContainer = ({children, width}) => {
  const height = children.length * 100;
  return (
    <svg width={width} height={height}>
      <g>
      {children}
      </g>
      <g>
        <SvgGridWrapper lineColor={'rgb(0,200,100)'} interval={'hours'} width={width} height={height*2}/>
        <SvgGridWrapper lineColor={'rgb(100,200,0)'} interval={'minutes'} width={width} height={height}/>
        <SvgNowLineIndicator  width={width} height={height}/>
      </g>
    </svg>
  )
};

/**
 * Indicator
 */
const TimeLineIndicator = ({currentZoom, handleZoom}) => (
  <div className="timeline-indicator" style={{color: 'white'}}>
    Time Line Indicator: <br/>
    Current Zoom: {currentZoom} <br/>
    <button onClick={() => handleZoom(+100)}>+</button><button onClick={() => handleZoom(-100)}>-</button>
  </div>
);

/**
 * TimeLine
 */
const RouteTimeLine = ({routes, width}) => (
  <div className="route-timeline-wrapper">
    <SvgTimeLineContainer width={width}>
      {routes.map((route, index) => <SvgRouteItemRow key={route.route_id} route={route} index={index} />)}
    </SvgTimeLineContainer>
  </div>
);

/**
 * Driver List
 */
const DriverItem = ({route}) => (
  <div className="route-item">
    Route {route.route_id}
    <br />
    Delivery man: {route.deliveryman_id}
    </div>
);

const DriverList = ({routes}) => (
  <div className="driver-list-wrapper">
    { routes.map((route) => <DriverItem key={route.route_id} route={route} />)}
  </div>
);

/**
 * Container
 */
class TimeLineContainer extends Component {
  state = {
    width: 2000
  };

  handleZoom = (change) => {
    this.setState(prev => { return  {width: prev.width + change}});
  };

  render() {
    return (
      <div className="timeline-container">
        <TimeLineIndicator currentZoom={this.state.width} handleZoom={this.handleZoom} />
        <div className="timeline-list-wrapper">
          <DriverList routes={routes} />
          <RouteTimeLine routes={routes} width={this.state.width} />
        </div>
      </div>
    );
  }
}

class App extends Component {
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
          <TimeLineContainer />
        </div>
      </div>
    );
  }
}

export default App;
