export class ChooseCharacterScene extends Phaser.Scene {
  constructor() {
    super('ChooseCharacterScene'); // Scene key
  }

  preload() {
    // Laad de sprites voor de karakters
    this.load.spritesheet('boy', 'assets/boy.png', { frameWidth: 48, frameHeight: 48 }); 
    this.load.spritesheet('girl', 'assets/girl.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    // Laad de achtergrondafbeelding
    this.load.image('castle', 'assets/chooseYourCharacter.png');
    // Laad het achtergrondgeluid
    this.load.audio('schoose', 'music/choose.mp3');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Voeg castle background toe, vult het hele scherm
    this.add.image(0, 0, 'castle').setOrigin(0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Titeltekst bovenaan het scherm
    this.add.text(centerX, 100, 'Choose your character', {
      fontSize: '70px',
      fill: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5);

    // Laat de jongen zien, links van het midden, klikbaar
    const boy = this.add.image(centerX - 200, centerY - -50, 'boy')
      .setInteractive()
      .setScale(6.5);
    boy.on('pointerdown', () => {
      this.startGame('boy'); // Start spel met jongen
    });

    // Laat het meisje zien, rechts van het midden, klikbaar
    const girl = this.add.image(centerX + 200, centerY - -50, 'girl')
      .setInteractive()
      .setScale(6.5);
    girl.on('pointerdown', () => {
      this.startGame('girl'); // Start spel met meisje
    });

    // Stop eventueel startSound als scene sluit (voor de zekerheid)
    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Speel achtergrondmuziek in een loop
    this.music = this.sound.add('schoose', { loop: true, volume: 0.5 });
    this.music.play();

    // Stop muziek als scene sluit
    this.events.on('shutdown', () => {
      if (this.music && this.music.isPlaying) {
        this.music.stop();
      }
    });

    // Voeg een geluid-icoon toe rechtsonder, klikbaar om muziek te pauzeren/hervatten
    this.soundIcon = this.add.image(this.cameras.main.width - 60, this.cameras.main.height - 70, 'soundOn')
      .setScale(0.25)
      .setInteractive();

    this.soundOn = true; // Houdt bij of muziek aan staat

    // Klik op het icoon om muziek aan/uit te zetten
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

  // Start de volgende scene en geef het gekozen karakter door
  startGame(character) {
    this.scene.start('ChooseNameScene', { character });
  }
}
