import SettingsCard from "@/components/SettingsCard"
import SettingsSelection from "@/components/SettingsSelection";
import SettingsTitle from "@/components/SettingsTitle";

export default function Page() {

    const torrentClientOptions = [
        {"qBittorent" : "qbittorent"}
    ]

    return (
        <div className="w-full">
            <p className="px-8 pt-6 pb-3 mb-2 text-lg">Client</p>
            <form className=" px-8 pt-6 pb-8 mb-4">

                <SettingsTitle title="Client setup"/>
                <SettingsSelection 
                    name="Client Type"
                    id="clientType"
                    options={torrentClientOptions}
                    addClass="mb-4"
                />

                <div className="mb-8 flex flex-row gap-3">
                    <SettingsCard
                        label="Client URL"
                        id="url"
                        type="text"
                        placeholder="http://192.168.1.1"
                    ></SettingsCard>
                    <SettingsCard
                        label="Port"
                        id="port"
                        type="text"
                        placeholder="8085"
                    ></SettingsCard>
                </div>

                <SettingsTitle title="Authentication"/>
                <div className="mb-8 flex flex-col gap-3">
                    <SettingsCard
                        label="Username"
                        id="username"
                        type="text"
                        addClass="mb-4"
                    ></SettingsCard>
                    <SettingsCard
                        label="Password"
                        id="password"
                        type="password"
                        addClass="mb-4"
                    ></SettingsCard>
                </div>

                <SettingsTitle title="Options"/>
                <div className="mb-8 flex flex-row gap-3">
                    <label className="flex items-center space-x-2 text-gray-900 text-sm" htmlFor="">
                        Add torrent paused?
                    </label>
                    <input
                        type="checkbox"
                        className=""
                    />
                </div>
                    <SettingsCard
                        label="Default torrent label"
                        id="label"
                        type="text"
                        placeholder="Anime"
                    ></SettingsCard>

                <div className="flex items-center justify-between mt-4">
                    <button className="ms-auto bg-sky-500 hover:bg-sky-600 text-white  py-2 px-6 rounded focus:outline-none focus:shadow-outline" type="button">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}