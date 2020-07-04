class Words
  def initialize
    @words = File
      .readlines("app/assets/five-letter-words.txt")
      .map{ |word| word.chomp }
  end

  def query(contains = [], not_contains = [])
    @words
      .select{ |w| superset(w.chars, contains) }
      .select{ |w| (w.chars & not_contains).length == 0 }
  end

  def jotto(guesses = [])
    @words
      .select{ |w| guesses.all?{ |g| makes_sense(w, g) } }
  end

  private

  def superset(a, b)
    (a & b).length == b.length
  end

  def makes_sense(word, guess)
    (word.chars & guess[:word].chars).length == guess[:common]
  end
end
