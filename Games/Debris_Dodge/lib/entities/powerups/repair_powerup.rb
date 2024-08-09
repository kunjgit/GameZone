class RepairPowerup < Powerup
  def pickup(object)
    if object.class == Tank
      if object.health.health < 100
        object.health.restore
      end
      true
    end
  end

  def graphics
    :repair
  end
end
