import React from 'react'
import { DeductionContext } from '../core/deduction-context'
import { charClasses } from '../core/utils'

export default function Alphabet() {
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
