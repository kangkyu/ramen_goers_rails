source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.3.10"

gem "rails", "~> 8.1.0"
gem "pg", "~> 1.5"
gem "puma", "~> 7.1"
gem "bootsnap", require: false
gem "importmap-rails"
gem "turbo-rails"
gem "stimulus-rails"
gem "jbuilder"
gem "redis", "~> 5.0"
gem "bcrypt", "~> 3.1.7"
gem "image_processing", "~> 1.2"
gem "tailwindcss-rails"
gem "aws-sdk-s3", require: false
gem "dotenv-rails", groups: [:development, :test]

# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]

  # Audits gems for known security defects (use config/bundler-audit.yml to ignore issues)
  gem "bundler-audit", require: false

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false
end

group :development do
  gem "web-console"
  gem "rack-mini-profiler"
  gem "listen", "~> 3.3"
end

group :production do
  gem "rails_12factor"
end
