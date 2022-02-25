import { useEffect, useState } from "react";
import { isEmpty } from "lodash";

import './BoardContent.scss'

import Column from '../Column/Column'
import { mapOrder } from "utilities/sorts";

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
  return (
    <div className="board-content">
      {column.map((column,index) => <Column key={index} column={column}/>)}

      
    </div>
  )
}

export default BoardContent
