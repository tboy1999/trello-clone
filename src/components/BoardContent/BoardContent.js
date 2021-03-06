import { useEffect, useState, useRef} from "react";
import { Container, Draggable } from 'react-smooth-dnd';
import { isEmpty } from "lodash";

import './BoardContent.scss'
import 'font-awesome/css/font-awesome.min.css';

import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'

import Column from '../Column/Column'
import { mapOrder } from 'utilities/sorts';
import { applyDrag } from 'utilities/dragDrop';

import { initialData } from 'actions/initialData'

function BoardContent() {

  const [board, setBoard] = useState({})
  const [column, setColumn] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value)

  useEffect(() => {
    const boardFormDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFormDB) {
      setBoard(boardFormDB)


      setColumn(mapOrder(boardFormDB.columns, boardFormDB.columnOrder, 'id'))
    }
  }, [])

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])

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
      let newColumns = [...column]

      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(c => c.id)
      setColumn(newColumns)
    }
  }

  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...column]
    newColumns.push(newColumnToAdd)
    setColumn(newColumns) 
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    setBoard(newBoard)
    setNewColumnTitle('')
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...column]
    const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)

    if(newColumnToUpdate._destroy) {
      // remove column
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      // update column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }
    setColumn(newColumns) 
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    setBoard(newBoard)
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
            <Column 
              column={column} 
              onCardDrop={onCardDrop} 
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
          )
        )}
      </Container>

      <BootstrapContainer className= "trello-container">

        {!openNewColumnForm && 
          <Row>
            <Col className="add-new-column" onClick={toggleNewColumnForm}>
              <i className="fa fa-plus"/> add another column
            </Col>
          </Row>
        }

        {openNewColumnForm && 
          <Row>
            <Col className="enter-new-column">
              <Form.Control 
                size='sm'
                type='text'
                placeholder='Enter column title ...'
                className= "input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick= {addNewColumn}>Add column</Button>
              <span className="cancel-icon" onClick={toggleNewColumnForm}>
                <i className="fa fa-trash icon"></i>
              </span>
            </Col>
          </Row>
        }

      </BootstrapContainer>
      
    </div>
  )
}

export default BoardContent
