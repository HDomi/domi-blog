import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import style from "./input.module.scss";
interface CustomSelectProps {
  selectedValue: any;
  options: { value: string; label: string }[];
  onChange: (e: SelectChangeEvent<any>) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  selectedValue,
  onChange,
  ...props
}) => {
  const onChangeHandler = (e: SelectChangeEvent<any>) => {
    onChange(e.target.value);
  };
  return (
    <FormControl>
      <Select
        value={selectedValue}
        onChange={onChangeHandler}
        {...props}
        className={style["custom-select"]}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
