"use client";

import Link from "next/link";

export default function SettingsSidebar( { activeIndex, setActiveIndex }: Readonly<{ activeIndex: number; setActiveIndex: (index: number) => void; }>) {
    

    const menuItems = [
        { name: "Client", href: "/settings/client" },
        // { name: "Downloads", href: "/settings/downloads" },
        { name: "Scheduler", href: "/settings/scheduler" },
        { name: "AnimeBytes", href: "/settings/animebytes"},
        { name: "Logs", href: "/settings/logs"},
      ];

    return (
        <div className="bg-gray-100 rounded-md flex flex-row flex-wrap md:flex-col h-18 w-84 md:h-96 md:w-64 border-2 mx-auto md:mx-0">
            {menuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                    <button
                        className={`w-full py-2 px-4 md:py-4 md:px-8 text-left ${activeIndex === index ? "bg-sky-500  text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => setActiveIndex(index)}>
                            {item.name}
                    </button>
                </Link>
                )
            )}
        </div>
    );
}