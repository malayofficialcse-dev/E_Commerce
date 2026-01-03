/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
