import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './Photo.css';

const Photo = ({ photo, index, baskets }) => {
  const isImageInBasket = baskets.some((basket) =>
    basket.images.some((img) => img.id === photo.id)
  );
  return (
    <Draggable
      className="img-top"
      key={photo.id}
      draggableId={photo.id}
      index={index}
    >
      {(provided) => (
        <div
          className="img-top"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <img
            src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`}
            alt={photo.title}
            style={{
              width: '100px',
              marginBottom: '8px',
              display: 'flex',
              opacity: isImageInBasket ? 0.5 : 1,
            }}
          />
        </div>
      )}
    </Draggable>
  );
};

export default Photo;
