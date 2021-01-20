import React, { PureComponent } from 'react'

class CommonInput extends PureComponent {

  constructor(props) {
    super(props)
    this.input = React.createRef()
  }
  
  onChange = (e) => {
    let common = e.target.value === '' ? '' : parseInt(e.target.value)
    this.props.onCommonChange(common)
  }

  focus() {
    this.input.current.focus()
  }
  
  render () {
    const { common, hasError, onFocus, onBlur } = this.props

    const classes = ['common']
    if (hasError) classes.push('has-error')

    return (
      <input
        ref={this.input}
        type="number"
        className={classes.join(' ')}
        value={common}
        onChange={this.onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
  }
}
  
export default CommonInput