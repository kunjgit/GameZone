class PlayerSounds
  class << self
    def respawn(object, camera)
      volume, pan = Utils.volume_and_pan(object, camera)
      respawn_sound.play(object.object_id, pan, volume * 0.5)
    end

    private

    def respawn_sound
      @@respawn ||= StereoSample.new(
        $window, Utils.media_path('respawn.wav'))
    end
  end
end

