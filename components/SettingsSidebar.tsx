"use client";

import Link from "next/link";
import { useState } from "react";

export default function SettingsSidebar() {
    const [activeIndex, setActiveIndex] = useState(0);

    const menuItems = [
        { name: "General", href: "/settings/general" },
        { name: "Client", href: "/settings/client" }
      ];

    return (
        <div className="bg-gray-100 rounded-md flex flex-col h-96 w-64 mt-28 border-2">
            <ul>
                {menuItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                        <li >
                            <button
                            className={`w-full p-4 ${activeIndex === index ? "bg-sky-500  text-white" : "bg-gray-100 hover:bg-gray-200"}`}
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