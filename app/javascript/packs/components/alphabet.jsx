import React from 'react'
import { DeductionContext } from './deduction-context'
import { charClasses } from '../utils'

export default function Alphabet({ found, eliminated }) {
  const alphabet = [...'abcdefghijklmnopqrstuvwxyz']

  return (
    <DeductionContext.Consumer>
      { ({ found, eliminated }) =>
        <div className="alphabet">
          { alphabet.map(char =>
            <span key={char} className={charClasses(char, found, eliminated)}>
              {char}
            </span>
          )}
        </div>
      }
    </DeductionContext.Consumer>
  )
}
