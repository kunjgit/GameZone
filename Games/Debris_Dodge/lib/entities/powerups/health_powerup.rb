class HealthPowerup < Powerup
  def pickup(object)
    if object.class == Tank
      object.health.increase(25)
      true
    end
  end

  def graphics
    :life_up
  end
end
