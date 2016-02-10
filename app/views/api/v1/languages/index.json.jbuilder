json.array!(@api_v1_languages) do |api_v1_language|
  json.extract! api_v1_language, :id
  json.url api_v1_language_url(api_v1_language, format: :json)
end
