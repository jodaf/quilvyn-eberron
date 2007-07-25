/*
Copyright 2005, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/*
 * This module loads the rules from the Eberron campaign setting.  The Eberron
 * function contains methods that load rules for Eberron-specific races, base
 * classes, prestige classes, and feats.  These member methods can be called
 * independently in order to use a subset of the Eberron rules.  Similarly, the
 * constant fields of Eberron (CLASSES, FEATS, etc.) can be thined to limit the
 * user's choices.
 */
function Eberron() {
  Eberron.classRules(PH35.rules, Eberron.CLASSES);
  Eberron.featRules(PH35.rules, Eberron.FEATS, Eberron.SUBFEATS);
  Eberron.prestigeClassRules(PH35.rules, Eberron.PRESTIGE_CLASSES);
  Eberron.raceRules(PH35.rules, Eberron.RACES);
  Eberron.magicRules(rules, Eberron.DOMAINS, Eberron.SPELLS);
}

Eberron.CLASSES = ['Artificer'];
Eberron.DOMAINS = [
  'Artifice:Ar', 'Charm:Cm', 'Commerce:Cc', 'Community:Co', 'Deathless:Dl',
  'Decay:Dy', 'Dragon Below:Db', 'Exorcism:Ex', 'Feast:Fe', 'Life:Li',
  'Madness:Md', 'Meditation:Mt', 'Necromancer:Ne', 'Passion:Pa', 'Shadow:Sh',
  'Weather:We'
];
Eberron.FEATS = [
  'Aberrant Dragonmark', 'Action Boost', 'Action Surge',
  'Adamantine Body:Warforged', 'Ashbound', 'Attune Magic Weapon:Item Creation',
  'Beast Shape', 'Beast Totem', 'Beasthide Elite:Shifter',
  'Bind Elemental:Item Creation', 'Child Of Winter', 'Cliffwalk Elite:Shifter',
  'Double Steel Strike', 'Dragon Rage', 'Dragon Totem', 'Ecclesiarch',
  'Education', 'Exceptional Artisan:Item Creation', 'Extend Rage',
  'Extra Music', 'Extra Rings:Item Creation', 'Extra Shifter Trait:Shifter',
  'Extraordinary Artisan:Item Creation', 'Favored In House', 'Flensing Strike',
  'Gatekeeper Initiate', 'Great Bite:Shifter', 'Great Rend:Shifter',
  'Greater Dragonmark', 'Greater Powerful Charge',
  'Greater Shifter Defense:Shifter', 'Greensinger Initiate', 'Haunting Melody',
  'Healing Factor:Shifter', 'Heroic Spirit',
  'Improved Damage Reduction:Warforged', 'Improved Fortification:Warforged',
  'Improved Natural Attack', 'Investigate', 'Knight Training',
  'Least Dragonmark', 'Legendary Artisan:Item Creation', 'Lesser Dragon Mark',
  'Longstride Elite:Shifter', 'Mithral Body:Warforged',
  'Mithrl Fluidity:Warforged', 'Monastic Training', 'Music Of Growth',
  'Music Of Making', 'Powerful Charge', 'Precise Swing', 'Pursue',
  'Raging Luck', 'Recognize Impostor', 'Repel Aberration', 'Research',
  'Right Of Counsel', 'Serpent Strike', 'Shifter Defense:Shifter',
  'Shifter Ferocity:Shifter', 'Shifter Multiattack:Shifter', 'Silver Smite',
  'Song Of The Heart', 'Soothe The Beast', 'Spontaneous Casting',
  'Strong Mind', 'Totem Companion', 'Undead Empathy', 'Urban Tracking',
  'Vermin Companion', 'Vermin Shape', 'Wand Mastery', 'Warden Initiate',
  'Whirling Steel Strike'
];
Eberron.PRESTIGE_CLASSES = [
  'Dragonmark Heir', 'Eldeen Ranger', 'Exorcist Of The Silver Flame',
  'Extreme Explorer', 'Heir Of Siberys', 'Master Inquisitive',
  'Warforged Juggernaut', 'Weretouched Master'
];
Eberron.RACES = [
  'Changeling', 'Kalashtar', 'Shifter', 'Warforged'
];
Eberron.SPELLS = [
  'Align Weapon:I2',
  'Armor Enhancement:I2/Transmutation',
  'Bear\'s Endurance:I2',
  'Blade Barrier:I6',
  'Bolts Of Bedevilment:Md2/Enchantment',
  'Bull\'s Strength:I2',
  'Cat\'s Grace:I2',
  'Chill Metal:I2',
  'Construct Energy Ward:I3/Abjuration',
  'Control Deathless:Dl7/Necromancy',
  'Create Deathless:Dl6/Necromancy',
  'Create Greater Deathless:Dl8/Necromancy',
  'Detect Aberration:I6/Divination',
  'Detoxify:Fe8/Conjuration',
  'Disable Construct:I6/Transmutation',
  'Disrupting Weapon:I5',
  'Eagle\'s Splendor:I2',
  'Energy Alteration:I1/Transmutation',
  'Enhancement Alteration:I1/Transmutation',
  'Fabricate:I5',
  'Feast Of Champions:C9/Fe9/Conjuration',
  'Fox\'s Cunning:I2',
  'Globe Of Invulnerability:I6',
  'Greater Armor Enhancement:I3/Transmutation',
  'Greater Construct Energy Ward:I4/Abjuration',
  'Greater Magic Weapon:I3',
  'Greater Status:Co4/Divination',
  'Greater Weapon Augmentation:I6/Transmutation',
  'Halt Deathless:Dl3/Necromancy',
  'Hardening:Ar7/I6/W6/Transmutation',
  'Heat Metal:I2',
  'Hero\'s Blade:Dl9/Necromancy',
  'Identify:I1',
  'Inflict Critical Damage:I4/Transmutation',
  'Inflict Light Damage:I1/Transmutation',
  'Inflict Moderate Damage:I2/Transmutation',
  'Inflict Serious Damage:I3/Transmutation',
  'Iron Construct:I4/Transmutation',
  'Item Alteration:I4/Transmutation',
  'Legion\'s Shield Of Faith:I4/Abjuration',
  'Lesser Armor Enhancement:I1/Transmutation',
  'Lesser Globe Of Invulnerability:I4',
  'Lesser Weapon Augmentation:I2/Transmutation',
  'Light:I1',
  'Maddening Scream:Md8/W8/Enchantment',
  'Magecraft:W1/Divination',
  'Magic Stone:I1',
  'Magic Vestment:I1',
  'Magic Weapon:I1',
  'Major Creation:I5',
  'Metamagic Item:I3/Transmutation',
  'Minor Creation:I4',
  'Move Earth:I6',
  'Nature\'s Wrath:D4/Evocation',
  'Owl\'s Wisdom:I2',
  'Personal Weapon Augmentation:I1/Transmutation',
  'Power Surge:I3/Transmutation',
  'Repair Critical Damage:I4/Transmutation',
  'Repair Light Damage:I1/Transmutation',
  'Repair Moderate Damage:I2/Transmutation',
  'Repair Serious Damage:I3/Transmutation',
  'Resistance Item:I1/Abjuration',
  'Rusting Grasp:I4',
  'Return To Nature:D7/Transmutation',
  'Shield Of Faith:I1/Abjuration',
  'Skill Enhancement:I1/Transmutation',
  'Spell Storing Item:I1/Transmutation',
  'Spirit Steed:Dl4/Necromancy',
  'Stone Construct:I3/Transmutation',
  'Suppress Requirement:I3/Transmutation',
  'Total Repair:I6/Transmutation',
  'Touch Of Madness:Md2/Enchantment',
  'Toughen Construct:I2/Transmutation',
  'True Creation:Ar8/Conjuration',
  'Wall Of Force:I5',
  'Wall Of Iron:I6',
  'Wall Of Stone:I5',
  'Weapon Augmentation:I4/Transmutation',
  'Weapon Augmentation:I6/Transmutation',
  'Withering Palm:Dy7/Necromancy',
  'Zone Of Natural Purity:D2/Evocation'
];
Eberron.SUBFEATS = {
};

