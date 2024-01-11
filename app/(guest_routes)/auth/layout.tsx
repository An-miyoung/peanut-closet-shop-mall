interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="h-full flex items-center justify-center mt-10 md:mt-20">
      {children}
    </div>
  );
}
