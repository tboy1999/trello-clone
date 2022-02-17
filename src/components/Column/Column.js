import React from "react";

import './Column.scss'

import Task from '../Task/Task'

function Column() {
    return (       
        <div className="column">
          <header> brainstorm </header>
          <ul className="task-list">
            <Task />
            <li className="task-item">todo list level up</li>
            <li className="task-item">todo list level up</li>
            <li className="task-item">todo list level up</li>
            <li className="task-item">todo list level up</li>
          </ul>
          <footer>
            add another card
          </footer>
        </div>
    )
}

export default Column