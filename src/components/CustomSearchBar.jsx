import React from 'react';
import './CustomSearchBar.css';

const CustomSearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="custom-search-container">
      <div className="custom-search-bg-layer dark-bg"></div>
      <div className="custom-search-bg-layer dark-bg"></div>
      <div className="custom-search-bg-layer dark-bg"></div>
      <div className="custom-search-bg-layer white-bg"></div>
      <div className="custom-search-bg-layer border-bg"></div>
      <div className="custom-search-glow"></div>

      <div style={{ position: 'relative' }}>
        <input
          placeholder={placeholder}
          type="text"
          name="text"
          className="custom-search-input"
          value={value}
          onChange={onChange}
        />
        <div className="custom-search-input-mask"></div>
        <div className="custom-search-pink-mask"></div>

        <div className="custom-search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            height="24"
            fill="none"
            className="feather feather-search"
          >
            <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
            <line
              stroke="url(#searchl)"
              y2="16.65"
              y1="22"
              x2="16.65"
              x1="22"
            ></line>
            <defs>
              <linearGradient gradientTransform="rotate(50)" id="search">
                <stop stopColor="#f8e7f8" offset="0%"></stop>
                <stop stopColor="#b6a9b7" offset="50%"></stop>
              </linearGradient>
              <linearGradient id="searchl">
                <stop stopColor="#b6a9b7" offset="0%"></stop>
                <stop stopColor="#837484" offset="50%"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomSearchBar;
