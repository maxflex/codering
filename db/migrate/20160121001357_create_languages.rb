class CreateLanguages < ActiveRecord::Migration
  def change
    create_table :languages do |t|
      t.string :title
      t.string :short
      t.integer :votes, default: 0
      t.string :background, default: 'black'
      t.string :color, default: 'white'
      t.integer :category, default: 0
      t.string :url
      t.timestamps null: false
    end
  end
end
