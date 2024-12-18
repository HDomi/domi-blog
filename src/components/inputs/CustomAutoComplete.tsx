import React from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import style from "./input.module.scss";

interface Option {
  value: string;
  label: string;
}

interface CustomAutoCompleteProps {
  selectedValue: Option | null;
  options: Option[];
  width?: string;
  height?: string;
  onChange: (
    event: React.SyntheticEvent | null,
    value: Option | null | string
  ) => void;
}

const CustomAutoComplete: React.FC<CustomAutoCompleteProps> = ({
  options,
  selectedValue,
  width,
  height,
  onChange,
  ...props
}) => {
  const onChangeHandler = (event: React.SyntheticEvent | null, value: any) => {
    onChange(event, value);
  };

  const onInputChangeHandler = (
    event: React.ChangeEvent<{}>,
    value: string
  ) => {
    onChange(null, value);
  };

  return (
    <FormControl>
      <Autocomplete
        style={{ width: width, height: height }}
        value={selectedValue}
        onChange={(e, val: any) => onChangeHandler(e, val?.value || val)}
        onInputChange={onInputChangeHandler}
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option?.label || ""
        }
        isOptionEqualToValue={(option, value) => option.value === value.value}
        freeSolo
        {...props}
        className={style["custom-select"]}
        renderInput={(params) => <TextField {...params} label="" />}
      />
    </FormControl>
  );
};

export default CustomAutoComplete;
