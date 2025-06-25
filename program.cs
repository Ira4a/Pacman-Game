using System;
using System.Collections.Generic;
using System.Threading;

class Program
{
    static char[,] map = {
        {'#','#','#','#','#','#','#','#','#','#','#','#','#','#'},
        {'#',' ',' ',' ',' ',' ','#',' ',' ',' ',' ',' ',' ','#'},
        {'#',' ','#','#','#',' ','#',' ','#','#','#','#',' ','#'},
        {'#',' ','#',' ','#',' ',' ',' ','#',' ',' ','#',' ','#'},
        {'#',' ','#',' ','#','#','#','#','#',' ','#','#',' ','#'},
        {'#',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','#'},
        {'#','#','#','#','#','#','#','#','#','#','#','#','#','#'}
    };

    static int pacmanX = 1;
    static int pacmanY = 1;
    static int score = 0;
    static bool gameOver = false;

    static List<(int x, int y)> ghosts = new List<(int x, int y)> {
        (12, 1),
        (12, 5)
    };

    static Random random = new Random();

    static void Main()
    {
        Console.CursorVisible = false;
        ConsoleKey key = ConsoleKey.RightArrow;

        while (!gameOver)
        {
            Draw();

            if (Console.KeyAvailable)
                key = Console.ReadKey(true).Key;

            MovePacman(key);
            MoveGhosts();
            CheckGameOver();

            Thread.Sleep(200);
        }

        Console.Clear();
        Console.WriteLine("👻 Game Over! Вы набрали очков: " + score);
    }

    static void Draw()
    {
        Console.SetCursorPosition(0, 0);
        for (int y = 0; y < map.GetLength(0); y++)
        {
            for (int x = 0; x < map.GetLength(1); x++)
            {
                if (x == pacmanX && y == pacmanY)
                {
                    Console.Write('C');
                }
                else if (IsGhost(x, y))
                {
                    Console.Write('G');
                }
                else
                {
                    Console.Write(map[y, x]);
                }
            }
            Console.WriteLine();
        }

        Console.WriteLine("Очки: " + score);
    }

    static void MovePacman(ConsoleKey key)
    {
        int newX = pacmanX;
        int newY = pacmanY;

        switch (key)
        {
            case ConsoleKey.UpArrow: newY--; break;
            case ConsoleKey.DownArrow: newY++; break;
            case ConsoleKey.LeftArrow: newX--; break;
            case ConsoleKey.RightArrow: newX++; break;
        }

        if (map[newY, newX] != '#')
        {
            pacmanX = newX;
            pacmanY = newY;

            if (map[newY, newX] == ' ')
            {
                map[newY, newX] = '.';
                score++;
            }
        }
    }

    static void MoveGhosts()
    {
        for (int i = 0; i < ghosts.Count; i++)
        {
            int gx = ghosts[i].x;
            int gy = ghosts[i].y;

            List<(int x, int y)> directions = new List<(int, int)> {
                (gx + 1, gy), // Right
                (gx - 1, gy), // Left
                (gx, gy + 1), // Down
                (gx, gy - 1)  // Up
            };

            directions.RemoveAll(d =>
                d.x < 0 || d.x >= map.GetLength(1) ||
                d.y < 0 || d.y >= map.GetLength(0) ||
                map[d.y, d.x] == '#' ||
                IsGhost(d.x, d.y)
            );

            if (directions.Count > 0)
            {
                var (nx, ny) = directions[random.Next(directions.Count)];
                ghosts[i] = (nx, ny);
            }
        }
    }

    static bool IsGhost(int x, int y)
    {
        foreach (var g in ghosts)
            if (g.x == x && g.y == y)
                return true;
        return false;
    }

    static void CheckGameOver()
    {
        if (IsGhost(pacmanX, pacmanY))
            gameOver = true;
    }
}
