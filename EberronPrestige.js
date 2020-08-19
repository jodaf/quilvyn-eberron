/*
Copyright 2020, James J. Hayes

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

"use strict";

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
  EberronPrestige.identityRules(Eberron.rules, EberronPrestige.CLASSES);
  EberronPrestige.talentRules(Eberron.rules, EberronPrestige.FEATURES);
}

EberronPrestige.CLASSES = {
  'Dragonmark Heir':
    'Require=' +
      '"features.Favored In House","features.Least Dragonmark",' +
      '"house != \'None\'",' +
      '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'",' +
      '"CountSkillGe7 >= 2" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Diplomacy,"Gather Information",Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Nobility)",Perform,Ride,' +
      '"Sense Motive","Speak Language",Spellcraft ' +
    'Features=' +
      '"1:House Status","1:Lesser Dragonmark","2:Action Point Bonus",' +
      '"2:Improved Least Dragonmark","3:Improved Lesser Dragonmark",' +
      '"4:Greater Dragonmark","5:Improved Greater Dragonmark" ' +
    'CasterLevelArcane="levels.Ancestral Bladebearer" ' +
    'SpellAbility=charisma ' +
    'SpellsPerDay=' +
      'AB1:3=1;7=2,' +
      'AB2:5=1;9=2 ' +
    'Spells=' +
      '"AB1:Alarm;Detect Secret Doors",' +
      '"AB2:Augury;Protection From Arrows"',
  'Eldeen Ranger':
    'Require=' +
      '"baseAttack >= 5","features.Track","features.Favored Enemy",' +
      '"skills.Knowledge (Nature) >= 6","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Heal,Hide,Jump,' +
      '"Knowledge (Dungeoneering)","Knowledge (Geography)",' +
      '"Knowledge (Nature)",Listen,"Move Silently",Profession,Ride,Search,' +
      'Spot,Survival,Swim,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Nature Sense","1:Resist Aberrations","1:Resist Nature\'s Lure",' +
      '"1:Resist Poison","1:Resist The Arcane","2:Hated Foe",3:Darkvision,' +
      '3:Ferocity,"3:Improved Critical","3:Resist Corruption",' +
      '"3:Unearthly Grace","4:Favored Enemy","5:Damage Reduction",' +
      '"5:Slippery Mind","5:Smite Evil","5:Spell Resistance",' +
      '"5:Touch Of Contagion" ' +
    'Selectables=' +
      '1:Ashbound,"1:Children Of Winter",1:Gatekeepers,1:Greensingers,' +
      '"1:Wardens Of The Wood" ' +
//      'validationNotes.eldeenRanger - ChildrenOfWinterSelectableFeatureAlignment:' +
//        'Requires Alignment !~ Good',
//      'validationNotes.eldeenRanger - GatekeepersSelectableFeatureAlignment:' +
//        'Requires Alignment !~ Evil',
//      'validationNotes.eldeenRanger - GreensingersSelectableFeatureAlignment:' +
//        'Requires Alignment =~ Chaotic',
//      'validationNotes.eldeenRanger - WardensOfTheWoodSelectableFeatureAlignment:' +
//        'Requires Alignment !~ Evil'
  'Exorcist Of The Silver Flame':
    'Require=' +
      '"baseAttack >= 3","casterLevelDivine >= 1",' +
      '"deity == \'The Silver Flame\'","skills.Knowledge (Planes) >= 3",' +
      '"skills.Knowledge (Religion) >= 8" ' +
    'HitDie=d8 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Intimidate,"Knowledge (Arcana)",' +
      '"Knowledge (Planes)","Knowledge (Religion)",Profession,"Sense Motive",' +
      'Spellcraft ' +
    'Features=' +
      '"1:Flame Of Censure","1:Weapon Of The Exorcist",' +
      '"2:Caster Level Bonus",3:Darkvision,"3:Resist Charm",' +
      '"3:Resist Possession","3:Resist Unnatural","3:Smite Evil",' +
      '"4:Detect Thoughts","5:Silver Exorcism","6:Weapon Of Flame",' +
      '"10:Warding Flame" ' +
  'Extreme Explorer':
    'Require=' +
      '"baseAttack >= 4","features.Action Boost","skills.Survival >= 4",' +
      '"skills.Knowledge (Dungeoneering) >= 4" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,"Decipher Script","Disable Device","Escape Artist",' +
      'Jump,"Knowledge (Arcana)","Knowledge (Dungeoneering)",' +
      '"Knowledge (History)",Listen,"Open Lock",Ride,Search,"Speak Language",' +
      'Survival,Swim,Tumble,"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Action Point Bonus","1:Trap Sense","2:Dodge Bonus",2:Evasion,' +
      '"2:Extreme Hustle","4:Extreme Action" ' +
  'Heir Of Siberys':
    'Require=' +
      '"features.Heroic Spirit","features.Least Dragonmark == 0",' +
      '"race =~ \'race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human\'",' +
      '"CountSkillsGe15 >= 2" ' +
    'HitDie=d6 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Skills= ' +
    'Features=' +
      '"1:Action Point Bonus","2:Siberys Mark","2:Caster Level Bonus" ' +
  'Master Inquisitive':
    'Require=' +
      '"features.Investigative","skills.Gather Information >= 6",' +
      '"skills.Search >= 3","skills.Sense Motive >= 6" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Bluff,"Decipher Script","Gather Information","Knowledge (Local)",' +
      'Listen,Search,"Sense Motive",Spot ' +
    'Features=' +
      '"1:Zone Of Truth",2:Contact,"3:Discern Lies","4:Improved Contact",' +
      '"5:True Seeing" ' +
  'Warforged Juggernaut':
    'Require=' +
     '"baseAttack >= 5","features.Adamantine Body",' +
     '"features.Improved Bush Rush","features.Power Attack",' +
     '"race == \'Warforged\'" ' +
    'HitDie=d12 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,Intimidate,Jump,Survival,Swim ' +
    'Features=' +
      '"1:Armor Spikes","1:Expert Bull Rush","1:Powerful Charge",1:Reserved,' +
      '"2:Charge Bonus","2:Construct Perfection","2:Extended Charge",' +
      '"3:Healing Immunity","3:Mental Immunity","3:Superior Bull Rush",' +
      '"4:Death Immunity","5:Ability Immunity","5:Greater Powerful Charge" ' +
  'Weretouched Master':
    '"baseAttack >= 4","CountShifterFeats >= 1","race == \'Shifter\'",' +
    '"skills.Knowledge (Nature) >= 5","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,"Handle Animal",Hide,Intimidate,Jump,' +
      '"Knowledge (Nature)",Listen,"Move Silently",Spot,Survival,Swim ' +
    'Features=' +
      '"1:Weretouched Claws","1:Weretouched Fangs","1:Weretouched Tusks",' +
      '"2:Wild Empathy","3:Climb Speed","3:Fierce Will","3:Improved Grab",' +
      '3:Pounce,"3:Weretouched Rage",3:Trip,"4:Frightful Shifting",' +
      '"5:Alternate Form" ' +
    'Selectables=' +
      '1:Bear,1:Boar,1:Rat,1:Tiger,1:Wolf,1:Wolverine ' +
};
EberronPrestige.FEATURES = {
  'Action Point Bonus':'Section=ability Note="+2 AP"',
      'magicNotes.improvedGreaterDragonmarkFeature:' +
        '2nd Greater Dragonmark spell or +1/day',
      'magicNotes.improvedLeastDragonmarkFeature:' +
        '2nd Least Dragonmark spell or +1/day',
      'magicNotes.improvedLesserDragonmarkFeature:' +
        '2nd Lesser Dragonmark spell or +1/day',
      'skillNotes.houseStatusFeature:' +
        '+%V charisma-based skills w/house members',
      'combatNotes.favoredEnemyFeature:' +
        '+2 or more damage vs. %V type(s) of creatures',
      'combatNotes.hatedFoeFeature:' +
        'Spend 1 AP for double damage against favored enemy',
      'combatNotes.ironDamageReductionFeature:DR 3/cold iron',
      'combatNotes.ferocityFeature:Continue fighting below 0 HP',
      'combatNotes.smiteEvilFeature:' +
        '+%V attack/+%1 damage vs. evil foe %2/day',
      "featureNotes.darkvisionFeature:%V' b/w vision in darkness",
      'magicNotes.touchOfContagionFeature:<i>Contagion</i> 3/day',
      'saveNotes.resistAberrationsFeature:+2 vs. aberration abilities',
      'saveNotes.resistCorruptionFeature:Immune disease/+2 vs. mind-altering',
      "saveNotes.resistNature'sLureFeature:+4 vs. spells of feys",
      'saveNotes.resistTheArcaneFeature:+2 vs. arcane spells',
      'saveNotes.resistPoisonFeature:+2 vs. poison',
      'saveNotes.slipperyMindFeature:Second save vs. enchantment',
      'saveNotes.spellResistanceFeature:DC 20 spell resistance',
      'saveNotes.unearthlyGraceFeature:+%V all saves',
      'skillNotes.favoredEnemyFeature:' +
        '+2 or more Bluff, Listen, Sense Motive, Spot, Survival ' +
        'vs. %V type(s) of creatures',
      'skillNotes.natureSenseFeature:+2 Knowledge (Nature)/Survival',
      'combatNotes.flameOfCensureFeature:' +
        'Stun/banish Outsiders w/turning check',
      'combatNotes.silverExorcismFeature:+2 exorcism checks',
      'combatNotes.smiteEvilFeature:' +
        '+%V attack/+%1 damage vs. evil foe %2/day',
      'combatNotes.wardingFlameFeature:' +
        'Warding glow for +2 AC/striking evil foes DC %V Fortitude save ' +
        'or blinded',
      'combatNotes.weaponOfFlameFeature:+%Vd6 flame damage w/sacred weapon',
      'combatNotes.weaponOfTheExorcistFeature:' +
        '+1 damage w/sacred weapon treated as %V',
      "featureNotes.darkvisionFeature:%V' b/w vision in darkness",
      'magicNotes.casterLevelBonusFeature:' +
        '+%V base class level for spells known/per day',
      'magicNotes.detectThoughtsFeature:<i>Detect Thoughts</i> at will',
      'magicNotes.silverExorcismFeature:+2 vs. evil outsiders resistance',
      'magicNotes.wardingFlameFeature:Warding glow for spell resistance 25',
      'saveNotes.resistCharmFeature:+2 vs. charm effects',
      'saveNotes.resistPossessionFeature:+%V vs. possession',
      'saveNotes.resistUnnaturalFeature:+2 vs. effects of outsiders/undead',
      'turnOutsider.damageModifier:2d6+%V',
      'turnOutsider.frequency:%V/day',
      'turnOutsider.maxHitDice:(d20+%V)/3',
      'abilityNotes.actionPointBonusFeature:+2 AP',
      'combatNotes.dodgeBonusFeature:+%V AC when unencumbered',
      'featureNotes.extremeActionFeature:' +
        'Retain AP on successful AP roll of 8',
      'featureNotes.extremeHustleFeature:Spend 1 AP to gain a move action',
      'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
      'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
      'abilityNotes.actionPointBonusFeature:+2 AP',
      'magicNotes.casterLevelBonusFeature:' +
        '+%V base class level for spells known/per day',
      'magicNotes.siberysMarkFeature:Choice of %V',
      'featureNotes.contactFeature:3rd level associate/informant',
      'featureNotes.improvedContactFeature:6th level associate/informant',
      'magicNotes.discernLiesFeature:' +
        '<i>Discern Lies</i> 1/day; spend 2 AP for 2nd',
      'magicNotes.trueSeeingFeature:' +
        '<i>True Seeing</i> 1/day; spend 2 AP for 2nd',
      'magicNotes.zoneOfTruthFeature:' +
        '<i>Zone Of Truth</i> 1/day; spend 2 AP for 2nd',
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
      'abilityNotes.alternateFormFeature:Shift to %V--%1--or bipedal hybrid',
      'abilityNotes.climbSpeedFeature:' +
        "20' climb speed (+10 for Cliffwalker) while shifting",
      'abilityNotes.weretouchedClawsFeature:+2 strength while shifting',
      'abilityNotes.weretouchedFangsFeature:+2 dexterity while shifting',
      'abilityNotes.weretouchedTusksFeature:+2 constitution while shifting',
      'combatNotes.frightfulShiftingFeature:' +
         "Foes w/lt %V hit dice w/in 30' who see attack/charge shaken for " +
         '5d6 rounds (DC %1 Will neg)',
      'combatNotes.improvedGrabFeature:Grapple w/out AOO after claw hit',
      'combatNotes.pounceFeature:Full attack when charging',
      'combatNotes.tripFeature:Trip w/out AOO after bite hit',
      'combatNotes.weretouchedClawsFeature:d4+%V claw attack (next size for Razorclaw) while shifting',
      'combatNotes.weretouchedFangsFeature:d6+%V fang attack (next size for Longtooth) while shifting',
      'combatNotes.weretouchedRageFeature:' +
        '+2 strength/constitution/-2 AC for 1 round after taking damage',
      'combatNotes.weretouchedTusksFeature:d6+%V tusk attack (next size for Longtooth) while shifting',
      'saveNotes.fierceWillFeature:+4 Will while shifting',
      'skillNotes.wildEmpathyFeature:+%V Diplomacy (animals)',
};


/* Defines the rules related to LastAge Prestige Classes. */
EberronPrestige.identityRules = function(rules, classes) {
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
    EberronPrestige.classRulesExtra(rules, clas);
  }
};

