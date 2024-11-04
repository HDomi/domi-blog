import React from "react";
import style from "./input.module.scss";

interface CustomButtonProps {
  width?: string;
  height?: string;
  id?: string;
  type?: any;
  children?: React.ReactNode;
  onClick: (e: any) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  width,
  height,
  id,
  type = "button",
  children,
  onClick,
}) => {
  return (
    <button
      className={style["custom-button"]}
      id={id}
      type={type}
      style={{ width: width, height: height }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CustomButton;
