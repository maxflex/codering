# Preview all emails at http://localhost:3000/rails/mailers/new_language
class NewLanguagePreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/new_language/notify
  def notify
    NewLanguage.notify
  end

end
