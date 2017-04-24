require 'rails_helper'

RSpec.feature "Chats", type: :feature do
  let!(:user) { double(:user, name: "demo_user") }

  before(:each) do
    visit '/'
    at_dashboard?
    create_episode
    at_lobby?
  end

  scenario "user can post message in chat box", js: true do
    chat_input = find('#chat-input')
    chat_input.set("Testing one two")
    click_on('Send')

    expect(chat_input).to_not have_content("Testing one two")
    expect(page).to have_content("#{user.name}: Testing one two")
  end

end
