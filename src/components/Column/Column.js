import React from "react";

import './Column.scss'

import Card from '../Card/Card'

import { mapOrder } from "utilities/sorts";

function Column(props) {
    const { column } = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')
    

    return (       
        <div className="column">
          <header> {column.title} </header>
          <ul className="card-list">
            {cards.map((card, index) => <Card key={index} card={card} />)}
            {/* <li className="card-item">todo list level up</li>
            <li className="card-item">todo list level up</li>
            <li className="card-item">todo list level up</li>
            <li className="card-item">todo list level up</li> */}
          </ul>
          <footer>
            add another card
          </footer>
        </div>
    )
}

export default Column