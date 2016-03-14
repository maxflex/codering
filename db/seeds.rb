# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Language.delete_all
# ActiveRecord::Base.connection.reset_pk_sequence!(Language.table_name)

languages = [
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
    {
      title: 'Python',
      short: 'python',
      category: Language.categories[:language],
      url: 'https://www.python.org/',
      background: '#3470A2',
    },
    {
      title: 'NodeJS',
      short: 'nodejs',
      category: Language.categories[:language],
      url: 'https://nodejs.org/',
      background: '#026e00',
    },
    {
      title: 'Django',
      short: 'django',
      category: Language.categories[:framework],
      url: 'https://www.djangoproject.com',
      background: '#0C4B33',
    },
    {
      title: 'Rails',
      short: 'ror',
      category: Language.categories[:framework],
      url: 'http://rubyonrails.org/',
      background: '#C00',
    },
    {
      title: 'AngularJS',
      short: 'angular',
      category: Language.categories[:frontend],
      url: 'https://angularjs.org/',
      background: '#1976D2',
    },
    {
      title: 'Vue.js',
      short: 'vue',
      category: Language.categories[:frontend],
      url: 'http://vuejs.org/',
      background: '#41B883',
    },
    {
      title: 'jQuery',
      short: 'jquery',
      category: Language.categories[:frontend],
      url: 'https://jquery.com/',
      background: '#0769AD',
    },
    {
      title: 'JavaScript',
      short: 'js',
      category: Language.categories[:frontend],
      url: 'https://www.javascript.com/',
      background: '#F0DB4F',
    },
    {
      title: 'ES6',
      short: 'es6',
      category: Language.categories[:frontend],
      url: 'http://es6-features.org/',
      background: '#F26522',
    },
    {
      title: 'Meteor',
      short: 'meteor',
      category: Language.categories[:frontend],
      url: 'https://www.meteor.com/',
      background: '#1D232E',
    },
    {
      title: 'Dart',
      short: 'dart',
      category: Language.categories[:frontend],
      url: 'https://www.dartlang.org/',
      background: '#1AA9C1',
    },
    {
      title: 'ReactJS',
      short: 'react',
      category: Language.categories[:frontend],
      url: 'https://facebook.github.io/react/',
      background: '#61dafb',
    }
]

languages.each do |language|
  Language.find_or_create_by(language)
end
