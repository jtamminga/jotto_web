module Analyzer

  # find characters that are in the final word
  # and characters that are not in the final word
  def analyze_chars(words)
    all_chars = ('a'..'z').to_a
    chars_in = words.reduce(all_chars){ |chars,word| chars & word.chars }
    chars_out = all_chars - words.reduce([]){ |chars,word| chars | word.chars }
    { found: chars_in, eliminated: chars_out }
  end

end
