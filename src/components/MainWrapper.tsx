import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import Chatbot from "./chat-bot";




interface LayoutWrapperProps {
  children: ReactNode;
}

export default function MainWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      <Sidebar />
      {children}
      <Chatbot />
    </>
  );
}
