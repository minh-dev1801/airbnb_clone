import React from "react";

type Props = {
    onSearch: (value: string) => void; // Callback để truyền giá trị tìm kiếm lên cha
};

const SearchBar = ({ onSearch }: Props) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    return (
        <div className="relative w-1/3">
            <input
                type="text"
                placeholder="Search..."
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe6b6e]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                🔍
            </span>
        </div>
    );
};

export default SearchBar;
