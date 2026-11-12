/**
 * 앱 목록 데이터. 화면 로직 없이 내용만 둔다.
 * href 가 비어 있으면 화면에 "링크 준비 중"으로 표시된다.
 *
 * 묶음 앱 추가하는 법: SUITES 에 항목 하나를 넣는다.
 * 아이콘이 있으면 `public/apps/<id>.png` (256px 권장) 에 두고 icon.src 에 경로를 적는다.
 * 아이콘이 없으면 src 를 비워둔다. 이름 첫 글자로 만든 자리 표시 아이콘이 대신 나온다.
 */

export type AppKind = "앱" | "도구" | "게임";

/** 앱 아이콘. 없으면 tone 색으로 자리 표시 아이콘을 만든다. */
export type AppIcon = {
  /** `/apps/<id>.png` 같은 public 경로. */
  src?: string;
  /**
   * 아이콘 안쪽 여백 보정 배율. macOS 아이콘처럼 투명 여백이 있으면 1 보다 크게 줘서
   * 꽉 찬 아이콘들과 크기를 맞춘다.
   */
  scale?: number;
  /** 자리 표시 아이콘 바탕색 (src 가 없을 때). */
  tone: string;
};

/** 묶음 앱: 하나의 컨셉 아래 함께 쓰도록 만든 도구 모음. */
export type Suite = {
  id: string;
  name: string;
  /** 컨셉 한 줄. */
  concept: string;
  description: string;
  tools: { name: string; summary: string }[];
  /** 저장소 등 연결할 주소. 비워두면 링크 준비 중. */
  href?: string;
  icon: AppIcon;
  /** 패널 포인트 색 (배경 팔레트 계열). */
  tint: string;
};

/** 개별 앱: 서로 연결되지 않은, 따로 만든 앱·게임. */
export type Solo = {
  id: string;
  name: string;
  kind: AppKind;
  summary: string;
  /** 저장소·스토어 주소. 게임은 나중에 스팀 링크. 비워두면 링크 준비 중. */
  href?: string;
  /** 표지 그라디언트 두 색 (어두운 쪽 → 밝은 쪽). */
  cover: [string, string];
};

export const SUITES: Suite[] = [
  {
    id: "vibrato",
    name: "Vibrato",
    concept: "Claude Code 와 Codex 를 한 화면에서",
    description:
      "IDE 없이 로컬 CLI 그대로 바이브코딩하는 macOS 앱. 에이전트 대화부터 브라우저 확인, 개발 도구, 원격 접속까지 한 창에서 이어간다.",
    tools: [
      { name: "에이전트", summary: "Claude Code 와 Codex 를 같은 채팅·승인 화면으로" },
      { name: "앱 안 브라우저", summary: "에이전트가 직접 열고 클릭하고 실측하는 Safari 창" },
      { name: "도구 모드", summary: "JSON, JWT, 정규식, Diff, PDF 편집기 등 개발 유틸 30여 종" },
      { name: "원격", summary: "밖에서는 Windows·Mac 에서 같은 세션에 붙어 이어서" },
    ],
    icon: { src: "/apps/vibrato.png", scale: 1.18, tone: "#16213a" },
    tint: "#6fd6c8",
  },
  {
    id: "legato",
    name: "Legato",
    concept: "Mac 과 Windows 사이를 끊김 없이",
    description:
      "IP 와 포트 하나로 바로 붙는 Mac·Windows 원격 데스크톱. 중계 서버 없이 두 컴퓨터를 직접 잇는다.",
    tools: [
      { name: "화면 공유", summary: "Mac 화면을 Windows 에서 보고 조작" },
      { name: "직접 연결", summary: "중계 서버 없이 IP 와 포트로 접속" },
      { name: "빠른 전송", summary: "QUIC 위에서 화면과 입력을 주고받는다" },
    ],
    icon: { src: "/apps/legato.png", scale: 1.18, tone: "#16213a" },
    tint: "#8aa8ff",
  },
];

// 이름·설명은 임시값이다. 실제 프로젝트로 바꿔 넣는다.
export const SOLOS: Solo[] = [
  {
    id: "aria",
    name: "Aria",
    kind: "게임",
    summary: "혼자 걷는 밤의 도시를 탐험하는 짧은 내러티브 게임.",
    cover: ["#16202a", "#3f6b79"],
  },
  {
    id: "coda",
    name: "Coda",
    kind: "앱",
    summary: "하루를 마무리하며 세 줄만 남기는 기록 앱.",
    cover: ["#211a24", "#6b4560"],
  },
  {
    id: "fermata",
    name: "Fermata",
    kind: "도구",
    summary: "작업 중 잠깐 멈춰 쉬어야 할 때를 알려주는 타이머.",
    cover: ["#181c26", "#4d5c78"],
  },
  {
    id: "tremolo",
    name: "Tremolo",
    kind: "게임",
    summary: "박자에 맞춰 흔들리는 블록을 쌓는 리듬 퍼즐.",
    cover: ["#13211f", "#3f7468"],
  },
  {
    id: "cadenza",
    name: "Cadenza",
    kind: "앱",
    summary: "사진 한 장에서 색 팔레트를 뽑아 저장하는 앱.",
    cover: ["#241d19", "#7a6450"],
  },
  {
    id: "rubato",
    name: "Rubato",
    kind: "도구",
    summary: "마크다운 메모를 깔끔한 슬라이드로 바꿔주는 변환기.",
    cover: ["#1c1a26", "#5e5675"],
  },
];