/* Defines the rules related to Eberron Chapter 2, Character Classes. */
Eberron.classRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Artificer') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
      ];
      hitDie = 6;
      notes = [
      ];
      profArmor = PH35.PROFICIENCY_LIGHT;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Appraise', 'Concentration', 'Craft', 'Disable Device',
        'Knowledge (Arcana)', 'Knowledge (Architecture)', 'Knowledge (Planes)',
        'Open Lock', 'Profession', 'Search', 'Spellcraft', 'Use Magic Device'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;

    } else
      continue;

    PH35.defineClass
      (rules, klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       spellsKnown, spellsPerDay, spellAbility);
    if(notes != null)
      rules.defineNote(notes);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + klass);
      }
    }
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + klass);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }

  }

  }

};

/* Defines the rules related to Eberron Chapter 3, Heroic Characteristics. */
Eberron.featRules = function(rules, feats, subfeats) {

  var allFeats = [];
  for(var i = 0; i < feats.length; i++) {
    var pieces = feats[i].split(':');
    var feat = pieces[0];
    var featSubfeats = subfeats[feat];
    if(featSubfeats == null) {
      allFeats[allFeats.length] = feat + ':' + pieces[1];
    } else {
      rules.defineRule('subfeatCount.' + feat,
        new RegExp('^feats\\.' + feat + ' \\('), '+=', '1'
      );
      if(featSubfeats != '') {
        featSubfeats = featSubfeats.split('/');
        for(var j = 0; j < featSubfeats.length; j++) {
          allFeats[allFeats.length] =
            feat + ' (' + featSubfeats[j] + '):' + pieces[1];
        }
      }
    }
  }

  for(var i = 0; i < allFeats.length; i++) {
    var pieces = allFeats[i].split(':');
    var feat = pieces[0];
    var matchInfo;
    var notes;
    if(feat == 'Abberant Dragonmark') {
      continue; // TODO
    } else if(feat == 'Action Boost') {
      continue; // TODO
    } else if(feat == 'Action Surge') {
      continue; // TODO
    } else if(feat == 'Adamantine Body') {
      continue; // TODO
    } else if(feat == 'Ashbound') {
      continue; // TODO
    } else if(feat == 'Attune Magic Weapon') {
      continue; // TODO
    } else if(feat == 'Beast Shape') {
      continue; // TODO
    } else if(feat == 'Beast Totem') {
      continue; // TODO
    } else if(feat == 'Beasthide Elite') {
      continue; // TODO
    } else if(feat == 'Bind Elemental') {
      continue; // TODO
    } else if(feat == 'Child Of Winter') {
      continue; // TODO
    } else if(feat == 'Cliffwalk Elite') {
      continue; // TODO
    } else if(feat == 'Double Steel Strike') {
      continue; // TODO
    } else if(feat == 'Dragon Rage') {
      continue; // TODO
    } else if(feat == 'Dragon Totem') {
      continue; // TODO
    } else if(feat == 'Ecclesiarch') {
      continue; // TODO
    } else if(feat == 'Education') {
      continue; // TODO
    } else if(feat == 'Exceptional Artisan') {
      continue; // TODO
    } else if(feat == 'Extend Rage') {
      continue; // TODO
    } else if(feat == 'Extra Music') {
      continue; // TODO
    } else if(feat == 'Extra Rings') {
      continue; // TODO
    } else if(feat == 'Extra Shifter Trait') {
      continue; // TODO
    } else if(feat == 'Extraordinary Artisan') {
      continue; // TODO
    } else if(feat == 'Favored In House') {
      continue; // TODO
    } else if(feat == 'Flensing Strike') {
      continue; // TODO
    } else if(feat == 'Gatekeeper Initiate') {
      continue; // TODO
    } else if(feat == 'Great Bite') {
      continue; // TODO
    } else if(feat == 'Great Rend') {
      continue; // TODO
    } else if(feat == 'Greater Dragonmark') {
      continue; // TODO
    } else if(feat == 'Greater Powerful Charge') {
      continue; // TODO
    } else if(feat == 'Greater Shifter Defense') {
      continue; // TODO
    } else if(feat == 'Greensinger Initiate') {
      continue; // TODO
    } else if(feat == 'Haunting Melody') {
      continue; // TODO
    } else if(feat == 'Healing Factor') {
      continue; // TODO
    } else if(feat == 'Heroic Spirit') {
      continue; // TODO
    } else if(feat == 'Improved Damage Reduction') {
      continue; // TODO
    } else if(feat == 'Improved Fortification') {
      continue; // TODO
    } else if(feat == 'Improved Natural Attack') {
      continue; // TODO
    } else if(feat == 'Investigate') {
      continue; // TODO
    } else if(feat == 'Knight Training') {
      continue; // TODO
    } else if(feat == 'Least Dragonmark') {
      continue; // TODO
    } else if(feat == 'Legendary Artisan') {
      continue; // TODO
    } else if(feat == 'Lesser Dragon Mark') {
      continue; // TODO
    } else if(feat == 'Longstride Elite') {
      continue; // TODO
    } else if(feat == 'Mithral Body') {
      continue; // TODO
    } else if(feat == 'Mithrl Fluidity') {
      continue; // TODO
    } else if(feat == 'Monastic Training') {
      continue; // TODO
    } else if(feat == 'Music Of Growth') {
      continue; // TODO
    } else if(feat == 'Music Of Making') {
      continue; // TODO
    } else if(feat == 'Powerful Charge') {
      continue; // TODO
    } else if(feat == 'Precise Swing') {
      continue; // TODO
    } else if(feat == 'Pursue') {
      continue; // TODO
    } else if(feat == 'Raging Luck') {
      continue; // TODO
    } else if(feat == 'Recognize Impostor') {
      continue; // TODO
    } else if(feat == 'Repel Aberration') {
      continue; // TODO
    } else if(feat == 'Research') {
      continue; // TODO
    } else if(feat == 'Right Of Counsel') {
      continue; // TODO
    } else if(feat == 'Serpent Strike') {
      continue; // TODO
    } else if(feat == 'Shifter Defense') {
      continue; // TODO
    } else if(feat == 'Shifter Ferocity') {
      continue; // TODO
    } else if(feat == 'Shifter Multiattack') {
      continue; // TODO
    } else if(feat == 'Silver Smite') {
      continue; // TODO
    } else if(feat == 'Song Of The Heart') {
      continue; // TODO
    } else if(feat == 'Soothe The Beast') {
      continue; // TODO
    } else if(feat == 'Spontaneous Casting') {
      continue; // TODO
    } else if(feat == 'Strong Mind') {
      continue; // TODO
    } else if(feat == 'Totem Companion') {
      continue; // TODO
    } else if(feat == 'Undead Empathy') {
      continue; // TODO
    } else if(feat == 'Urban Tracking') {
      continue; // TODO
    } else if(feat == 'Vermin Companion') {
      continue; // TODO
    } else if(feat == 'Vermin Shape') {
      continue; // TODO
    } else if(feat == 'Wand Mastery') {
      continue; // TODO
    } else if(feat == 'Warden Initiate') {
      continue; // TODO
    } else if(feat == 'Whirling Steel Strike') {
      continue; // TODO
    } else
      continue;
    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);
  }

};

