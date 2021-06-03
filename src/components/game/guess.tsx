import React, { PureComponent } from 'react';
import { hasError } from '../../core/utils';
import WordInput from '../word-input';
import { OnlineGuess } from '../../core/types';

type Props = {
  submittable: boolean;
  onSubmit: () => void;
  onChange: (o: { word: string }) => void;
} & OnlineGuess

class Guess extends PureComponent<Props, {}> {
  state = {
    isFocused: true
  }

  onChange = (word: string) => {
    this.props.onChange({ word });
  }

  onFocus = () => {
    this.setState({ isFocused: true });
  }

  onBlur = () => {
    this.setState({ isFocused: false });
  }

  errors(): string[] {
    const { word, wordShort, doubleLetter, invalidChar } = this.props;
    const { isFocused } = this.state;
    const errors = [];

    if (word === '')
      return [];

    if (invalidChar) {
      errors.push('Word can only contain letters');
      return errors;
    }

    if (doubleLetter) {
      errors.push('Word cannot have a double letter');
      return errors;
    }

    if (wordShort && !isFocused) {
      errors.push('Word must be a 5 letter word');
    }

    return errors;
  }

  render() {
    const { word, common, submitted, onSubmit, submittable } = this.props;
    const { isFocused } = this.state;

    const errors = this.errors();
    const canSubmit = submittable && !hasError(this.props);

    return (
      <div className="guess">
        <div className="guess-input">
          <WordInput
            word={word}
            onWordChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            isFocused={!submitted}
            hasError={errors.length > 0}
          />

          { submitted ? 
            <div className="guess-number">
              {common}
            </div>
            :
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
            >Submit</button>
          }
        </div>

        <div className="guess-errors">
          { errors.map((error, i) =>
            <div key={i}>{error}</div>
          )}
        </div>
      </div>
    )
  }
}

export default Guess;