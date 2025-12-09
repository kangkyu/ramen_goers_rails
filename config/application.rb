require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

module RamenApp
  class Application < Rails::Application
    config.load_defaults 8.1
    config.autoload_lib(ignore: %w(assets tasks))
    
    config.time_zone = "UTC"
    config.i18n.default_locale = :en
    
    config.session_store :cookie_store, key: '_ramen_app_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, config.session_options
    
    config.action_mailer.default_url_options = { host: 'localhost:3000' }
  end
end
