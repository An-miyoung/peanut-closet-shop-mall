import Navbar from "@components/navbar";

interface Props {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <Navbar />
      {children}
    </div>
  );
}
