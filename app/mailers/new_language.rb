class NewLanguage < ApplicationMailer
  default from: 'Codering <info@codering>'
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.new_language.notify.subject
  #
  def notify(language)
    @language = language
    mail to: "makcyxa-k@yandex.ru", subject: 'New language request'
  end
end
