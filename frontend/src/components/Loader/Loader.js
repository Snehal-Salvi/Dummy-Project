import React from "react";

// Spinner component to display loading on page.
 
export default function Loader() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" height="50">
      <circle
        fill="#FF156D"
        stroke="#FF156D"
        strokeWidth="10"  
        r="10" 
        cx="40"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4"
        ></animate>
      </circle>
      <circle
        fill="#FF156D"
        stroke="#FF156D"
        strokeWidth="10" 
        r="10"  
        cx="100"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2"
        ></animate>
      </circle>
      <circle
        fill="#FF156D"
        stroke="#FF156D"
        strokeWidth="10"  
        r="10"  
        cx="160"
        cy="100"
      >
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0"
        ></animate>
      </circle>
    </svg>
  );
}
