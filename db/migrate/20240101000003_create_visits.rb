class CreateVisits < ActiveRecord::Migration[8.1]
  def change
    create_table :visits do |t|
      t.references :user, null: false, foreign_key: true
      t.references :restaurant, null: false, foreign_key: true
      t.datetime :visit_date, null: false
      t.text :notes

      t.timestamps
    end

    add_index :visits, [:user_id, :restaurant_id]
  end
end
