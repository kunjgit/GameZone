class Stats
  attr_reader :name, :kills, :deaths, :shots, :changed_at
  def initialize(name)
    @name = name
    @kills = @deaths = @shots = @damage = @damage_dealt = 0
    changed
  end

  def add_kill(amount = 1)
    @kills += amount
    changed
  end

  def add_death
    @deaths += 1
    changed
  end

  def add_shot
    @shots += 1
    changed
  end

  def add_damage(amount)
    @damage += amount
    changed
  end

  def damage
    @damage.round
  end

  def add_damage_dealt(amount)
    @damage_dealt += amount
    changed
  end

  def damage_dealt
    @damage_dealt.round
  end

  def to_s
    "[kills: #{@kills}, " \
      "deaths: #{@deaths}, " \
      "shots: #{@shots}, " \
      "damage: #{damage}, " \
      "damage_dealt: #{damage_dealt}]"
  end

  private

  def changed
    @changed_at = Gosu.milliseconds
  end
end
