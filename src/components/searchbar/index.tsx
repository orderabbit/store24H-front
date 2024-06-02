import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
            <input 
                type="text" 
                value={query} 
                onChange={handleChange} 
                placeholder="Search for places..."
                style={{ padding: '5px', fontSize: '16px' }}
            />
            <button type="submit" style={{ padding: '5px', fontSize: '16px' }}>Search</button>
        </form>
    );
};

export default SearchBar;
