class AddStarsAndGithubToLanguages < ActiveRecord::Migration
  def change
    add_column :languages, :stars, :integer
    add_column :languages, :github, :string
  end
end
