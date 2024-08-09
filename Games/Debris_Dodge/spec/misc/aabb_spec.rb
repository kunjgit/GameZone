require_relative '../../lib/misc/axis_aligned_bounding_box'
describe AxisAlignedBoundingBox do

  let(:center) { [5, 5] }
  let(:half_dimension) { [10, 10] }
  let(:box) { AxisAlignedBoundingBox.new(
    center, half_dimension) }

  let(:point1) { [4, 7] }
  let(:point2) { [0, 0] }
  let(:point3) { [10, 10] }
  let(:point4) { [0, 10] }
  let(:point5) { [10, 0] }

  let(:point6) { [-2, 7] }
  let(:point7) { [0, 11] }
  let(:point8) { [11, 11] }
  let(:point9) { [0, 11] }
  let(:point10) { [11, 0] }
  let(:point11) { [3, 15] }
  let(:point12) { [11, 4] }
  let(:point13) { [1, -4] }
  let(:point14) { [-1, -4] }

  describe '#contains?' do
    it 'detects containing point' do
      expect(box.contains?(point1)).to be_truthy
      expect(box.contains?(point2)).to be_truthy
      expect(box.contains?(point3)).to be_truthy
      expect(box.contains?(point4)).to be_truthy
      expect(box.contains?(point5)).to be_truthy
    end

    it 'does not detect points out of bounds' do
      expect(box.contains?(point6)).to be_falsy
      expect(box.contains?(point8)).to be_falsy
      expect(box.contains?(point7)).to be_falsy
      expect(box.contains?(point9)).to be_falsy
      expect(box.contains?(point10)).to be_falsy
      expect(box.contains?(point11)).to be_falsy
      expect(box.contains?(point12)).to be_falsy
      expect(box.contains?(point13)).to be_falsy
      expect(box.contains?(point14)).to be_falsy
    end
  end

  describe '#intersects?' do
    # center within box
    let(:box1) { AxisAlignedBoundingBox.new(
      [8, 8], [10, 12]) }
    # center out of boundaries
    let(:box2) { AxisAlignedBoundingBox.new(
      [12, 12], [15, 15]) }
    let(:box2_1) { AxisAlignedBoundingBox.new(
      [-5, -5], [1, 1]) }
    # touching corners
    let(:box3) { AxisAlignedBoundingBox.new(
      [-1, -1], [0, 0]) }
    # out of bounds
    let(:box4) { AxisAlignedBoundingBox.new(
      [15, 15], [17, 17]) }
    let(:box5) { AxisAlignedBoundingBox.new(
      [-5, -5], [-1, -1]) }
    let(:box6) { AxisAlignedBoundingBox.new(
      [5, 12], [6, 13]) }


    it 'intersects with itself' do
      expect(box.intersects?(box)).to be_truthy
    end

    it 'detects intersecting boxes' do
      expect(box.intersects?(box1)).to be_truthy
      expect(box.intersects?(box2)).to be_truthy
      expect(box.intersects?(box2_1)).to be_truthy
      expect(box.intersects?(box3)).to be_truthy
    end

    it 'does not detect interesections out of bounds' do
      expect(box.intersects?(box4)).to be_falsy
      expect(box.intersects?(box5)).to be_falsy
      expect(box.intersects?(box6)).to be_falsy
    end
  end
end
