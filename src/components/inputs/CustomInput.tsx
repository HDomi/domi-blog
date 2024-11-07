import React, { useEffect, useRef, useState } from "react";
import style from "./input.module.scss";
import IconEyeBall from "@/svgIcons/IconEyeBall";
import IconEyeOpen from "@/svgIcons/IconEyeOpen";
import IconEyeClose from "@/svgIcons/IconEyeClose";
import cx from "clsx";
import { passwordEyeDirections } from "@/constants";
import SearchIcon from "@mui/icons-material/Search";
import CNJ from "@/utils/classNameJoiner";

interface CustomInputProps {
  value: string;
  placeholder: string;
  width?: string;
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
  isSearch?: boolean;
  isTransparent?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onkeypress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onIconClickEvent?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  width,
  id,
  name,
  isSearch = false,
  isTransparent = false,
  required = false,
  type = "text",
  onChange,
  onkeypress,
  onIconClickEvent,
}) => {
  const [inputType, setInputType] = useState<string>(type);
  const onClickPasswordTypeButton = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };
  const originRef = useRef<HTMLButtonElement>(null);
  const [cord, setCord] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent): void => {
      if (!originRef.current) return;

      const { x: x1, y: y1 } = e;
      const { x: x2, y: y2 } = originRef.current.getBoundingClientRect();

      let rad = Math.atan2(y2 - y1, x2 - x1);
      if (rad < 0) rad += Math.PI * 2;
      rad = (rad * 180) / Math.PI;

      for (const { angle, cordData } of passwordEyeDirections) {
        if (rad < angle) {
          setCord(cordData);
          break;
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  });
  return (
    <div
      className={cx(style["input-contents"], {
        [style.clear]: isTransparent,
      })}
      style={{ width: width }}
    >
      {isSearch && (
        <SearchIcon
          className={style["search-icon"]}
          onClick={onIconClickEvent}
        />
      )}
      <input
        className={style["custom-input"]}
        value={value}
        id={id}
        required={required}
        name={name}
        type={inputType}
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={onkeypress}
      />
      {type === "password" && (
        <div className={style["input-password"]}>
          <button
            type="button"
            className={style["fancy-eye-ball"]}
            onClick={onClickPasswordTypeButton}
            ref={originRef}
          >
            {inputType === "password" ? (
              <IconEyeClose className={style["eye-close"]} />
            ) : (
              <>
                <IconEyeOpen className={style["eye-open"]} />
                <IconEyeBall
                  className={cx(style["eye-ball"], {
                    [style.top]: cord.top,
                    [style.bottom]: cord.bottom,
                    [style.left]: cord.left,
                    [style.right]: cord.right,
                  })}
                />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
