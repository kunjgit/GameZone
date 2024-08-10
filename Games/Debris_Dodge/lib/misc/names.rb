class Names
  def initialize(file)
    @names = File.read(file).split("\n").reject do |n|
      n.size > 12
    end
  end

  def random
    name = @names.sample
    @names.delete(name)
    name
  end
end
