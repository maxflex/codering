class Language < ActiveRecord::Base
  has_many :likes
  enum category: [:language, :framework, :frontend]

  def self.trending
    languages = {}
    categories.each do |category, index|
      languages[category] = joins(:likes)
                              .group('languages.id')
                              .order('count(languages.id) desc')
                              .where(category: index)
                              .first
    end
    languages
  end

  # Получить цвет в RGBA
  def rgba(a = 0.1)
    color = ( background.match /#(..?)(..?)(..?)/ )[1..3]
    color.map!{ |x| x + x } if background.size == 4
    "rgba(#{color[0].hex},#{color[1].hex},#{color[2].hex},#{a})"
  end

  # Получить цвет
  def lighten_color(amount=0.9)
    hex_color = background.gsub('#','')
    rgb = hex_color.scan(/../).map {|color| color.hex}
    rgb[0] = [(rgb[0].to_i + 255 * amount).round, 255].min
    rgb[1] = [(rgb[1].to_i + 255 * amount).round, 255].min
    rgb[2] = [(rgb[2].to_i + 255 * amount).round, 255].min
    "#%02x%02x%02x" % rgb
  end

  def likes_count
    likes.length + (stars / 22)
  end

  def self.find_by_name(name)
    find_by(short: name.downcase)
  end

  def self.update_or_create(attributes)
    if exists?(title: attributes[:title])
      where(title: attributes[:title]).update_all(attributes)
    else
      create(attributes)
    end
  end

  # generate keywords from all languages
  def self.get_keywords(data)
    languages = Array.new
    categories.each do |category, index|
      data[category.pluralize].each do |language|
        languages << language.title
      end
    end
    languages.join ', '
  end
end
