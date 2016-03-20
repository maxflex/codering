Rails.application.routes.draw do
  get 'trending/index'

  root 'index#index'

  get ':language_1-vs-:language_2' => 'battle#index'
  get ':category/:language' => 'battle#single'

  get '/auth/:provider/callback' => 'sessions#create'
  get '/signout' => 'sessions#destroy', :as => :signout

  get 'trending' => 'trending#index'

  CommandController.action_methods.each do |action|
    get "command/#{action}" => "command#{action}"
  end

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
