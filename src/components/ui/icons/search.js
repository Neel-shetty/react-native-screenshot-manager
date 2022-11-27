import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    className="ionicon"
    viewBox="0 0 512 512">
    <Path
      d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64z"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit={10}
      strokeWidth={32}
    />
    <Path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={32}
      d="M338.29 338.29 448 448"
    />
  </Svg>
);

export default SvgComponent;
