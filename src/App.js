import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import SearchForm from './components/SearchForm/SearchForm';
import Photo from './components/Photo/Photo';
import Basket from './components/Basket/Basket';
import './App.css';

function App() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState('');
  const [baskets, setBaskets] = useState([]);
  const [isSortingComplete, setIsSortingComplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (isSearching || searchKeyword === '') return; // Prevent multiple searches or empty keyword searches
    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b3ce50d157bf5280e6b91ebc5f42bdd8&format=json&nojsoncallback=1&text=${searchKeyword}&per_page=5`
      );
      setSearchResults(response.data.photos.photo);
      setSearch(searchKeyword);
      if (searchKeyword === '' || response.data.photos.photo.length === 0) {
        setIsSearching(false);
        return;
      }

      if (!baskets.some((e) => e.keyword === searchKeyword)) {
        const newBasket = {
          id: `basket${baskets.length + 1}`,
          name: `Basket ${baskets.length + 1}`,
          keyword: searchKeyword,
          images: [],
          showImages: false,
        };
        setBaskets((prevBaskets) => [...prevBaskets, newBasket]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const draggedImage = searchResults[source.index];

    const destinationBasketId = destination.droppableId;

    if (destinationBasketId.includes('basket')) {
      const destinationBasket = baskets?.find(
        (basket) => basket.id === destinationBasketId
      );

      if (destinationBasket.keyword === search) {
        setBaskets((prevState) => {
          const updatedBaskets = prevState.map((basket) => {
            if (basket.id === destinationBasketId) {
              const existingImageIds = basket.images.map((image) => image.id);

              if (
                basket.images.length < 5 &&
                !existingImageIds.includes(draggedImage.id)
              ) {
                return {
                  ...basket,
                  images: [...basket.images, draggedImage],
                };
              }
            }
            return basket;
          });

          // Remove the dragged image from the search results only if it was successfully added to a basket
          if (prevState !== updatedBaskets) {
            setSearchResults((prevSearchResults) => {
              const updatedSearchResults = [...prevSearchResults];
              updatedSearchResults.splice(source.index, 1);
              return updatedSearchResults;
            });
          }

          return updatedBaskets;
        });
      }
    }
  };

  const handleBasketClick = (basketId) => {
    setBaskets((prevState) =>
      prevState.map((basket) =>
        basket.id === basketId
          ? { ...basket, showImages: !basket.showImages }
          : basket
      )
    );
  };

  useEffect(() => {
    if (baskets?.every((e) => e.images.length === 5) && baskets.length !== 0) {
      setIsSortingComplete(true);
    } else {
      setIsSortingComplete(false);
    }
  }, [baskets]);

  return (
    <div className="container">
      <div className="cont-flex">
        <SearchForm
          searchKeyword={searchKeyword}
          onSearch={setSearchKeyword}
          isSearching={isSearching}
          handleSearch={handleSearch}
        />

        {isSortingComplete ? (
          <p>You are finished!</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="only-div">
              <Droppable droppableId="search-results">
                {(provided) => (
                  <div
                    className="top-img"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ flex: 1 }}
                  >
                    {searchResults.map((photo, index) => (
                      <Photo
                        key={photo.id}
                        baskets={baskets}
                        photo={photo}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="ul-li">
                {baskets?.map((basket) => (
                  <div className="f-l">
                    <span>{basket.keyword}</span>
                    <Basket
                      key={basket.id}
                      basket={basket}
                      onClick={handleBasketClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          </DragDropContext>
        )}
        {isSortingComplete && <p>All images have been sorted!</p>}
      </div>
    </div>
  );
}

export default App;
