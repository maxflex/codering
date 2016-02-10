class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :provider
      t.string :uid
      t.string :name
      t.string :login
      t.string :avatar
      t.string :email
      t.string :website
      t.string :location

      t.timestamps null: false
    end
  end
end
