const cell = 20;
const width = 600;
const height = 600;
const row = width / cell;

const colors = {
    head: "#8f0000", body: "#ff0000", apple: "#00ff25"
}

const button = document.getElementById('button')
const buttonField = document.getElementById('field2')

let count = document.getElementById("count")
let score = 0
console.log(count)

const state = {
    body: [
        {x: 5, y: 5, direc: 'right', head: false},
        {x: 6, y: 5, direc: 'right', head: false},
        {x: 7, y: 5, direc: 'right', head: true}
    ],
    prevDirec: 'right',
    nextDirec: 'right',
    ate: false,
    apple: {x: 10, y: 15}
}

function updateScore() {
    count.textContent = score
    console.log(count)
}


const changepath = (keycode) => {
    if (keycode === 37 && state.prevDirec !== "right") {
        state.nextDirec = "left"
    } else if (keycode === 38 && state.prevDirec !== "down") {
        state.nextDirec = "up"
    } else if (keycode === 39 && state.prevDirec !== "left") {
        state.nextDirec = "right"
    } else if (keycode === 40 && state.prevDirec !== 'up') {
        state.nextDirec = "down"
    } else {
        return
    }
}


const newApple = () => {
    let x, y;
    do {
        x = Math.floor(Math.random() * row)
        y = Math.floor(Math.random() * row)
    } while (state.body.some((seg) => seg.x === x && seg.y === y))

    return {x, y};
}

const moveSnake = () => {
    state.prevDirec = state.nextDirec

    const head = state.body[state.body.length - 1]
    let newHead

    head.head = false

    if (state.nextDirec === "left") {
        newHead = {x: head.x - 1, y: head.y, direc: state.nextDirec, head: true}
    } else if (state.nextDirec === "right") {
        newHead = {x: head.x + 1, y: head.y, direc: state.nextDirec, head: true}
    } else if (state.nextDirec === "up") {
        newHead = {x: head.x, y: head.y - 1, direc: state.nextDirec, head: true}
    } else {
        newHead = {x: head.x, y: head.y + 1, direc: state.nextDirec, head: true}
    }

    if (state.apple.x === newHead.x && state.apple.y === newHead.y) {
        state.apple = newApple()
        state.body.push(newHead)
        state.ate = true
        score++;
        updateScore();

    } else {
        state.body.shift()
        state.body.push(newHead)
        state.ate = false
    }

    if (newHead.x === row + 1 || newHead.x === -2 || newHead.y === row + 1 || newHead.y === -2) {
        alert('game over !')
        alert(`Your Score is ${score}`)
        window.location.reload()
    }

    if (state.body.slice(0, -1).some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        alert('Game Over!');
        alert(`Your Score is ${score}`);
        window.location.reload();
    }

}

const load = () => {
    state.apple = newApple()

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    score = 0;
    updateScore();

    button.onclick = () => {
        setInterval(() => {
            GameRender()
            moveSnake()
        }, 150)
        buttonField.style.display = "none";
        textsField.style.display = "block";

    }

    const GameRender = () => {
        context.clearRect(0, 0, width, height)


        state.body.forEach((item) => {
            context.fillStyle = item.head ? colors.head : colors.body
            context.fillRect(item.x * cell, item.y * cell, cell, cell)
        })
        context.fillStyle = colors.apple;
        context.fillRect(state.apple.x * cell, state.apple.y * cell, cell, cell)

    }


    document.addEventListener('keydown', (event) => {
        changepath(event.keyCode)
    })
}

window.addEventListener('load', load)