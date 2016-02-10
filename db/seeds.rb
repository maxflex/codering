# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Language.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!(Language.table_name)

Language.create([
    {
      title: 'PHP',
      short: 'php',
      category: Language.categories[:language],
      url: 'https://php.net',
      background: '#5F81BA',
    },
    {
      title: 'Ruby',
      short: 'ruby',
      category: Language.categories[:language],
      url: 'https://www.ruby-lang.org/',
      background: '#C00',
    },
    {
      title: 'Laravel',
      short: 'laravel',
      category: Language.categories[:framework],
      url: 'https://laravel.com/',
      background: '#e74430'
    },
    {
      title: 'Yii 2',
      short: 'yii2',
      category: Language.categories[:framework],
      url: 'http://www.yiiframework.com/',
      background: '#0471B8'
    },
])
