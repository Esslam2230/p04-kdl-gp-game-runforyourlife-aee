let chosenCharacter; // De speler
let platforms; // Groep met alle platforms
let cursors; // Cursor toetsen (links, rechts, omhoog)
let bananaForest; // Groep met bananen
let platformForest; // Specifiek platform onderaan

export class theForest extends Phaser.Scene {
  constructor() {
    super('theForest');
  }

  preload() {
    this.load.image('heart', 'assets/heart.png');
    this.load.image('Background_forest', 'assets/Background_forest.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('catch_banana', 'assets/catch_banana.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('bgMusic', 'music/forest_bg_music.mp3');
    this.load.spritesheet('girl', 'assets/girl.png', {
      frameWidth: 48,
      frameHeight: 48
    });
  }

  init(data) {
    this.selectedCharacter = data.character;
    this.playerName = data.playerName || 'No name';
    this.lives = 3;
  }

  create() {
    const bg = this.add.image(0, 0, 'Background_forest').setOrigin(0, 0);
    const scaleX = this.cameras.main.width / bg.width;
    const scaleY = this.cameras.main.height / bg.height;
    bg.setScale(scaleX, scaleY);

    this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
    this.bgMusic.play();

    platforms = this.physics.add.staticGroup();
    platformForest = platforms.create(0, 700, 'platform')
      .setOrigin(0, 0)
      .setScale(this.cameras.main.width / 300, 0.5)
      .refreshBody();
    platforms.create(650, 200, 'platform');
    platforms.create(400, 500, 'platform');
    platforms.create(1340, 390, 'platform');

    this.add.text(20, 20, 'Objective: Verzamel alle bananen!', {
      fontSize: '24px',
      fill: '#FF00FF',
      fontWeight: 'bold'
    });

    bananaForest = this.physics.add.group({
      key: 'catch_banana',
      repeat: 11,
      setXY: { x: 12, y: 100, stepX: 70 }
    });

    bananaForest.children.iterate(child => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setScale(0.06);
    });

    this.physics.add.collider(bananaForest, platforms);

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

    chosenCharacter = this.physics.add.sprite(100, 300, 'girl');
    chosenCharacter.setBounce(0.2);
    chosenCharacter.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(chosenCharacter, platforms);
    this.physics.add.collider(chosenCharacter, platformForest);

    this.physics.add.overlap(chosenCharacter, bananaForest, this.collectBanana, null, this);

    this.add.text(100, 50, `Character: ${this.selectedCharacter}`, {
      fontSize: '32px',
      fill: '#fff'
    });

    this.playerNameText = this.add.text(100, 100, `Player name: ${this.playerName}`, {
      fontSize: '28px',
      fill: '#0f0'
    });

    this.lives = 3;
    this.hearts = [];
    const startX = 100 + this.playerNameText.width + 20;
    const startY = 100 + this.playerNameText.height / 2;

    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(startX + i * 40, startY, 'heart').setScale(0.025).setOrigin(0, 0.5);
      this.hearts.push(heart);
    }
  }

  update() {
    if (cursors.left.isDown) {
      chosenCharacter.setVelocityX(-160);
      chosenCharacter.anims.play('left', true);
    } else if (cursors.right.isDown) {
      chosenCharacter.setVelocityX(160);
      chosenCharacter.anims.play('right', true);
    } else {
      chosenCharacter.setVelocityX(0);
      chosenCharacter.anims.play('turn');
    }

    if (cursors.up.isDown && chosenCharacter.body.touching.down) {
      chosenCharacter.setVelocityY(-500);
    }
  }
  //zodra alles is verzameld ga je door naar de volgende level
  collectBanana(player, banana) {
    banana.disableBody(true, true);

    if (bananaForest.countActive(true) === 0) {
      // Alle bananen verzameld, ga naar water level
      this.bgMusic.stop();
      this.scene.start('intro', {
        character: this.selectedCharacter,
        playerName: this.playerName
      });
    }
  }
}