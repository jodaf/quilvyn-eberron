/* $Id: EberronPrestige.js,v 1.2 2008/03/27 05:12:22 Jim Exp $ */

/*
Copyright 2008, James J. Hayes

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
 * This module loads the rules for the Eberron campaign setting prestige
 * classes.  The EberronPrestige.CLASSES constant field can be manipulated in
 * order to trim the choices offered.
 */
function EberronPrestige() {
  if(window.SRD35 == null || window.Eberron == null) {
    alert
     ('The EberronPrestige module requires use of the SRD35 and Eberron modules');
    return;
  }
  EberronPrestige.classRules(Eberron.rules, EberronPrestige.CLASSES);
}

EberronPrestige.CLASSES = [
  'Dragonmark Heir', 'Eldeen Ranger', 'Exorcist Of The Silver Flame',
  'Extreme Explorer', 'Heir Of Siberys', 'Master Inquisitive',
  'Warforged Juggernaut', 'Weretouched Master'
];

/* Defines the rules related to Eberron prestige classes. */
EberronPrestige.classRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Dragonmark Heir') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:House Status', '1:Lesser Dragonmark', '2:Action Point Bonus',
        '2:Improved Least Dragonmark', '3:Improved Lesser Dragonmark',
        '4:Greater Dragonmark', '5:Improved Greater Dragonmark'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.actionPointBonusFeature:+2 AP',
        'magicNotes.greaterDragonmarkFeature:' +
          'DC %V+spell level %1 at caster level 10/' +
          'least/lesser dragonmark ability +1/day',
        'magicNotes.improvedGreaterDragonmarkFeature:' +
          '2nd greater dragonmark ability or use ability +1/day',
        'magicNotes.improvedLeastDragonmarkFeature:' +
          '2nd least dragonmark ability or use ability +1/day',
        'magicNotes.improvedLesserDragonmarkFeature:' +
          '2nd lesser dragonmark ability or use ability +1/day',
        'magicNotes.lesserDragonmarkFeature:' +
          'DC %V+spell level %1 at caster level 6/' +
          'least dragonmark ability +1/day',
        'skillNotes.houseStatusFeature:' +
          '+%V charisma-based skills w/house members',
        'validationNotes.dragonmarkHeirClassFeats:' +
          'Requires Favored In House/Least Dragonmark',
        'validationNotes.dragonmarkHeirClassHouse:Requires House != None',
        'validationNotes.dragonmarkHeirClassRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human',
        'validationNotes.dragonmarkHeirClassSkills:Requires any 2 >= 7'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Appraise', 'Bluff', 'Diplomacy', 'Gather Information', 'Intimidate',
        'Knowledge (Arcana)', 'Knowledge (Nobility)', 'Perform', 'Ride',
        'Sense Motive', 'Speak Language', 'Spellcraft'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('actionPoints', 'abilityNotes.actionPointBonusFeature', '+', '2');
      rules.defineRule('magicNotes.greaterDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('magicNotes.greaterDragonmarkFeature.1',
        'dragonmark', '=',
        'Eberron.dragonmarksSpells[source] == null ? null : ' +
        'Eberron.dragonmarksSpells[source][2]'
      );
      rules.defineRule('magicNotes.lesserDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('magicNotes.lesserDragonmarkFeature.1',
        'dragonmark', '=',
        'Eberron.dragonmarksSpells[source] == null ? null : ' +
        'Eberron.dragonmarksSpells[source][1]'
      );
      rules.defineRule
        ('skillNotes.houseStatusFeature', 'levels.Dragonmark Heir', '=', null);
      rules.defineRule('validationNotes.dragonmarkHeirClassSkills',
        'levels.Dragonmark Heir', '=', '-2',
        /^skillModifier\./, '+', 'source >= 7 ? 1 : null',
        '', 'v', '0'
      );

    } else if(klass == 'Eldeen Ranger') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Nature Sense', '1:Resist Aberrations', '1:Resist Nature\'s Lure',
        '1:Resist Poison', '1:Resist The Arcane', '2:Hated Foe',
        '3:Darkvision', '3:Ferocity', '3:Improved Critical',
        '3:Resist Corruption', '3:Unearthly Grace', '4:Favored Enemy',
        '5:Damage Reduction', '5:Slippery Mind', '5:Smite Evil',
        '5:Spell Resistance', '5:Touch Of Contagion'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.favoredEnemyFeature:' +
          '+2 or more damage vs. %V type(s) of creatures',
        'combatNotes.hatedFoeFeature:' +
          'Spend 1 AP for double damage against favored enemy',
        'combatNotes.ironDamageReductionFeature:DR 3/cold iron',
        'combatNotes.ferocityFeature:Continue fighting below 0 HP',
        'combatNotes.smiteEvilFeature:' +
          '%V/day add %1 to attack, %2 to damage vs. evil foe',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.touchOfContagionFeature:<i>Contagion</i> 3/day',
        'saveNotes.resistAberrationsFeature:+2 vs. aberration abilities',
        'saveNotes.resistCorruptionFeature:Immune disease/+2 vs. mind-altering',
        'saveNotes.resistNature\'sLureFeature:+4 vs. spells of feys',
        'saveNotes.resistTheArcaneFeature:+2 vs. arcane spells',
        'saveNotes.resistPoisonFeature:+2 vs. poison',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'saveNotes.spellResistanceFeature:DC 20 spell resistance',
        'saveNotes.unearthlyGraceFeature:+%V all saves',
        'skillNotes.favoredEnemyFeature:' +
          '+2 or more vs. %V type(s) of creatures on ' +
          'Bluff/Listen/Sense Motive/Spot/Survival',
        'skillNotes.natureSenseFeature:+2 Knowledge (Nature)/Survival',
        'validationNotes.childrenOfWinterSelectableFeatureAlignment:' +
          'Requires Alignment !~ Good',
        'validationNotes.eldeenRangerClassBaseAttack:Requires Base Attack >= 5',
        'validationNotes.eldeenRangerClassFeats:Requires Track',
        'validationNotes.eldeenRangerClassFeatures:Requires Favored Enemy',
        'validationNotes.eldeenRangerClassSkills:' +
          'Requires Knowledge (Nature) >= 6/Survival >= 8',
        'validationNotes.gatekeepersSelectableFeatureAlignment:' +
          'Requires Alignment !~ Evil',
        'validationNotes.greensingersSelectableFeatureAlignment:' +
          'Requires Alignment =~ Chaotic',
        'validationNotes.wardensOfTheWoodSelectableFeatureAlignment:' +
          'Requires Alignment !~ Evil'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Ashbound', 'Children Of Winter', 'Gatekeepers', 'Greensingers',
        'Wardens Of The Wood'
      ];
      skillPoints = 6;
      skills = [
        'Climb', 'Craft', 'Handle Animal', 'Heal', 'Hide', 'Jump',
        'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
        'Knowledge (Nature)', 'Listen', 'Move Silently', 'Profession', 'Ride',
        'Search', 'Spot', 'Survival', 'Swim', 'Use Rope'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.favoredEnemyFeature',
        'levels.' + klass, '+=', 'source >= 4 ? 1 : null'
      );
      rules.defineRule
        ('combatNotes.smiteEvilFeature', 'levels.Eldeen Ranger', '+=', '1');
      rules.defineRule
        ('combatNotes.smiteEvilFeature.1', 'charismaModifier', '=', null);
      rules.defineRule
        ('combatNotes.smiteEvilFeature.2', 'levels.Eldeen Ranger', '=', null);
      rules.defineRule('eldeenRangerFeatures.Damage Reduction',
        'selectableFeatures.Greensingers', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Darkvision',
        'selectableFeatures.Gatekeepers', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Ferocity',
        'selectableFeatures.Ashbound', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Improved Critical',
        'selectableFeatures.Wardens Of The Wood', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Nature Sense',
        'selectableFeatures.Wardens Of The Wood', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Resist Aberrations',
        'selectableFeatures.Gatekeepers', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Resist Corruption',
        'selectableFeatures.Children Of Winter', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Resist Nature\'s Lure',
        'selectableFeatures.Greensingers', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Resist Poison',
        'selectableFeatures.Children Of Winter', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Resist The Arcane',
        'selectableFeatures.Ashbound', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Slippery Mind',
        'selectableFeatures.Gatekeepers', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Smite Evil',
        'selectableFeatures.Wardens Of The Wood', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Spell Resistance',
        'selectableFeatures.Ashbound', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Touch Of Contagion',
        'selectableFeatures.Children Of Winter', '?', null
      );
      rules.defineRule('eldeenRangerFeatures.Unearthly Grace',
        'selectableFeatures.Greensingers', '?', null
      );
      rules.defineRule('featCount.Fighter',
        'eldeenRangerFeatures.Improved Critical', '+=', '1'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'eldeenRangerFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule
        ('save.Fortitude', 'saveNotes.unearthlyGraceFeature', '+', null);
      rules.defineRule
        ('save.Reflex', 'saveNotes.unearthlyGraceFeature', '+', null);
      rules.defineRule
        ('save.Will', 'saveNotes.unearthlyGraceFeature', '+', null);
      rules.defineRule
        ('saveNotes.unearthlyGraceFeature', 'charismaModifier', '=', null);
      rules.defineRule('selectableFeatureCount.Eldeen Ranger',
        'levels.Eldeen Ranger', '=', '1'
      );
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.' + klass, '+=', 'source >= 4 ? 1 : null'
      );

    } else if(klass == 'Exorcist Of The Silver Flame') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Flame Of Censure', '1:Weapon Of The Exorcist',
        '2:Caster Level Bonus', '3:Darkvision', '3:Resist Charm',
        '3:Resist Possession', '3:Resist Unnatural', '3:Smite Evil',
        '4:Detect Thoughts', '5:Silver Exorcism', '6:Weapon Of Flame',
        '10:Warding Flame'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.flameOfCensureFeature:' +
          'Stun/banish Outsiders w/turning check',
        'combatNotes.silverExorcismFeature:+2 exorcism checks',
        'combatNotes.smiteEvilFeature:' +
          '%V/day add %1 to attack, %2 to damage vs. evil foe',
        'combatNotes.wardingFlameFeature:' +
          'Warding glow for +2 AC/striking evil foes DC %V Fortitude save ' +
          'or blinded',
        'combatNotes.weaponOfFlameFeature:+%Vd6 flame damage w/sacred weapon',
        'combatNotes.weaponOfTheExorcistFeature:' +
          '+1 damage w/sacred weapon treated as %V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.detectThoughtsFeature:DC %V <i>Detect Thoughts</i> at will',
        'magicNotes.wardingFlameFeature:Warding glow for spell resistance 25',
        'saveNotes.resistCharmFeature:+2 vs. charm effects',
        'saveNotes.resistPossessionFeature:+4 vs. possession',
        'saveNotes.resistUnnaturalFeature:+2 vs. effects of outsiders/undead',
        'magicNotes.silverExorcismFeature:+2 checks vs. evil outsiders',
        'turnOutsider.damageModifier:2d6+%V',
        'turnOutsider.frequency:%V/day',
        'turnOutsider.maxHitDice:(d20+%V)/3',
        'validationNotes.exorcistOfTheSilverFlameClassBaseAttack:' +
          'Requires Base Attack >= 3',
        'validationNotes.exorcistOfTheSilverFlameClassCasterLevelDivine:' +
          'Requires Caster Level Divine >= 1',
        'validationNotes.exorcistOfTheSilverFlameClassDeity:' +
          'Requires Deity =~ The Silver Flame',
        'validationNotes.exorcistOfTheSilverFlameClassSkills:' +
          'Requires Knowledge (Planes) >= 3/Knowledge (Religion) >= 8'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Concentration', 'Craft', 'Intimidate', 'Knowledge (Arcana)',
        'Knowledge (Planes)', 'Knowledge (Religion)', 'Profession',
        'Sense Motive', 'Spellcraft'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.smiteEvilFeature',
        'levels.Exorcist Of The Silver Flame', '+=',
        'source >= 7 ? 2 : source >= 3 ? 1 : null'
      );
      rules.defineRule
        ('combatNotes.smiteEvilFeature.1', 'charismaModifier', '=', null);
      rules.defineRule('combatNotes.smiteEvilFeature.2',
        'levels.Exorcist Of The Silver Flame', '=', 'source>=3 ? source : null'
      );
      rules.defineRule('combatNotes.wardingFlameFeature',
        'charismaModifier', '=', '20 + source'
      );
      rules.defineRule('combatNotes.weaponOfFlameFeature',
        'levels.Exorcist Of The Silver Flame', '=',
        'source >= 9 ? 2 : source >= 6 ? 1 : null'
      );
      rules.defineRule('combatNotes.weaponOfTheExorcistFeature',
        'levels.Exorcist Of The Silver Flame', '=',
        '["magic"]' +
        '.concat(source >= 2 ? ["silver"] : [])' +
        '.concat(source >= 4 ? ["good"] : [])' +
        '.concat(source >= 8 ? ["lawful"] : []).sort().join("/")'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'levels.Exorcist Of The Silver Flame', '+=',
        'source >= 6 ? 60 : source >= 3 ? 30 : null'
      );
      rules.defineRule('magicNotes.casterLevelBonusFeature',
        'levels.Exorcist Of The Silver Flame', '+=', 'Math.floor(source*2/3)'
      );
      rules.defineRule('magicNotes.detectThoughtsFeature',
        'levels.Exorcist Of The Silver Flame', '=', '10 + source',
        'charismaModifier', '+', null
      );
      rules.defineRule('turnOutsider.level',
        'levels.Exorcist Of The Silver Flame', '=', null
      );
      rules.defineRule('turnOutsider.damageModifier',
        'turnOutsider.level', '=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule('turnOutsider.frequency',
        'turnOutsider.level', '=', '3',
        'charismaModifier', '+', null
      );
      rules.defineRule('turnOutsider.maxHitDice',
        'turnOutsider.level', '?', null,
        'level', '=', 'source * 3 - 10',
        'charismaModifier', '+', null
      );
      rules.defineSheetElement('Turn Outsider', 'Turn Undead', null, ' * ');

    } else if(klass == 'Extreme Explorer') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = [
        'Action Surge', 'Heroic Spirit', 'Persue', 'Spontaneous Casting'
      ];
      features = [
        '1:Action Point Bonus', '1:Trap Sense', '2:Dodge Bonus', '2:Evasion',
        '2:Extreme Hustle', '4:Extreme Action'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.actionPointBonusFeature:+2 AP',
        'combatNotes.dodgeBonusFeature:+%V AC when unencumbered',
        'featureNotes.extremeActionFeature:' +
          'Retain AP on successful AP roll of 8',
        'featureNotes.extremeHustleFeature:Spend 1 AP to gain a move action',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
        'validationNotes.extremeExplorerClassBaseAttack:' +
          'Requires Base Attack >= 4',
        'validationNotes.extremeExplorerClassFeats:Requires Action Boost',
        'validationNotes.extremeExplorerClassSkills:' +
          'Requires Knowledge (Dungeoneering) >= 4/Survival >= 4'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 6;
      skills = [
        'Balance', 'Climb', 'Decipher Script', 'Disable Device',
        'Escape Artist', 'Jump', 'Knowledge (Arcana)',
        'Knowledge (Dungeoneering)', 'Knowledge (History)', 'Listen',
        'Open Lock', 'Ride', 'Search', 'Speak Language', 'Survival', 'Swim',
        'Tumble', 'Use Magic Device', 'Use Rope'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('actionPoints', 'abilityNotes.actionPointBonusFeature', '+', '2');
      rules.defineRule
       ('armorClass', 'combatNotes.dodgeBonusFeature', '+', null);
      rules.defineRule('combatNotes.dodgeBonusFeature',
        'levels.Extreme Explorer', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('featCount.Extreme Explorer',
        'levels.Extreme Explorer', '=',
        'source < 3 ? null : Math.floor((source - 1) / 2)'
      );
      rules.defineRule('saveNotes.trapSenseFeature',
        'levels.Extreme Explorer', '+=', 'Math.floor((source + 1) / 2)'
      );

    } else if(klass == 'Heir Of Siberys') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = [
        'Action Boost', 'Action Surge', 'Favored In House', 'Pursue',
        'Spontaneous Casting'
      ];
      features = [
        '1:Action Point Bonus', '2:Siberys Mark', '2:Caster Level Bonus'
      ];
      hitDie = 6;
      notes = [
        'abilityNotes.actionPointBonusFeature:+2 AP',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.siberysMarkFeature:' +
          'DC %V+spell level %1 at caster level 15 %2/day',
        'validationNotes.heirOfSiberysClassFeats:' +
          'Requires Heroic Spirit/no Dragonmark feats',
        'validationNotes.heirOfSiberysClassRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human',
        'validationNotes.heirOfSiberysClassSkills:Requires any 2 >= 15'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [ ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('actionPoints', 'abilityNotes.actionPointBonusFeature', '+', '2');
      rules.defineRule
        ('featCount.General', 'heirOfSiberysFeatures.Feat Bonus', '+=', null);
      rules.defineRule
        ('featCount.Heir Of Siberys', 'levels.Heir Of Siberys', '=', '1');
      rules.defineRule
        ('heirOfSiberysFeatures.Caster Level Bonus', 'isCaster', '?', null);
      rules.defineRule('heirOfSiberysFeatures.Feat Bonus',
        'isCaster', '?', '!source',
        'levels.Heir Of Siberys', '=', 'source>=3 ? 2 : source==2 ? 1 : null'
      );
      rules.defineRule('isCaster',
        '', '=', 'false',
        'casterLevel', '=', 'true'
      );
      rules.defineRule('magicNotes.casterLevelBonusFeature',
        'levels.Heir Of Siberys', '+=', 'source - 1'
      );
      rules.defineRule('magicNotes.siberysMarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('magicNotes.siberysMarkFeature.1',
        'dragonmark', '=',
        'Eberron.dragonmarksSpells[source] == null ? null : ' +
        'Eberron.dragonmarksSpells[source][3]'
      );
      rules.defineRule('magicNotes.siberysMarkFeature.2',
        'levels.Heir Of Siberys', '=',
        'source >= 3 ? 2 : source == 2 ? 1 : null'
      );
      rules.defineRule('validationNotes.heirOfSiberysClassFeats',
        'levels.Heir Of Siberys', '=', '-10',
        'features.Heroic Spirit', '+', '10',
        /^features\.(Greater|Least|Lesser) Dragonmark/, '+', '-1'
      );
      rules.defineRule('validationNotes.heirOfSiberysClassSkills',
        'levels.Heir Of Siberys', '=', '-2',
        /^skillModifier\./, '+', 'source >= 15 ? 1 : null',
        '', 'v', '0'
      );

    } else if(klass == 'Master Inquisitive') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = [
        'Alertness', 'Deceitful', 'Heroic Spirit', 'Improved Initiative',
        'Iron Will', 'Negotiator', 'Persuasive', 'Recognize Impostor',
        'Research', 'Toughness', 'Track', 'Urban Tracking'
      ];
      features = [
        '1:Zone Of Truth', '2:Contact', '3:Discern Lies', '4:Improved Contact',
        '5:True Seeing'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.contactFeature:3rd level associate/informant',
        'featureNotes.improvedContactFeature:6th level associate/informant',
        'magicNotes.discernLiesFeature:' +
          '<i>Discern Lies</i> 1/day; spend 2 AP for 2nd',
        'magicNotes.trueSeeingFeature:' +
          '<i>True Seeing</i> 1/day; spend 2 AP for 2nd',
        'magicNotes.zoneOfTruthFeature:' +
          '<i>Zone Of Truth</i> 1/day; spend 2 AP for 2nd',
        'validationNotes.masterInquisitiveClassFeats:Requires Investigate',
        'validationNotes.masterInquisitiveClassSkills:' +
          'Requires Gather Information >= 6/Search >= 3/Sense Motive >= 6'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 6;
      skills = [
        'Bluff', 'Decipher Script', 'Gather Information', 'Knowledge (Local)',
        'Listen', 'Search', 'Sense Motive', 'Spot'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('featCount.Master Inquisitive',
        'levels.Master Inquisitive', '=',
        'source < 2 ? null : Math.floor(source / 2)'
      );

    } else if(klass == 'Warforged Juggernaut') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Armor Spikes', '1:Expert Bull Rush', '1:Powerful Charge',
        '1:Reserved', '2:Charge Bonus', '2:Construct Perfection',
        '2:Extended Charge', '3:Healing Immunity', '3:Mental Immunity',
        '3:Superior Bull Rush', '4:Death Immunity', '5:Ability Immunity',
        '5:Greater Powerful Charge'
      ];
      hitDie = 12;
      notes = [
        'abilityNotes.extendedChargeFeature:+5 speed when charging',
        'combatNotes.armorSpikesFeature:Grapple attack for %V damage',
        'combatNotes.chargeBonusFeature:+%V attack when charging',
        'combatNotes.constructPerfectionFeature:' +
          'Immune nonlethal damage/critical hits',
        'combatNotes.expertBullRushFeature:+%V bull rush/door breakage',
        'combatNotes.greaterPowerfulChargeFeature:' +
          'Raise charge damage one size category to %V',
        'combatNotes.superiorBullRushFeature:+%V+%1 damage from bull rush',
        'combatNotes.powerfulChargeFeature:+%V damage from successful charge',
        'saveNotes.abilityImmunityFeature:Immune to ability damage/drain',
        'saveNotes.deathImmunityFeature:Immune to death/necromancy effects',
        'saveNotes.healingImmunityFeature:No effect from healing spells',
        'saveNotes.mentalImmunityFeature:Immune to mind-altering effects',
        'skillNotes.reservedFeature:' +
          '-%V Bluff/Diplomacy/Gather Information/Sense Motive',
        'validationNotes.warforgedJuggernautClassBaseAttack:' +
          'Requires Base Attack >= 5',
        'validationNotes.warforgedJuggernautClassFeats:' +
          'Requires Adamantine Body/Improved Bull Rush/Power Attack',
        'validationNotes.warforgedJuggernautRace:Requires Race == Warforged'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Climb', 'Craft', 'Intimidate', 'Jump', 'Survival', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.armorSpikesFeature',
        'levels.Warforged Juggernaut', '=', 'source >= 4 ? "1d8" : "1d6"'
      );
      rules.defineRule('combatNotes.chargeBonusFeature',
        'levels.Warforged Juggernaut', '=',
        'source < 2 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.expertBullRushFeature',
        'levels.Warforged Juggernaut', '=', null
      );
      rules.defineRule('combatNotes.greaterPowerfulChargeFeature',
        '', '=', '"2d6"',
        'features.Large', '=', '"3d6"'
      );
      rules.defineRule('combatNotes.powerfulChargeFeature',
        '', '=', '"d8"',
        'features.Large', '=', '"2d6"'
      );
      rules.defineRule('combatNotes.superiorBullRushFeature',
        'levels.Warforged Juggernaut', '=', 'source >= 4 ? "1d8" : "1d6"'
      );
      rules.defineRule('combatNotes.superiorBullRushFeature.1',
        'strengthModifier', '=', null
      );
      rules.defineRule('skillNotes.reservedFeature',
        'levels.Warforged Juggernaut', '=', null
      );

    } else if(klass == 'Weretouched Master') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Weretouched Claws', '1:Weretouched Fangs', '1:Weretouched Tusks',
        '2:Wild Empathy', '3:Climb Speed', '3:Fierce Will', '3:Improved Grab',
        '3:Pounce', '3:Weretouched Rage', '3:Trip', '4:Frightful Shifting',
        '5:Alternate Form'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.alternateFormFeature:Shift to %V--%1--or bipedal hybrid',
        // TODO Cliffwalk => +10 climb speed
        'abilityNotes.climbSpeedFeature:' +
          '20 ft dexterity-based climb speed while shifting',
        'abilityNotes.weretouchedClawsFeature:+2 strength while shifting',
        'abilityNotes.weretouchedFangsFeature:+2 dexterity while shifting',
        'abilityNotes.weretouchedTusksFeature:+2 constitution while shifting',
        'combatNotes.frightfulShiftingFeature:' +
           'Foes w/< %V hit dice w/in 30 ft who see attack/charge DC %1 Will ' +
           'save or shaken for 5d6 rounds',
        'combatNotes.improvedGrabFeature:Grapple w/out AOO after claw hit',
        'combatNotes.pounceFeature:Full attack when charging',
        'combatNotes.tripFeature:Trip w/out AOO after bite hit',
        // TODO Razorclaw => next size category
        'combatNotes.weretouchedClawsFeature:d4+%V claw attack while shifting',
        // TODO Longtooth => next size category
        'combatNotes.weretouchedFangsFeature:d6+%V fang attack while shifting',
        'combatNotes.weretouchedRageFeature:' +
          '+2 strength/constitution/-2 AC for 1 round after taking damage',
        // TODO Longtooth => next size category
        'combatNotes.weretouchedTusksFeature:d6+%V tusk attack while shifting',
        'saveNotes.fierceWillFeature:+4 Will while shifting',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals',
        'validationNotes.weretouchedMasterClassBaseAttack:' +
          'Requires Base Attack >= 4',
        'validationNotes.weretouchedMasterClassFeats:Requires any Shifter',
        'validationNotes.weretouchedMasterClassRace:Requires Race == Shifter',
        'validationNotes.weretouchedMasterClassSkills:' +
          'Requires Knowledge (Nature) >= 5/Survival >= 8'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Bear', 'Boar', 'Rat', 'Tiger', 'Wolf', 'Wolverine'
      ];
      skillPoints = 2;
      skills = [
        'Balance', 'Climb', 'Handle Animal', 'Hide', 'Intimidate', 'Jump',
        'Knowledge (Nature)', 'Listen', 'Move Silently', 'Spot', 'Survival',
        'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('abilityNotes.alternateFormFeature',
        'weretouchedMasterAnimal', '=', null
      );
      rules.defineRule('abilityNotes.alternateFormFeature.1',
        'weretouchedMasterAnimal', '=',
        'source == "Bear"?"+16 strength/+2 dexterity/+8 consitutution":' +
        'source == "Boar"?"+4 strength/+6 consitutution":' +
        'source == "Rat"?"+6 dexterity/+2 consitutution":' +
        'source == "Tiger"?"+12 strength/+4 dexterity/+6 consitutution":' +
        'source == "Wolf"?"+2 strength/+4 dexterity/+4 consitutution":' +
        'source == "Wolverine"?"+4 strength/+4 dexterity/+8 consitutution":""'
      );
      rules.defineRule
        ('combatNotes.frightfulShiftingFeature', 'level', '=', null);
      rules.defineRule('combatNotes.frightfulShiftingFeature.1',
        'levels.Weretouched Master', '=', 'source + 10',
        'charismaModifier', '+', null
      );
      rules.defineRule('combatNotes.weretouchedClawsFeature',
        'level', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.weretouchedFangsFeature',
        'level', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.weretouchedTusksFeature',
        'level', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('featCount.Shifter',
        'levels.Weretouched Master', '+=',
        'source < 2 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('selectableFeatureCount.Weretouched Master',
        'levels.Weretouched Master', '=', '1'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Weretouched Master', '+=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule('validationNotes.weretouchedMasterClassFeats',
        'levels.Weretouched Master', '=', '0', // TODO Any shifter
        '', 'v', '0'
      );
      rules.defineRule('weretouchedMasterAnimal',
        'selectableFeatures.Bear', '=', '"Bear"',
        'selectableFeatures.Boar', '=', '"Boar"',
        'selectableFeatures.Rat', '=', '"Rat"',
        'selectableFeatures.Tiger', '=', '"Tiger"',
        'selectableFeatures.Wolf', '=', '"Wolf"',
        'selectableFeatures.Wolverine', '=', '"Wolverine"'
      );
      rules.defineRule('weretouchedMasterFeatures.Climb Speed',
        'selectableFeatures.Rat', '?', null
      );
      rules.defineRule('weretouchedMasterFeatures.Fierce Will',
        'selectableFeatures.Boar', '?', null
      );
      rules.defineRule('weretouchedMasterFeatures.Improved Grab',
        'selectableFeatures.Bear', '?', null
      );
      rules.defineRule('weretouchedMasterFeatures.Pounce',
        'selectableFeatures.Tiger', '?', null
      );
      rules.defineRule('weretouchedMasterFeatures.Trip',
        'selectableFeatures.Wolf', '?', null
      );
      rules.defineRule('weretouchedMasterFeatures.Weretouched Claws',
        'weretouchedMasterAnimal', '?', '"BearTiger".indexOf(source) >= 0'
      );
      rules.defineRule('weretouchedMasterFeatures.Weretouched Fangs',
        'weretouchedMasterAnimal', '?', '"RatWolf".indexOf(source) >= 0'
      );
      rules.defineRule('weretouchedMasterFeatures.Weretouched Rage',
        'selectableFeatures.Wolverine', '?', null
      );
      rules.defineRule('weretouchedMasterFeatures.Weretouched Tusks',
        'weretouchedMasterAnimal', '?', '"BoarWolverine".indexOf(source) >= 0'
      );

    } else
      continue;

    SRD35.defineClass
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
