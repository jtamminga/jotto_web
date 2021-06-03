import { useState } from "react";
import { wordErrors } from "core/words";
import WordInput from "../word-input";

type Props = {
  word: string;
  onChange: (word: string) => void;
};

export default function WordInputWrapper({ word, onChange }: Props) {
  const [ isFocused, setIsFocused ] = useState(true);
  const errors = wordErrors(word, isFocused);

  function onBlur() {
    setIsFocused(false);
  }

  function onFocus() {
    setIsFocused(true);
  }

  return (
    <div className="guess">
      <WordInput
        word={word}
        onBlur={onBlur}
        onFocus={onFocus}
        onWordChange={onChange}
        hasError={errors.length > 0}
        isFocused={true}
      />

      <div className="guess-errors">
        { errors.map((error, i) =>
          <div key={i}>{error}</div>
        )}
      </div>
    </div>
  );
}