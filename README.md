# React Adaptive Cursor

Simulate iOS's iPad cursor on web elements using React.

## Installation

To install the package, run:

```sh
npm install @demonxdrag/react-adaptive-cursor
```

## Usage

### AdaptiveCursorProvider
Wrap your application with the AdaptiveCursorProvider.

```tsx
import React from 'react'
import { AdaptiveCursorProvider } from '@demonxdrag/react-adaptive-cursor'

const App = () => {
  return (
    <AdaptiveCursorProvider>
      <YourComponent />
    </AdaptiveCursorProvider>
  )
}

export default App
```

### AdaptiveCursorTarget

Use the AdaptiveCursorTarget component to define areas where the adaptive cursor should be active.

```tsx
import React from 'react'
import { AdaptiveCursorTarget } from '@demonxdrag/react-adaptive-cursor'

const YourComponent = () => {
  return (
    <AdaptiveCursorTarget>
      <div>Your content here</div>
    </AdaptiveCursorTarget>
  )
}

export default YourComponent
```

### Configuration

You can customize the cursor by passing a configuration object to the AdaptiveCursorProvider.

```tsx
import React from 'react'
import { AdaptiveCursorProvider } from '@demonxdrag/react-adaptive-cursor'

const customConfig = {
  size: 30,
  transitionSpeed: 0.3,
  parallaxIndex: 20,
  mainCursorColor: 'rgba(0, 0, 0, 0.3)',
  mainCursorLiftColor: 'rgba(0, 0, 0, 0)',
  shadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
}

const App = () => {
  return (
    <AdaptiveCursorProvider config={customConfig}>
      <YourComponent />
    </AdaptiveCursorProvider>
  )
}

export default App
```

#### Options

- `size`: `Number` - Diameter/Size of the cursor.
- `transitionSpeed`: `Number` - Transition speed between the cursor shape and the element shape.
- `parallaxIndex`: `Number` - How much you want to shift elements when hovering the cursor.
- `mainCursorHoverColor`: `String` - Color of the cursor when hovering over elements.
- `mainCursorLiftColor`: `String` - Color of the cursor when idling.
- `shadow`: `String` - Box shadow of the cursor.