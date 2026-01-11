# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_11_054805) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "likes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "restaurant_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["restaurant_id"], name: "index_likes_on_restaurant_id"
    t.index ["user_id", "restaurant_id"], name: "index_likes_on_user_id_and_restaurant_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "restaurants", force: :cascade do |t|
    t.string "address", null: false
    t.datetime "created_at", null: false
    t.string "cuisine"
    t.string "image"
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "visits", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "notes"
    t.bigint "restaurant_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.datetime "visit_date", null: false
    t.index ["restaurant_id"], name: "index_visits_on_restaurant_id"
    t.index ["user_id", "restaurant_id"], name: "index_visits_on_user_id_and_restaurant_id"
    t.index ["user_id"], name: "index_visits_on_user_id"
  end

  add_foreign_key "likes", "restaurants"
  add_foreign_key "likes", "users"
  add_foreign_key "visits", "restaurants"
  add_foreign_key "visits", "users"
end
