import React, {useState, useEffect, useRef} from "react";
import { Container, Draggable } from 'react-smooth-dnd';
import {Dropdown, Form, Button} from 'react-bootstrap'
import { MODAL_ACTION_CONFIRM} from 'utilities/constants'
import {saveContentAfterPressEnter, selectAllInlineText} from 'utilities/contentEditable'
import {cloneDeep} from 'lodash'

import './Column.scss'
import ConfirmModal from 'components/common/ConfirmModal'
import Card from '../Card/Card'

import 'font-awesome/css/font-awesome.min.css';

import { mapOrder } from "utilities/sorts";

function Column(props) {
    const { column, onCardDrop, onUpdateColumn } = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')
    
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

    const [columnTitle, setColumnTitle] = useState('')
    const handleColumnTitleChange = (e) => setColumnTitle(e.target.value)

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardTextAreaRef = useRef(null)

    const [newCardTitle, setNewCardTitle] = useState('')
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

    useEffect(() => {
      setColumnTitle(column.title)
    },[column.title])

    useEffect(() => {
      if (newCardTextAreaRef && newCardTextAreaRef.current) {
        newCardTextAreaRef.current.focus()
        newCardTextAreaRef.current.select()
      }
    }, [openNewCardForm])

    const onConfirmModalAction = (type) => {
      if (type === MODAL_ACTION_CONFIRM) {
        const newColumn = {
          ...column,
          _destroy: true
        }
        onUpdateColumn(newColumn)
      }
      toggleShowConfirmModal()
    }

   

    const handleColumnTitleBlur = () => {
      const newColumn = {
        ...column,
        title: columnTitle
      }
      onUpdateColumn(newColumn)
    }

    const addNewCard = () => {
      if (!newCardTitle) {
        newCardTextAreaRef.current.focus()
        return
      }

      const newCardToAdd = {
        id: Math.random().toString(36).substring(2, 5),
        boardId: column.boardId,
        columnId: column.id,
        title: newCardTitle.trim(),
        cover: null
      }

      let newColumn = cloneDeep(column)
      newColumn.cards.push(newCardToAdd)
      newColumn.cardOrder.push(newCardToAdd.id)

      onUpdateColumn(newColumn)
      setNewCardTitle('')
      toggleNewCardForm()
    }

    

    return (       
        <div className="column">
          <header className="column-drag-handle">
            <div className="column-title">
              <Form.Control 
                size='sm'
                type='text'
                className= "trello-content-editable"
                value={columnTitle}
                onChange={handleColumnTitleChange}
                onBlur={handleColumnTitleBlur}
                onKeyDown={saveContentAfterPressEnter}
                onMouseDown={e => e.preventDefault()}
                spellCheck="false"
                onClick={selectAllInlineText}
              />
            </div>
            <div className="column-dropdown-actions">
              <Dropdown>
                <Dropdown.Toggle  size='sm' className= "dropdown-btn" />

                <Dropdown.Menu>
                  <Dropdown.Item>Add card ...</Dropdown.Item>
                  <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column ...</Dropdown.Item>
                  <Dropdown.Item>Move add cards in this column...</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </header>
          <div className="card-list">
            <Container
              {...column.props}
              groupName="col"
              orientation="vertical"
              onDrop={dropResult => onCardDrop(column.id, dropResult)}
              getChildPayload={index => cards[index]}
              dragClass="card-ghost"
              dropClass="card-ghost-drop"
              dropPlaceholder={{                      
                animationDuration: 150,
                showOnTop: true,
                className: 'card-drop-preview' 
              }}
              dropPlaceholderAnimationDuration={200}
            >
              {cards.map((card, index) =>(
                  <Draggable key={index}>
                    <Card card={card} />
                  </Draggable>
                ))}
            </Container>
            {openNewCardForm && 
              <div className="add-new-card-area">
                <Form.Control 
                  size='sm'
                  as="textarea"
                  rows="3"
                  placeholder='Enter a title for this card ...'
                  className= "textarea-enter-new-card"
                  ref={newCardTextAreaRef}
                  value={newCardTitle}
                  onChange={onNewCardTitleChange}
                  onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                />
              </div>
            }
          </div>
          <footer>
            {openNewCardForm && 
              <div className="add-new-card-actions">
                <Button variant="success" size="sm" onClick={addNewCard}>Add card</Button>
                <span className="cancel-icon" onClick={toggleNewCardForm}>
                  <i className="fa fa-trash icon"></i>
                </span>
              </div>
            }
            {!openNewCardForm &&
              <div className="footer-action" onClick={toggleNewCardForm}>
                <i className="fa fa-plus"/> add another card
              </div>
            }
          </footer>
          <ConfirmModal 
            show={showConfirmModal}
            onAction={onConfirmModalAction}
            title="Remove column"
            content={`Are you sure you want to remove <strong>${column.title}</strong>! <br /> All related cards will also be removed!`}
          />
        </div>
    )
}

export default Column
