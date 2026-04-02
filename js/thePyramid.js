export class thePyramid extends Phaser.Scene {
  constructor() {
    super({ key: 'thePyramid' }); // Scene key
    this.lives = 3;               // Standaard aantal levens
    this.score = 0;               // Score bijhouden
    this.pharaohEnemies = [];     // Array voor vijanden
    this.illObjects = [];         // Array voor ill-objecten
    this.lifeHearts = [];         // Hartjes bij de speler
    this.uiHearts = [];           // Hartjes linksboven
    this.hasKey = false;          // Of speler de sleutel heeft
  }

  preload() {
    // Laad alle benodigde assets voor deze scene
    this.load.image('spritesheet', 'tiled/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'tiled/E-level.json');
    this.load.image('ill-level2', 'assets/ill-level2.png');
    this.load.image('pharaoh', 'assets/pharaoh.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('key', 'assets/key.png');
    this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 32, frameHeight: 48 });
  }

  init(data) {
    this.selectedCharacter = data.character;           // Gekozen karakter uit vorige scene
    this.playerName = data.playerName || 'No name';    // Naam van speler
    this.lives = 3;                                    // Zet levens op 3 bij start
  }

  create() {
    // Maak tilemap en lagen aan
    this.map = this.make.tilemap({ key: 'map' });
    const tileset = this.map.addTilesetImage('spritesheet', 'spritesheet');

    this.groundLayer = this.map.createLayer('ground', tileset, 0, 0);
    this.groundLayer.setCollisionByExclusion([-1]);
    this.skyLayer = this.map.createLayer('sky', tileset, 0, 0);
    this.doorLayer = this.map.createLayer('door', tileset, 0, 0);
    this.doorLayer.setCollisionByExclusion([-1]);
    this.pyramidLayer = this.map.createLayer('pyramid', tileset, 0, 0);

    // Zet correcte wereld-bounds
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Maak speler aan
    this.player = this.physics.add.sprite(10, 800, 'girl');
    this.player.setBounce(0.2).setCollideWorldBounds(true);
    this.physics.add.collider(this.groundLayer, this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);

    // Animaties voor de speler
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

    // Naam van de speler linksboven tonen
    this.playerNameText = this.add.text(100, 100, `Name: ${this.playerName}`, {
      fontSize: '28px',
      fill: '#000000' // zwart
    });

    // Levensharten (naast naam)
    this.lives = 3;
    this.lifeHearts = [];
    const startX = 100 + this.playerNameText.width + 20;
    const startY = 100 + this.playerNameText.height / 2;
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(startX + i * 40, startY, 'heart').setScale(0.025).setOrigin(0, 0.5);
      this.lifeHearts.push(heart);
    }

    // UI-harten linksboven
    this.uiHearts = [];
    for (let i = 0; i < 3; i++) {
      let heart = this.add.image(30 + i * 40, 30, 'heart').setScrollFactor(0).setScale(0.05);
      this.uiHearts.push(heart);
    }

    // Farao vijanden aanmaken
    this.pharaohEnemies = [];
    for (let x = 250; x < this.map.widthInPixels; x += 500) {
      let tile = this.groundLayer.getTileAtWorldXY(x, 0, true);
      let y = tile ? tile.getBottom() : 900;
      let pharaoh = this.physics.add.sprite(x, y - 10, 'pharaoh')
        .setOrigin(0.5, 1).setScale(0.3).setBounce(1)
        .setCollideWorldBounds(true).setVelocityX(50);

      this.physics.add.collider(this.groundLayer, pharaoh);
      this.physics.add.overlap(this.player, pharaoh, this.hitPyramid, null, this);
      this.pharaohEnemies.push(pharaoh);
    }

    // Ill-objecten aanmaken
    this.illObjects = [];
    for (let pos of illPositions) {
      let ill = this.physics.add.staticImage(pos.x, pos.y, 'ill-level2').setScale(0.15);
      ill.refreshBody();
      this.illObjects.push(ill);
      this.physics.add.overlap(this.player, ill, this.eatIll, null, this);
    }

    // Sleutel aanmaken (onzichtbaar tot alle ill-objecten zijn verzameld)
    this.key = this.physics.add.staticImage(3820, 240, 'key').setScale(0.15);
    this.key.setVisible(false);
    this.key.body.enable = false;
    this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);

    // Overlap tussen speler en deur: alleen doorgaan als je de sleutel hebt
    this.physics.add.overlap(this.player, this.doorLayer, (player, tile) => {
      if (this.hasKey) {
        this.scene.start('fireIntro', {
          character: this.selectedCharacter,
          playerName: this.playerName,
          lives: this.lives // <-- levens meenemen!
        });
      }
    });
  }

  update() {
    if (!this.player || !this.cursors) return;

    // Speler besturen met pijltjestoetsen
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }

    // Zet de hearts boven het hoofd van de speler
    const offsetY = 40; // afstand boven het hoofd
    const spacing = 30; // ruimte tussen de hearts
    for (let i = 0; i < this.lifeHearts.length; i++) {
      this.lifeHearts[i].x = this.player.x - ((this.lifeHearts.length - 1) * spacing) / 2 + i * spacing;
      this.lifeHearts[i].y = this.player.y - offsetY;
    }

    // Zet de naam boven de hearts
    if (this.playerNameText) {
      this.playerNameText.x = this.player.x - this.playerNameText.width / 2;
      this.playerNameText.y = this.player.y - offsetY - 50; // 50 pixels boven de hearts
    }
  }

  // Speler raakt een farao
  hitPyramid(player, pharaoh) {
    if (this.invulnerable) return;

    this.invulnerable = true;

    if (this.lives > 0) {
      this.lives--;
      let lostHeart = this.lifeHearts.pop();
      if (lostHeart) lostHeart.destroy();
    }

    console.log('Levens over:', this.lives);
    if (this.lives <= 0) {
      console.log('Game Over');
      this.scene.start('loseScene'); // <-- ga naar lose scene!
    } else {
      // Zet speler kort onkwetsbaar (bijv. 1 seconde)
      this.player.setTint(0xff0000);
      this.time.delayedCall(1000, () => {
        this.invulnerable = false;
        this.player.clearTint();
      });
    }
  }

  // Speler eet een ill-object
  eatIll(player, ill) {
    this.score += 1;
    ill.disableBody(true, true); // Verberg en deactiveer het illObject
    this.collectedIlls = (this.collectedIlls || 0) + 1;

    // Check of alle illObjects zijn verzameld
    if (this.collectedIlls === this.illObjects.length) {
      this.key.setVisible(true);
      this.key.body.enable = true;
    }
  }

  // Speler pakt de sleutel
  collectKey(player, keyObj) {
    this.hasKey = true;
    keyObj.destroy();
    console.log('Sleutel gepakt!');
  }

  // Reset het level (optioneel, bijv. na dood)
  resetGame() {
    this.player.setPosition(10, 800);
    this.score = 0;
    this.lives = 3;
    this.hasKey = false;

    this.pharaohEnemies.forEach(p => p.destroy());
    this.illObjects.forEach(i => i.destroy());
    this.pharaohEnemies = [];
    this.illObjects = [];

    this.lifeHearts.forEach(h => h.destroy());
    this.uiHearts.forEach(h => h.destroy());
    this.lifeHearts = [];
    this.uiHearts = [];
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(100 + this.playerNameText.width + 20 + i * 40, 100 + this.playerNameText.height / 2, 'heart').setScale(0.025).setOrigin(0, 0.5);
      this.lifeHearts.push(heart);
    }
    for (let i = 0; i < 3; i++) {
      let heart = this.add.image(30 + i * 40, 30, 'heart').setScrollFactor(0).setScale(0.05);
      this.uiHearts.push(heart);
    }

    // Heropbouw farao's
    for (let x = 250; x < this.map.widthInPixels; x += 500) {
      let tile = this.groundLayer.getTileAtWorldXY(x, 0, true);
      let y = tile ? tile.getBottom() : 900;
      let pharaoh = this.physics.add.sprite(x, y - 10, 'pharaoh')
        .setOrigin(0.5, 1).setScale(0.3).setBounce(1)
        .setCollideWorldBounds(true).setVelocityX(50);

      this.physics.add.collider(this.groundLayer, pharaoh);
      this.physics.add.overlap(this.player, pharaoh, this.hitPyramid, null, this);
      this.pharaohEnemies.push(pharaoh);
    }

    for (let pos of illPositions) {
      let ill = this.physics.add.staticImage(pos.x, pos.y, 'ill-level2').setScale(0.15);
      ill.refreshBody();
      this.illObjects.push(ill);
      this.physics.add.overlap(this.player, ill, this.eatIll, null, this);
    }

    // Herplaats sleutel
    this.key = this.physics.add.staticImage(3820, 240, 'key').setScale(0.15);
    this.key.setVisible(false);
    this.key.body.enable = false;
    this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
  }
}

// Ill-objectenlocaties buiten de klasse laten staan
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