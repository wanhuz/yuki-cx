import Link from "next/link";
import Image from "next/image";

export default function Header({isHomepage} : {isHomepage?: boolean}) {
    return (
        <nav className={`bg-header p-3 ${isHomepage ? "absolute  top-0 w-full bg-header/80 z-50" : ""}`}>
            <div className="container mx-auto flex justify-between items-center">

                <div className={`space-x-3 sm:space-x-12 opacity-100`}>
                    <Link href="/" className="text-white hover:text-gray-400">Home</Link>
                    <Link href="/scheduler" className="text-white hover:text-gray-400">Scheduler</Link>
                    <Link href="/status" className="text-white hover:text-gray-400">Status</Link>
                    <Link href="/calendar" className="text-white hover:text-gray-400">Calendar</Link>
                    <Link href="/search" className="text-white hover:text-gray-400">Search</Link>
                </div>

                <div className="text-white text-lg font-bold">
                    <Link href="/settings/client">
                        <Image src="/gear.svg" className="fill-white" alt="Settings page" width={20} height={20}></Image>
                    </Link>
                </div>

            </div>
        </nav>
    );
  }