/* Defines rules related to character features. */
EberronPrestige.talentRules = function(rules, features) {
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
};

/* Defines the rules related to Eberron prestige classes. */
EberronPrestige.classRulesExtra = function(rules, name) {

  var prefix =
    name.substring(0,1).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(name == 'Dragonmark Heir') {

    rules.defineRule
      ('actionPoints', 'abilityNotes.actionPointBonusFeature', '+', '2');
    rules.defineRule('casterLevels.Greater Dragonmark',
      'levels.Dragonmark Heir', '+', null
    );
    rules.defineRule('casterLevels.Least Dragonmark',
      'levels.Dragonmark Heir', '+', null
    );
    rules.defineRule('casterLevels.Lesser Dragonmark',
      'levels.Dragonmark Heir', '+', null
    );
    rules.defineRule
      ('skillNotes.houseStatusFeature', 'levels.Dragonmark Heir', '=', null);

  } else if(name == 'Eldeen Ranger') {

    rules.defineRule('casterLevels.Eldeen Ranger',
      'eldeenRangerFeatures.Touch Of Contagion', '?', null,
      'levels.Eldeen Ranger', '=', 'source < 5 ? null : source'
    );
    rules.defineRule
      ('casterLevels.Contagion', 'casterLevels.Eldeen Ranger', '^=', null);
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calcuated even for non-Wizard Eldeen Rangers.
    rules.defineRule
      ('casterLevels.W', 'casterLevels.Eldeen Ranger', '^=', '1');
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
      'eldeenRangerFeatures.Greensingers', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Darkvision',
      'eldeenRangerFeatures.Gatekeepers', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Ferocity',
      'eldeenRangerFeatures.Ashbound', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Improved Critical',
      'eldeenRangerFeatures.Wardens Of The Wood', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Nature Sense',
      'eldeenRangerFeatures.Wardens Of The Wood', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Resist Aberrations',
      'eldeenRangerFeatures.Gatekeepers', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Resist Corruption',
      'eldeenRangerFeatures.Children Of Winter', '?', null
    );
    rules.defineRule("eldeenRangerFeatures.Resist Nature's Lure",
      'eldeenRangerFeatures.Greensingers', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Resist Poison',
      'eldeenRangerFeatures.Children Of Winter', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Resist The Arcane',
      'eldeenRangerFeatures.Ashbound', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Slippery Mind',
      'eldeenRangerFeatures.Gatekeepers', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Smite Evil',
      'eldeenRangerFeatures.Wardens Of The Wood', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Spell Resistance',
      'eldeenRangerFeatures.Ashbound', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Touch Of Contagion',
      'eldeenRangerFeatures.Children Of Winter', '?', null
    );
    rules.defineRule('eldeenRangerFeatures.Unearthly Grace',
      'eldeenRangerFeatures.Greensingers', '?', null
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

  } else if(name == 'Exorcist Of The Silver Flame') {

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
    rules.defineRule('resistance.Possession',
      'saveNotes.resistPossessionFeature', '+=', null
    );
    rules.defineRule('saveNotes.resistPossessionFeature',
      'exorcistOfTheSilverFlameFeatures.Resist Possession', '+=', '4'
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

  } else if(name == 'Extreme Explorer') {

    feats = [
      'Action Surge', 'Heroic Spirit', 'Persue', 'Spontaneous Casting'
    ];
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

  } else if(name == 'Heir Of Siberys') {

    feats = [
      'Action Boost', 'Action Surge', 'Favored In House', 'Pursue',
      'Spontaneous Casting'
    ];
    rules.defineRule
      ('actionPoints', 'abilityNotes.actionPointBonusFeature', '+', '2');
    rules.defineRule
      ('casterLevels.Heir Of Siberys', 'levels.Heir Of Siberys', '=', '15');
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
    rules.defineRule
      ('magicNotes.siberysMarkFeature', '', '=', '"spells %1/day"');
    rules.defineRule('magicNotes.siberysMarkFeature.1',
      'levels.Heir Of Siberys', '=', 'source < 2 ? null : Math.min(source + 1, 2)'
    );
    // Set casterLevels.[CS] to a minimal value so that spell DC will be
    // calcuated even for non-caster characters.
    rules.defineRule
      ('casterLevels.C', 'casterLevels.Heir Of Siberys', '^=', '1');
    rules.defineRule
      ('casterLevels.S', 'casterLevels.Heir Of Siberys', '^=', '1');
    for(var dragonmark in Eberron.dragonmarksSpells) {
      var spells = Eberron.dragonmarksSpells[dragonmark][3].split(/,\s*/);
      for(var j = 0; j < spells.length; j++) {
        var spell = spells[j];
        rules.defineRule('casterLevels.' + spell,
          'casterLevels.Heir Of Siberys', '^=', null
        );
        spells[j] = '<i>' + spell + '</i> %1/day';
      }
      rules.defineRule('magicNotes.siberysMarkFeature',
        'isDragonmark.' + dragonmark, '=', '"' + spells.join(', ') + '"'
      );
    };

  } else if(name == 'Master Inquisitive') {

    feats = [
      'Alertness', 'Deceitful', 'Heroic Spirit', 'Improved Initiative',
      'Iron Will', 'Negotiator', 'Persuasive', 'Recognize Impostor',
      'Research', 'Toughness', 'Track', 'Urban Tracking'
    ];
    rules.defineRule('casterLevels.Master Inquisitive',
      'masterInquisitiveFeatures.Natural Spells', '?', null,
      'levels.Master Inquisitive', '=', null
    );
    rules.defineRule('casterLevels.Discern Lies',
      'casterLevels.Master Inquisitive', '^=', null
    );
    rules.defineRule('casterLevels.True Seeing',
      'casterLevels.Master Inquisitive', '^=', null
    );
    rules.defineRule('casterLevels.Zome Of Truth',
      'casterLevels.Master Inquisitive', '^=', null
    );
    // Set casterLevels.C to a minimal value so that spell DC will be
    // calcuated even for non-Cleric Master Inquisitives.
    rules.defineRule
      ('casterLevels.C', 'casterLevels.Master Inquisitive', '^=', '1');
    rules.defineRule('featCount.Master Inquisitive',
      'levels.Master Inquisitive', '=',
      'source < 2 ? null : Math.floor(source / 2)'
    );

  } else if(name == 'Warforged Juggernaut') {

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

  } else if(name == 'Weretouched Master') {

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
    rules.defineRule('weretouchedMasterAnimal',
      '', '=', '"None"',
      'weretouchedMasterFeatures.Bear', '=', '"Bear"',
      'weretouchedMasterFeatures.Boar', '=', '"Boar"',
      'weretouchedMasterFeatures.Rat', '=', '"Rat"',
      'weretouchedMasterFeatures.Tiger', '=', '"Tiger"',
      'weretouchedMasterFeatures.Wolf', '=', '"Wolf"',
      'weretouchedMasterFeatures.Wolverine', '=', '"Wolverine"'
    );
    rules.defineRule('weretouchedMasterFeatures.Climb Speed',
      'weretouchedMasterAnimal', '?', 'source == "Rat"'
    );
    rules.defineRule('weretouchedMasterFeatures.Fierce Will',
      'weretouchedMasterAnimal', '?', 'source == "Boar"'
    );
    rules.defineRule('weretouchedMasterFeatures.Improved Grab',
      'weretouchedMasterAnimal', '?', 'source == "Bear"'
    );
    rules.defineRule('weretouchedMasterFeatures.Pounce',
      'weretouchedMasterAnimal', '?', 'source == "Tiger"'
    );
    rules.defineRule('weretouchedMasterFeatures.Trip',
      'weretouchedMasterAnimal', '?', 'source == "Wolf"'
    );
    rules.defineRule('weretouchedMasterFeatures.Weretouched Claws',
      'weretouchedMasterAnimal', '?', '"BearTiger".indexOf(source) >= 0'
    );
    rules.defineRule('weretouchedMasterFeatures.Weretouched Fangs',
      'weretouchedMasterAnimal', '?', '"RatWolf".indexOf(source) >= 0'
    );
    rules.defineRule('weretouchedMasterFeatures.Weretouched Rage',
      'weretouchedMasterAnimal', '?', 'source == "Wolverine"'
    );
    rules.defineRule('weretouchedMasterFeatures.Weretouched Tusks',
      'weretouchedMasterAnimal', '?', '"BoarWolverine".indexOf(source) >= 0'
    );

  }

};
