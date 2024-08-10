class GameState

  def self.switch(new_state)
    $window.state && $window.state.leave
    $window.state = new_state
    new_state.enter
  end

  def enter
  end

  def leave
  end

  def draw
  end

  def update
  end

  def needs_redraw?
    true
  end

  def button_down(id)
  end
end
