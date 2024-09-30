import React from "react";
import style from "./input.module.scss";

interface CustomInputProps {
  value: string;
  placeholder: string;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  width,
  onChange,
}) => {
  const onChangeHandler = (e: any) => {
    onChange(e.target.value);
  };
  return (
    <input
      className={style["custom-input"]}
      type="text"
      value={value}
      style={{ width: width }}
      placeholder={placeholder}
      onChange={onChangeHandler}
    />
  );
};

export default CustomInput;
