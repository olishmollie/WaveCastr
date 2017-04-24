require 'rails_helper'

RSpec.feature "Auths", type: :feature do

  scenario "I visit root and am at the demo_user's dashboard" do
    visit "/"
    expect(page).to have_content("demo_user")
  end
end
