using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace PacmanGame
{
    public partial class Form1 : Form
    {
        Timer gameTimer = new Timer();
        List<Rectangle> walls = new List<Rectangle>();
        List<Rectangle> dots = new List<Rectangle>();
        Rectangle pacman;
        int pacmanSpeed = 5;
        int score = 0;
        Keys direction = Keys.Right;

        public Form1()
        {
            InitializeComponent();
            this.DoubleBuffered = true;
            this.Width = 500;
            this.Height = 500;

            InitGame();

            gameTimer.Interval = 50;
            gameTimer.Tick += Update;
            gameTimer.Start();

            this.KeyDown += Form1_KeyDown;
        }

        void InitGame()
        {
            pacman = new Rectangle(50, 50, 20, 20);

            // Стены
            walls.Add(new Rectangle(0, 0, 480, 20));
            walls.Add(new Rectangle(0, 0, 20, 480));
            walls.Add(new Rectangle(0, 460, 480, 20));
            walls.Add(new Rectangle(460, 0, 20, 480));
            walls.Add(new Rectangle(100, 100, 280, 20));
            walls.Add(new Rectangle(100, 200, 20, 150));

            // Точки
            for (int y = 40; y < 460; y += 40)
                for (int x = 40; x < 460; x += 40)
                    dots.Add(new Rectangle(x, y, 5, 5));
        }

        void Form1_KeyDown(object sender, KeyEventArgs e)
        {
            direction = e.KeyCode;
        }

        void Update(object sender, EventArgs e)
        {
            Rectangle next = pacman;

            switch (direction)
            {
                case Keys.Left: next.X -= pacmanSpeed; break;
                case Keys.Right: next.X += pacmanSpeed; break;
                case Keys.Up: next.Y -= pacmanSpeed; break;
                case Keys.Down: next.Y += pacmanSpeed; break;
            }

            // Проверка на стены
            bool canMove = true;
            foreach (var wall in walls)
            {
                if (wall.IntersectsWith(next))
                {
                    canMove = false;
                    break;
                }
            }

            if (canMove)
                pacman = next;

            // Съедание точек
            for (int i = 0; i < dots.Count; i++)
            {
                if (pacman.IntersectsWith(dots[i]))
                {
                    dots.RemoveAt(i);
                    score++;
                    break;
                }
            }

            this.Invalidate(); // Перерисовка
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            Graphics g = e.Graphics;

            g.Clear(Color.Black);

            // Нарисовать Pacman
            g.FillEllipse(Brushes.Yellow, pacman);

            // Нарисовать стены
            foreach (var wall in walls)
                g.FillRectangle(Brushes.Blue, wall);

            // Нарисовать точки
            foreach (var dot in dots)
                g.FillEllipse(Brushes.White, dot);

            // Очки
            g.DrawString("Очки: " + score, new Font("Arial", 14), Brushes.White, 10, 10);
        }
    }
}
