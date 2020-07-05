class Api::WordsController < ActionController::API
  include Analyzer

  def words
    @words ||= Words.new
  end

  def query
    contains = params[:in]&.downcase&.chars || []
    not_contains = params[:notin]&.downcase&.chars || []

    render json: { words: words.query(contains, not_contains) }
  end

  def jotto
    possibilites = words.jotto(params[:guesses])
    analytics = analyze_chars(possibilites)

    render json: {
      words: possibilites,
      analytics: analytics
    }
  end

end
