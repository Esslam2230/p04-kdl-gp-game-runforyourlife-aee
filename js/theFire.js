export class theFire extends Phaser.Scene {
  constructor() {
    super({ key: 'theFire' }); // Scene key
    this.lives = 3;            // Standaard aantal levens
    this.hearts = [];          // Array voor hartjes
    this.invulnerable = false; // Onkwetsbaar na schade
    this.selectedCharacter = 'girl'; // Standaard karakter
  }

  init(data) {
    this.selectedCharacter = data.character; // Gekozen karakter uit vorige scene
    this.playerName = data.playerName;       // Gekozen naam uit vorige scene
    this.lives = data.lives || 3;            // Aantal levens, standaard 3
  }

  preload() {
    // Laad alle benodigde assets voor deze scene
    this.load.image('spritesheet', 'tiled/spritesheet.png');
    this.load.tilemapTiledJSON('fireMap', 'tiled/level3.json');
    this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 48, frameHeight: 48 });
    this.load.image('grah', 'assets/grah.png');
    this.load.image('drap', 'assets/drap.png');
    this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 48, frameHeight: 48 });
    this.load.image('keyIcon', 'assets/keyIcon.png');
    this.load.image('fireKey', 'assets/key3.png');
    this.load.image('heart', 'assets/heart.png');
  }

  create() {
    console.log("Scene 'theFire' geladen!");

    // === TILEMAP EN LAGEN ===
    this.map = this.make.tilemap({ key: 'fireMap' });
    const tileset = this.map.addTilesetImage('spritesheet', 'spritesheet');
    this.sky = this.map.createLayer('sky', tileset, 0, 0);
    this.lava = this.map.createLayer('lava', tileset, 0, 0);
    this.big = this.map.createLayer('big', tileset, 0, 0);
    this.ground = this.map.createLayer('ground', tileset, 0, 0);
    this.ground.setCollisionByExclusion([-1]);
    this.door = this.map.createLayer('door', tileset, 0, 0);

    // Camera en physics grenzen instellen
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.ground.width, this.ground.height);

    // === SPELER AANMAKEN ===
    this.player = this.physics.add.sprite(10, 600, 'girl');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.ground, this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);

    // === LAVA GUN EN DRUPPELS ===
    this.grahGroup = this.add.group();
    this.drapGroup = this.physics.add.group();

    // Posities van de lava-kanonnen
    const grahPositions = [
      { x: 650, y: 200 },
      { x: 100, y: 10 },
      { x: 1100, y: 10 }
    ];

    // Maak de lava-kanonnen aan
    grahPositions.forEach(pos => {
      const grah = this.physics.add.staticSprite(pos.x, pos.y, 'grah');
      grah.setScale(0.2);
      grah.setAngle(104);
      this.grahGroup.add(grah);
    });

    // Laat de kanonnen periodiek druppels schieten
    this.time.addEvent({
      delay: 1500,
      callback: () => {
        this.grahGroup.getChildren().forEach(grah => {
          const drap = this.drapGroup.create(grah.x, grah.y + 20, 'drap');
          drap.setVelocityY(200);
          drap.setScale(0.1);
          drap.setCollideWorldBounds(false);
          drap.body.setSize(drap.width * 0.2, drap.height * 0.2).setOffset(drap.width * 0.15, drap.height * 0.5);
        });
      },
      loop: true
    });

    // Speler raakt een druppel
    this.physics.add.overlap(this.player, this.drapGroup, (player, drap) => {
      this.hitLava(drap);
    });

    // === SLEUTELS EN ICONS ===
    this.keyGroup = this.physics.add.staticGroup();
    this.keyIcons = [];
    this.keyCount = 0;

    // Posities van de sleutels
    const keyPositions = [
      { x: 600, y: 35 },
      { x: 700, y: 35 },
      { x: 1550, y: 35 }
    ];

    // Sleutels plaatsen
    keyPositions.forEach(pos => {
      const key = this.keyGroup.create(pos.x, pos.y, 'fireKey');
      key.setScale(0.2);
      key.refreshBody();
    });

    // Sleutel-iconen linksboven
    for (let i = 0; i < 3; i++) {
      const icon = this.add.image(50 + i * 40, 50, 'keyIcon')
        .setScrollFactor(0)
        .setScale(0.2)
        .setAlpha(0.3);
      this.keyIcons.push(icon);
    }

    // Speler pakt een sleutel
    this.physics.add.overlap(this.player, this.keyGroup, (player, key) => {
      key.disableBody(true, true);

      if (this.keyCount < 3) {
        this.keyIcons[this.keyCount].setAlpha(1);
      }

      this.keyCount++;

      if (this.keyCount === 3) {
        this.openDoor(); // Alleen deur openen!
      }
    });

    // Naam van de speler linksboven tonen
    this.playerNameText = this.add.text(100, 100, ` Name: ${this.playerName}`, {
      fontSize: '28px',
      fill: '#ffffff' // wit
    });

    // Levensharten naast naam
    this.hearts = [];
    const startX = 100 + this.playerNameText.width + 20;
    const startY = 100 + this.playerNameText.height / 2;
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(startX + i * 40, startY, 'heart').setScale(0.025).setOrigin(0, 0.5);
      this.hearts.push(heart);
    }

    // Speler raakt de deur (alleen als alle sleutels zijn verzameld)
    this.physics.add.overlap(this.player, this.door, () => {
      if (this.keyCount === 3) {
        // Ga naar het win-scherm
        this.scene.start('wonScene', {
          character: this.selectedCharacter,
          playerName: this.playerName
        });
      }
    });
  }

  // Deur openen (tegel veranderen)
  openDoor() {
    console.log("Alle sleutels verzameld! Deur gaat open.");
    this.door.forEachTile(tile => {
      if (tile.index === 12) {
        tile.index = 196; // Of jouw open-deur tile index
      }
    });
    // NIET van scene wisselen hier!
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
    for (let i = 0; i < this.hearts.length; i++) {
      this.hearts[i].x = this.player.x - ((this.hearts.length - 1) * spacing) / 2 + i * spacing;
      this.hearts[i].y = this.player.y - offsetY;
    }

    // Zet de naam boven de hearts
    if (this.playerNameText) {
      this.playerNameText.x = this.player.x - this.playerNameText.width / 2;
      this.playerNameText.y = this.player.y - offsetY - 50; // 50 pixels boven de hearts
    }
  }

  // Afhandelen als speler lava raakt
  hitLava(drap) {
    if (this.invulnerable) return; // Niet opnieuw raken als je tijdelijk onkwetsbaar bent
    this.invulnerable = true;

    drap.destroy(); // Druppel verdwijnt
    this.lives--;   // Leven eraf
    let lostHeart = this.hearts.pop();
    if (lostHeart) lostHeart.destroy();

    this.player.setTint(0xff0000); // Speler rood kleuren

    if (this.lives <= 0) {
      // Als levens op zijn: restart scene (hier kun je ook naar loseScene gaan)
      this.time.delayedCall(500, () => {
        this.scene.restart();
      });
    } else {
      // Anders: na 1 seconde weer kwetsbaar en kleur terug
      this.time.delayedCall(1000, () => {
        this.invulnerable = false;
        this.player.clearTint();
      });
    }
  }
}