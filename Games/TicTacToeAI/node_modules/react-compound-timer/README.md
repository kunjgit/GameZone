# react-compound-timer

Timer compound component for react and react-native to make building timers less painfull.
It incapsulates all timer logic - you should only think about rendering!

[See Working Examples](https://volkov97.github.io/react-compound-timer/)

### Forward Count

Just render a simple timer and start counting forward from 0. Use compound components to render time units.
You can see all avaliable time units in this example.

```jsx
<Timer>
    <Timer.Days /> days
    <Timer.Hours /> hours
    <Timer.Minutes /> minutes
    <Timer.Seconds /> seconds
    <Timer.Milliseconds /> milliseconds
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

## React Native
Timer compound component also works for react-native applications. All you have to do is wrap the elements in a <Text> tag from react-native.

### Countdown example with milliseconds
```jsx
import { View, Text } from 'react-native'
import Timer from 'react-compound-timer'

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Timer
        initialTime={60 * 1000}
        direction="backward"
        timeToUpdate={10}
        checkpoints={[
            {
                time: 0,
                callback: () => alert('countdown finished'),
            },
        ]}
    >
        <Text style={{ fontFamily: 'Helvetica Neue' }}>
            <Text style={{ fontSize: 32 }}>
                <Timer.Seconds />
            </Text>
            <Text style={{ fontSize: 12 }}>
                <Timer.Milliseconds />
            </Text>
        </Text>
    </Timer>
</View>
```