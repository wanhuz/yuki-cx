import SettingsSidebar from "@/components/SettingsSidebar";

export default function Page({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
          <main className="container flex flex-row w-80 sm:w-full mx-auto sm:items-start sm:mx-auto mb-10 gap-16">
              <SettingsSidebar></SettingsSidebar>
              <div className="bg-gray-100 rounded-md flex flex-col h-5/6 w-full mt-28 border-2">
                  { children }
              </div>
          </main>
        </>
    );
  }
