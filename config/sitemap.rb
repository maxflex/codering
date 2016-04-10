require 'rubygems'
require 'sitemap_generator'

SitemapGenerator::Sitemap.default_host = 'http://codering.info'
SitemapGenerator::Sitemap.create do
  add '/trending', :priority => 1, :changefreq => 'daily'
  add '/add', :priority => 0.8, :changefreq => 'monthly'

  Language::categories.each do |category, index|
    Language.where(category: index).each do |l|
      Language.where(category: index).where('id != ?', l.id).each do |l2|
        add "#{l.short}-vs-#{l2.short}", :priority => 1
      end
    end
  end

  Language.find_each do |l|
    add "#{l.category}/#{l.short}", :priority => 0.9
  end
end
