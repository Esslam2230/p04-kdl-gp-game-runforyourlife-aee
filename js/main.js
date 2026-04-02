
import { StartScene } from '/js/startScene.js';
import { RulesScene } from '/js/rulesScene.js';
import { ChooseCharacterScene } from '/js/chooseCharacterScene.js';
import { ChooseNameScene } from '/js/chooseNameScene.js';
import { theForest } from '/js/theForest.js';
import { intro } from '/js/intro.js';
import { thePyramid } from '/js/thePyramid.js';
import { fireIntro } from '/js/fireIntro.js';
import { theFire } from '/js/theFire.js';
import { loseScene } from '/js/loseScene.js';
import { wonScene } from '/js/wonScene.js'; // Zorg ervoor dat je deze scene ook hebt gedefinieerd




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
      gravity: { y: 300 }, // pas dit aan naar wens
      debug: false
    }
  },
  scene: [StartScene, RulesScene, ChooseCharacterScene, ChooseNameScene, theForest, intro, thePyramid, fireIntro, theFire, loseScene, wonScene]
};


const game = new Phaser.Game(config);
