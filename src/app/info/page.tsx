"use client";

import style from "./info.module.scss";
import MyPhoto from "../../../public/images/my_photo.jpg";
import SkillItem from "@/components/info/SkillItem";
import Image from "next/image";
import CNJ from "@/utils/classNameJoiner";
import { useEffect, useState } from "react";

const skillArr = [
  {
    title: "HTML/CSS",
    progress: 80,
  },
  {
    title: "Typescript",
    progress: 70,
  },
  {
    title: "Vue Js",
    progress: 70,
  },
  {
    title: "React Js",
    progress: 65,
  },
  {
    title: "React Native",
    progress: 50,
  },
  {
    title: "Git",
    progress: 75,
  },
  {
    title: "Communication",
    progress: 100,
  },
];

const Info = () => {
  const defaultDate = "2021-10-16";
  const [curDate, setCurDate] = useState<number | null>(null);

  useEffect(() => {
    //defaultDate 부터 현재 날짜까지의 경과일 계산
    const date1 = new Date(defaultDate);
    const date2: Date = new Date();
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);
    setCurDate(diffYears);
  }, []);
  return (
    <div className={style["info-wrap"]}>
      <div className={style["info-content"]}>
        <div className={CNJ([style["simple-info"], "flex-col"])}>
          <div className={style["photo-circle"]}>
            <Image
              src={MyPhoto.src}
              alt="my-photo"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={style["domi-info-wrap"]}>
            <div className={CNJ([style["domi-info"], style["link-wrap"]])}>
              <p>
                <a href="https://github.com/HDomi">https://github.com/HDomi</a>
                &nbsp;:GitHub
              </p>
              <p>
                <a href="https://domi-blog-pearl.vercel.app">
                  https://domi-blog-pearl.vercel.app
                </a>
                &nbsp;:Blog
              </p>
            </div>
            <div className={`${style.dvd} dvd`} />
            <div className={CNJ([style["domi-info"], style["call-wrap"]])}>
              <p>
                Email: <span>hwangjae1139@gmail.com</span>
              </p>
              <p>
                Phone: <span>010 - 3892 - 8331</span>
              </p>
            </div>
          </div>
        </div>
        <div className={style["skill-intro"]}>
          <div className={CNJ([style["skills"], "flex-col"])}>
            {skillArr.map((skill, idx) => (
              <SkillItem key={idx} skill={skill} />
            ))}
          </div>
          <div className={CNJ([style.dvd, "dvd"])} />
          <div className={style["intro-simple-wrap"]}>
            <p>
              <span className={style.tit}>Introduce.</span>
              <br />
              <br />
              {curDate}년 차 개발자로 근무하며 웹과 앱 서비스 프론트 부분을
              개발/배포/유지보수를 담당 하였습니다.
              <br />
              주로 Vue와 React를 사용하여 업무를 진행 하였으며, React native도
              사용하였습니다.
              <br />
              <br />
              개인 및 회사의 업무 평판에 기여하는 것을 목표로 하고있습니다.{" "}
              <br />
              이를 위해 빠르게 개발하고,
              <br />
              정확하게 일을 처리하고자 노력해왔습니다.
              <br />
              또한, 개발 뿐이 아닌 협업을 위한 커뮤니케이션 능력을 중요시 하여,
              의견제시 및 의견수렴에 대해 적극적으로 임했습니다.
              <br />
              <br />
              반복되는 일을 최소화 하고, 효율적인 방법을 지향합니다. <br />
              다른 개발자가 작성한 코드더라도 먼저 개발자의 의도를 파악하고 좀
              더 좋은 코드로 바꿔보는 취미가 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Info;
