def find_position(board, die_inputs):
    current_position = 1  # Start position
    snakes_encountered = 0
    ladders_encountered = 0

    for die_input in die_inputs:
        new_position = current_position + die_input

        if new_position > 100:
            continue  # Skip moves that go beyond the board

        # Check if there's a snake or ladder at the new position
        square = board[new_position // 10][new_position % 10]
        if square.startswith("S("):
            snakes_encountered += 1
            new_position = int(square[2:-1])  # Move to the snake's tail
        elif square.startswith("L("):
            ladders_encountered += 1
            new_position = int(square[2:-1])  # Move to the ladder's top

        current_position = new_position

    if current_position == 100:
        return "Possible", snakes_encountered, ladders_encountered
    else:
        return "Not possible", snakes_encountered, ladders_encountered, current_position

# Input processing
board = [input().split() for _ in range(10)]
die_inputs = list(map(int, input().split()))

# Find and print the result
result = find_position(board, die_inputs)
print(*result)
