require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = false

  config.serve_static_assets = true
  config.static_cache_control = "public, max-age=3600"

  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.cache_store = :null_store

  config.action_mailer.perform_caching = false

  config.active_support.deprecation = :stderr

  config.log_level = :debug

  config.active_record.migration_error = :page_load
end
