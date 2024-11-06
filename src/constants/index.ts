export const menuItems = [
  {
    name: "Info",
    link: "/info",
  },
  {
    name: "Blog",
    link: "/blog",
  },
];
export const passwordEyeDirections = [
  {
    angle: 22.5,
    cordData: { top: false, right: false, bottom: false, left: true },
  }, // L
  {
    angle: 67.5,
    cordData: { top: true, right: false, bottom: false, left: true },
  }, // TL
  {
    angle: 112.5,
    cordData: { top: true, right: false, bottom: false, left: false },
  }, // T
  {
    angle: 157.5,
    cordData: { top: true, right: true, bottom: false, left: false },
  }, // TR
  {
    angle: 202.5,
    cordData: { top: false, right: true, bottom: false, left: false },
  }, // R
  {
    angle: 247.5,
    cordData: { top: false, right: true, bottom: true, left: false },
  }, // BR
  {
    angle: 292.5,
    cordData: { top: false, right: false, bottom: true, left: false },
  }, // B
  {
    angle: 337.5,
    cordData: { top: false, right: false, bottom: true, left: true },
  }, // BL
  {
    angle: 360,
    cordData: { top: false, right: false, bottom: false, left: true },
  }, // L
];
export const mainTextArr = [
  {
    text: "제 블로그에 오신것을 환영합니다.",
    isUser: false,
  },
  {
    text: "제 작업물은 아래 링크에서 확인하실 수 있습니다.",
    isUser: false,
  },
  {
    text: "GitHub 바로가기!",
    isUser: false,
    link: "https://github.com/HDomi",
  },
  {
    text: "NPM 바로가기!",
    isUser: false,
    link: "https://www.npmjs.com/package/@h_domi/useful_tools",
  },
];
