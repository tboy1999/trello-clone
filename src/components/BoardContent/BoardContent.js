import { useEffect, useState } from "react";
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from "lodash";

import './BoardContent.scss'

import Column from '../Column/Column'
import { mapOrder } from 'utilities/sorts';

import { initialData } from 'actions/initialData'

function BoardContent() {

  const [board, setBoard] = useState({})
  const [column, setColumn] = useState([])

  useEffect(() => {
    const boardFormDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFormDB) {
      setBoard(boardFormDB)


      setColumn(mapOrder(boardFormDB.columns, boardFormDB.columnOrder, 'id'))
    }
  }, [])

  if (isEmpty(board)) {
    return <div>Board not found!</div>
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult)
  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index => column[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {column.map((column,index) => (
          <Draggable key={index}>
            <Column column={column}/>
          </Draggable>
          )
        )}
      </Container>

      
    </div>
  )
}

export default BoardContent
