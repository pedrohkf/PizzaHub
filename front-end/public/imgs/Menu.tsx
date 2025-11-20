import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}

const MenuIcon: React.FC<IconProps> = ({ width = 20, height = 20, className }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
      />
    </svg>
  );
};

export default MenuIcon;