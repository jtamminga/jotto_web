class Api::WordsController < ActionController::API

  def words
    @words ||= Words.new
  end

  def query
    contains = params[:in]&.downcase&.chars || []
    not_contains = params[:notin]&.downcase&.chars || []

    render json: { words: words.query(contains, not_contains) }
  end

  def jotto
    render json: { words: words.jotto(params[:guesses]) }
  end

end
