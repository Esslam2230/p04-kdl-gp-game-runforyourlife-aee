export class ChooseNameScene extends Phaser.Scene {
  constructor() {
    super('ChooseNameScene');
  }

  init(data) {
    this.selectedCharacter = data.character; // Gekozen karakter uit vorige scene
  }

  preload() {
    this.load.audio('name', 'music/name.mp3'); // Laad achtergrondmuziek
    this.load.image('castleInterior', 'assets/chooseYourName.png'); // Laad achtergrondafbeelding
  }

  create() {
    const { width, height } = this.cameras.main;

    // Zet achtergrondafbeelding neer
    this.add.image(0, 0, 'castleInterior').setOrigin(0, 0).setDisplaySize(width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Titeltekst
    this.add.text(centerX, 100, 'Enter your name:', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5);

    // HTML input veld voor naam
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

    // Hover-effect voor knop
    submitButton.on('pointerover', () => {
      submitButton.setStyle({ backgroundColor: '#ffffff33' });
    });

    submitButton.on('pointerout', () => {
      submitButton.setStyle({ backgroundColor: '#000000aa' });
    });

    // Klik op knop: check naam, verwijder input, ga naar volgende scene
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

    // Stop eventueel startSound als scene sluit (voor de zekerheid)
    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Achtergrondmuziek (loop)
    this.music = this.sound.add('name', { loop: true, volume: 0.5 });
    this.music.play();

    // Stop muziek als scene sluit
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

  // Zorg dat het inputveld wordt verwijderd als de scene sluit
  shutdown() {
    if (this.nameInput) {
      this.nameInput.remove();
    }
  }
}