Rails.application.routes.draw do
  root to: 'application#word_helper'

  get 'jotto', to: 'application#jotto_helper'

  namespace :api do
    get 'words', to: 'words#query'
    post 'jotto', to: 'words#jotto'
  end

end
