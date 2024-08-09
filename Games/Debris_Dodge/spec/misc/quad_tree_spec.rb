class GameObject
  attr_accessor :x, :y
  def initialize(x, y)
    @x, @y = x, y
  end

  def location
    [@x, @y]
  end
end

require_relative '../../lib/misc/axis_aligned_bounding_box'
require_relative '../../lib/misc/quad_tree'

describe QuadTree do
  let(:box) { AxisAlignedBoundingBox.new(
    [5, 5], [10, 10]) }
  let(:tree) { QuadTree.new(box) }

  let(:location) { [5, 5] }
  let(:object) { GameObject.new(*location) }

  describe '#insert' do
    subject { tree.insert(object) }

    context 'around zero coordinates' do
      let(:box) { AxisAlignedBoundingBox.new(
        [0, 0], [10, 10]) }
      let(:location) { [0, 0] }

      it 'inserts in the middle' do
        expect(subject).to be_truthy
      end
    end

    context 'object in center' do
      it 'gets inserted' do
        expect(subject).to be_truthy
      end
    end

    context 'object in corner' do
      let(:location) { [10, 10] }
      it 'gets inserted' do
        expect(subject).to be_truthy
      end
    end

    context 'object out of bounds' do
      let(:location) { [11, 11] }
      it 'does not get inserted' do
        expect(subject).to be_falsy
      end
    end

    context 'several objects' do
      subject { tree.query_range(box) }
      context 'to different locations' do
        before do
          50.times do |i|
            tree.insert(
              GameObject.new(
                rand(0..10),
                rand(0..10)))
          end
        end
        it 'inserts all' do
          expect(subject.size).to eq 50
        end
      end

      context 'to same location' do
        before { 5.times { tree.insert(object.dup) } }

        it 'still inserts all' do
          expect(subject.size).to eq 5
        end
      end
    end
  end

  describe '#query_range' do
    let(:query_params) { [[5, 5], [10, 10]] }
    let(:query_box) { AxisAlignedBoundingBox.new(*query_params) }
    subject { tree.query_range(query_box) }

    context 'empty tree' do
      it 'returns empty array' do
        should be_empty
      end
    end

    context 'single object' do
      before { tree.insert(object) }

      context 'is found' do
        let(:query_params) do
          [object.location, object.location.map { |c| c + 1 }]
        end
      end
    end
  end

  describe '#remove' do
    context 'single object' do
      before do
        tree.insert(object)
        tree.remove(object)
      end
      subject { tree.query_range(box) }

      it 'removes it' do
        expect(subject.size).to equal(0)
      end
    end

    context 'all objects' do
      before do
        50.times do
          tree.insert(
            GameObject.new(
              rand(0..10),
              rand(0..10)))
        end
      end
      subject { tree.query_range(box) }

      it 'removes it' do
        expect(subject.size).to equal(50)
        subject.each do |ob|
          expect(tree.remove(ob)).to be_truthy
        end
        expect(tree.query_range(box).size).to equal(0)
      end
    end
  end
end
