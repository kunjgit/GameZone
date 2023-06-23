### Forward Count

Just render a simple timer and start counting forward from 0. Use compound components to render time units.
You can see all avaliable time units in this example.

```jsx
<Timer>
	<Timer.Seconds />
</Timer>
```

### Forward Count with formatting

You can format all values by passing `formatValue` prop to Timer component. If you want to make value it's own formatting - just pass `formatValue` to appropriate component, like in this example.

```jsx
<Timer formatValue={(value) => `${(value < 10 ? `0${value}` : value)} units `}>
    <Timer.Hours formatValue={value => `${value} hours. `} />
    <Timer.Minutes />
    <Timer.Seconds formatValue={value => `${value} s. `} />
    <Timer.Milliseconds />
</Timer>
```

### Backward Count

The same simple timer, but counting backward.

```jsx
<Timer
    initialTime={55000}
    direction="backward"
>
    {() => (
        <React.Fragment>
            <Timer.Days /> days
            <Timer.Hours /> hours
            <Timer.Minutes /> minutes
            <Timer.Seconds /> seconds
            <Timer.Milliseconds /> milliseconds
        </React.Fragment>
    )}
</Timer>
```

### Controls

Get action functions from props and use them to control your timer.

```jsx
<Timer
    initialTime={55000}
>
    {({ start, resume, pause, stop, reset, timerState }) => (
        <React.Fragment>
            <div>
                <Timer.Days /> days
                <Timer.Hours /> hours
                <Timer.Minutes /> minutes
                <Timer.Seconds /> seconds
                <Timer.Milliseconds /> milliseconds
            </div>
            <div>{timerState}</div>
            <br />
            <div>
                <button onClick={start}>Start</button>
                <button onClick={pause}>Pause</button>
                <button onClick={resume}>Resume</button>
                <button onClick={stop}>Stop</button>
                <button onClick={reset}>Reset</button>
            </div>
        </React.Fragment>
    )}
</Timer>
```

### No autoplay

You can just render a timer, and then start it only by using action function 'start' from props.

```jsx
<Timer
    initialTime={55000}
    startImmediately={false}
>
    {({ start, resume, pause, stop, reset, timerState }) => (
        <React.Fragment>
            <div>
                <Timer.Days /> days
                <Timer.Hours /> hours
                <Timer.Minutes /> minutes
                <Timer.Seconds /> seconds
                <Timer.Milliseconds /> milliseconds
            </div>
            <div>{timerState}</div>
            <br />
            <div>
                <button onClick={start}>Start</button>
                <button onClick={pause}>Pause</button>
                <button onClick={resume}>Resume</button>
                <button onClick={stop}>Stop</button>
                <button onClick={reset}>Reset</button>
            </div>
        </React.Fragment>
    )}
</Timer>
```

### With hooks

Write your own hooks on timer actions.

```jsx
<Timer
    initialTime={55000}
    startImmediately={false}
    onStart={() => console.log('onStart hook')}
    onResume={() => console.log('onResume hook')}
    onPause={() => console.log('onPause hook')}
    onStop={() => console.log('onStop hook')}
    onReset={() => console.log('onReset hook')}
>
    {({ start, resume, pause, stop, reset, getTimerState, getTime }) => (
        <React.Fragment>
            <div>
                <Timer.Days /> days
                <Timer.Hours /> hours
                <Timer.Minutes /> minutes
                <Timer.Seconds /> seconds
                <Timer.Milliseconds /> milliseconds
            </div>
            <div>{getTimerState()} {getTime()}</div>
            <br />
            <div>
                <button onClick={start}>Start</button>
                <button onClick={pause}>Pause</button>
                <button onClick={resume}>Resume</button>
                <button onClick={stop}>Stop</button>
                <button onClick={reset}>Reset</button>
            </div>
        </React.Fragment>
    )}
</Timer>
```

### Last Unit Property

Control your last unit. For example, 1 minute 30 seconds can be 90 seconds, if you set lastUnit as 'seconds'.
It means that minutes, hours and days will not be computed.

```jsx
<Timer
    initialTime={60000 * 60 * 48 + 5000}
    lastUnit="h"
    direction="backward"
>
    {() => (
        <React.Fragment>
            <Timer.Days /> days
            <Timer.Hours /> hours
            <Timer.Minutes /> minutes
            <Timer.Seconds /> seconds
            <Timer.Milliseconds /> milliseconds
        </React.Fragment>
    )}
</Timer>
```

### With checkpoints

If you need to call some functions on certain time - provide checkpoints property. It is an array of objects.
Each object contains time and callback, that will be fired, when timer intersects checkpoint's time.

```jsx
<Timer
    initialTime={60000 * 60 * 48 + 5000}
    direction="backward"
    checkpoints={[
        {
            time: 60000 * 60 * 48,
            callback: () => console.log('Checkpoint A'),
        },
        {
            time: 60000 * 60 * 48 - 5000,
            callback: () => console.log('Checkpoint B'),
        }
    ]}
>
    <Timer.Days /> days
    <Timer.Hours /> hours
    <Timer.Minutes /> minutes
    <Timer.Seconds /> seconds
    <Timer.Milliseconds /> milliseconds
</Timer>
```

### Change props dynamically and use HOC

```jsx
const withTimer = timerProps => WrappedComponent => wrappedComponentProps => (
  <Timer {...timerProps}>
    {timerRenderProps =>
      <WrappedComponent {...wrappedComponentProps} timer={timerRenderProps} />}
  </Timer>
);

class ClockUpDown extends React.Component {
    componentDidMount() {
        const { setCheckpoints, setDirection, setTime, start } = this.props.timer;

        setCheckpoints([
            {
                time: 1000,
                callback: () => setDirection('forward'),
            },
            {
                time: 5000,
                callback: () => setDirection('backward'),
            },
        ]);

        setTimeout(() => {
            setTime(10000);
            start();
        }, 3000);
    }

    render() {
        return (
            <Timer.Seconds />
        );
    }
}

const TimerHOC = withTimer({
    direction: 'backward',
    initialTime: 5000,
    startImmediately: false,
})(ClockUpDown);

<TimerHOC />
```

### Use Timer.Consumer

```jsx
const withTimer = timerProps => WrappedComponent => wrappedComponentProps => (
  <Timer {...timerProps}>
    {timerRenderProps =>
      <WrappedComponent {...wrappedComponentProps} timer={timerRenderProps} />}
  </Timer>
);

class TimerWrapper extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div>
                <div>Simple text</div>
                <Timer.Consumer>
                    {() => this.props.timer.getTime()}
                </Timer.Consumer>
            </div>
        );
    }
}

const TimerHOC = withTimer({
    initialTime: 5000,
})(TimerWrapper);

<TimerHOC />
```
