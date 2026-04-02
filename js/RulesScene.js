export class RulesScene extends Phaser.Scene {
  constructor() {
    super('RulesScene'); // Scene key
  }

  preload() {
    this.load.audio('rulesSound', 'music/rules.mp3'); // Laad achtergrondmuziek
    this.load.image('background', 'assets/Backround-startscreen.png'); // Laad achtergrondafbeelding
  }

  create() {
    // Achtergrondafbeelding plaatsen
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    const centerX = this.cameras.main.width / 2;

    // Titeltekst bovenaan
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

    // Regels tekst tonen
    this.add.text(centerX, 200, rulesText, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Irish Grover',
      align: 'center',
      wordWrap: { width: 900 },
    }).setOrigin(0.5, 0);

    // Terugknop maken
    const backButton = this.add.text(centerX, 550, 'Terug', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Irish Grover',
      backgroundColor: '#00000088',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive();

    // Hover-effect voor terugknop
    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#ffffff33' });
    });

    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#00000088' });
    });

    // Klik op terugknop: ga naar StartScene
    backButton.on('pointerdown', () => {
      console.log('Back button clicked');
      this.scene.start('StartScene');
    });

    // Stop eventueel startSound als scene sluit (voor de zekerheid)
    this.events.on('shutdown', () => {
      if (this.startSound && this.startSound.isPlaying) {
        this.startSound.stop();
      }
    });

    // Achtergrondmuziek (loop)
    this.music = this.sound.add('rulesSound', { loop: true, volume: 0.5 });
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
}