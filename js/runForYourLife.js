// Start scene dat is de begin scherm
class startScene extends Phaser.Scene {
  constructor() {
    super('startScene');
  }

  preload() {
    this.load.audio('startSound', 'music/start-screen.mp3'); // Start geluid
    this.load.image('background', 'assets/Backround-startscreen.png');
    this.load.image('soundOn', 'assets/sound-on.png');    // Geluid aan icoon
    this.load.image('soundOff', 'assets/sound-off.png');  // Geluid uit icoon
  }

  create() {

    // Achtergrondafbeelding
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2 - 100;

    // Titeltekst
    const titleContainer = this.add.container(centerX, centerY);

    const runText = this.add.text(0, 0, 'RUN4', {
      fontSize: '112px',
      fontFamily: 'Griffy',
      color: '#8B0000'
    });

    const yourText = this.add.text(runText.width, 0, 'YOUR', {
      fontSize: '112px',
      fontFamily: 'Griffy',
      color: '#e0ff00 '
    });

    const lifeText = this.add.text(runText.width + yourText.width, 0, 'LIFE!!', {
      fontSize: '112px',
      fontFamily: 'Griffy',
      color: '#006400'
    });

    [runText, yourText, lifeText].forEach(text => {
      text.setShadow(2, 2, '#000000', 4, false, true);
    });

    titleContainer.add([runText, yourText, lifeText]);
    titleContainer.setSize(runText.width + yourText.width + lifeText.width, runText.height);
    titleContainer.setPosition(centerX - titleContainer.width / 2, centerY);

    this.tweens.add({
      targets: titleContainer,
      y: centerY - 60,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Start knop
    const startText = this.add.text(centerX, centerY + 200, 'Start', {
      fontSize: '70px',
      color: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5).setInteractive();

    // Rules knop
    const rulesText = this.add.text(centerX, centerY + 300, 'Rules', {
      fontSize: '70px',
      color: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5).setInteractive();

    startText.on('pointerover', () => {
      startText.setStyle({ fill: '#ff0000' });
      runText.setColor('#FF4C4C');
      yourText.setColor('#cde13a ');
      lifeText.setColor('#33CC33');
    });

    startText.on('pointerout', () => {
      startText.setStyle({ fill: '#ffffff' });
      runText.setColor('#8B0000');
      yourText.setColor('#e0ff00 ');
      lifeText.setColor('#006400');
    });

    startText.on('pointerdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
      this.scene.start('chooseYourCharacter');
    });

    rulesText.on('pointerover', () => {
      rulesText.setStyle({ fill: '#ff0000' });
      runText.setColor('#FF4C4C');
      yourText.setColor('#cde13a ');
      lifeText.setColor('#33CC33');
    });

    rulesText.on('pointerout', () => {
      rulesText.setStyle({ fill: '#ffffff' });
      runText.setColor('#8B0000');
      yourText.setColor('#e0ff00 ');
      lifeText.setColor('#006400');
    });

    rulesText.on('pointerdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
      this.scene.start('rulesScene');
    });

    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Achtergrondmuziek (loop)
    this.music = this.sound.add('startSound', { loop: true, volume: 0.5 });
    this.music.play();

    this.events.on('shutdown', () => {
      if (this.music && this.music.isPlaying) {
        this.music.stop();
      }
    });

    // Geluid icoon rechtsonder, klikbaar om geluid aan/uit te zetten
    this.soundIcon = this.add.image(this.cameras.main.width - 60, this.cameras.main.height - 70, 'soundOn')
      .setScale(0.25)
      .setInteractive();

    this.soundOn = true;

    this.soundIcon.on('pointerdown', () => {
      if (this.soundOn) {
        this.music.pause();
        this.soundIcon.setTexture('soundOff');
        this.soundOn = false;
      } else {
        this.music.resume();
        this.soundIcon.setTexture('soundOn');
        this.soundOn = true;
      }
    });
  }
}


//Rules scene
class rulesScene extends Phaser.Scene {
  constructor() {
    super('rulesScene');
  }

  preload() {
    this.load.audio('rulesSound', 'music/rules.mp3'); // Geluid voor regels
    this.load.image('background', 'assets/Backround-startscreen.png');
  }

  create() {
    // Achtergrond
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    const centerX = this.cameras.main.width / 2;

    // Titel
    this.add.text(centerX, 130, 'Spelregels', {
      fontSize: '64px',
      color: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5);

    // Regels tekst
    const rulesText =
      '1. Kies een personage en geef je held(in) een naam.\n' +
      '2. Je bestuurt je personage met de pijltjestoetsen op je toetsenbord.\n' +
      '3. Er zijn 3 levels: Bos, sahara en lava.\n' +
      '4. In elk level moet je 3 sleutels verzamelen om naar het volgende level te gaan.\n' +
      '5. Let goed op de obstakels en vijanden, want je moet ze vermijden om geen leven te verliezen.\n' +
      '6. Je hebt 3 levens.Als je al je levens kwijt bent, moet je opnieuw beginnen.';


    this.add.text(centerX, 200, rulesText, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Irish Grover',
      align: 'center',
      wordWrap: { width: 900 },
    }).setOrigin(0.5, 0);

    // Terugknop
    const backButton = this.add.text(centerX, 550, 'Terug', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Irish Grover',
      backgroundColor: '#00000088',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive();

    //  this.music = this.sound.add('rulesSound', { loop: true, volume: 0.5 });
    // this.music.play();

    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#ffffff33' });
    });

    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#00000088' });
    });


