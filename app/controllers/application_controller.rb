class ApplicationController < ActionController::Base

  def jotto_helper
    set_words
  end

  def word_helper
    set_words
  end

  private

  def set_words
    @words = Words.new.all.join('')
  end

end
