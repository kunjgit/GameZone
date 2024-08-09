# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

Gem::Specification.new do |spec|
  spec.name          = "tank_island"
  spec.version       = '1.0.5'
  spec.authors       = ["Tomas Varaneckas"]
  spec.email         = ["tomas.varaneckas@gmail.com"]
  spec.summary       = %q{Top down 2D shooter game that involves blowing up tanks}
  spec.description   = <<-EOS
    This is a game built with Gosu library while writing "Developing Games With Ruby" book.
    You can get the book at https://leanpub.com/developing-games-with-ruby
  EOS
  spec.homepage      = "https://leanpub.com/developing-games-with-ruby"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake", "~> 10.0"

  spec.add_runtime_dependency 'gosu', "~> 0.15.2"
  spec.add_runtime_dependency 'rmagick'
  spec.add_runtime_dependency 'gosu_texture_packer'
  spec.add_runtime_dependency 'perlin_noise'
end
