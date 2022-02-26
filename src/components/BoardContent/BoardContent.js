import { useEffect, useState } from "react";
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from "lodash";

import './BoardContent.scss'
import 'font-awesome/css/font-awesome.min.css';

import Column from '../Column/Column'
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';

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
    let newColumns = [...column]
    newColumns = applyDrag(newColumns, dropResult)
    setColumn(newColumns) 
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    setBoard(newBoard)
  }

  const onCardDrop= (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      console.log(columnId)
      console.log(dropResult)
      let newColumns = [...column]

      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(c => c.id)
      setColumn(newColumns)
    }
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
            <Column column={column} onCardDrop={onCardDrop}/>
          </Draggable>
          )
        )}
      </Container>
      <div className="add-ner-column">
        <i className="fa fa-plus"/> add another column
      </div>
      
    </div>
  )
}

export default BoardContent
