import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Basket = ({ basket, onClick }) => {
  return (
    <Droppable key={basket.id} droppableId={basket.id}>
      {(provided, snapshot) => (
        <div
          onClick={() => onClick(basket.id)}
          className="basket"
          style={{
            border: '1px solid black',
            // margin: '10px',
            // padding: '10px',
            cursor: 'pointer',
            backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'white',
          }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h3>{basket.keyword}</h3>

          {basket.showImages && (
            <>
              {basket.images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img
                        src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_q.jpg`}
                        alt={image.title}
                        style={{ width: '100px', marginBottom: '8px' }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </>
          )}
        </div>
      )}
    </Droppable>
  );
};

export default Basket;
