import * as React from "react";

const SvgIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='#e3e3e3'
    viewBox='0 -960 960 960'
  >
    <path d='M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160M360-600v-80h240v80zm0 120v-80h240v80zm320-120q-17 0-28.5-11.5T640-640t11.5-28.5T680-680t28.5 11.5T720-640t-11.5 28.5T680-600m0 120q-17 0-28.5-11.5T640-520t11.5-28.5T680-560t28.5 11.5T720-520t-11.5 28.5T680-480M240-160h360v-80H200v40q0 17 11.5 28.5T240-160m-40 0v-80z'></path>
  </svg>
);

export default React.memo(SvgIcon);
