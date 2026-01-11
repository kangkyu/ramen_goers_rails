Rails.application.routes.draw do
  get "home", to: "pages#home"

  resources :restaurants, only: [:index, :show] do
    resources :visits, only: [:create]
    resource :like, only: [:create, :destroy]
  end

  resources :visits, only: [:index, :destroy]

  get "rankings", to: "rankings#index"

  get "sign_up", to: "sessions#new"
  post "sign_up", to: "sessions#create"

  get "login", to: "sessions#login"
  post "login", to: "sessions#authenticate"

  post "logout", to: "sessions#destroy"
  delete "logout", to: "sessions#destroy"

  get "my_visits", to: "visits#index"

  root "pages#home"
end
