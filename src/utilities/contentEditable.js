export const saveContentAfterPressEnter = (e) => {
    if(e.key === 'Enter') {
      e.target.blur()
    }
}

export const selectAllInlineText = (e) => {
    e.target.focus()
    e.target.select()
}
