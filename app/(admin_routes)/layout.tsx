import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@components/AdminSideBar";

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/auth/signin");

  const isAdmin = session.user.role === "admin";
  if (!isAdmin) return redirect("/");

  return <AdminSidebar>{children}</AdminSidebar>;
}
