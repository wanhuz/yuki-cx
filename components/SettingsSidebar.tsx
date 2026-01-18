"use client";

import Link from "next/link";

export default function SettingsSidebar( { activeIndex, setActiveIndex }: Readonly<{ activeIndex: number; setActiveIndex: (index: number) => void; }>) {
    

    const menuItems = [
        { name: "Client", href: "/settings/client" },
        // { name: "Downloads", href: "/settings/downloads" },
        { name: "Scheduler", href: "/settings/scheduler" },
        { name: "AnimeBytes", href: "/settings/animebytes"}
      ];

    return (
        <div className="bg-gray-100 rounded-md flex flex-col h-96 w-64 border-2">
            <ul>
                {menuItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                        <li >
                            <button
                                className={`w-full py-4 px-8 text-left ${activeIndex === index ? "bg-sky-500  text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                                onClick={() => setActiveIndex(index)}>
                                    {item.name}
                            </button>
                        </li>
                    </Link>
                    )
                )}
            </ul>
        </div>
    );
}