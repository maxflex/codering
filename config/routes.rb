Rails.application.routes.draw do
  root 'index#index'

  get ':language_1-vs-:language_2' => 'battle#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/signout' => 'sessions#destroy', :as => :signout

  resources :add, only: [:index, :create]

  namespace :api, defaults: {format: 'json'} do
    namespace :v1 do
      controller :like, only: [] do
        post 'like'
      end
      resource :language
    end
  end

end
