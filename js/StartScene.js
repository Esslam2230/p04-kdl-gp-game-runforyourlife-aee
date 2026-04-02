export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene'); // Scene key
  }

  preload() {
    this.load.audio('startSound', 'music/start-screen.mp3'); // Laad achtergrondmuziek
    this.load.image('background', 'assets/Backround-startscreen.png'); // Achtergrondafbeelding
    this.load.image('soundOn', 'assets/sound-on.png');    // Geluid aan icoon
    this.load.image('soundOff', 'assets/sound-off.png');  // Geluid uit icoon
  }

  create() {

    // Achtergrondafbeelding plaatsen
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2 - 100;

    // Titeltekst als container met 3 delen (RUN4, YOUR, LIFE!!)
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

    // Schaduw toevoegen aan alle titelteksten
    [runText, yourText, lifeText].forEach(text => {
      text.setShadow(2, 2, '#000000', 4, false, true);
    });

    // Voeg alle tekst toe aan de container en centreer
    titleContainer.add([runText, yourText, lifeText]);
    titleContainer.setSize(runText.width + yourText.width + lifeText.width, runText.height);
    titleContainer.setPosition(centerX - titleContainer.width / 2, centerY);

    // Animatie voor de titel (op en neer bewegen)
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

    // Hover-effect voor start knop
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

    // Start het spel bij klik op start
    startText.on('pointerdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
      this.scene.start('ChooseCharacterScene');
    });

    // Hover-effect voor rules knop
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

    // Ga naar regels bij klik op rules
    rulesText.on('pointerdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
      this.scene.start('RulesScene');
    });

    // Stop eventueel startSound als scene sluit (voor de zekerheid)
    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Achtergrondmuziek (loop)
    this.music = this.sound.add('startSound', { loop: true, volume: 0.5 });
    this.music.play();

    // Stop muziek als scene sluit
    this.events.on('shutdown', () => {
      if (this.music && this.music.isPlaying) {
        this.music.stop();
      }
    });

    // Geluid icoon rechtsonder, klikbaar om muziek aan/uit te zetten
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
}