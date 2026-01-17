
export default function SchedulerSearchBar({
  onSearchTextChange,
  onIsSearch,
}: {
  onSearchTextChange: React.Dispatch<React.SetStateAction<string>>;
  onIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    
    return (
        <div className="container mx-auto my-8 px-0 sm:px-5 md:px-0">
            <div className="flex items-center justify-center">
                <div className="relative w-11/12 mx-auto sm:w-full">
                    <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Search..."
                        onChange={(e) => {
                            if (e.target.value === '') {
                                onIsSearch(false);
                                return;
                            }
                            onSearchTextChange(e.target.value)
                            onIsSearch(true);
                        }} />
                </div>
            </div>
        </div>
    );
  }