    backButton.on('pointerdown', () => {
      console.log('Back button clicked');
      this.scene.start('startScene');
    });



    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Achtergrondmuziek (loop)
    this.music = this.sound.add('rulesSound', { loop: true, volume: 0.5 });
    this.music.play();

    this.events.on('shutdown', () => {
      if (this.music && this.music.isPlaying) {
        this.music.stop();
      }
    });

    // Geluid icoon rechtsonder, klikbaar om geluid aan/uit te zetten
    this.soundIcon = this.add.image(this.cameras.main.width - 60, this.cameras.main.height - 70, 'soundOn')
      .setScale(0.25)
      .setInteractive();

    this.soundOn = true;

    this.soundIcon.on('pointerdown', () => {
      if (this.soundOn) {
        this.music.pause();
        this.soundIcon.setTexture('soundOff');
        this.soundOn = false;
      } else {
        this.music.resume();
        this.soundIcon.setTexture('soundOn');
        this.soundOn = true;
      }
    });


  }
}


// Scene waar je character kiest
class chooseYourCharacter extends Phaser.Scene {
  constructor() {
    super('chooseYourCharacter');
  }
  // Dit load the characters
  preload() {
    this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('girl', 'assets/girl.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.image('castle', 'assets/chooseYourCharacter.png');
    this.load.audio('schoose', 'music/choose.mp3'); // Geluid voor regels
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Voeg castle background toe
    this.add.image(0, 0, 'castle').setOrigin(0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Tekst choose your character
    this.add.text(centerX, 100, 'Choose your character', {
      fontSize: '70px',
      fill: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5);

    // Laat de man zien
    const boy = this.add.image(centerX - 200, centerY - -50, 'boy')
      .setInteractive()
      .setScale(6.5);
    boy.on('pointerdown', () => {
      this.startGame('boy');
    });

    // Laat de vrouw zien
    const girl = this.add.image(centerX + 200, centerY - -50, 'girl')
      .setInteractive()
      .setScale(6.5);
    girl.on('pointerdown', () => {
      this.startGame('girl');
    });



    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Achtergrondmuziek (loop)
    this.music = this.sound.add('schoose', { loop: true, volume: 0.5 });
    this.music.play();

    this.events.on('shutdown', () => {
      if (this.music && this.music.isPlaying) {
        this.music.stop();
      }
    });

    // Geluid icoon rechtsonder, klikbaar om geluid aan/uit te zetten
    this.soundIcon = this.add.image(this.cameras.main.width - 60, this.cameras.main.height - 70, 'soundOn')
      .setScale(0.25)
      .setInteractive();

    this.soundOn = true;

    this.soundIcon.on('pointerdown', () => {
      if (this.soundOn) {
        this.music.pause();
        this.soundIcon.setTexture('soundOff');
        this.soundOn = false;
      } else {
        this.music.resume();
        this.soundIcon.setTexture('soundOn');
        this.soundOn = true;
      }
    });
  }

  startGame(character) {
    this.scene.start('chooseYourName', { character });
  }
}

class chooseYourName extends Phaser.Scene {
  constructor() {
    super('chooseYourName');
  }

  init(data) {
    this.selectedCharacter = data.character;
  }

  preload() {
    this.load.audio('name', 'music/name.mp3'); // Geluid voor regels
    this.load.image('castleInterior', 'assets/chooseYourName.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Gebruik afbeelding als achtergrond
    this.add.image(0, 0, 'castleInterior').setOrigin(0, 0).setDisplaySize(width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    this.add.text(centerX, 100, 'Enter your name:', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5);
    config
    // HTML input veld
    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = 'Your name here';
    this.nameInput.style.position = 'absolute';
    this.nameInput.style.top = (this.game.canvas.offsetTop + centerY) + 'px';
    this.nameInput.style.left = (this.game.canvas.offsetLeft + centerX - 150) + 'px';
    this.nameInput.style.width = '300px';
    this.nameInput.style.fontSize = '24px';
    this.nameInput.style.padding = '10px';
    this.nameInput.style.border = '2px solid white';
    this.nameInput.style.borderRadius = '8px';
    this.nameInput.style.background = '#11111188'; // doorzichtig donker

    document.body.appendChild(this.nameInput);
    this.nameInput.focus();

    // Start-knop
    const submitButton = this.add.text(centerX, centerY + 125, 'Start Game', {
      fontSize: '40px',
      fill: '#ffffff',
      fontFamily: 'Irish Grover',
      backgroundColor: '#000000aa',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive();

    submitButton.on('pointerover', () => {
      submitButton.setStyle({ backgroundColor: '#ffffff33' });
    });

    submitButton.on('pointerout', () => {
      submitButton.setStyle({ backgroundColor: '#000000aa' });
    });

    submitButton.on('pointerdown', () => {
      const playerName = this.nameInput.value.trim();
      if (playerName.length > 0) {
        this.nameInput.remove();
        this.scene.start('theForest', {
          character: this.selectedCharacter,
          playerName
        });
      } else {
        alert('Please enter a name!');
      }
    });



    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Achtergrondmuziek (loop)
    this.music = this.sound.add('name', { loop: true, volume: 0.5 });
    this.music.play();

    this.events.on('shutdown', () => {
      if (this.music && this.music.isPlaying) {
        this.music.stop();
      }
    });

    // Geluid icoon rechtsonder, klikbaar om geluid aan/uit te zetten
    this.soundIcon = this.add.image(this.cameras.main.width - 60, this.cameras.main.height - 70, 'soundOn')
      .setScale(0.25)
      .setInteractive();

    this.soundOn = true;

    this.soundIcon.on('pointerdown', () => {
      if (this.soundOn) {
        this.music.pause();
        this.soundIcon.setTexture('soundOff');
        this.soundOn = false;
      } else {
        this.music.resume();
        this.soundIcon.setTexture('soundOn');
        this.soundOn = true;
      }
    });
  }


  shutdown() {
    if (this.nameInput) {
      this.nameInput.remove();
    }
  }
}




let chosenCharacter; // De speler
let platforms; // Groep met alle platforms
let cursors; // Cursor toetsen (links, rechts, omhoog)
let bananaForest; // Groep met bananen
let platformForest; // Specifiek platform onderaan

class theForest extends Phaser.Scene {
  constructor() {
    super('theForest'); // Naam van de scene
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
      this.scene.start('thePyramide', {
        character: this.selectedCharacter,
        playerName: this.playerName
      });
    }
  }
}



class thePyramide extends Phaser.Scene {
  constructor() {
    super({ key: 'thePyramide' });
    this.lives = 3;
    this.score = 0;
    this.pharaohEnemies = [];
    this.illObjects = [];
    this.lifeHearts = [];
    this.uiHearts = [];
    this.hasKey = false;
  }

  preload() {
    this.load.image('spritesheet', 'tiled/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'tiled/E-level.json');
    this.load.image('ill-level2', 'assets/ill-level2.png');
    this.load.image('pharaoh', 'assets/pharaoh.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('key', 'assets/key.png');
    this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 32, frameHeight: 48 });
  }

  init(data) {
    this.selectedCharacter = data.character;
    this.playerName = data.playerName || 'No name';
    this.lives = 3;
  }

  create() {
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

    this.player = this.physics.add.sprite(10, 800, 'girl');
    this.player.setBounce(0.2).setCollideWorldBounds(true);
    this.physics.add.collider(this.groundLayer, this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
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

    // Farao's
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

    // Ill-objecten
    this.illObjects = [];
    for (let pos of illPositions) {
      let ill = this.physics.add.staticImage(pos.x, pos.y, 'ill-level2').setScale(0.15);
      ill.refreshBody();
      this.illObjects.push(ill);
      this.physics.add.overlap(this.player, ill, this.eatIll, null, this);
    }

    // Sleutel
    this.key = this.physics.add.staticImage(3820, 240, 'key').setScale(0.15);
    this.key.setVisible(false);
    this.key.body.enable = false;
    this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);

    // Overlap tussen speler en deur
    this.physics.add.overlap(this.player, this.doorLayer, (player, tile) => {
      if (this.hasKey) {
        this.scene.start('theFire', {
          character: this.selectedCharacter,
          playerName: this.playerName
        });
      }
    });
  }

  update() {
    if (!this.player || !this.cursors) return;

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
      this.resetGame();
    } else {
      // Zet speler kort onkwetsbaar (bijv. 1 seconde)
      this.player.setTint(0xff0000);
      this.time.delayedCall(1000, () => {
        this.invulnerable = false;
        this.player.clearTint();
      });
    }
  }

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

  collectKey(player, keyObj) {
    this.hasKey = true;
    keyObj.destroy();
    console.log('Sleutel gepakt!');
  }

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



//AMINA
class theFire extends Phaser.Scene {
  constructor() {
    super({ key: 'theFire' });
    this.lives = 3;
    this.hearts = [];
    this.invulnerable = false;
    this.selectedCharacter = 'girl';
  }


  init(data) {
    this.selectedCharacter = data.character;
    this.playerName = data.playerName; // altijd verplicht
  }

  preload() {
    this.load.image('spritesheet', 'tiled/spritesheet.png');
    this.load.tilemapTiledJSON('map', 'tiled/level3.json');
    this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 48, frameHeight: 48 });
    this.load.image('grah', 'assets/grah.png');
    this.load.image('drap', 'assets/drap.png');
    this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 48, frameHeight: 48 });
    this.load.image('keyIcon', 'assets/keyIcon.png');
    this.load.image('key', 'assets/key3.png');
    this.load.image('heart', 'assets/heart.png');
  }

  create() {
    // === TILEMAP ===
    this.map = this.make.tilemap({ key: 'map' });
    const tileset = this.map.addTilesetImage('spritesheet', 'spritesheet');
    this.sky = this.map.createLayer('lucht', tileset, 0, 0);
    this.lava = this.map.createLayer('lava', tileset, 0, 0);
    this.big = this.map.createLayer('big', tileset, 0, 0);
    this.ground = this.map.createLayer('grond', tileset, 0, 0);
    this.ground.setCollisionByExclusion([-1]);
    this.door = this.map.createLayer('deur', tileset, 0, 0);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.ground.width, this.ground.height);

    // === SPELER ===
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
    this.lives = 3;

    const grahPositions = [
      { x: 650, y: 200 },
      { x: 100, y: 10 },
      { x: 1100, y: 10 }
    ];

    grahPositions.forEach(pos => {
      const grah = this.physics.add.staticSprite(pos.x, pos.y, 'grah');
      grah.setScale(0.2);
      grah.setAngle(104);
      this.grahGroup.add(grah);
    });

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

    this.physics.add.overlap(this.player, this.drapGroup, (player, drap) => {
      this.hitLava(drap);
    });

    // === SLEUTELS ===
    this.keyGroup = this.physics.add.staticGroup();
    this.keyIcons = [];
    this.keyCount = 0;

    const keyPositions = [
      { x: 600, y: 35 },
      { x: 700, y: 35 },
      { x: 1550, y: 35 }
    ];

    keyPositions.forEach(pos => {
      const key = this.keyGroup.create(pos.x, pos.y, 'key');
      key.setScale(0.2);
      key.refreshBody();
    });

    for (let i = 0; i < 3; i++) {
      const icon = this.add.image(50 + i * 40, 50, 'keyIcon')
        .setScrollFactor(0)
        .setScale(0.2)
        .setAlpha(0.3);
      this.keyIcons.push(icon);
    }

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

    // Toon spelernaam linksboven
    this.playerNameText = this.add.text(100, 100, ` Name: ${this.playerName}`, {
      fontSize: '28px',
      fill: '#000000' // zwart
    });

    // Levensharten naast naam
    this.lives = 3;
    this.hearts = [];
    const startX = 100 + this.playerNameText.width + 20;
    const startY = 100 + this.playerNameText.height / 2;
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(startX + i * 40, startY, 'heart').setScale(0.025).setOrigin(0, 0.5);
      this.hearts.push(heart);
    }

    this.physics.add.overlap(this.player, this.door, () => {
      if (this.keyCount === 3) {
        // Ga naar een eindscherm of laat een win-tekst zien
        this.scene.start('endScene', {
          character: this.selectedCharacter,
          playerName: this.playerName
        });
      }
    });




  }

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

  hitLava(drap) {
    if (this.invulnerable) return;
    this.invulnerable = true;

    drap.destroy();
    this.lives--;
    let lostHeart = this.hearts.pop();
    if (lostHeart) lostHeart.destroy();

    this.player.setTint(0xff0000);

    if (this.lives <= 0) {
      this.time.delayedCall(500, () => {
        this.scene.restart();
      });
    } else {
      this.time.delayedCall(1000, () => {
        this.invulnerable = false;
        this.player.clearTint();
      });
    }
  }
}



const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
  scene: [startScene, rulesScene, chooseYourCharacter, chooseYourName, theForest, thePyramide, theFire]
};

const game = new Phaser.Game(config);