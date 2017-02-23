/* global $ */
(function () {
    'use strict';

    var canvas = document.getElementById('theCanvas'),
        scoreCanvas = document.getElementById('scoreCanvas'),
        main = $('#main'),
        play = $('#playButton');

    play.click(function () {
        $('#startingImage').fadeOut('slow', function () {
            main.show();
            init();
        });
    });

    function init() {
        
        const LEFT = 37,
            UP = 38,
            RIGHT = 39,
            DOWN = 40,
            PAUSE = 80;

        var dingSound = document.getElementById('ding'),
            ctx = canvas.getContext('2d'),
            ctx2 = scoreCanvas.getContext('2d'),
            controlsDiv = $('#controls'),
            face,
            body,
            apple,
            snakeSize = 64,
            direction = RIGHT,
            snake = [{ x: -64, y: 0 }],
            appleX,
            appleY,
            speed = 500,
            isPaused = false,
            score = 0;

        function resizeCanvas() {
            var canvasDiv = document.getElementById('canvasDiv'),
                borders = parseInt(getComputedStyle(canvas, 10).getPropertyValue('border-left-width')) * 2,
                width = canvasDiv.offsetWidth - borders, //canvasDiv.scrollWidth,
                height = window.innerHeight - 10,
                sideBarHeight = $('#sideBar').css('height');

            canvas.width = width - width % snakeSize; //this is to make the screen width size exact with the snake size
            canvas.height = height - height % snakeSize; //this is to make the screen height size exact with the snake size
            
            controlsDiv.css('height', sideBarHeight - scoreCanvas.height);

            if (appleX) {
                placeApple();
            }
        }

        window.addEventListener('resize', function () {
            resizeCanvas();
        });

        resizeCanvas();

        face = new Image();
        face.src = 'images/newHead_Sized.png';

        body = new Image();
        body.src = 'images/newBody_Sized.png';

        function drawScore() {
            ctx2.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);// clear this canvas
            ctx2.font = "20px sans-serif";
            ctx2.fillStyle = 'white';
            ctx2.fillText('Score:', (scoreCanvas.width / 2) - (ctx.measureText('Score:').width / 2), 25);
            ctx2.font = "48px cursive";
            ctx2.fillText(score, (scoreCanvas.width / 2) - (ctx.measureText(score).width / 2), 75);
        }

        function gameloop() {
            setTimeout(function () {
                var x = 0,
                    y = 0;
                switch (direction) {
                    case LEFT:
                        x = -snakeSize;
                        break;
                    case RIGHT:
                        x = snakeSize;
                        break;
                    case UP:
                        y = -snakeSize;
                        break;
                    case DOWN:
                        y = snakeSize;
                        break;
                }

                if (snake[0].x + x < 0 || snake[0].y + y < 0 ||
                    snake[0].x + x >= canvas.width || snake[0].y + y >= canvas.height) {
                    dingSound.play();
                    return;
                }

                var i;
                for (i = 2; i < snake.length; i++) {
                    if (snake[i].x === snake[0].x + x && snake[i].y === snake[0].y + y) {
                        dingSound.play();
                        return;
                    }
                }

                if (snake[0].x + x === appleX && snake[0].y + y === appleY) {
                    snake.push({ x: snake[0].x, y: snake[0].y });
                    dingSound.play();
                    score++;
                    speed *= 0.9;
                    placeApple();
                }
                snake.forEach(function (snakePart) {
                    ctx.clearRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
                });

                snake.unshift({ x: snake[0].x + x, y: snake[0].y + y });
                snake.pop();

                snake.forEach(function (snakePart, index) {
                    ctx.drawImage(index === 0 ? face : /*index === snake.length - 1 ? tail :*/ body, snakePart.x, snakePart.y, snakeSize, snakeSize);
                });

                drawScore();
                if (!isPaused) {
                    gameloop();
                }
            }, speed);
        }

        face.onload = gameloop;

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function placeApple() {
            var good;
            do {
                good = true;
                appleX = getRandomNumber(0, canvas.width);
                appleY = getRandomNumber(0, canvas.height);

                appleX -= appleX % snakeSize;
                appleY -= appleY % snakeSize;

                var i;
                for (i = 0; i < snake.length; i++) {
                    if (snake[i].x === appleX && snake[i].y === appleY) {
                        good = false;
                        break;
                    }
                }
            } while (!good);
            ctx.drawImage(apple, appleX, appleY, snakeSize - 4, snakeSize - 4);
        }

        $('#newGame').click(function () {
            console.log('clicked');
            // main.hide();
        });

        apple = new Image();
        apple.src = 'images/apple_Sized.png';
        apple.onload = placeApple;

        drawScore();

        window.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case LEFT:
                    if (snake.length === 1 || direction !== RIGHT) {
                        direction = event.keyCode;
                    }
                    break;
                case UP:
                    if (snake.length === 1 || direction !== DOWN) {
                        direction = event.keyCode;
                    }
                    break;
                case RIGHT:
                    if (snake.length === 1 || direction !== LEFT) {
                        direction = event.keyCode;
                    }
                    break;
                case DOWN:
                    if (snake.length === 1 || direction !== UP) {
                        direction = event.keyCode;
                    }
                    break;
                case PAUSE:
                    isPaused = !isPaused;
                    if (!isPaused) {
                        gameloop();
                    }
                    break;
            }
        });
    }
}());