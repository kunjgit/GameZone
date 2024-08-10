require 'singleton'
class PauseState < GameState
  include Singleton
  attr_accessor :play_state

  def initialize
    @message = Gosu::Image.from_text(
      $window, "Game Paused",
      Utils.title_font, 60)
  end

  def enter
    music.play(true)
    music.volume = 1
    @score_display = ScoreDisplay.new(@play_state.object_pool)
    @mouse_coords = [$window.mouse_x, $window.mouse_y]
  end

  def leave
    music.volume = 0
    music.stop
    $window.mouse_x, $window.mouse_y = @mouse_coords
  end

  def music
    @@music ||= Gosu::Song.new(
      $window, Utils.media_path('menu_music.ogg'))
  end

  def draw
    @play_state.draw
    @message.draw(
      $window.width / 2 - @message.width / 2,
      $window.height / 4 - @message.height - 50,
      1000)
    info.draw(
      $window.width / 2 - info.width / 2,
      $window.height / 4 - info.height,
      1000)
    @score_display.draw
  end

  def info
    @info ||= Gosu::Image.from_text(
      $window, 'Q: Quit to Main Menu',
      Utils.main_font, 30)
  end

  def button_down(id)
    if id == Gosu::KbQ
      MenuState.instance.play_state = @play_state
      GameState.switch(MenuState.instance)
    end
    if id == Gosu::KbC && @play_state
      GameState.switch(@play_state)
    end
    if id == Gosu::KbEscape
      GameState.switch(@play_state)
    end
  end
end
