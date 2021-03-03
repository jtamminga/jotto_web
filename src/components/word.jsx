import React from 'react'
import { DeductionContext } from '../core/context'
import { charClasses } from '../core/utils'

// The full word
export default function Word({ value, className = '', ...props }) {
  let chars = value.split('')

  return (
    <DeductionContext.Consumer>
      { ({ found, eliminated }) =>
        <span className={`word ${className}`} {...props}>
          { chars.map((char, i) =>
            <span key={i} className={charClasses(char, found, eliminated)}>
              {char}
            </span>
          )}
        </span>
      }
    </DeductionContext.Consumer>
  )
}
