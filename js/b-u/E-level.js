const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let map;
let groundLayer;
let skyLayer;
let doorLayer;
let pyramidLayer;
let player;
let cursors;
let lives = 3;
let score = 0;
let pharaohEnemies = [];
let illObjects = [];
let hearts = [];
let key;
let hasKey = false;

let illPositions = [
    { x: 170, y: 900 }, { x: 290, y: 830 }, { x: 410, y: 700 },
    { x: 530, y: 600 }, { x: 630, y: 515 }, { x: 725, y: 570 },
    { x: 800, y: 635 }, { x: 910, y: 695 }, { x: 1060, y: 745 },
    { x: 1170, y: 675 }, { x: 1275, y: 615 }, { x: 1375, y: 535 },
    { x: 1460, y: 475 }, { x: 1575, y: 525 }, { x: 1675, y: 600 },
    { x: 1800, y: 680 }, { x: 1930, y: 755 }, { x: 2065, y: 675 },
    { x: 2160, y: 590 }, { x: 2270, y: 515 }, { x: 2380, y: 440 },
    { x: 2525, y: 375 }, { x: 2635, y: 280 }, { x: 2790, y: 210 },
    { x: 2915, y: 260 }, { x: 3000, y: 300 }, { x: 3100, y: 360 },
    { x: 3230, y: 450 }, { x: 3350, y: 510 }, { x: 3455, y: 590 },
    { x: 3570, y: 690 }, { x: 3675, y: 630 }, { x: 3760, y: 570 },
    { x: 3900, y: 500 }, { x: 3800, y: 440 }, { x: 3700, y: 360 },
    { x: 3620, y: 280 },
];

const game = new Phaser.Game(config);

function preload() {
    this.load.image('spritesheet', 'tiled/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'tiled/E-level.json');
    this.load.image('ill-level2', 'assets/ill-level2.png');
    this.load.image('pharaoh', 'assets/pharaoh.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('key', 'assets/key.png');
    this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('spritesheet', 'spritesheet');

    groundLayer = map.createLayer('ground', tileset, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);

    skyLayer = map.createLayer('sky', tileset, 0, 0);
    doorLayer = map.createLayer('door', tileset, 0, 0);
    pyramidLayer = map.createLayer('pyramid', tileset, 0, 0);

    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    player = this.physics.add.sprite(10, 800, 'girl');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(groundLayer, player);

    cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(1.5);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'girl', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('girl', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    // Maak bewegende Pharaohs 
    for (let x = 250; x < map.widthInPixels; x += 500) {

        let tile = groundLayer.getTileAtWorldXY(x, 0, true);
        let y = tile ? tile.getBottom() : 900;

        let pharaoh = this.physics.add.sprite(x, y - 10, 'pharaoh')
            .setOrigin(0.5, 1)
            .setScale(0.3)
            .setBounce(1)
            .setCollideWorldBounds(true)
            .setVelocityX(50);

        this.physics.add.collider(groundLayer, pharaoh);
        this.physics.add.overlap(player, pharaoh, hitPyramid, null, this);

        pharaohEnemies.push(pharaoh);
    }


    // Voeg ill-objecten toe
    for (let i = 0; i < illPositions.length; i++) {
        let ill = this.physics.add.staticImage(illPositions[i].x, illPositions[i].y, 'ill-level2').setScale(0.15);
        ill.refreshBody();
        illObjects.push(ill);
        this.physics.add.overlap(player, ill, eatIll, null, this);
    }

    // Voeg de key toe
    key = this.physics.add.staticImage(3820, 240, 'key').setScale(0.15);
    this.physics.add.overlap(player, key, collectKey, null, this);

}

function update() {
    if (!player || !cursors) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-330);
    }

    // Laat pharaohs heen-en-weer bewegen
    pharaohEnemies.forEach(pharaoh => {
        if (pharaoh.body.blocked.right) {
            pharaoh.setVelocityX(-50);
        } else if (pharaoh.body.blocked.left) {
            pharaoh.setVelocityX(50);
        }
    });

    // Voeg 3 hartjes toe als UI-elementen
    for (let i = 0; i < 3; i++) {
        let heart = this.add.image(30 + i * 40, 30, 'heart').setScrollFactor(0).setScale(0.05);
        hearts.push(heart);
    }
}

function hitPyramid(player, pharaoh) {
    // Verlaag levens alleen als speler nog levens heeft
    if (lives > 0) {
        lives--;
        // Verwijder visueel hartje
        let lostHeart = hearts.pop();
        if (lostHeart) lostHeart.destroy();
    }

    // Farao blijft bestaan, of je kunt hem ook verwijderen:
    // pharaoh.destroy();

    console.log('Levens over:', lives);

    if (lives <= 0) {
        console.log('Game Over');
        resetGame(player.scene); // Stuur scene mee voor opnieuw starten
  }
}


function eatIll(player, ill) {
    score += 1;
    ill.destroy();
    console.log('Score:', score);
}

//// Functie om de sleutel te verzamelen
function collectKey(player, keyObj) {
    hasKey = true;
    keyObj.destroy();
    console.log('Sleutel gepakt!');
}

function resetGame(scene) {
    // Reset spelerpositie
    player.setPosition(10, 800);
    score = 0;
    lives = 3;

    // Vernietig oude enemies en ill-objecten
    pharaohEnemies.forEach(pharaoh => pharaoh.destroy());
    illObjects.forEach(ill => ill.destroy());
    pharaohEnemies = [];
    illObjects = [];

    // Vernieuw de hartjes
    hearts.forEach(heart => heart.destroy());
    hearts = [];
    for (let i = 0; i < 3; i++) {
        let heart = scene.add.image(30 + i * 40, 30, 'heart').setScrollFactor(0).setScale(0.05);
        hearts.push(heart);
    }



    // Herbouw vijanden en ill's opnieuw
    for (let x = 250; x < map.widthInPixels; x += 500) {
        let tile = groundLayer.getTileAtWorldXY(x, 0, true);
        let y = tile ? tile.getBottom() : 900;

        let pharaoh = scene.physics.add.sprite(x, y - 10, 'pharaoh')
            .setOrigin(0.5, 1)
            .setScale(0.3)
            .setBounce(1)
            .setCollideWorldBounds(true)
            .setVelocityX(50);

        scene.physics.add.collider(groundLayer, pharaoh);
        scene.physics.add.overlap(player, pharaoh, hitPyramid, null, scene);

        pharaohEnemies.push(pharaoh);
    }

    for (let i = 0; i < illPositions.length; i++) {
        let ill = scene.physics.add.staticImage(illPositions[i].x, illPositions[i].y, 'ill-level2').setScale(0.15);
        ill.refreshBody();
        illObjects.push(ill);
        scene.physics.add.overlap(player, ill, eatIll, null, scene);
    }
}

function collectKey(player, keyObj) {
    hasKey = true;
    keyObj.destroy();
    console.log('Sleutel gepakt!');
    // Win-scherm of melding
    this.add.text(player.x - 100, player.y - 100, 'Je hebt gewonnen!', {
        fontSize: '48px',
        fill: '#fff',
        backgroundColor: '#000'
    }).setScrollFactor(0);
    this.physics.pause(); // Zet alles stil
}
