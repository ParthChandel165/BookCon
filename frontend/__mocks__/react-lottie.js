import React from 'react';

const Lottie = ({ options, width, height, ...props }) => (
  <div 
    data-testid="lottie-animation" 
    style={{ width, height }}
    {...props}
  >
    Lottie Animation
  </div>
);

export default Lottie;