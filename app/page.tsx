import ChatBot from "@/components/ChatBot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | AI Assistant",
  description: "Chat With our AI",
};
export default async function Home() {
  return <ChatBot />;
}
