"use client";

import { ISkillItem } from "@/types";
import style from "./infoCompo.module.scss";

const SkillItem = ({ skill }: { skill: ISkillItem }) => {
  return (
    <div className={style["progress-wrap"]}>
      <div className={style.title}>{skill.title}</div>
      <div className={style.progress}>
        <div
          className={style["progress-bar"]}
          style={{ width: `${skill.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillItem;
