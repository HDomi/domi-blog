import React, { useEffect, useRef, useState } from "react";
import style from "./input.module.scss";
import IconEyeBall from "@/svgIcons/IconEyeBall";
import IconEyeOpen from "@/svgIcons/IconEyeOpen";
import IconEyeClose from "@/svgIcons/IconEyeClose";
import cx from "clsx";
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
      if (rad < 22.5) {
        // L
        setCord({
          top: false,
          right: false,
          bottom: false,
          left: true,
        });
      } else if (rad < 67.5) {
        // TL
        setCord({
          top: true,
          right: false,
          bottom: false,
          left: true,
        });
      } else if (rad < 112.5) {
        // T
        setCord({
          top: true,
          right: false,
          bottom: false,
          left: false,
        });
      } else if (rad < 157.5) {
        // TR
        setCord({
          top: true,
          right: true,
          bottom: false,
          left: false,
        });
      } else if (rad < 202.5) {
        // R
        setCord({
          top: false,
          right: true,
          bottom: false,
          left: false,
        });
      } else if (rad < 247.5) {
        // BR
        setCord({
          top: false,
          right: true,
          bottom: true,
          left: false,
        });
      } else if (rad < 292.5) {
        // B
        setCord({
          top: false,
          right: false,
          bottom: true,
          left: false,
        });
      } else if (rad < 337.5) {
        // BL
        setCord({
          top: false,
          right: false,
          bottom: true,
          left: true,
        });
      } else if (rad < 360) {
        // L
        setCord({
          top: false,
          right: false,
          bottom: false,
          left: true,
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  });
  return (
    <div className={style["input-contents"]} style={{ width: width }}>
      <input
        className={style["custom-input"]}
        value={value}
        id={id}
        required={required}
        name={name}
        type={inputType}
        placeholder={placeholder}
        onChange={onChange}
      />
      {type === "password" && (
        <button
          type="button"
          className={style["fancy-eye-ball"]}
          onClick={onClickPasswordTypeButton}
          ref={originRef}
        >
          {inputType === "password" ? (
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
          ) : (
            <IconEyeClose className={style["eye-close"]} />
          )}
        </button>
      )}
    </div>
  );
};

export default CustomInput;
