export class intro extends Phaser.Scene {
  constructor() {
    super({ key: 'intro' }); // Scene key
  }

  preload() {
    this.load.image('pyramidBg', 'assets/introPyramid.png'); // Laad achtergrondafbeelding
    this.load.audio('introMusic', 'assets/intro.mp3'); // Laad achtergrondmuziek
  }

  init(data) {
    this.selectedCharacter = data.character; // Gekozen karakter uit vorige scene
    this.playerName = data.playerName;       // Gekozen naam uit vorige scene
    this.lives = data.lives || 3;            // Aantal levens, standaard 3
  }

  create() {

    // Toon de naam van de speler linksboven
    this.add.text(100, 100, `Naam: ${this.playerName}`, {
      fontSize: '32px',
      fill: '#fff'
    });

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Zet de achtergrondafbeelding in het midden en schaal hem naar het scherm
    const bg = this.add.image(centerX, centerY, 'pyramidBg').setOrigin(0.5);
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Titel van het level, gecentreerd bovenaan
    this.add.text(centerX, centerY - 140, 'Level 2: The Pyramid', {
      fontSize: '112px',
      fill: '#ffffff',
      fontFamily: 'Griffy',
    }).setOrigin(0.5);

    // Uitlegtekst, gecentreerd
    this.add.text(centerX, centerY - 30, 'Ontwijk de farao en verzamel de driekhoek', {
      fontSize: '67px',
      fill: '#cde13a',
      fontFamily: 'Irish Grover',
    }).setOrigin(0.5);

    // Knop om naar het volgende level te gaan
    const button = this.add.text(centerX, centerY + 300, 'Ga naar volgende level', {
      fontSize: '70px',
      color: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5).setInteractive();

    // Hover-effect voor de knop
    button.on('pointerover', () => {
      button.setStyle({ color: '#e0ff00' });
    });

    button.on('pointerout', () => {
      button.setStyle({ color: '#ffffff' });
    });

    // Klik op knop: ga naar de volgende scene
    button.on('pointerdown', () => {
      this.scene.start('thePyramid', {
        character: this.selectedCharacter,
        playerName: this.playerName
      });
    });
    
    // Toon het juiste aantal hartjes linksboven
    this.hearts = [];
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(50 + (i * 50), 50, 'heart') // Gebruik de juiste key!
        .setScrollFactor(0)
        .setScale(0.05);
      this.hearts.push(heart);
    }

    // Speel achtergrondmuziek (herhalend)
    this.bgMusic = this.sound.add('introMusic', { loop: true, volume: 1 });
    this.bgMusic.play();
  }
}