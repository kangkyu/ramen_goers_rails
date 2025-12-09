# Ramen App - Rails Edition

A full-stack Ruby on Rails application for tracking ramen restaurant visits with Hotwire (Turbo + Stimulus).

## Tech Stack

- **Framework**: Ruby on Rails 8.1
- **Database**: PostgreSQL
- **Frontend**: ERB + Hotwire (Turbo + Stimulus)
- **Authentication**: bcrypt + sessions (no Devise)
- **Styling**: Custom CSS with responsive design
- **Deployment**: Heroku

## Features

- User authentication (signup/login)
- Restaurant catalog browsing
- Check-in tracking with notes and dates
- User visit history and statistics
- Restaurant rankings by visit count
- Responsive design for mobile and desktop

## Setup Instructions

### Prerequisites

- Ruby 3.3.0+
- PostgreSQL 12+
- Bundler

### Local Development

1. **Clone and setup**
```bash
bundle install
rails db:create
rails db:migrate
rails db:seed
```

2. **Start the server**
```bash
./bin/dev
```

Visit `http://localhost:3000`

3. **Test accounts** (after seeding)
- Create an account using the sign up page

## Project Structure

```
app/
├── controllers/         # Request handlers
├── models/              # Database models
├── views/               # ERB templates
├── javascript/
│   └── controllers/     # Stimulus controllers
└── assets/stylesheets/  # CSS

config/
├── database.yml         # Database configuration
├── routes.rb            # URL routes
└── environments/        # Environment configs

db/
├── migrate/             # Database migrations
└── seeds.rb             # Initial data

```

## Models

### User
- Email, name, password (bcrypt)
- Has many visits
- Uniqueness validation on email

### Restaurant
- Name, address, cuisine, image URL
- Has many visits
- Ranking by total visits

### Visit
- User & Restaurant associations
- Visit date, optional notes
- Timestamps

## Authentication Flow

1. User signs up with email/password
2. Password hashed with bcrypt
3. Session stored in encrypted cookie
4. Current user available in all controllers

## Deployment to Heroku

1. **Create Heroku app**
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
```

2. **Push to Heroku**
```bash
git push heroku main
```

3. **Run migrations**
```bash
heroku run rails db:migrate
heroku run rails db:seed
```

4. **Set environment variables** (if needed)
```bash
heroku config:set RAILS_MASTER_KEY=your-key
```

## Turbo & Stimulus Integration

- **Turbo**: Handles navigation and form submissions without full page reloads
- **Stimulus**: Powers interactive UI components like check-in forms

## API Endpoints

All routes are server-rendered with Turbo integration:

- `GET /` - Home page
- `GET /restaurants` - Restaurant list
- `GET /restaurants/:id` - Restaurant details
- `POST /restaurants/:id/visits` - Create visit
- `GET /my_visits` - User's visits
- `GET /rankings` - Leaderboard
- `GET/POST /login` - Login
- `GET/POST /sign_up` - Registration
- `POST/DELETE /logout` - Logout

## Development Notes

- Use `rails generate` to create scaffolds
- Database migrations: `rails db:migrate`
- Run tests: `rails test`
- Console: `rails console`

## License

MIT
