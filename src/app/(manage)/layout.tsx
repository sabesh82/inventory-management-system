import Logout from "../Logout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-dvh flex flex-col">
      <div className="w-full flex-1">{children}</div>
      <footer className="py-3 border-t">
        <div className="w-full flex items-center justify-center">
          <Logout />
        </div>
      </footer>
    </main>
  );
}
