/**
 * A* (A-Star) algorithm for a path finder
 */
var AStar = (function () {
    "use strict";
    

    function diagonalSuccessors($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i, walkable) {
        if ($N) {
            if ($E && grid[N][E] < walkable) {
                result[i++] = { x: E, y: N };
            }
            if ($W && grid[N][W] < walkable) {
                result[i++] = { x: W, y: N };
            }
        }
        if ($S) {
            if ($E && grid[S][E] < walkable) {
                result[i++] = { x: E, y: S };
            }
            if ($W && grid[S][W] < walkable) {
                result[i++] = { x: W, y: S };
            }
        }
        return result;
    }

    function diagonalSuccessorsFree($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i, walkable) {
        $N = N > -1;
        $S = S < rows;
        $E = E < cols;
        $W = W > -1;
        if ($E) {
            if ($N && grid[N][E] < walkable) {
                result[i++] = { x: E, y: N };
            }
            if ($S && grid[S][E] < walkable) {
                result[i++] = { x: E, y: S };
            }
        }
        if ($W) {
            if ($N && grid[N][W] < walkable) {
                result[i++] = { x: W, y: N };
            }
            if ($S && grid[S][W] < walkable) {
                result[i++] = { x: W, y: S };
            }
        }
        return result;
    }

    function nothingToDo($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i, walkable) {
        return result;
    }

    function successors(find, x, y, grid, rows, cols, walkable) {
        var N = y - 1,
            S = y + 1,
            E = x + 1,
            W = x - 1,
            $N = N > -1 && grid[N][x] < walkable,
            $S = S < rows && grid[S][x] < walkable,
            $E = E < cols && grid[y][E] < walkable,
            $W = W > -1 && grid[y][W] < walkable,
            result = [],
            i = 0;
        
        if ($N) { result[i++] = { x: x, y: N }; }
        if ($E) { result[i++] = { x: E, y: y }; }
        if ($S) { result[i++] = { x: x, y: S }; }
        if ($W) { result[i++] = { x: W, y: y }; }
        return find($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i, walkable);
    }

    function diagonal(start, end, f1, f2) {
        return f2(f1(start.x - end.x), f1(start.y - end.y));
    }

    function euclidean(start, end, f1, f2) {
        var x = start.x - end.x,
            y = start.y - end.y;
        
        return f2(x * x + y * y);
    }

    function manhattan(start, end, f1, f2) {
        return f1(start.x - end.x) + f1(start.y - end.y);
    }

    function AStar(grid, start, end, f, walkable) {
        var adj, distance, find, i, j, max, min, current, next,
            cols = grid[0].length,
            rows = grid.length,
            limit = cols * rows,
            f1 = Math.abs,
            f2 = Math.max,
            list = {},
            result = [],
            open = [{ x: start[0], y: start[1], f: 0, g: 0, v: start[0] + start[1] * cols }],
            length = 1;
        
        end = { x: end[0], y: end[1], v: end[0] + end[1] * cols };
        find = f === "Diagonal" || f === "Euclidean" ? diagonalSuccessors : find;
        
        switch (f) {
        case "Diagonal":
        case "DiagonalFree":
            distance = diagonal;
            break;
        case "Euclidean":
        case "EuclideanFree":
            f2 = Math.sqrt;
            distance = euclidean;
            break;
        default:
            distance = manhattan;
            find = nothingToDo;
            break;
        }
        
        find = find || diagonalSuccessorsFree;
        do {
            max = limit;
            min = 0;
            for (i = 0; i < length; ++i) {
                f = open[i].f;
                if (f < max) {
                    max = f;
                    min = i;
                }
            }
            current = open.splice(min, 1)[0];
            if (current.v !== end.v) {
                --length;
                next = successors(find, current.x, current.y, grid, rows, cols, walkable);
                for (i = 0, j = next.length; i < j; ++i) {
                    adj = next[i];
                    adj.p = current;
                    adj.f = adj.g = 0;
                    adj.v = adj.x + adj.y * cols;
                    if (!list.hasOwnProperty(adj.v)) {
                        adj.g = current.g + distance(adj, current, f1, f2);
                        adj.f = adj.g + distance(adj, end, f1, f2);
                        open[length++] = adj;
                        list[adj.v] = 1;
                    }
                }
            } else {
                i = length = 0;
                do {
                    result[i++] = [current.x, current.y];
                    current = current.p;
                } while (current);
                result.reverse();
            }
        } while (length);
        return result;
    }
    
    
    return AStar;
}());
