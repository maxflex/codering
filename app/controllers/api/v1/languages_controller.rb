class Api::V1::LanguagesController < ApplicationController
  # GET /api/v1/languages
  # GET /api/v1/languages.json
  def index
    render json: Language.all
  end

  # GET /api/v1/languages/1
  # GET /api/v1/languages/1.json
  def show
    render json: Language.find(params[:id])
  end

  # GET /api/v1/languages/new
  def new
    @api_v1_language = Api::V1::Language.new
  end

  # GET /api/v1/languages/1/edit
  def edit
  end

  # POST /api/v1/languages
  # POST /api/v1/languages.json
  def create
    @api_v1_language = Api::V1::Language.new(api_v1_language_params)

    respond_to do |format|
      if @api_v1_language.save
        format.html { redirect_to @api_v1_language, notice: 'Language was successfully created.' }
        format.json { render :show, status: :created, location: @api_v1_language }
      else
        format.html { render :new }
        format.json { render json: @api_v1_language.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/v1/languages/1
  # PATCH/PUT /api/v1/languages/1.json
  def update
    respond_to do |format|
      if @api_v1_language.update(api_v1_language_params)
        format.html { redirect_to @api_v1_language, notice: 'Language was successfully updated.' }
        format.json { render :show, status: :ok, location: @api_v1_language }
      else
        format.html { render :edit }
        format.json { render json: @api_v1_language.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/v1/languages/1
  # DELETE /api/v1/languages/1.json
  def destroy
    @api_v1_language.destroy
    respond_to do |format|
      format.html { redirect_to api_v1_languages_url, notice: 'Language was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
end
