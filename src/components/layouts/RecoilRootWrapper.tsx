"use client";
import { RecoilRoot } from "recoil";

interface RecoilRootWrapperProps {
  children: React.ReactNode;
}

export const RecoilRootWrapper = ({ children }: RecoilRootWrapperProps) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};
export default RecoilRootWrapper;
