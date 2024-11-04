import React from "react";
import style from "./input.module.scss";

interface CustomInputProps {
  value: string;
  placeholder: string;
  width?: string;
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  width,
  id,
  name,
  required = false,
  type = "text",
  onChange,
}) => {
  return (
    <input
      className={style["custom-input"]}
      value={value}
      id={id}
      required={required}
      name={name}
      type={type}
      style={{ width: width }}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default CustomInput;
