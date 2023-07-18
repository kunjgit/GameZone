function BinaryHeap(scoreFunction) {
  var data = [];
  var length = 0;

  function sinkDown(i) {
    var element = data[i];
    var parent;
    var parentI;
    while (i) {
      parentI = ((i + 1) >> 1) - 1;
      parent = data[parentI];
      if (scoreFunction(element) < scoreFunction(parent)) {
        data[i] = parent;
        data[i = parentI] = element;
      } else {
        break;
      }
    }
  }

  function bubbleUp(i) {
    var element = data[i];
    var score = scoreFunction(element);

    while (1) {
      var child2i = (i + 1) << 1;
      var child1i = child2i - 1;
      var child1Score;
      var swap = -1;

      if (child1i < length) {
        var child1 = data[child1i];
        if ((child1Score = scoreFunction(child1)) < score) {
          swap = child1i;
        }
      }

      if (child2i < length) {
        var child2 = data[child2i];
        if (scoreFunction(child2) < (swap < 0 ? score : child1Score)) {
          swap = child2i;
        }
      }

      if (swap < 0) {
        break;
      }

      data[i] = data[swap];
      data[i = swap] = element;
    }
  }

  __mixin(this, {
    a: function push(element) {
      data[length++] = element;
      sinkDown(length - 1);
    },
    r: function pop() {
      if (!length) throw length;
      var element = data[0];
      var end = data[--length];
      if (length) {
        data[0] = end;
        bubbleUp(0);
      }

      return element;
    },
    n: function size() {
      return length;
    }
  });
}

var AStar = (function() {
  // Private variables
  var grid;

  // Methods variables
  var x, y;

  function pushIfExists(results, x, y) {
    grid[y] && grid[y][x] && results.push(grid[y][x]);
  }

  function manhattanHeuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  return {
    init: function(map, isWall) {
      // Build the grid
      grid = [];
      for (y = map.length; y--;) {
        grid[y] = [];
        for (x = map[0].length; x--;) {
          grid[y][x] = {
            w: isWall(map[y][x]), // Wall
            x: x, // Position X
            y: y, // Position Y
            v: 0, // Visited
            c: 0, // Closed
            h: 0, // Heuristic score
          };
        }
      }
    },
    w: function setWall(x, y, flag) {
      grid[y][x].w = flag;
    },
    r: function ray(start, end) {
      var deltaX = end.x - start.x;
      var deltaY = end.y - start.y;
      var steps = Math.ceil(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
      var stepX = deltaX / steps;
      var stepY = deltaY / steps;
      var currX = start.x - stepX;
      var currY = start.y - stepY;

      while (steps--) {
        if (grid[(currY += stepY) | 0][(currX += stepX) | 0].w) {
          return false;
        }
      }

      return true;
    },
    s: function search(start, end) {
      var heap = new BinaryHeap(function(node) {
        if (!node) throw "";
        return node.h;
      });

      // Reset grid
      var current;
      for (y = grid.length; y--;) {
        for (x = grid[0].length; x--;) {
          current = grid[y][x];
          current.v = current.c = current.h = current.p = 0;
        }
      }

      start = grid[start.y][start.x];
      end = grid[end.y][end.x];
      heap.a(start);

      while (heap.n()) {
        current = heap.r();
        if (current == end) {
          var curr = current;
          var ret = [];

          while (curr.p) {
            ret.push(curr);
            curr = curr.p;
          }

          return ret.reverse();
        }

        current.c = 1;

        x = current.x;
        y = current.y;

        var neighbors = [];
        pushIfExists(neighbors, x - 1, y); // West
        pushIfExists(neighbors, x + 1, y); // East
        pushIfExists(neighbors, x, y - 1); // North
        pushIfExists(neighbors, x, y + 1); // South

        for (var i = neighbors.length; i--;) {
          var neighbor = neighbors[i];
          if (!neighbor.c && !neighbor.w && !neighbor.v) {
            neighbor.v = 1;
            neighbor.p = current;
            neighbor.h = neighbor.h || manhattanHeuristic(neighbor, end);

            heap.a(neighbor);
          }
        }
      }

      return [];
    }
  };
})();
