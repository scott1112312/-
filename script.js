class Cell {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.visited = false;
        this.walls = { top: true, right: true, bottom: true, left: true };
    }
}

class Maze {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.grid = this.createGrid(cols, rows);
        this.generate();
    }

    createGrid(cols, rows) {
        const grid = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                row.push(new Cell(c, r));
            }
            grid.push(row);
        }
        return grid;
    }

    neighbors(cell) {
        const { col, row } = cell;
        const list = [];
        if (row > 0) list.push(this.grid[row - 1][col]);
        if (col < this.cols - 1) list.push(this.grid[row][col + 1]);
        if (row < this.rows - 1) list.push(this.grid[row + 1][col]);
        if (col > 0) list.push(this.grid[row][col - 1]);
        return list.filter((c) => !c.visited);
    }

    removeWalls(a, b) {
        const x = a.col - b.col;
        const y = a.row - b.row;
        if (x === 1) {
            a.walls.left = false;
            b.walls.right = false;
        } else if (x === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }
        if (y === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        } else if (y === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    }

    generate() {
        const stack = [];
        const start = this.grid[0][0];
        start.visited = true;
        stack.push(start);

        while (stack.length) {
            const current = stack[stack.length - 1];
            const nextCandidates = this.neighbors(current);

            if (nextCandidates.length === 0) {
                stack.pop();
                continue;
            }

            const next = nextCandidates[Math.floor(Math.random() * nextCandidates.length)];
            next.visited = true;
            this.removeWalls(current, next);
            stack.push(next);
        }
    }
}

class MazeGame {
    constructor(canvas, statusEl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.statusEl = statusEl;
        this.cellSize = canvas.width / 15;
        this.maze = new Maze(15, 15);
        this.start = { col: 0, row: 0 };
        this.goal = { col: 14, row: 14 };
        this.player = { ...this.start };
        this.bindEvents();
        this.draw();
        this.updateStatus('使用方向键或箭头按钮移动');
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
            const dir = map[e.key];
            if (dir) {
                e.preventDefault();
                this.move(dir);
            }
        });

        document.querySelectorAll('.dir').forEach((btn) => {
            btn.addEventListener('click', () => this.move(btn.dataset.move));
        });

        document.getElementById('newMaze').addEventListener('click', () => this.resetMaze());
        document.getElementById('reset').addEventListener('click', () => this.resetPlayer());
    }

    resetMaze() {
        this.maze = new Maze(15, 15);
        this.player = { ...this.start };
        this.draw();
        this.updateStatus('新的迷宫生成啦，出发！');
    }

    resetPlayer() {
        this.player = { ...this.start };
        this.draw();
        this.updateStatus('已回到起点');
    }

    move(direction) {
        const cell = this.maze.grid[this.player.row][this.player.col];
        if (direction === 'up' && !cell.walls.top) this.player.row -= 1;
        if (direction === 'down' && !cell.walls.bottom) this.player.row += 1;
        if (direction === 'left' && !cell.walls.left) this.player.col -= 1;
        if (direction === 'right' && !cell.walls.right) this.player.col += 1;

        this.draw();
        if (this.player.row === this.goal.row && this.player.col === this.goal.col) {
            this.updateStatus('恭喜！你找到了出口 🎉 点击“生成新迷宫”再来一局。');
        } else {
            this.updateStatus('继续探索吧，出口在右下角');
        }
    }

    draw() {
        const { ctx, cellSize } = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.strokeStyle = '#2f3a56';
        ctx.lineWidth = 2;

        for (let r = 0; r < this.maze.rows; r++) {
            for (let c = 0; c < this.maze.cols; c++) {
                const cell = this.maze.grid[r][c];
                const x = c * cellSize;
                const y = r * cellSize;

                ctx.beginPath();
                if (cell.walls.top) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + cellSize, y);
                }
                if (cell.walls.right) {
                    ctx.moveTo(x + cellSize, y);
                    ctx.lineTo(x + cellSize, y + cellSize);
                }
                if (cell.walls.bottom) {
                    ctx.moveTo(x + cellSize, y + cellSize);
                    ctx.lineTo(x, y + cellSize);
                }
                if (cell.walls.left) {
                    ctx.moveTo(x, y + cellSize);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }

        this.drawGoal();
        this.drawPlayer();
    }

    drawPlayer() {
        const { ctx, cellSize } = this;
        const x = this.player.col * cellSize + cellSize / 2;
        const y = this.player.row * cellSize + cellSize / 2;
        ctx.fillStyle = '#66e3ff';
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGoal() {
        const { ctx, cellSize, goal } = this;
        const x = goal.col * cellSize + cellSize * 0.2;
        const y = goal.row * cellSize + cellSize * 0.2;
        const size = cellSize * 0.6;
        ctx.fillStyle = '#ffcc66';
        ctx.fillRect(x, y, size, size);
    }

    updateStatus(text) {
        this.statusEl.textContent = text;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('maze');
    const statusEl = document.getElementById('status');
    new MazeGame(canvas, statusEl);
});
