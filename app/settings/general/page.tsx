import SettingsCard from "@/components/SettingsCard";

export default function Page() {
    return (
        <div className="w-full">
            <p className="px-8 pt-6 pb-3 mb-2 text-lg">General</p>
            <form className=" px-8 pt-6 pb-8 mb-4">
                <SettingsCard
                    label="AnimeBytes API Key"
                    id="anidbAPIKey"
                    type="text"
                    addClass="mb-8"
                />
                <SettingsCard
                    label="TVDB API Key"
                    id="tvdbAPIKey"
                    type="text"
                    addClass="mb-8"
                />
                <div className="flex items-center justify-between mt-4">
                    <button className="ms-auto bg-sky-500 hover:bg-sky-600 text-white  py-2 px-6 rounded focus:outline-none focus:shadow-outline" type="button">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}