/* Defines the rules related to Eberron Chapter 4, Prestige Classes. */
Eberron.prestigeClassRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Dragonmark Heir') {

      continue; // TODO

    } else if(klass == 'Eldeen Ranger') {

      continue; // TODO

    } else if(klass == 'Exorcist Of The Silver Flame') {

      continue; // TODO

    } else if(klass == 'Extreme Explorer') {

      continue; // TODO

    } else if(klass == 'Heir Of Siberys') {

      continue; // TODO

    } else if(klass == 'Master Inquisitive') {

      continue; // TODO

    } else if(klass == 'Warforged Juggernaut') {

      continue; // TODO

    } else if(klass == 'Weretouched Master') {

      continue; // TODO

    } else
      continue;

    PH35.defineClass
      (rules, klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       spellsKnown, spellsPerDay, spellAbility);
    if(notes != null)
      rules.defineNote(notes);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + klass);
      }
    }
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + klass);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }

  }

};

/* Defines the rules related to Eberron Chapter 1, Character Races. */
Eberron.raceRules = function(rules, races) {

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, notes, selectableFeatures;
    var race = races[i];

    if(race == 'Changeling') {

      adjustment = null;
      features = [
        'Charm Resistance', 'Deceptive', 'Intuitive', 'Minor Shape Change',
        'Natural Linguist', 'Sleep Resistance'
      ];
      notes = [
        'magicNotes.minorShapeChange:<i>Shape Change</i> body at will',
        'saveNotes.charmResistanceFeature:+2 vs. charm effects',
        'saveNotes.sleepResistanceFeature:+2 vs. sleep effects',
        'skillNotes.deceptiveFeature:+2 Bluff/Intimidate',
        'skillNotes.intuitiveFeature:+2 Sense Motive',
        'skillNotes.naturalLinguistFeature:Speak Language is a class skill'
      ];
      selectableFeatures = null;
      rules.defineRule('classSkills.Speak Language',
        'skillNotes.naturalLinguistFeature', '=', '1'
      );

    } else if(race == 'Kalashtar') {

      adjustment = null;
      features = [
        'Dreamless', 'Humanlike', 'Influential', 'Mental Resistance',
        'Mindlink', 'Natural Psionic', 'Possession Resistance'
      ];
      notes = [
        'magicNotes.mindlinkFeature:<i>Mindlink</i> as level %V wilder 1/day',
        'magicNotes.naturalPsionicFeature:+1 power point/level',
        'saveNotes.dreamlessFeature:Immune <i>Dream</i>, <i>Nightmare</i>',
        'saveNotes.mentalResistanceFeature:+2 vs. mind-altering effects',
        'saveNotes.possessionResistanceFeature:+2 vs. possession',
        'skillNotes.humanlikeFeature:+2 Disguise (human)',
        'skillNotes.influentialFeature:+2 Bluff/Diplomacy/Intimidate'
      ];
      selectableFeatures = null;
      rules.defineRule('magicNotes.mindlinkFeature',
        'level', 'source < 2 ? 1 : Math.floor(source / 2)'
      );

    } else if(race == 'Shifter') {

      adjustment = '+2 dexterity/-2 intelligence/-2 charisma';
      features = ['Shifting'];
      notes = [
        'abilityNotes.beasthideFeature:+2 Constitution while shifting',
        'abilityNotes.cliffwalkFeature:+2 Dexterity while shifting',
        'abilityNotes.longstrideFeature:+2 Dexterity/+2 speed while shifting',
        'abilityNotes.longtoothFeature:+2 Strength while shifting',
        'abilityNotes.razorclawFeature:+2 Strength while shifting',
        'abilityNotes.wildhuntFeature:+2 Constitution while shifting',
        'combatNotes.beasthideFeature:+2 AC while shifting',
        'combatNotes.longtoothFeature:d6+%V bite attack while shifting',
        'combatNotes.razorclawFeature:d4+%V claw attack while shifting',
        'featureNotes.shiftingFeature:Use Shifter trait for %V rounds %1/day',
        'featureNotes.wildhuntFeature:' +
          'Detect creatures\' presence w/in 30 ft/track by smell',
        'skillNotes.cliffwalkFeature:20 ft climb speed while shifting',
        'skillNotes.wildhuntFeature:+2 Survival'
      ];
      selectableFeatures = [
        'Beasthide', 'Longtooth', 'Cliffwalk', 'Razorclaw', 'Longstride',
        'Wildhunt'
      ];
      rules.defineRule('combatNotes.longtoothFeature',
        'level', '=', 'Math.floor(source / 4)',
        'strengthModifier', '+', null
      );
      rules.defineRule('combatNotes.razorclawFeature',
        'level', '=', 'Math.floor(source / 4)',
        'strengthModifier', '+', null
      );
      rules.defineRule('featureNotes.shiftingFeature',
        'constitutionModifier', '=', '3 + source'
      );
      rules.defineRule('featureNotes.shiftingFeature.1', '', '=', '1');
      rules.defineRule('selectableFeatureCount.Shifter',
        'race', '=', 'source == "Shifter" ? 1 : null'
      );

    } else if(race == 'Warforged') {

      adjustment = '+2 constitution/-2 wisdom/-2 charisma';
      features = [
        'Composite Plating', 'Construct Immunity', 'Construct Vulnerability',
        'Light Fortification', 'Slam Weapon', 'Stable', 'Unhealing'
      ];
      notes = [
        'combatNotes.compositePlatingFeature:+2 AC/Cannot wear armor',
        'combatNotes.lightFortificationFeature:' +
          '25% change of negating critical hit/sneak attack',
        'combatNotes.stableFeature:' +
          'May perform strenuous activity at 0 hit points/no additional ' +
          'loss at negative hit points',
        'combatNotes.slamWeaponFeature:d4 slam attack',
        'featureNotes.unhealingFeature:' +
          'Does not heal damage naturally/half effect from healing spells',
        'saveNotes.constructImmunityFeature:' +
          'Immune to poison, sleep, paralysis, disease, nausea, fatigue, ' +
          'exhaustion, sickening, and energy drain',
        'saveNotes.constructVulnerabilityFeature:' +
          'Affected by effects that target wood or metal'
      ];
      selectableFeatures = null;
      rules.defineRule
        ('armor', 'combatNotes.compositePlatingFeature', '=', '"None"');
      rules.defineRule
        ('armorClass', 'combatNotes.compositePlatingFeature', '+', '2');
      rules.defineRule('magicNotes.arcaneSpellFailure',
        'combatNotes.compositePlatingFeature', '+=', '5'
      );

    } else
      continue;

    PH35.defineRace(rules, race, adjustment, features);
    if(notes != null) {
      rules.defineNote(notes);
    }
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + race);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }


  }

};
