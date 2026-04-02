const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE, // zorgt dat het canvas mee schaalt
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
let ground;
let sky;
let door;
let lava;
let player;
let lives = 3;
let keyGroup;
let keyIcons = [];
let keyCount = 0;


const game = new Phaser.Game(config);
// Deze code zorgt ervoor dat het canvas meeverandert met venstergrootte


function preload() {
    // Laad de tileset-afbeelding
    this.load.image('spritesheet', 'tiled/spritesheet.png');

    // Laad de tilemap die je in Tiled hebt gemaakt
    this.load.tilemapTiledJSON('map', 'tiled/level3.json');
    this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('grah', 'assets/grah.png');  // Lava gun
    this.load.image('drap', 'assets/drap.png');  // Lava druppel
    this.load.spritesheet('girl', 'girl.png', {
        frameWidth: 48, // pas dit aan indien nodig
        frameHeight: 64
    });

    this.load.image('keyIcon', 'assets/keyIcon.png');
    this.load.image('key', 'assets/key3.png');

}

function create() {
    // === TILEMAP EN LAGEN ===
    map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('spritesheet', 'spritesheet');
    sky = map.createLayer('sky', tileset, 0, 0);
    lava = map.createLayer('lava', tileset, 0, 0);
    ground = map.createLayer('ground', tileset, 0, 0);
    ground.setCollisionByExclusion([-1]);
    door = map.createLayer('door', tileset, 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.bounds.width = ground.width;
    this.physics.world.bounds.height = ground.height;

    // === SPELER ===
    player = this.physics.add.sprite(10, 600, 'girl');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(ground, player);
    cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(1.5);



    // === GRAH & DRUPPELS ===
    grahGroup = this.add.group();
    drapGroup = this.physics.add.group();

    const grahPositions = [
        { x: 650, y: 200 },
        { x: 100, y: 10 },
        { x: 1100, y: 10 }
    ];

    grahPositions.forEach(pos => {
        const grah = this.physics.add.staticSprite(pos.x, pos.y, 'grah');
        grah.setScale(0.2);
        grah.setAngle(104);
        grahGroup.add(grah);
    });

    this.time.addEvent({
        delay: 1500,
        callback: () => {
            grahGroup.getChildren().forEach(grah => {
                const drap = drapGroup.create(grah.x, grah.y + 20, 'drap');
                drap.setVelocityY(200);
                drap.setScale(0.1);
                drap.setCollideWorldBounds(false);
                drap.checkWorldBounds = true;
                drap.outOfBoundsKill = true;
            });
        },
        loop: true
    });

    this.physics.add.overlap(player, drapGroup, (player, drap) => {
        drap.destroy();
        lives--;
        console.log('Auw! Lava geraakt je. Levens over: ' + lives);
        if (lives <= 0) {
            console.log('Game Over');
            this.scene.restart();
        }
    }, null, this);

    // === SLEUTELS ===
    keyGroup = this.physics.add.staticGroup(); // static zorgt dat ze niet vallen

    const keyPositions = [
        { x: 1300, y: 500 },
        { x: 1300, y: 400 },
        { x: 1300, y: 550 }
    ];

    keyPositions.forEach(pos => {
        const key = keyGroup.create(pos.x, pos.y, 'key');
        key.setScale(0.2);
        key.refreshBody(); // nodig bij static + scale
    });

    // === SCOREBORD SLEUTELS ===
    for (let i = 0; i < 3; i++) {
        const icon = this.add.image(50 + i * 40, 50, 'keyIcon').setScrollFactor(0).setScale(0.2).setAlpha(0.3);
        keyIcons.push(icon);
    }

    // === SLEUTEL VERZAMELEN ===
    this.physics.add.overlap(player, keyGroup, (player, key) => {
        this.tweens.add({
            targets: key,
            y: key.y - 50,
            alpha: 0,
            duration: 400,
            onComplete: () => key.destroy()
        });

        if (keyCount < 3) {
            keyIcons[keyCount].setAlpha(1); // icoon activeren
        }

        keyCount++;

        if (keyCount === 3) {
            // === DEUR OPENEN ===
            openDoor();
        }
    }, null, this);

    // === DEUR OPEN FUNCTION ===
    function openDoor() {
        console.log("Alle sleutels verzameld! Deur gaat open.");
        // Vervang deur-tiles met een 'open' tile (bijv. ID 26) in de hele deurlaag
        door.forEachTile(tile => {
            if (tile.index === 12) {  // stel 12 is gesloten deur tile index
                tile.index = 196;     // verander naar open deur
            }
        });

    }

    // Animaties
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('girl', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('girl', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{ key: 'girl', frame: 0 }],
        frameRate: 10
    });

    // Speler aanmaken
    this.girl = this.physics.add.sprite(100, 100, 'girl');
    this.cursors = this.input.keyboard.createCursorKeys();






}



function update() {
    this.girl.setVelocity(0);

    if (this.cursors.left.isDown) {
        this.girl.setVelocityX(-160);
        this.girl.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.girl.setVelocityX(160);
        this.girl.anims.play('right', true);
    } else if (this.cursors.down.isDown) {
        this.girl.setVelocityY(160);
        this.girl.anims.play('down', true);
    } else {
        this.girl.anims.play('idle', true);
    }

}


