class PowerupRespawnQueue
  RESPAWN_DELAY = 1000
  def initialize
    @respawn_queue = {}
    @last_respawn = Gosu.milliseconds
  end

  def enqueue(delay_seconds, type, x, y)
    respawn_at = Gosu.milliseconds + delay_seconds * 1000
    @respawn_queue[respawn_at.to_i] = [type, x, y]
  end

  def respawn(object_pool)
    now = Gosu.milliseconds
    return if now - @last_respawn < RESPAWN_DELAY
    @respawn_queue.keys.each do |k|
      next if k > now # not yet
      type, x, y = @respawn_queue.delete(k)
      type.new(object_pool, x, y)
    end
    @last_respawn = now
  end
end
