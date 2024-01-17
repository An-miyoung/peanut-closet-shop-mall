import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@components/navbar";

interface Props {
  children: React.ReactNode;
}

export default async function GuestLayout({ children }: Props) {
  const session = await getServerSession(authConfig);
  // signin 이면 root 페이지로 가도록 여기서 조절!!!!!
  if (session) return redirect("/");

  return (
    <div className="max-w-screen-xl mx-auto lg:p-0 p-4">
      <Navbar />
      {children}
    </div>
  );
}
