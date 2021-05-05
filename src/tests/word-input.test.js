import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import WordInput from '../components/word-input';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("shows word", () => {
  act(() => {
    render(
      <WordInput
        word="cabin"
        isFocused
      />
      , container);
  });

  expect(container.querySelector("input").value).toBe("cabin");

  act(() => {
    render(
      <WordInput
        word="cabin"
        isFocused={false}
      />
      , container);
  });

  // expect()
});

