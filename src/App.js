import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
    const [searchText, setSearchText] = useState("");
    const [searchedText, setSearchedText] = useState("");
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const loader = useRef(null);

    useEffect(() => {
        if (searchedText) {
            fetchPhotos();
        }
    }, [searchedText, page]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 0.1,
        };
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current);
        }
    }, []);

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${searchedText}&page=${page}&per_page=10&client_id=OcdxbNRffDc0vKpHF3M5Q01bzbuzbtEXWx5G0XHkDlk`
            );
            const data = await response.json();
            setPhotos((prevPhotos) => [...prevPhotos, ...data.results]);
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    const handleSearch = () => {
        setPhotos([]);
        setPage(1);
        setSearchedText(searchText);
        setLoading(true);
    };

    return (
        <div className="App">
            <h1>Search Some Awesome Photos!</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for photos..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>
            {loading && (
                <div className="full-screen-loader">
                    <div className="loader"></div>
                </div>
            )}
            <div className="photo-list">
                {photos.map((photo, index) => (
                    <div key={photo.id} className="photo-item">
                        <img src={photo.urls.small} alt={photo.alt_description} />
                    </div>
                ))}
            </div>
            <div ref={loader} className="loading-indicator">
                {loading && (
                    <div className="full-screen-loader">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
