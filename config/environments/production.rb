require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true

  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  config.cache_store = :memory_store, { size: 64.megabytes }

  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?

  config.assets.compile = false
  config.assets.digest = true

  config.log_level = :info

  config.log_to_stdout = true

  config.logger = ActiveSupport::TaggedLogging.new(Logger.new(STDOUT))
end
