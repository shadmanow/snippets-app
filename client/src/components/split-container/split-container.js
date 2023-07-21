import React, {useEffect, useRef} from 'react';
import './split-container.scss'
import Split from 'split.js';

export default function SplitContainer({ direction, gutterSize, minSize, sizes, children }) {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      for (let gutter of container.current.querySelectorAll(`:scope > .gutter`)) {
        gutter.parentNode.removeChild(gutter);
      }

      for (let child of container.current.children) {
        child.style.width = '';
        child.style.height = '';
      }
    }

    const classes = [];

    for (let i = 0; i < children.length; i++) {
      if (direction === 'horizontal') {
        classes.push(`.split-h-${i}`);
      } else if (direction === 'vertical') {
        classes.push(`.split-v-${i}`);
      }
    }

    const options = {
      direction,
      gutterSize,
      minSize: minSize ? minSize : 0,
    };

    if (sizes) options.sizes = sizes;

    Split(classes, options);

  }, [direction]);

  return (
    <div className={`SplitContainer ${direction}`} ref={container}>
      {
        children.map((child, index) =>
          <div
            key={`split-${direction === 'horizontal' ? 'h' : 'v'}-${index}`}
            className={`split-${direction === 'horizontal' ? 'h' : 'v'}-${index}`}
          >
            {child}
          </div>)
      }
    </div>
  )
}