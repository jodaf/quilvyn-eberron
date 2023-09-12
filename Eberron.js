/*
Copyright 2023, James J. Hayes

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

/*jshint esversion: 6 */
/* jshint forin: false */
/* globals Quilvyn, QuilvynRules, QuilvynUtils, SRD35, PHB35, Pathfinder */
"use strict";

/*
 * This module loads the rules from the Eberron campaign setting.  The Eberron
 * function contains methods that load rules for particular parts/chapters
 * of the rule book; raceRules for character races, magicRules for spells, etc.
 * These member methods can be called independently in order to use a subset of
 * the Eberron rules.  Similarly, the constant fields of Eberron (FEATS,
 * SKILLS, etc.) can be manipulated to modify the choices. If #baseRules#
 * contains "Pathfinder", the Pathfinder plugin is used as the basis for the
 * Eberron rule set; otherwise, the SRD35 plugin is used.
 */
function Eberron(baseRules) {

  if(window.SRD35 == null) {
    alert('The Eberron module requires use of the SRD35 module');
    return;
  }

  Eberron.USE_PATHFINDER =
    window.Pathfinder != null && Pathfinder.SRD35_SKILL_MAP &&
    baseRules != null && baseRules.includes('Pathfinder');

  let rules = new QuilvynRules(
    'Eberron - ' + (Eberron.USE_PATHFINDER ? 'Pathfinder 1E' : 'D&D v3.5'),
    Eberron.VERSION
  );
  rules.plugin = Eberron;
  rules.basePlugin = Eberron.USE_PATHFINDER ? Pathfinder : SRD35;
  Eberron.rules = rules;

  Eberron.CHOICES = rules.basePlugin.CHOICES.concat(Eberron.CHOICES_ADDED);
  rules.defineChoice('choices', Eberron.CHOICES);
  rules.choiceEditorElements = Eberron.choiceEditorElements;
  rules.choiceRules = Eberron.choiceRules;
  rules.removeChoice = SRD35.removeChoice;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.getPlugins = Eberron.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Eberron.randomizeOneAttribute;
  Eberron.RANDOMIZABLE_ATTRIBUTES =
    rules.basePlugin.RANDOMIZABLE_ATTRIBUTES.concat
    (Eberron.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', Eberron.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD35.getChoices;
  rules.ruleNotes = Eberron.ruleNotes;

  if(rules.basePlugin == window.Pathfinder) {
    SRD35.ABBREVIATIONS.CMB = 'Combat Maneuver Bonus';
    SRD35.ABBREVIATIONS.CMD = 'Combat Maneuver Defense';
  }

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes');
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels',
    'prestige:Prestige Levels,bag,prestiges', 'npc:NPC Levels,bag,npcs');

  Eberron.ALIGNMENTS = Object.assign({}, rules.basePlugin.ALIGNMENTS);
  Eberron.ANIMAL_COMPANIONS =
    Object.assign({}, rules.basePlugin.ANIMAL_COMPANIONS);
  Eberron.ARMORS =
    Object.assign({}, rules.basePlugin.ARMORS, Eberron.ARMORS_ADDED);
  Eberron.CLASSES =
    Object.assign({}, rules.basePlugin.CLASSES, Eberron.CLASSES_ADDED);
  Eberron.NPC_CLASSES = Object.assign({}, rules.basePlugin.NPC_CLASSES);
  for(let c in Eberron.CLASS_FEATURES_ADDED) {
    let features =
      QuilvynUtils.getAttrValueArray(Eberron.CLASS_FEATURES_ADDED[c], 'Features');
    let selectables =
      QuilvynUtils.getAttrValueArray(Eberron.CLASS_FEATURES_ADDED[c], 'Selectables');
    if(c in Eberron.CLASSES) {
      Eberron.CLASSES[c] =
        Eberron.CLASSES[c].replace(
          'Features=', 'Features="' + features.join('","') + '",'
        ).replace(
          'Selectables=', 'Selectables="' + selectables.join('","') + '",'
        );
    } else if(c in Eberron.NPC_CLASSES) {
      Eberron.NPC_CLASSES[c] =
        Eberron.NPC_CLASSES[c].replace(
          'Features=', 'Features="' + features.join('","') + '",'
        ).replace(
          'Selectables=', 'Selectables="' + selectables.join('","') + '",'
        );
    }
  }
  Eberron.FAMILIARS = Object.assign({}, rules.basePlugin.FAMILIARS);
  Eberron.FEATS =
    Object.assign({}, rules.basePlugin.FEATS, Eberron.FEATS_ADDED);
  Eberron.FEATURES =
    Object.assign({}, rules.basePlugin.FEATURES, Eberron.FEATURES_ADDED);
  Eberron.GOODIES = Object.assign({}, rules.basePlugin.GOODIES);
  Eberron.LANGUAGES =
    Object.assign({}, rules.basePlugin.LANGUAGES, Eberron.LANGUAGES_ADDED);
  Eberron.PATHS =
    Object.assign({}, rules.basePlugin.PATHS, Eberron.PATHS_ADDED);
  Eberron.RACES =
    Object.assign({}, rules.basePlugin.RACES, Eberron.RACES_ADDED);
  Eberron.SCHOOLS = Object.assign({}, rules.basePlugin.SCHOOLS);
  Eberron.SHIELDS = Object.assign({}, rules.basePlugin.SHIELDS);
  Eberron.SKILLS = Object.assign({}, rules.basePlugin.SKILLS);
  Eberron.SPELLS = Object.assign
    ({}, Eberron.USE_PATHFINDER ? Pathfinder.SPELLS :
         window.PHB35 != null ? PHB35.SPELLS : SRD35.SPELLS,
     Eberron.SPELLS_ADDED);
  for(let s in Eberron.SPELLS_LEVELS) {
    let levels = Eberron.SPELLS_LEVELS[s];
    if(!(s in Eberron.SPELLS)) {
      if(window.PHB35 && PHB35.SPELL_RENAMES && s in PHB35.SPELL_RENAMES) {
        s = PHB35.SPELL_RENAMES[s];
      } else {
        console.log('Missing spell "' + s + '"');
        continue;
      }
    }
    Eberron.SPELLS[s] =
      Eberron.SPELLS[s].replace('Level=', 'Level=' + levels + ',');
  }
  Eberron.WEAPONS =
    Object.assign({}, rules.basePlugin.WEAPONS, Eberron.WEAPONS_ADDED);

  Eberron.abilityRules(rules);
  Eberron.aideRules(rules, Eberron.ANIMAL_COMPANIONS, Eberron.FAMILIARS);
  Eberron.combatRules(rules, Eberron.ARMORS, Eberron.SHIELDS, Eberron.WEAPONS);
  Eberron.magicRules(rules, Eberron.SCHOOLS, Eberron.SPELLS);
  // Feats must be defined before classes
  Eberron.talentRules
    (rules, Eberron.FEATS, Eberron.FEATURES, Eberron.GOODIES, Eberron.LANGUAGES,
     Eberron.SKILLS);
  Eberron.identityRules(
    rules, Eberron.ALIGNMENTS, Eberron.CLASSES, Eberron.DEITIES,
    Eberron.HOUSES, Eberron.PATHS, Eberron.RACES, Eberron.PRESTIGE_CLASSES,
    Eberron.NPC_CLASSES
  );

  Quilvyn.addRuleSet(rules);

}

Eberron.VERSION = '2.4.1.0';

// Eberron uses PHB35 as its default base ruleset. If USE_PATHFINDER is true,
// the Eberron function will instead use rules taken from the Pathfinder plugin.
Eberron.USE_PATHFINDER = false;

Eberron.CHOICES_ADDED = ['House'];
Eberron.CHOICES = SRD35.CHOICES.concat(Eberron.CHOICES_ADDED);
Eberron.RANDOMIZABLE_ATTRIBUTES_ADDED = ['house'];
Eberron.RANDOMIZABLE_ATTRIBUTES =
  SRD35.RANDOMIZABLE_ATTRIBUTES.concat(Eberron.RANDOMIZABLE_ATTRIBUTES_ADDED);

SRD35.ABBREVIATIONS.AP = 'Action Points';

Eberron.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
Eberron.ANIMAL_COMPANIONS = Object.assign({}, SRD35.ANIMAL_COMPANIONS);
Eberron.ARMORS_ADDED = {
  'Darkleaf Banded':'AC=6 Weight=Medium Dex=2 Skill=4 Spell=30',
  'Darkleaf Breastplate':'AC=5 Weight=Light Dex=4 Skill=2 Spell=20',
  'Leafweave':'AC=2 Weight=Light Dex=7 Skill=0 Spell=5'
};
Eberron.ARMORS = Object.assign({}, SRD35.ARMORS, Eberron.ARMORS_ADDED);
Eberron.CLASSES_ADDED = {
  'Artificer':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Escape Artist","Handle Animal",Hide,Jump,' +
      '"Knowledge (Local)","Knowledge (Shadow)",Listen,"Move Silently",' +
      'Profession,Ride,"Sense Motive","Speak Language",Swim,Tumble ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Artificer Knowledge","1:Artisan Bonus","1:Craft Reserve",' +
      '"1:Disable Trap","1:Item Creation","1:Scribe Scroll","2:Brew Potion",' +
      '"3:Craft Wondrous Item","4:Artificer Feat Bonus","4:Craft Homunculus",' +
      '"5:Craft Magic Arms And Armor","5:Retain Essence",' +
      '"6:Metamagic Spell Trigger","7:Craft Wand","9:Craft Rod",' +
      '"11:Metamagic Spell Completion","12:Craft Staff",' +
      '"13:Artificer Skill Mastery","14:Forge Ring" ' +
    'Skills=' +
      'Appraise,Concentration,Craft,"Disable Device","Knowledge (Arcana)",' +
      '"Knowledge (Engineering)","Knowledge (Planes)","Open Lock",' +
      'Profession,Search,Spellcraft,"Use Magic Device" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'A1:1=2;2=3;14=4,' +
      'A2:3=1;4=2;5=3;15=4,' +
      'A3:5=1;6=2;8=3;16=4,' +
      'A4:8=1;9=2;13=3;17=4,' +
      'A5:11=1;12=2;14=3;18=4,' +
      'A6:14=1;15=2;17=3;19=4'
};
Eberron.CLASS_FEATURES_ADDED = {
  'Cleric':
    'Features=' +
      '"features.Artifice Domain ? 1:Artifice Master",' +
      '"features.Artifice Domain ? 1:Empowered Creation",' +
      '"features.Charm Domain ? 1:Turn On The Charm",' +
      '"features.Commerce Domain ? 1:Commercial",' +
      '"features.Community Domain ? 1:Community Pillar",' +
      '"features.Deathless Domain ? 1:Rebuke Deathless",' +
      '"features.Decay Domain ? 1:Touch Of Decay",' +
      '"features.Dragon Below Domain ? 1:Augment Summoning",' +
      '"features.Exorcism Domain ? 1:Exorcise",' +
      '"features.Feast Domain ? 1:Feast Gut",' +
      '"features.Life Domain ? 1:Add Life",' +
      '"features.Madness Domain ? 1:Clarity Of True Madness",' +
      '"features.Madness Domain ? 1:Madness-Weakened",' +
      '"features.Meditation Domain ? 1:Meditative Casting",' +
      '"features.Necromancer Domain ? 1:Empowered Necromancy",' +
      '"features.Passion Domain ? 1:Fit Of Passion",' +
      '"features.Shadow Domain ? 1:Blind-Fight",' +
      '"features.Weather Domain ? 1:All-Weather",' +
      '"features.Weather Domain ? 1:Weather-Wise" ' +
    'Selectables=' +
      '"deityDomains =~ \'Artifice\' ? 1:Artifice Domain:Domain",' +
      '"deityDomains =~ \'Charm\' ? 1:Charm Domain:Domain",' +
      '"deityDomains =~ \'Commerce\' ? 1:Commerce Domain:Domain",' +
      '"deityDomains =~ \'Community\' ? 1:Community Domain:Domain",' +
      '"deityDomains =~ \'Deathless\' ? 1:Deathless Domain:Domain",' +
      '"deityDomains =~ \'Decay\' ? 1:Decay Domain:Domain",' +
      '"deityDomains =~ \'Dragon Below\' ? 1:Dragon Below Domain:Domain",' +
      '"deityDomains =~ \'Exorcism\' ? 1:Exorcism Domain:Domain",' +
      '"deityDomains =~ \'Feast\' ? 1:Feast Domain:Domain",' +
      '"deityDomains =~ \'Life\' ? 1:Life Domain:Domain",' +
      '"deityDomains =~ \'Madness\' ? 1:Madness Domain:Domain",' +
      '"deityDomains =~ \'Meditation\' ? 1:Meditation Domain:Domain",' +
      '"deityDomains =~ \'Necromancer\' ? 1:Necromancer Domain:Domain",' +
      '"deityDomains =~ \'Passion\' ? 1:Passion Domain:Domain",' +
      '"deityDomains =~ \'Shadow\' ? 1:Shadow Domain:Domain",' +
      '"deityDomains =~ \'Weather\' ? 1:Weather Domain:Domain"',
};
Eberron.CLASSES = Object.assign({}, SRD35.CLASSES, Eberron.CLASSES_ADDED);
Eberron.NPC_CLASSES = Object.assign({}, SRD35.NPC_CLASSES);
for(let c in Eberron.CLASS_FEATURES_ADDED) {
  let features =
    QuilvynUtils.getAttrValueArray(Eberron.CLASS_FEATURES_ADDED[c], 'Features');
  let selectables =
    QuilvynUtils.getAttrValueArray(Eberron.CLASS_FEATURES_ADDED[c], 'Selectables');
  if(c in Eberron.CLASSES) {
    Eberron.CLASSES[c] =
      Eberron.CLASSES[c].replace(
        'Features=', 'Features="' + features.join('","') + '",'
      ).replace(
        'Selectables=', 'Selectables="' + selectables.join('","') + '",'
      );
  } else if(c in Eberron.NPC_CLASSES) {
    Eberron.NPC_CLASSES[c] =
      Eberron.NPC_CLASSES[c].replace(
        'Features=', 'Features="' + features.join('","') + '",'
      ).replace(
        'Selectables=', 'Selectables="' + selectables.join('","') + '",'
      );
  }
}
Eberron.PRESTIGE_CLASSES = {
  'Dragonmark Heir':
    'Require=' +
      '"features.Favored In House","features.Least Dragonmark",' +
      '"house != \'None\'",' +
      '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Elf|Half-Orc|Human\'",' +
      '"countSkillsGe7 >= 2" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Diplomacy,"Gather Information",Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Nobility)",Perform,Ride,' +
      '"Sense Motive","Speak Language",Spellcraft ' +
    'Features=' +
      '"1:House Status","1:Lesser Dragonmark","2:Additional Action Points",' +
      '"2:Improved Least Dragonmark","3:Improved Lesser Dragonmark",' +
      '"4:Greater Dragonmark","5:Improved Greater Dragonmark"',
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
      '"1:Armor Proficiency (Light)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"features.Ashbound ? 1:Resist The Arcane",' +
      '"features.Children Of Winter ? 1:Resist Poison",' +
      '"features.Gatekeepers ? 1:Resist Corruption (Gatekeepers)",' +
      '"features.Greensingers ? 1:Resist Nature\'s Lure",' +
      '"features.Wardens Of The Wood ? 1:Nature Sense",' +
      '"2:Hated Foe",' +
      '"features.Ashbound ? 3:Ferocity",' +
      '"features.Children Of Winter ? 3:Resist Corruption (Children Of Winter)",' +
      '"features.Gatekeepers ? 3:Darkvision",' +
      '"features.Greensingers ? 3:Unearthly Grace",' +
      '"features.Wardens Of The Wood ? 3:Improved Critical",' +
      '"4:Favored Enemy",' +
      '"features.Ashbound ? 5:Spell Resistance",' +
      '"features.Children Of Winter ? 5:Touch Of Contagion",' +
      '"features.Gatekeepers ? 5:Slippery Mind",' +
      '"features.Greensingers ? 5:Greensinger Damage Reduction",' +
      '"features.Wardens Of The Wood ? 5:Smite Evil" ' +
    'Selectables=' +
      '1:Ashbound,' +
      '"alignment !~ \'Good\' ? 1:Children Of Winter",' +
      '"alignment !~ \'Evil\' ? 1:Gatekeepers",' +
      '"alignment =~ \'Chaotic\' ? 1:Greensingers",' +
      '"alignment !~ \'Evil\' ? 1:Wardens Of The Wood"',
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
      '"2:Caster Level Bonus","2:Weapon Of Silver",3:Darkvision,' +
      '"3:Resist Charm","3:Resist Possession","3:Resist Unnatural",' +
      '"3:Smite Evil","4:Detect Thoughts","4:Weapon Of Good",' +
      '"5:Silver Exorcism","6:Weapon Of Flame","8:Weapon Of Law",' +
      '"9:Weapon Of Sacred Flame","10:Warding Flame"',
  'Extreme Explorer':
    'Require=' +
      '"baseAttack >= 4","features.Action Boost",' +
      '"skills.Knowledge (Dungeoneering) >= 4","skills.Survival >= 4"' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,"Decipher Script","Disable Device","Escape Artist",' +
      'Jump,"Knowledge (Arcana)","Knowledge (Dungeoneering)",' +
      '"Knowledge (History)",Listen,"Open Lock",Ride,Search,"Speak Language",' +
      'Survival,Swim,Tumble,"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Additional Action Points","1:Trap Sense","2:Dodge Bonus",2:Evasion,' +
      '"2:Extreme Hustle","3:Extreme Explorer Feat Bonus","4:Extreme Action"',
  'Heir Of Siberys':
    'Require=' +
      '"features.Aberrant Dragonmark == 0","features.Heroic Spirit",' +
      '"features.Least Dragonmark == 0",' +
      '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half Orc|Human\'",' +
      '"countSkillsGe15 >= 2" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    // Note: Heir Of Siberys grants no additional class skills
    'Features=' +
      '"1:Additional Action Points","1:Heir Of Siberys Feat Bonus",' +
      '"2:Siberys Mark","3:Improved Siberys Mark",' +
      '"casterLevel ? 2:Caster Level Bonus",' +
      '"casterLevel == 0 ? 2:Feat Bonus"',
  'Master Inquisitive':
    'Require=' +
      '"features.Investigate","skills.Gather Information >= 6",' +
      '"skills.Search >= 3","skills.Sense Motive >= 6" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Bluff,"Decipher Script","Gather Information","Knowledge (Local)",' +
      'Listen,Search,"Sense Motive",Spot ' +
    'Features=' +
      '"1:Zone Of Truth",2:Contact,"2:Master Inquisitive Feat Bonus",' +
      '"3:Discern Lies","5:True Seeing"',
  'Warforged Juggernaut':
    'Require=' +
     '"baseAttack >= 5","features.Adamantine Body",' +
     '"features.Improved Bull Rush","features.Power Attack",' +
     '"race == \'Warforged\'" ' +
    'HitDie=d12 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,Intimidate,Jump,Survival,Swim ' +
    'Features=' +
      '"1:Armor Spikes","1:Expert Bull Rush","1:Powerful Charge",1:Reserved,' +
      '"2:Charge Bonus","2:Construct Perfection I","2:Extended Charge",' +
      '"3:Healing Immunity","3:Construct Perfection II",' +
      '"3:Superior Bull Rush","4:Construct Perfection III",' +
      '"5:Construct Perfection IV","5:Greater Powerful Charge"',
  'Weretouched Master':
    'Require=' +
      '"baseAttack >= 4","sumShifterFeats >= 1","race == \'Shifter\'",' +
      '"skills.Knowledge (Nature) >= 5","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,"Handle Animal",Hide,Intimidate,Jump,' +
      '"Knowledge (Nature)",Listen,"Move Silently",Spot,Survival,Swim ' +
    'Features=' +
      '"2:Weretouched Feat Bonus","2:Wild Empathy",3:Scent,' +
      '"features.Bear ? 3:Improved Grab",' +
      '"features.Boar ? 3:Fierce Will",' +
      '"features.Rat ? 3:Climb Speed",' +
      '"features.Tiger ? 3:Pounce",' +
      '"features.Wolf ? 3:Trip",' +
      '"features.Wolverine ? 3:Weretouched Rage",' +
      '"4:Frightful Shifting",' +
      '"features.Bear ? 5:Alternate Form (Bear)",' +
      '"features.Boar ? 5:Alternate Form (Boar)",' +
      '"features.Rat ? 5:Alternate Form (Rat)",' +
      '"features.Tiger ? 5:Alternate Form (Tiger)",' +
      '"features.Wolf ? 5:Alternate Form (Wolf)",' +
      '"features.Wolverine ? 5:Alternate Form (Wolverine)" ' +
    'Selectables=' +
      '1:Bear,1:Boar,1:Rat,1:Tiger,1:Wolf,1:Wolverine'
};
Eberron.DEITIES = {
  'None':'',
  'Arawai':'Alignment=NG Weapon=Morningstar Domain=Good,Life,Plant,Weather',
  'Aureon':'Alignment=LN Weapon=Quarterstaff Domain=Knowledge,Law,Magic',
  'Balinor':'Alignment=N Weapon=Battleaxe Domain=Air,Animal,Earth',
  'Boldrei':'Alignment=LG Weapon=Spear Domain=Community,Good,Law,Protection',
  'Dol Arrah':'Alignment=LG Weapon=Halberd Domain=Good,Law,Sun,War',
  'Dol Dorn':'Alignment=CG Weapon=Longsword Domain=Chaos,Good,Strength,War',
  'Kol Korran':
    'Alignment=N Weapon="Heavy Mace","Light Mace" Domain=Charm,Commerce,Travel',
  'Olladra':'Alignment=NG Weapon=Sickle Domain=Feast,Good,Healing,Luck',
  'Onatar':'Alignment=NG Weapon=Warhammer Domain=Artifice,Fire,Good',
  'The Blood Of Vol':
    'Alignment=LE Weapon=Dagger Domain=Death,Evil,Law,Necromancer',
  'The Cults Of The Dragon Below':
    'Alignment=LN Weapon="Heavy Pick" Domain="Dragon Below",Earth,Evil,Madness',
  'The Devourer':
    'Alignment=NE Weapon=Trident Domain=Destruction,Evil,Water,Weather',
  'The Fury':'Alignment=NE Weapon=Rapier Domain=Evil,Madness,Passion',
  'The Keeper':'Alignment=NE Weapon=Scythe Domain=Death,Decay,Evil',
  'The Mockery':'Alignment=NE Weapon=Kama Domain=Destruction,Evil,Trickery,War',
  'The Path Of Light':
    'Alignment=LN Weapon=Unarmed Domain=Law,Meditation,Protection',
  'The Shadow':
    'Alignment=CE Weapon=Quarterstaff Domain=Chaos,Evil,Magic,Shadow',
  'The Silver Flame':
    'Alignment=LG Weapon=Longbow Domain=Exorcism,Good,Law,Protection',
  'The Traveler':
    'Alignment=CN Weapon=Scimitar Domain=Artifice,Chaos,Travel,Trickery',
  'The Undying Court':
    'Alignment=NG Weapon=Scimitar Domain=Deathless,Good,Protection'
};
Eberron.FAMILIARS = Object.assign({}, SRD35.FAMILIARS);
Eberron.FEATS_ADDED = {
  'Aberrant Dragonmark':
    'Type=General ' +
    'Require="feats.Least Dragonmark == 0",' +
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Elf|Half-Orc|Human\'"',
  'Action Boost':'Type=General',
  'Action Surge':'Type=General Require="baseAttack >= 3"',
  'Adamantine Body':
    'Type=General ' +
    'Require="race == \'Warforged\'" ' +
    'Imply="features.Mithral Body == 0","levels.Druid == 0"',
  'Ashbound':'Type=General Require="features.Spontaneous Druid Spell"',
  'Attune Magic Weapon':
    'Type="Item Creation" ' +
    'Require="casterLevel >= 5","features.Craft Magic Arms And Armor"',
  'Beast Shape':
    'Type=General ' +
    'Require="Max \'^features.Beast Totem\' > 0",' +
            '"magicNotes.wildShape =~ \'huge\'"',
  'Beast Totem (Chimera)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Digester)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Displacer Beast)':
    'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Gorgon)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Krenshar)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Unicorn)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Winter Wolf)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Yrthak)':'Type=General Require="features.Wild Empathy"',
  'Beasthide Elite':'Type=General,Shifter Require=features.Beasthide',
  'Bind Elemental':
    'Type="Item Creation" ' +
    'Require="casterLevel >= 9",' +
            '"features.Craft Wondrous Item"',
  'Child Of Winter':
    'Type=General ' +
    'Require="alignment !~ \'Good\'",' +
            '"features.Spontaneous Druid Spell"',
  'Cliffwalk Elite':'Type=General,Shifter Require=features.Cliffwalk',
  'Craft Construct':  // From MM, needed for Artificer class
    'Type="Item Creation" ' +
    'Require="features.Craft Magic Arms And Armor",' +
            '"features.Craft Wondrous Item"',
  'Double Steel Strike':
    'Type=General ' +
    'Require="features.Flurry Of Blows",' +
            '"features.Weapon Proficiency (Two-Bladed Sword)" ' +
    'Imply="weapons.Two-Bladed Sword"',
  'Dragon Rage':
    'Type=General ' +
    'Require="Max \'^features.Dragon Totem\' > 0",' +
             'features.Rage,' +
             '"origin == \'Argonnessen\'"',
  'Dragon Totem (Black)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Blue)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Brass)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Bronze)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Copper)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Gold)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Green)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Red)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (Silver)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Dragon Totem (White)':
    'Type=General Require="baseAttack >= 1","origin =~ \'Argonnessen|Seren\'"',
  'Ecclesiarch':
    'Type=General ' +
    'Require="skills.Knowledge (Religion) >= 6" ' +
    'Imply=features.Leadership',
  'Education':'Type=General',
  'Exceptional Artisan':
    'Type="Item Creation" Require="sumItemCreationFeats >= 2"',
  'Extend Rage':'Type=General Require=features.Rage',
  'Extra Music':'Type=General Require="features.Bardic Music"',
  'Extra Rings':
    'Type="Item Creation" Require="casterLevel >= 12","features.Forge Ring"',
  'Extra Shifter Trait':
    'Type=General,Shifter Require="race == \'Shifter\'","sumShifterFeats >= 3"',
  'Extraordinary Artisan':
    'Type="Item Creation" Require="sumItemCreationFeats >= 2"',
  'Favored In House':
    'Type=General ' +
    'Require="house != \'None\'",' +
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Elf|Half-Orc|Human\'"',
  'Flensing Strike':
    'Type=General ' +
    'Require="features.Weapon Focus (Kama)",' +
            '"features.Weapon Proficiency (Kama)"',
  'Gatekeeper Initiate':
    'Type=General Require="features.Spontaneous Druid Spell"',
  'Great Bite':
    'Type=General,Shifter Require="baseAttack >= 6",features.Longtooth',
  'Great Rend':
    'Type=General,Shifter Require="baseAttack >= 4",features.Razorclaw',
  'Greater Dragonmark':
    'Type=General ' +
    'Require="features.Least Dragonmark",' +
            '"features.Lesser Dragonmark",' +
            '"house != \'None\'",' +
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Elf|Half-Orc|Human\'",' +
            '"countSkillsGe12 >= 2"',
  'Greater Powerful Charge':
    'Type=General ' +
    'Require="baseAttack >= 4",' +
            '"features.Powerful Charge",' +
            '"features.Small == 0"',
  'Greater Shifter Defense':
    'Type=General,Shifter ' +
    'Require="features.Shifter Defense",' +
            '"race == \'Shifter\'",' +
            '"sumShifterFeats >= 5"',
  'Greensinger Initiate':
    'Type=General Require="features.Spontaneous Druid Spell"',
  'Haunting Melody':
    'Type=General ' +
    'Require="features.Bardic Music",' +
            '"sumPerformRanks >= 9"',
  'Healing Factor':
    'Type=General,Shifter Require="constitution >= 13","race == \'Shifter\'"',
  'Heroic Spirit':'Type=General',
  'Improved Damage Reduction':'Type=General Require="race == \'Warforged\'"',
  'Improved Fortification':
    'Type=General Require="baseAttack >= 6","race == \'Warforged\'"',
  'Improved Natural Attack (Claws)':
    'Type=General Require="baseAttack >= 4","weapons.Claws"',
  'Improved Natural Attack (Fangs)':
    'Type=General Require="baseAttack >= 4","weapons.Fangs||weapons.Tusks"',
  'Investigate':'Type=General',
  'Knight Training':'Type=General Imply="levels.Paladin > 0"',
  'Least Dragonmark':
    'Type=General ' +
    'Require="house != \'None\'",' +
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Elf|Half-Orc|Human\'"',
  'Legendary Artisan':
    'Type="Item Creation" Require="sumItemCreationFeats >= 2"',
  'Lesser Dragonmark':
    'Type=General ' +
    'Require="house != \'None\'",' +
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Elf|Half-Orc|Human\'",' +
            '"features.Least Dragonmark",' +
            '"countSkillsGe9 >= 2"',
  'Longstride Elite':'Type=General,Shifter Require=features.Longstride',
  'Mithral Body':
    'Type=General ' +
    'Require="race == \'Warforged\'" ' +
    'Imply="features.Adamantine Body == 0","levels.Druid == 0"',
  'Mithral Fluidity':
    'Type=General Require="race == \'Warforged\'","features.Mithral Body"',
  'Monastic Training':'Type=General Imply="levels.Monk > 0"',
  'Music Of Growth':
    'Type=General ' +
    'Require="features.Bardic Music",' +
            '"Sum \'^skills.Perform\' >= 12"',
  'Music Of Making':
    'Type=General ' +
    'Require="features.Bardic Music",' +
            '"Sum \'^skills.Perform\' >= 9"',
  'Powerful Charge':
    'Type=General Require="baseAttack >= 1","features.Small == 0"',
  'Precise Swing':'Type=General Require="baseAttack >= 5"',
  'Pursue':'Type=General Require="features.Combat Reflexes"',
  'Raging Luck':'Type=General Require=features.Rage',
  'Recognize Impostor':
    'Type=General Require="skills.Sense Motive >= 3","skills.Spot >= 3"',
  'Repel Aberration':
    'Type=General Require="features.Gatekeeper Initiate","levels.Druid >= 3"',
  'Research':'Type=General',
  'Right Of Counsel':'Type=General Require="race == \'Elf\'"',
  'Serpent Strike':
    'Type=General ' +
    'Require="features.Weapon Focus (Longspear)",' +
            '"features.Flurry Of Blows",' +
            '"weaponProficiencyLevel >= 1" ' +
    'Imply="weapons.Longspear"',
  'Shifter Defense':
    'Type=General,Shifter Require="race == \'Shifter\'","sumShifterFeats >= 3"',
  'Shifter Ferocity':
    'Type=General,Shifter Require="wisdom >= 13","race == \'Shifter\'"',
  'Shifter Multiattack':
    'Type=General,Shifter ' +
    'Require="baseAttack >= 6","features.Longtooth||features.Razorclaw"',
  'Silver Smite':
    'Type=General ' +
    'Require="deity == \'The Silver Flame\'","features.Smite Evil"',
  'Song Of The Heart':
    'Type=General ' +
    'Require="features.Bardic Music",' +
            '"features.Inspire Competence",' +
            '"Sum \'^skills.Perform\' >= 6"',
  'Soothe The Beast':
    'Type=General ' +
    'Require="features.Bardic Music","Sum \'^skills.Perform\' >= 6"',
  'Spontaneous Casting':'Type=General Require="casterLevel >= 5"',
  'Strong Mind':'Type=General Require="wisdom >= 11"',
  'Totem Companion':
    'Type=General ' +
    'Require="Max \'^features.Beast Totem\' >= 1","features.Wild Empathy"',
  'Undead Empathy':'Type=General Require="charisma >= 13"',
  'Urban Tracking':'Type=General',
  'Vermin Companion':
    'Type=General Require="alignment !~ \'Good\'","levels.Druid >= 3"',
  'Vermin Shape':
    'Type=General ' +
    'Require="alignment !~ \'Good\'",' +
            '"features.Child Of Winter",' +
            '"levels.Druid >= 5"',
  'Wand Mastery':
    'Type=General Require="casterLevel >= 9","features.Craft Wand"',
  'Warden Initiate':'Type=General Require="features.Spontaneous Druid Spell"',
  'Whirling Steel Strike':
    'Type=General ' +
    'Require="features.Weapon Focus (Longsword)",' +
            '"features.Flurry Of Blows" ' +
    'Imply="weapons.Longsword"'
};
Eberron.FEATS = Object.assign({}, SRD35.FEATS, Eberron.FEATS_ADDED);
Eberron.FEATURES_ADDED = {

  // Class
  'Artificer Feat Bonus':'Section=feature Note="%V Artificer feats"',
  'Artificer Knowledge':
    'Section=skill ' +
    'Note="Successful +%{levels.Artificer+intelligenceModifier} DC 15 check determines whether an item is magical"',
  'Artificer Skill Mastery':
    'Section=skill ' +
    'Note="May take 10 on Spellcraft or Use Magic Device when distracted"',
  'Artisan Bonus':
    'Section=skill Note="+2 Use Magic Device on items self can craft"',
  'Craft Homunculus':
    'Section=magic Note="May create a small homunculus w/up to %{level-2} HD"',
  'Craft Reserve':
    'Section=magic Note=%V',
  'Disable Trap':
    'Section=skill ' +
    'Note="May use Search and Disable Device to find and remove DC 20+ traps"',
  'Item Creation':
    'Section=magic ' +
    'Note="Successful +2 DC 20+caster level check creates magic items"',
  'Metamagic Spell Completion':
    'Section=skill ' +
    'Note="Successful DC 20 + 3x modified spell level Use Magic Device applies metamagic feat to spell from scroll %{intelligenceModifier+3}/dy"',
  'Metamagic Spell Trigger':
    'Section=magic Note="May apply metamagic feats to spells cast from wands"',
  'Retain Essence':
    'Section=magic Note="May drain magic item XP into craft reserve"',

  // Domain
  'Add Life':
    'Section=magic ' +
    'Note="Touched gains 1d6+%{levels.Cleric} temporary HP for %{levels.Cleric} hr"',
  'All-Weather':
    'Section=feature,skill ' +
    'Note="Can see clearly in any weather",' +
         '"+2 Survival (weather)/Survival is a class skill"',
  'Artifice Master':'Section=skill Note="+4 all Craft"',
  'Clarity Of True Madness':
    'Section=feature ' +
    'Note="May add %{levels.Cleric//2} to a Wisdom skill check or Will save 1/dy"',
  'Commercial':
    'Section=skill ' +
    'Note="+10 Profession (earn a living)/Appraise is a class skill"',
  'Community Pillar':
    'Section=magic,skill '  +
    'Note="May cast <i>Calm Emotions</i> 1/dy","+2 Diplomacy"',
  'Empowered Creation':
    'Section=magic Note="+1 caster level on Item Creation spells"',
  'Empowered Necromancy':
    'Section=magic Note="+1 caster level on Necromancy spells"',
  'Exorcise':
    'Section=combat Note="May use Turn Undead to exorcise spirits"',
  'Feast Gut':'Section=save Note="Immune to ingested poison and disease"',
  'Fit Of Passion':
    'Section=combat ' +
    'Note="May gain +4 Strength, +4 Constitution, and +2 Will save and suffer -2 AC for %{levels.Cleric} rd/dy"',
  'Madness-Weakened':'Section=save Note="-1 Will"',
  'Meditative Casting':
    'Section=magic Note="May gain x1.5 chosen spell variable effects 1/dy"',
  'Rebuke Deathless':
    'Section=combat Note="May use Turn Undead to rebuke deathless 1/dy"',
  'Touch Of Decay':
    'Section=magic ' +
    'Note="Touch inflicts -1d4 Constitution (living) or 2d6+%{levels.Cleric} HP (undead) 1/dy"',
  'Turn On The Charm':
    'Section=ability Note="May gain +4 Charisma for 1 min 1/dy"',

  // Feat
  'Aberrant Dragonmark':'Section=magic Note="May cast chosen spell 1/dy"',
  'Action Boost':
    'section=ability ' +
    'Note="Adds 1d8 instead of 1d6 when using AP on attack, skill, ability, level or saving throw"',
  'Action Surge':
    'Section=combat ' +
    'Note="May spend 2 AP to take an extra move or standard action"',
  'Adamantine Body':
    'Section=ability,combat Note="Max 20\' speed","+6 AC/DR 2/adamantine"',
  'Ashbound':
    'Section=magic ' +
    'Note="Dbl <i>Summon Nature\'s Ally</i> duration; summoned creatures gain +3 attack"',
  'Attune Magic Weapon':
    'Section=combat Note="+1 attack and damage w/magic weapons"',
  'Beast Shape':'Section=magic Note="May Wild Shape into beast totem 1/dy"',
  'Beast Totem (Chimera)':'Section=save Note="+4 vs. breath weapons"',
  'Beast Totem (Digester)':'Section=save Note="+4 vs. acid"',
  'Beast Totem (Displacer Beast)':'Section=save Note="+4 vs. targeted spells"',
  'Beast Totem (Gorgon)':'Section=save Note="+4 vs. petrification"',
  'Beast Totem (Krenshar)':'Section=save Note="+4 vs. fear"',
  'Beast Totem (Unicorn)':'Section=save Note="+4 vs. poison"',
  'Beast Totem (Winter Wolf)':'Section=save Note="+4 vs. cold"',
  'Beast Totem (Yrthak)':'Section=save Note="+4 vs. sonic"',
  'Beasthide Elite':'Section=combat Note="+2 Beasthide AC"',
  'Bind Elemental':
    'Section=magic Note="May incorporate elementals into wondrous items"',
  'Child Of Winter':
    'Section=magic ' +
    'Note="May use Druid animal spells on vermin and may summon vermin"',
  'Cliffwalk Elite':'Section=ability Note="+10\' Cliffwalk climb speed"',
  'Craft Construct':'Section=magic Note="May create enchanted construct"',
  'Detective':'Section=skill Note="+2 Spot"',
  'Double Steel Strike':
    'Section=combat Note="May use Flurry Of Blows w/two-bladed sword"',
  'Dragon Rage':
    'Section=combat,save ' +
    'Note="+2 AC during Rage","+10 %V resistance during Rage"',
  'Dragon Totem (Black)':'Section=save Note="Resistance 5 to acid"',
  'Dragon Totem (Blue)':'Section=save Note="Resistance 5 to electricity"',
  'Dragon Totem (Brass)':'Section=save Note="Resistance 5 to fire"',
  'Dragon Totem (Bronze)':'Section=save Note="Resistance 5 to electricity"',
  'Dragon Totem (Copper)':'Section=save Note="Resistance 5 to acid"',
  'Dragon Totem (Gold)':'Section=save Note="Resistance 5 to fire"',
  'Dragon Totem (Green)':'Section=save Note="Resistance 5 to acid"',
  'Dragon Totem (Red)':'Section=save Note="Resistance 5 to fire"',
  'Dragon Totem (Silver)':'Section=save Note="Resistance 5 to cold"',
  'Dragon Totem (White)':'Section=save Note="Resistance 5 to cold"',
  'Ecclesiarch':
    'Section=feature,skill ' +
    'Note="+2 Leadership",' +
         '"Gather Information is a class skill/Knowledge (Local) is a class skill"',
  'Education':
    'Section=skill ' +
    'Note="All Knowledge is a class skill/+1 any 2 Knowledge skills"',
  'Exceptional Artisan':
    'Section=magic Note="Reduces item creation base time by 25%"',
  'Extend Rage':'Section=combat Note="Adds 5 rd to Rage duration"',
  'Extra Music':
    'Section=feature Note="May use Bardic Music effects %V extra times/dy"',
  'Extra Rings':'Section=magic Note="May wear up to 4 magic rings at once"',
  'Extra Shifter Trait':
    'Section=feature Note="Gains extra Shifter trait w/out ability bonus"',
  'Extraordinary Artisan':
    'Section=magic Note="Reduces item creation base price by 25%"',
  'Favored In House':
    'Section=feature ' +
    'Note="+%{level>=16 ? 5 : level>=12 ? 4 : level>=7 ? 3 : level>=3 ? 2 : 1} attempts to acquire favors from house contacts %{level//2>?1}/wk"',
  'Finder':'Section=skill Note="+2 Search"',
  'Flensing Strike':
    'Section=combat ' +
    'Note="Kama causes -4 pain penalty to foe attacks, saves, and checks (DC %{10+level//2+wisdomModifier} Fort neg) for 1 min"',
  'Gatekeeper Initiate':
    'Section=magic,save,skill ' +
    'Note="Has access to additional spells",' +
         '"+2 vs. supernatural and aberrations",' +
         '"Knowledge (Planes) is a class skill"',
  'Great Bite':'Section=combat Note="Fangs Crit is x3"',
  'Great Rend':'Section=combat Note="+1d4+%{level//4+strengthModifier//2} HP on hit w/both claws"',
  'Greater Dragonmark':
    'Section=magic Note="May cast choice of level 3 dragonmark spell 1/dy"',
  'Greater Powerful Charge':
    'Section=combat ' +
    'Note="Raises Powerful Charge damage one size category to %V"',
  'Greater Shifter Defense':'Section=combat Note="+2 DR/silver while shifting"',
  'Greensinger Initiate':
    'Section=magic,skill ' +
    'Note="Has access to additional spells",' +
         '"Bluff is a class skill/Hide is a class skill/Perform is a class skill"',
  'Handler':'Section=skill Note="+2 Handle Animal"',
  'Haunting Melody':
    'Section=magic ' +
    'Note="R30\' Shakes foes (DC %{10+levels.Bard//2+charismaModifier} Will neg) for %{sumPerformRanks} rd"',
  'Healer':'Section=skill Note="+2 Heal"',
  'Healing Factor':
    'Section=combat Note="Recovers %{level} HP when shifting ends"',
  'Heroic Spirit':'Section=ability Note="+%{level*3} AP"',
  'Hospitaler':'Section=skill Note="+2 Diplomacy"',
  'Improved Damage Reduction':'Section=combat Note="DR +1/adamantine"',
  'Improved Fortification':
    'Section=combat Note="Immune to sneak attacks, critical hits, and healing"',
  'Improved Natural Attack (Claws)':
    'Section=combat Note="Claw damage increases one size category"',
  'Improved Natural Attack (Fangs)':
    'Section=combat Note="Fangs damage increases one size category"',
  'Investigate':
    'Section=skill ' +
    'Note="May use Search to find and analyze clues/Gains synergy with appropriate Knowledge skill"',
  'Knight Training':
    'Section=ability ' +
    'Note="Has no restrictions on combining Paladin and chosen class levels"',
  'Least Dragonmark':
    'Section=magic Note="May cast choice of level 1 dragonmark spell 1/dy"',
  'Legendary Artisan':
    'Section=magic Note="Reduces item creation XP price by 25%"',
  'Lesser Dragonmark':
    'Section=magic Note="May cast choice of level 2 dragonmark spell 1/dy"',
  'Longstride Elite':'Section=ability Note="+10\' Longstride Speed"',
  'Maker':'Section=skill Note="+2 all Craft"',
  'Mithral Body':'Section=combat Note="+3 AC"',
  'Mithral Fluidity':
    'Section=combat,skill ' +
    'Note="Raises Mithral Body dexterity AC limit by 1",' +
         '"Reduces skill penalty by 1"',
  'Monastic Training':
    'Section=ability ' +
    'Note="Has no restrictions on combining Monk and chosen class levels"',
  'Music Of Growth':
    'Section=magic ' +
    'Note="R30\' Bardic Music gives +4 Strength and Constitution to animal and plant creatures"',
  'Music Of Making':
    'Section=magic,skill ' +
    'Note="Dbl duration of conjuration spells involving Bardic Music",' +
         '"+4 Craft during Bardic Music"',
  'Powerful Charge':
    'Section=combat Note="Successful charge inflicts +%V HP"',
  'Precise Swing':
    'Section=combat Note="Melee attack ignores less-than-total cover"',
  'Pursue':
    'Section=combat ' +
    'Note="May spend 1 AP to step into area vacated by opponent"',
  'Raging Luck':'Section=ability Note="Gains 1 AP during Rage"',
  'Recognize Impostor':
    'Section=skill Note="+4 Sense Motive vs. Bluff and Spot vs. Disguise"',
  'Repel Aberration':
    'Section=combat ' +
    'Note="R60\' May hold at bay 2d6+%{levels.Druid+charismaModifier} HD of aberrations of up to (d20+%{levels.Druid*3-10+charismaModifier})/3 HD %{3+charismaModifier+combatNotes.extraTurning}/dy"',
  'Research':
    'Section=skill Note="May use Knowledge skill on library and records"',
  'Right Of Counsel':
    'Section=feature Note="May seek advice from deathless ancestor"',
  'Scribe':'Section=skill Note="+2 Decipher Script"',
  'Shadower':'Section=skill Note="+2 Gather Information"',
  'Shifter Defense':'Section=combat Note="DR 2/silver while shifting"',
  'Shifter Ferocity':
    'Section=combat Note="May continue fighting below 0 HP while shifting"',
  'Sentinel':'Section=skill Note="+2 Sense Motive"',
  'Serpent Strike':'Section=combat Note="May use Flurry Of Blows w/longspear"',
  'Shifter Multiattack':
    'Section=combat Note="Reduces penalty for additional natural attack to -2"',
  'Silver Smite':'Section=combat Note="Smite Evil inflicts +1d6 HP"',
  'Song Of The Heart':'Section=magic Note="+1 Bardic Music effects"',
  'Soothe The Beast':
    'Section=skill ' +
    'Note="R30\' Successful Perform check during Bardic Music changes animal reaction"',
  'Spontaneous Casting':
    'Section=magic ' +
    'Note="May spend 2 AP to substitute any known spell for a prepared one"',
  'Storm Walker':'Section=skill Note="+2 Balance"',
  'Strong Mind':'Section=save Note="+3 vs. psionics and mind attacks"',
  'Totem Companion':
    'Section=companion ' +
    'Note="Has Beast Totem magical beast as an animal companion"',
  'Traveler':'Section=skill Note="+2 Survival"',
  'Undead Empathy':
    'Section=skill ' +
    'Note="+4 Diplomacy (influence intelligent undead reaction)/May use Diplomacy w/mindless undead"',
  'Urban Tracking':
    'Section=skill Note="May use Gather Information to trace a person w/in communities"',
  'Vermin Companion':
    'Section=companion Note="Has vermin creature as an animal companion"',
  'Vermin Shape':'Section=magic Note="May Wild Shape into vermin"',
  'Wand Mastery':'Section=magic Note="+2 spell DC and caster level w/wands"',
  'Warden Initiate':
    'Section=combat,magic,skill ' +
    'Note="+2 AC (forests)",' +
         '"Has access to additional spells",' +
         '"Climb is a class skill/Jump is a class skill"',
  'Warder':'Section=skill Note="+2 Search"',
  'Whirling Steel Strike':
    'Section=combat Note="May use Flurry Of Blows w/longsword"',

  // Race
  'Beasthide':
    'Section=ability,combat ' +
    'Note="+2 Constitution while shifting",' +
         '"+%V AC while shifting"',
  'Cliffwalk':
    'Section=ability Note="+2 Dexterity and %V\' climb speed while shifting"',
  'Composite Plating':'Section=combat Note="+2 AC/Cannot wear armor"',
  'Deceptive':'Section=skill Note="+2 Bluff/+2 Intimidate"',
  'Dreamless':'Section=save Note="Immune to <i>Dream</i> and <i>Nightmare</i>"',
  'Humanlike':'Section=skill Note="+2 Disguise (human)"',
  'Influential':'Section=skill Note="+2 Bluff/+2 Diplomacy/+2 Intimidate"',
  'Intuitive':'Section=skill Note="+2 Sense Motive"',
  'Light Fortification':
    'Section=combat ' +
    'Note="25% chance of negating critical hits and sneak attacks"',
  'Longstride':
    'Section=ability Note="+2 Dexterity and +%V\' Speed while shifting"',
  'Longtooth':
    'Section=ability,combat ' +
    'Note="+2 Strength while shifting",' +
         '"Can attack w/fangs while shifting"',
  'Mechanized':'Section=feature Note="Has no need to breathe, eat, or sleep"',
  'Mindlink':
    'Section=magic ' +
    'Note="R30\' May use telepathy with willing target for %{level//2>?1} rd 1/dy"',
  'Minor Shape Change':
    'Section=magic Note="May use <i>Disguise Self</i> effects on body at will"',
  'Natural Psionic':'Section=magic Note="+1 PP each level"',
  'Natural Linguist':'Section=skill Note="Speak Language is a class skill"',
  'Razorclaw':
    'Section=ability,combat ' +
    'Note="+2 Strength while shifting",' +
         '"Can attack w/claws while shifting"',
  'Resist Charm':'Section=save Note="+2 vs. charm effects"',
  'Resist Mental':'Section=save Note="+2 vs. mind-altering effects"',
  'Resist Sleep':'Section=save Note="+2 vs. sleep effects"',
  'Shifter Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Intelligence/-2 Charisma"',
  'Shifting':'Section=feature Note="May use Shifter trait for %V rd 1/dy"',
  'Slam Weapon':'Section=combat Note="Can attack w/slam"',
  'Stable':
    'Section=combat ' +
    'Note="May perform strenuous activity at 0 HP; suffers no additional loss at negative HP"',
  'Unhealing':
    'Section=combat ' +
    'Note="Does not heal damage naturally; gains half effects from healing spells"',
  'Warforged Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Wisdom/-2 Charisma"',
  'Warforged Immunity':
    'Section=save ' +
    'Note="Immune to poison, sleep, paralysis, disease, nausea, fatigue, exhaustion, sickening, and energy drain"',
  'Warforged Vulnerability':
    'Section=save Note="Affected by effects that target wood or metal"',
  'Wildhunt':
    'Section=ability,feature,skill ' +
    'Note="+2 Constitution while shifting",' +
         '"R30\' May detect creature presence and track by smell",' +
         '"+2 Survival"',

  // Prestige classes
  'Additional Action Points':'Section=ability Note="+2 AP"',
  'Alternate Form (Bear)':
    'Section=ability ' +
    'Note="May shift to animal (+16 Strength, +2 Dexterity, +8 Constitution) or bipedal hybrid form"',
  'Alternate Form (Boar)':
    'Section=ability Note="May shift to animal (+4 Strength, +6 Constitution) or bipedal hybrid form"',
  'Alternate Form (Rat)':
    'Section=ability Note="May shift to animal (+6 Dexterity, +2 Constitution) or bipedal hybrid form"',
  'Alternate Form (Tiger)':
    'Section=ability ' +
    'Note="May shift to animal (+12 Strength, +4 Dexterity, +6 Constitution) or bipedal hybrid form"',
  'Alternate Form (Wolf)':
    'Section=ability ' +
    'Note="May shift to animal (+2 Strength, +4 Dexterity, +4 Constitution) or bipedal hybrid form"',
  'Alternate Form (Wolverine)':
    'Section=ability ' +
    'Note="May shift to animal (+4 Strength, +4 Dexterity, +8 Constitution) or bipedal hybrid form"',
  'Animalistic Heritage':'Section=skill Note="+2 Balance/+2 Climb/+2 Jump"',
  'Armor Spikes':'Section=combat Note="Grapple attack inflicts 1d%{$\'levels.Warforged Juggernaut\'>=4 ? 8 : 6} HP"',
  'Bear':
    'Section=ability,combat ' +
    'Note="+2 Strength while shifting",' +
         '"Can attack w/claws while shifting"',
  'Boar':
    'Section=ability,combat ' +
    'Note="+2 Constitution while shifting",' +
         '"Can attack w/tusks (fangs) while shifting"',
  'Caster Level Bonus':
    'Section=magic Note="+%V base class level for spells known and spells/dy"',
  'Charge Bonus':
    'Section=combat ' +
    'Note="+%{$\'levels.Warforged Juggernaut\'//2} attack when charging"',
  'Climb Speed':
    'Section=ability,skill ' +
    'Note="20\' climb speed (+10 for Cliffwalk) while shifting",' +
         '"+%V Climb"',
  'Construct Perfection I':
    'Section=combat Note="Immune to nonlethal damage and critical hits"',
  'Construct Perfection II':'Section=save Note="Immune to mental effects"',
  'Construct Perfection III':
    'Section=save Note="Immune to death and necromancy effects"',
  'Construct Perfection IV':
    'Section=save Note="Immune to ability damage and drain"',
  'Contact':'Section=feature Note="Has a level 3%1 associate or informant"',
  'Detect Thoughts':
    'Section=magic Note="May use <i>Detect Thoughts</i> effects at will"',
  'Discern Lies':
    'Section=magic ' +
    'Note="R%{$\'levels.Master Inquisitive\'//2*5+25}\' May reveal lies from %{$\'levels.Master Inquisitive\'} creatures in 15\' radius for conc or %{$\'levels.Master Inquisitive\'} rd (DC %{14+wisdomModifier} Will neg) 1/dy; may spend 2 AP for 2/dy"',
  'Dodge Bonus':'Section=combat Note="+%V AC when unencumbered"',
  'Expert Bull Rush':'Section=combat Note="+%{$\'levels.Warforged Juggernaut\'} bull rush and door breakage"',
  'Extended Charge':'Section=ability Note="+5 speed when charging"',
  'Extreme Action':
    'Section=ability Note="Retains AP on successful AP roll of 8"',
  'Extreme Explorer Feat Bonus':
    'Section=feature Note="%V Extreme Explorer feats"',
  'Extreme Hustle':'Section=combat Note="May spend 1 AP to gain a move action"',
  'Ferocity':'Section=combat Note="May continue fighting below 0 HP"',
  'Fierce Will':'Section=save Note="+4 Will while shifting"',
  'Flame Of Censure':
    'Section=combat ' +
    'Note="May stun or banish evil outsiders w/a successful turning check"',
  'Frightful Shifting':
    'Section=combat ' +
    'Note="R30\' Foes up to %{level-1} HD shaken for 5d6 rounds (DC %{$\'levels.Weretouched Master\'+10+charismaModifier} Will neg)"',
  'Greensinger Damage Reduction':'Section=combat Note="DR 3/cold iron"',
  'Hated Foe':
    'Section=combat Note="May spend 1 AP for dbl damage against favored enemy"',
  'Heir Of Siberys Feat Bonus':'Section=feature Note="1 Heir Of Siberys feat"',
  'Healing Immunity':'Section=save Note="Unaffected by healing spells"',
  'House Status':
    'Section=skill ' +
    'Note="+%{$\'levels.Dragonmark Heir\'} Charisma-based skills w/house members"',
  'Improved Grab':
    'Section=combat Note="May grapple w/out provoking AOO after claw hit"',
  'Improved Greater Dragonmark':
    'Section=magic Note="May use 2nd level 3 dragonmark spell or +1/dy"',
  'Improved Least Dragonmark':
    'Section=magic Note="May use 2nd level 1 dragonmark spell or +1/dy"',
  'Improved Lesser Dragonmark':
    'Section=magic Note="May use 2nd level 2 dragonmark spell or +1/dy"',
  'Improved Critical':
    'Section=feature ' +
    'Note="+1 General Feat (Improved Critical (choice of ranged weapon))"',
  'Improved Siberys Mark':'Section=magic Note="May use dragonmark spell 2/dy"',
  'Master Inquisitive Feat Bonus':
    'Section=feature Note="%V Master Inquisitive feats"',
  'Metal Immunity':'Section=save Note="Immune to mind-altering effects"',
  'Pounce':'Section=combat Note="May make full attack when charging"',
  'Rat':
    'Section=ability,combat ' +
    'Note="+2 Dexterity while shifting",' +
         '"Can attack w/fangs while shifting"',
  'Reserved':
    'Section=skill ' +
    'Note="-%V Bluff/-%V Diplomacy/-%V Gather Information/-%V Sense Motive"',
  'Resist Corruption (Children Of Winter)':
    'Section=save Note="Immune to disease/+2 vs. mind-altering effects"',
  'Resist Corruption (Gatekeepers)':
    'Section=save Note="+2 vs. aberration abilities"',
  'Resist Possession':'Section=save Note="+%V vs. possession"',
  'Resist The Arcane':'Section=save Note="+2 vs. arcane spells"',
  'Resist Unnatural':
    'Section=save Note="+2 vs. effects of evil outsiders and undead"',
  'Scent':
    'Section=feature ' +
    'Note="R30\' May detect creature presence and track by smell"',
  'Siberys Mark':
    'Section=magic Note="May use choice of house dragonmark spell %1/dy"',
  'Silver Exorcism':'Section=combat Note="+2 exorcism checks"',
  'Spell Resistance':'Section=save Note="Spell resistance 20"',
  'Superior Bull Rush':
    'Section=combat ' +
    'Note="Inflicts +1d%{$\'levels.Warforged Juggernaut\'>=4 ? 8 : 6}+%{strengthModifier} HP from bull rush"',
  'Tiger':
    'Section=ability,combat ' +
    'Note="+2 Strength while shifting",' +
         '"Can attack w/claws while shifting"',
  'Touch Of Contagion':'Section=magic Note="May cast <i>Contagion</i> 3/dy"',
  'Trip':
    'Section=combat Note="May trip w/out provoking AOO after successful bite"',
  'True Seeing':
    'Section=magic ' +
    'Note="May see through 120\' darkness, illusion, and invisibility for %{$\'levels.Master Inquisitive\'} min 1/dy; may spend 2 AP for 2/dy"',
  'Unearthly Grace':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Warding Flame':
    'Section=combat,feature,save ' +
    'Note=' +
      '"May gain +2 AC and inflict blindness on evil foes that strike self (DC %{charismaModifier+20} Fort neg) at will",' +
      '"May generate 60\' light at will",' +
      '"May gain spell Resistance 25 (evil casters and spells) at will"',
  'Weapon Of Flame':
    'Section=combat Note="Exorcist weapon inflicts +%Vd6 HP fire"',
  'Weapon Of Good':
    'Section=combat Note="Exorcist weapon considered good-aligned"',
  'Weapon Of Law':
    'Section=combat Note="Exorcist weapon considered lawful-aligned"',
  'Weapon Of Sacred Flame':
     'Section=combat Note="Exorcist weapon inflicts +1d6 HP fire"',
  'Weapon Of Silver':'Section=combat Note="Exorcist weapon considered silver"',
  'Weapon Of The Exorcist':
    'Section=combat ' +
    'Note="Exorcist weapon inflicts +1 HP and is considered magic%1%2%3"',
  'Weretouched Feat Bonus':'Section=feature Note="%V Shifter feats"',
  'Weretouched Rage':
    'Section=combat ' +
    'Note="Gains +2 Strength, +2 Constitution, and -2 AC after taking damage until self or foe dies"',
  'Wolf':
    'Section=ability,combat ' +
    'Note="+2 Dexterity while shifting",' +
         '"Can attack w/fangs while shifting"',
  'Wolverine':
    'Section=ability,combat ' +
    'Note="+2 Constitution while shifting",' +
         '"Can attack w/fangs while shifting"',
  'Zone Of Truth':
    'Section=magic ' +
    'Note="R%{$\'levels.Master Inquisitive\'//2*5+25}\' May create 20\' radius that prohibits lying for %{$\'levels.Master Inquisitive\'} min (DC %{wisdomModifier+12} Will neg) 1/dy; may spend 2 AP for 2/dy"'

};
Eberron.FEATURES = Object.assign({}, SRD35.FEATURES, Eberron.FEATURES_ADDED);
Eberron.GOODIES = Object.assign({}, SRD35.GOODIES);
Eberron.HOUSES = {
  'None':
    '',
  'Cannith':
    'Dragonmark=Making ' +
    'Race=Human ' +
    'Features=Maker',
  'Deneith':
    'Dragonmark=Sentinel ' +
    'Race=Human ' +
    'Features=Sentinel',
  'Ghallanda':
    'Dragonmark=Hospitality ' +
    'Race=Halfling ' +
    'Features=Hospitaler',
  'Jorasco':
    'Dragonmark=Healing ' +
    'Race=Halfling ' +
    'Features=Healer',
  'Kundarak':
    'Dragonmark=Warding ' +
    'Race=Dwarf ' +
    'Features=Warder',
  'Lyrandar':
    'Dragonmark=Storm ' +
    'Race=Half-Elf ' +
    'Features="Storm Walker"',
  'Medani':
    'Dragonmark=Detection ' +
    'Race=Half-Elf ' +
    'Features=Detective',
  'Orien':
    'Dragonmark=Passage ' +
    'Race=Human ' +
    'Features=Traveler',
  'Phiarlan':
    'Dragonmark=Shadow ' +
    'Race=Elf ' +
    'Features=Shadower',
  'Sivis':
    'Dragonmark=Scribing ' +
    'Race=Gnome ' +
    'Features=Scribe',
  'Tharashk':
    'Dragonmark=Finding ' +
    'Race=Half-Orc,Human ' +
    'Features=Finder',
  'Thuranni':
    'Dragonmark=Shadow ' +
    'Race=Elf ' +
    'Features=Shadower',
  'Vadalis':
    'Dragonmark=Handling ' +
    'Race=Human ' +
    'Features=Handler'
};
Eberron.LANGUAGES_ADDED = {
  'Argon':'',
  'Daan':'',
  'Daelkyr':'',
  'Irial':'',
  'Kythric':'',
  'Mabran':'',
  'Quori':'',
  'Riedran':'',
  'Risian':'',
  'Syranian':''
};
Eberron.LANGUAGES = Object.assign({}, SRD35.LANGUAGES, Eberron.LANGUAGES_ADDED);
Eberron.PATHS = {};
Eberron.RACES_ADDED = {
  'Changeling':
    'Features=' +
      '1:Deceptive,1:Intuitive,"1:Minor Shape Change","1:Natural Linguist",' +
      '"1:Resist Charm","1:Resist Sleep" ' +
    'Languages=Common',
  'Kalashtar':
    'Features=' +
      '1:Dreamless,1:Humanlike,1:Influential,1:Mindlink,"1:Natural Psionic",' +
      '"1:Resist Mental","1:Resist Possession" ' +
    'Languages=Common,Quori',
  'Shifter':
    'Features=' +
      '"Animalistic Heritage","1:Shifter Ability Adjustment",' +
      '"1:Low-Light Vision",1:Shifting ' +
    'Selectables=' +
      '1:Beasthide,1:Longtooth,1:Cliffwalk,1:Razorclaw,1:Longstride,' +
      '1:Wildhunt ' +
    'Languages=Common',
  'Warforged':
    'Features=' +
      '"1:Composite Plating","1:Light Fortification",1:Mechanized,' +
      '"1:Slam Weapon",1:Stable,1:Unhealing,"1:Warforged Ability Adjustment",' +
      '"1:Warforged Immunity","1:Warforged Vulnerability" ' +
    'Languages=Common'
};
Eberron.RACES = Object.assign({}, SRD35.RACES, Eberron.RACES_ADDED);
Eberron.SCHOOLS = Object.assign({}, SRD35.SCHOOLS);
Eberron.SHIELDS = Object.assign({}, SRD35.SHIELDS);
Eberron.SKILLS = Object.assign({}, SRD35.SKILLS);
Eberron.SPELLS_ADDED = {

  // NOTE: It's unclear which of these spells might be available in potion/oil
  // form. The source book describes Oil Of Repair, which duplicates Repair xxx
  // Damage, and makes a passing reference to Oil Of Stone Construct.
  'Armor Enhancement':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched armor or shield gains +3 or 35K GP enhancement for %{lvl*10} min"',
  'Bolts Of Bedevilment':
    'School=Enchantment ' +
    'Level=Madness5 ' +
    'Description="R%{lvl*10+100}\' 3 targets (1/rd) suffer dazed (Will neg) for %{lvl*2} rd"',
  'Construct Energy Ward':
    'School=Abjuration ' +
    'Level=A3 ' +
    'Description="Touched construct gains resistance %{lvl>10?30:lvl>6?20:10} to chosen energy for %{lvl*10} min"',
  'Control Deathless':
    'School=Necromancy ' +
    'Level=Deathless7 ' +
    'Description="R%{lvl//2*5+25}\' %{lvl*2} HD of deathless in 15\' radius obey self commands (Will neg) for %{lvl} min"',
  'Create Deathless':
    'School=Necromancy ' +
    'Level=Deathless6 ' +
    'Description="R%{lvl//2*5+25}\' Creates deathless soldier"',
  'Create Greater Deathless':
    'School=Necromancy ' +
    'Level=Deathless8 ' +
    'Description="R%{lvl//2*5+25}\' Creates deathless councilor"',
  'Detect Aberration':
    'School=Divination ' +
    'Level=D1 ' +
    'Description="R60\' Cone gives self info on aberrations for conc or %{lvl} min"',
  'Detoxify':
    'School=Conjuration ' +
    'Level=Feast8 ' +
    'Description="R30\' Neutralizes venom and poisonous creatures (Will neg) for %{lvl*10} min"',
  'Dimension Leap':
    'School=Conjuration ' +
    'Level=Orien1 ' +
    'Description="Self teleports up to %{lvl*10}\'"',
  'Disable Construct':
    'School=Transmutation ' +
    'Level=A6 ' +
    'Description="Touched construct suffers %{lvl*10} HP (Will half)"',
  'Energy Alteration':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched magic item uses and affects chosen energy type for %{lvl*10} min"',
  'Enhancement Alteration':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched shield or weapon enhancement shifts to attack or defense for %{lvl*10} min"',
  'Feast Of Champions':
    'School=Conjuration ' +
    'Level=C9,Feast9 ' +
    'Description="R%{lvl//2*5+25}\' Creates food for %{lvl} creatures that cures disease, sickness, exhaustion, and 2d8+%{lvl} HP, gives 1d8+%{lvl//2<?10} temporary HP, +1 attack, skill, ability, and saves, and immunity to poison and fear for 12 hr"',
  'Greater Armor Enhancement':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched armor or shield gains +5 or 100K GP enhancement for %{lvl*10} min"',
  'Greater Construct Energy Ward':
    'School=Abjuration ' +
    'Level=A4 ' +
    'Description="Touched construct gains resistance %{lvl*12<?120} to chosen energy for %{lvl*10} min"',
  'Greater Status':
    'School=Divination ' +
    'Level=Community4 ' +
    'Description="Self may monitor the condition and position of and remotely casts level 0-2 touch spells on %{lvl//3} touched allies for %{lvl} hr"',
  'Greater Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A6 ' +
    'Description="Touched weapon gains +5 or 200K GP enhancement for %{lvl*10} min"',
  'Halt Deathless':
    'School=Necromancy ' +
    'Level=Deathless3 ' +
    'Description="R%{lvl*10+100}\' 15\' radius immobilizes 3 deathless (Will neg) for %{lvl} rd"',
  'Hardening':
    'School=Transmutation ' +
    'Level=A6,Artifice7,S6,W6 ' +
    'Description="Touched %{lvl} 10\' cu item (%{lvl}\' cu metal or mineral) resists damage"',
  "Hero's Blade":
    'School=Necromancy ' +
    'Level=Deathless9 ' +
    'Description="Touched blade becomes good-aligned, inflicts +2d6 HP (+2d10 HP crit) on evil, +2d8 HP (+2d12 HP crit) on evil outsider or undead, crit threat dbl, crit blinds and deafens evil for 1d4 rd (Will neg) and banishes evil outsider (Will neg) for %{lvl} min"',
  'Inflict Critical Damage':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched construct suffers 4d8+%{lvl<?20} HP"',
  'Inflict Light Damage':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched construct suffers 1d8+%{lvl<?5} HP"',
  'Inflict Moderate Damage':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched construct suffers 2d8+%{lvl<?10} HP"',
  'Inflict Serious Damage':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched construct suffers 3d8+%{lvl<?15} HP"',
  'Iron Construct':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched construct gains DR 15/adamantine, +4 Strength, -4 Dexterity, and x5 weight and takes half damage from acid and fire for %{lvl} min"',
  'Item Alteration':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched magic item grants bonus differently (Will neg) for %{lvl*10} min"',
  "Legion's Shield Of Faith":
    'School=Abjuration ' +
    'Level=A4 ' +
    'Description="R%{lvl*10+100}\' Allies in 20\' radius gain +%{lvl//6+2<?5} AC for %{lvl} min"',
  'Lesser Armor Enhancement':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched armor or shield gains +1 or 5K GP enhancement for %{lvl*10} min"',
  'Lesser Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched weapon gains +1 or 10K GP enhancement for %{lvl*10} min"',
  'Maddening Scream':
    'School=Enchantment ' +
    'Level=Madness8,S8,W8 ' +
    'Description="Touched acts madly (-4 AC, Ref save requires nat 20) for 1d4+1 rd"',
  'Magecraft':
    'School=Divination ' +
    'Level=S1,W1 ' +
    'Description="Self gains +5 Craft check for daily item creation work"',
  'Metamagic Item':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Imbues touched magic item w/metamagic property for %{lvl} rd"',
  "Nature's Wrath":
    'School=Evocation ' +
    'Level=Gatekeeper4 ' +
    'Description="R%{lvl*10+100}\' Aberrations in 20\' radius suffer %{lvl<?10}d6 HP and dazed 1 rd, and other unnatural creatures suffer %{lvl//2<?5}d8 HP (Will half)"',
  'Personal Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched self weapon gains +1 or 10K GP enhancement for %{lvl*10} min"',
  'Power Surge':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched magic item gains %{lvl//5} charges for %{lvl} min"',
  'Repair Critical Damage':
    'School=Transmutation ' +
    'Level=A4,S4,W4 ' +
    'Description="Touched construct regains 4d8+%{lvl<?20} HP"',
  'Repair Light Damage':
    'School=Transmutation ' +
    'Level=A1,Cannith1,S1,W1 ' +
    'Description="Touched construct regains 1d8+%{lvl<?5} HP" ' +
    'Liquid=Oil',
  'Repair Moderate Damage':
    'School=Transmutation ' +
    'Level=A2,S2,W2 ' +
    'Description="Touched construct regains 2d8+%{lvl<?10} HP" ' +
    'Liquid=Oil',
  'Repair Serious Damage':
    'School=Transmutation ' +
    'Level=A3,Cannith2,S3,W3 ' +
    'Description="Touched construct regains 3d8+%{lvl<?15} HP" ' +
    'Liquid=Oil',
  'Resistance Item':
    'School=Abjuration ' +
    'Level=A1 ' +
    'Description="Holder of touched item gains +%{lvl//4+1} saves for %{lvl*10} min"',
  'Return To Nature':
    'School=Transmutation ' +
    'Level=Gatekeeper7 ' +
    'Description="R%{lvl//2*5+25}\' Target arcane spellcaster suffers 1d4 negative levels, giant suffers <i>Reduce Person</i> (Fort neg), magical beast/outsider/aberration suffers -1d6 Intelligence/%{lvl//2<?10} HP/%{lvl*6} HP and -1d4/-2d4/all supernatural abilities for 1 dy (Fort half HP only)"',
  'Skill Enhancement':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched gains +%{lvl//2+2} on specified skill checks for %{lvl*10} min"',
  'Spell Storing Item':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Successful Use Magic Device imbues touched item with spell up to level %{lvl//2<?4} for %{lvl} hr"',
  'Spirit Steed':
    'School=Necromancy ' +
    'Level=Deathless4 ' +
    'Description="Touched animal gains +30\' Speed, increased run, and no hustle damage for %{lvl} hr"',
  'Stone Construct':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched construct gains DR 10/adamantine for %{lvl*10<?150} HP or %{lvl*10} min" ' +
    'Liquid=Oil',
  'Suppress Requirement':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Removes usage requirement from touched magic item for %{lvl*10} min"',
  'Total Repair':
    'School=Transmutation ' +
    'Level=A6 ' +
    'Description="Restores %{lvl*10<?150} HP to and removes conditions from touched construct"',
  'Touch Of Madness':
    'School=Enchantment ' +
    'Level=Madness2 ' +
    'Description="Touched suffers dazed for %{lvl*2} rd"',
  'Toughen Construct':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched construct gains +%{(lvl//3+1)<?5>?2} AC for %{lvl*10} min"',
  'True Creation':
    'School=Conjuration ' +
    'Level=Artifice8,Cannith4 ' +
    'Description="Creates permanent %{lvl}\' cu plant or mineral object"',
  'Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched weapon gains +3 or 70K GP enhancement for %{lvl*10} min"',
  "Wind's Favor":
    'School=Transmutation ' +
    'Level=Lyrandar2 ' +
    'Description="R%{lvl*10+100}\' Creates 10\'x10\'x%{lvl*20+100}\' 30 MPH wind for %{lvl} hr"',
  'Withering Palm':
    'School=Necromancy ' +
    'Level=Decay7 ' +
    'Description="Touched suffers -%{lvl//2} Strength and Constitution (Fort neg)"',
  'Zone Of Natural Purity':
    'School=Evocation ' +
    'Level=Gatekeeper2 ' +
    'Description="R%{lvl//2*5+25}\' Fey and plants in 20\' radius gain +1 attack, damage, and saves, and abberations suffer -1, for %{lvl*2} hr"'

};
Eberron.SPELLS = Object.assign(
  {}, window.PHB35 != null ? PHB35.SPELLS : SRD35.SPELLS, Eberron.SPELLS_ADDED
);
Eberron.SPELLS_LEVELS = {
  'Alarm':'Kundarak1',
  'Align Weapon':'A2',
  'Analyze Dweomer':'Commerce8',
  'Animal Growth':'Vadalis3',
  'Animate Objects':'Life6',
  'Animate Plants':'Life8',
  'Animate Rope':'Artifice1',
  'Antilife Shell':'Decay6',
  'Arcane Lock':'Kundarak1',
  'Arcane Mark':'Sivis1',
  'Astral Projection':'Meditation9',
  'Awaken':'Vadalis4',
  'Banishment':'Exorcism6,Gatekeeper5,Warden7',
  "Bear's Endurance":'A2',
  'Bestow Curse':'Dragon3',
  'Blade Barrier':'A6',
  'Blasphemy':'Dragon7',
  'Bless':'Community1',
  'Blight':'Decay5',
  "Bull's Strength":'A2',
  'Call Lightning':'Weather3',
  'Call Lightning Storm':'Weather5',
  'Calm Animals':'Vadalis1',
  'Calm Emotions':'Charm2',
  "Cat's Grace":'A2',
  'Cause Fear':'Dragon1,Passion1',
  'Charm Animal':'Vadalis1',
  'Charm Monster':'Charm5,Greensinger4',
  'Charm Person':'Charm1,Greensinger1',
  'Chill Metal':'A2',
  'Clairaudience/Clairvoyance':'Phiarlan2,Thuranni2',
  'Command Undead':'Necromancer2',
  'Comprehend Languages':'Commerce1,Meditation1,Sivis1',
  'Confusion':'Madness4,Passion3',
  'Consecrate':'Deathless2',
  'Contagion':'Decay3',
  'Control Undead':'Necromancer7',
  'Control Weather':'Lyrandar3,Weather7',
  'Control Winds':'Lyrandar3,Weather6',
  'Create Food And Water':'Feast3,Ghallanda2',
  'Crushing Despair':'Passion4',
  'Cure Light Wounds':'Jorasco1',
  'Cure Serious Wounds':'Jorasco2',
  'Darkness':'Phiarlan1,Shadow2,Thuranni1',
  'Daze Monster':'Greensinger2',
  'Death Knell':'Dragon2',
  'Death Ward':'Life4',
  'Deeper Darkness':'Shadow3',
  'Delay Poison':'Feast2',
  'Demand':'Charm8',
  'Detect Magic':'Medani1',
  'Detect Poison':'Medani1',
  'Detect Scrying':'Medani2',
  'Detect Thoughts':'Warden2',
  'Detect Undead':'Deathless1',
  'Dimension Door':'Orien2',
  'Dimensional Anchor':'Gatekeeper3',
  'Dimensional Lock':'Gatekeeper6',
  'Discern Location':'Tharashk4',
  'Disguise Self':'Phiarlan1,Thuranni1',
  'Dismissal':'Exorcism4',
  'Dispel Evil':'Exorcism5',
  'Displacement':'Greensinger3,Warden3',
  'Disrupting Weapon':'A5,Life5',
  'Dominate Animal':'Vadalis2',
  'Dominate Monster':'Charm9,Passion9',
  'Doom':'Decay1',
  "Eagle's Splendor":'A2',
  'Endure Elements':'Lyrandar1',
  'Energy Drain':'Decay9,Necromancer9',
  'Enervation':'Decay4,Necromancer4',
  'Ethereal Jaunt':'Greensinger7',
  'Etherealness':'Greensinger9',
  'Expeditious Retreat':'Orien1',
  'Explosive Runes':'Kundarak2',
  'Eyebite':'Necromancer6',
  'Fabricate':'A5,Artifice5,Cannith3',
  'Find The Path':'Meditation6,Tharashk3',
  'Fire Trap':'Kundarak1',
  'Fog Cloud':'Lyrandar1,Weather2',
  "Fox's Cunning":'A2',
  'Freedom':'Exorcism9',
  'Gate':'Dragon9',
  'Geas/Quest':'Charm6',
  'Glibness':'Commerce4',
  'Globe Of Invulnerability':'A6,Deneith3',
  'Glyph Of Warding':'Kundarak2',
  'Goodberry':'Feast1',
  'Greater Command':'Passion5',
  'Greater Glyph Of Warding':'Kundarak3',
  'Greater Heroism':'Passion6',
  'Greater Magic Fang':'Vadalis2',
  'Greater Magic Weapon':'A3',
  'Greater Planar Ally':'Dragon8',
  'Greater Prying Eyes':'Phiarlan4,Thuranni4',
  'Greater Shadow Conjuration':'Shadow7',
  'Greater Shadow Evocation':'Shadow8',
  'Greater Teleport':'Orien4',
  'Guards And Wards':'Kundarak3',
  'Gust Of Wind':'Lyrandar1',
  'Hallow':'Deathless5',
  'Heal':'Jorasco3',
  'Heat Metal':'A2',
  'Helping Hand':'Tharashk2',
  "Heroes' Feast":'Community6,Feast6,Ghallanda3',
  'Heroism':'Charm4',
  'Hide From Undead':'Life1',
  'Hold Monster':'Greensinger5,Warden5',
  'Holy Aura':'Exorcism8',
  'Holy Word':'Exorcism7',
  'Horrid Wilting':'Decay8,Necromancer8',
  'Identify':'A1,Tharashk1',
  'Imprisonment':'Gatekeeper9',
  'Illusory Script':'Sivis2',
  'Insanity':'Charm7,Madness7',
  'Know Direction':'Tharashk1',
  "Leomund's Secret Chest":'Commerce6',
  "Leomund's Secure Shelter":'Feast5,Ghallanda2',
  'Lesser Confusion':'Madness1',
  'Lesser Globe Of Invulnerability':'A4,Deneith2',
  'Lesser Planar Ally':'Dragon4',
  'Lesser Restoration':'Jorasco1,Life2',
  'Light':'A1',
  'Locate Creature':'Tharashk2,Warden4',
  'Locate Object':'Meditation3,Tharashk1',
  'Mage Armor':'Deneith1',
  'Magic Circle Against Evil':'Exorcism2',
  'Magic Stone':'A1',
  'Magic Vestment':'A1',
  'Magic Weapon':'A1',
  'Major Creation':'A5,Artifice6,Cannith3',
  'Make Whole':'Cannith1',
  "Mass Cat's Grace":'Greensinger6',
  'Mass Charm Monster':'Greensinger8',
  'Mass Heal':'Community9,Life9,Jorasco4',
  'Mass Hold Monster':'Warden9',
  'Mending':'Cannith1',
  'Mind Blank':'Deneith4,Gatekeeper8,Meditation8',
  'Minor Creation':'A4,Artifice4,Cannith2',
  'Minor Image':'Phiarlan1,Thuranni1',
  'Misdirection':'Kundarak1',
  'Mislead':'Phiarlan3,Thuranni3',
  'Moment Of Prescience':'Medani4',
  "Mordenkainen's Faithful Hound":'Kundarak3',
  "Mordenkainen's Magnificent Mansion":'Feast7,Ghallanda3',
  'Mount':'Orien1',
  'Move Earth':'A6',
  'Neutralize Poison':'Feast4,Jorasco2',
  'Nondetection':'Kundarak2',
  'Obscuring Mist':'Shadow1,Weather1',
  "Otto's Irresistible Dance":'Passion8',
  'Overland Flight':'Orien3',
  "Owl's Wisdom":'A2,Meditation2',
  'Phantasmal Killer':'Madness6',
  'Phantom Steed':'Orien2',
  'Planar Ally':'Dragon6',
  'Plant Growth':'Life3',
  'Polymorph Any Object':'Commerce9',
  'Prayer':'Community3',
  'Prestidigitation':'Ghallanda1',
  'Prismatic Sphere':'Artifice9',
  'Prismatic Wall':'Kundarak4',
  'Protection From Arrows':'Deneith1',
  'Protection From Energy':'Deneith2',
  'Protection From Evil':'Exorcism1,Gatekeeper1,Warden1',
  'Prying Eyes':'Phiarlan3,Thuranni3',
  'Purify Food And Drink':'Ghallanda1',
  'Rage':'Madness3',
  "Rary's Telepathic Bond":'Community5',
  'Ray Of Enfeeblement':'Decay2,Necromancer1',
  'Refuge':'Commerce7,Community7,Ghallanda4',
  'Regenerate':'Life7',
  'Remove Curse':'Exorcism3',
  'Remove Disease':'Jorasco2',
  'Repulsion':'Warden6',
  'Restoration':'Jorasco2',
  'Rusting Grasp':'A4',
  'Screen':'Warden8',
  'Scrying':'Phiarlan2,Thuranni2',
  'Secret Page':'Sivis2',
  'See Invisibility':'Medani2',
  'Sending':'Sivis3',
  'Shades':'Shadow9',
  'Shadow Conjuration':'Phiarlan2,Shadow4,Thuranni2',
  'Shadow Evocation':'Shadow5',
  'Shadow Walk':'Phiarlan3,Shadow6,Thuranni3',
  'Shield Of Faith':'A1,Deneith1',
  'Shield Other':'Deneith1',
  'Slay Living':'Dragon5',
  'Sleet Storm':'Lyrandar2,Weather4',
  'Song Of Discord':'Passion7',
  'Speak With Animals':'Vadalis1',
  'Spell Resistance':'Meditation5',
  'Spell Turning':'Meditation7',
  'Status':'Community2',
  'Stone Shape':'Artifice3',
  'Storm Of Vengeance':'Lyrandar4,Weather9',
  'Suggestion':'Charm3',
  "Summon Nature's Ally V":'Vadalis3',
  "Summon Nature's Ally VI":'Vadalis4',
  'Symbol Of Death':'Sivis4',
  'Sympathy':'Community8',
  "Tasha's Hideous Laughter":'Passion2',
  'Teleport':'Orien3',
  'Tongues':'Commerce3,Meditation4,Sivis2',
  'True Seeing':'Commerce5,Medani3',
  'Unseen Servant':'Ghallanda1',
  'Vampiric Touch':'Necromancer3',
  'Wall Of Force':'A5',
  'Wall Of Iron':'A6',
  'Wall Of Stone':'A5',
  'Waves Of Fatigue':'Necromancer5',
  'Weird':'Madness9',
  'Whirlwind':'Weather8',
  'Whispering Wind':'Sivis1',
  'Wind Wall':'Lyrandar2',
  'Wood Shape':'Artifice2',
  'Zone Of Truth':'Commerce2'
};
for(let s in Eberron.SPELLS_LEVELS) {
  let levels = Eberron.SPELLS_LEVELS[s];
  if(!(s in Eberron.SPELLS)) {
    if(window.PHB35 && PHB35.SPELL_RENAMES && s in PHB35.SPELL_RENAMES) {
      s = PHB35.SPELL_RENAMES[s];
    } else {
      // We might be loading before PHB35 has completed. There will be another
      // chance to pick this up during Eberron() initialization.
      // console.log('Missing spell "' + s + '"');
      continue;
    }
  }
  Eberron.SPELLS[s] =
    Eberron.SPELLS[s].replace('Level=', 'Level=' + levels + ',');
}
Eberron.WEAPONS_ADDED = {
  'Talenta Boomerang':'Level=Exotic Category=Ranged Damage=d4 Range=30',
  'Talenta Sharrash':
    'Level=Exotic Category=Two-Handed Damage=d10 Crit=4 Threat=19',
  'Talenta Tangat':'Level=Exotic Category=Two-Handed Damage=d10 Threat=18',
  'Valenar Double Scimitar':
    'Level=Exotic Category=Two-Handed Damage=d6/d6 Threat=18',
  "Xen'drik Boomerang":'Level=Exotic Category=Ranged Damage=d6 Range=20'
};
Eberron.WEAPONS = Object.assign({}, SRD35.WEAPONS, Eberron.WEAPONS_ADDED);

/* Defines the rules related to character abilities. */
Eberron.abilityRules = function(rules) {
  rules.basePlugin.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
Eberron.aideRules = function(rules, companions, familiars) {
  rules.basePlugin.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to combat. */
Eberron.combatRules = function(rules, armors, shields, weapons) {
  rules.basePlugin.combatRules(rules, armors, shields, weapons);
  rules.defineChoice('notes',
    'damageReduction.Adamantine:%V/%N',
    'damageReduction.Cold Iron:%V/%N',
    'damageReduction.Silver:%V/%N'
  );
};

/* Defines rules related to basic character identity. */
Eberron.identityRules = function(
  rules, alignments, classes, deities, houses, paths, races, prestigeClasses,
  npcClasses
) {

  QuilvynUtils.checkAttrTable
    (houses, ['Dragonmark', 'Race', 'Features']);

  if(rules.basePlugin == window.Pathfinder)
    Pathfinder.identityRules(
      rules, alignments, classes, deities, {}, paths, races, Pathfinder.TRACKS,
      Pathfinder.TRAITS, Eberron.PRESTIGE_CLASSES, Eberron.NPC_CLASSES
    );
  else
    SRD35.identityRules(
      rules, alignments, classes, deities, paths, races,
      Eberron.PRESTIGE_CLASSES, Eberron.NPC_CLASSES
    );

  for(let house in houses) {
    rules.choiceRules(rules, 'House', house, houses[house]);
  }

  rules.defineRule('actionPoints', 'level', '=', '5 + Math.floor(source / 2)');
  rules.defineRule('actionDice', 'level', '=', '1 + Math.floor(source / 7)');
  rules.defineSheetElement('Heroics', 'Description');
  rules.defineSheetElement('House', 'Heroics/');
  rules.defineSheetElement('Dragonmark', 'Heroics/');
  rules.defineSheetElement('Action Points', 'Heroics/');
  rules.defineSheetElement('Action Dice', 'Heroics/');
  rules.defineEditorElement
    ('house', 'House', 'select-one', 'houses', 'alignment');

};

/* Defines rules related to magic use. */
Eberron.magicRules = function(rules, schools, spells) {
  rules.basePlugin.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
Eberron.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  rules.basePlugin.talentRules
    (rules, feats, features, goodies, languages, skills);
  // No changes needed to the rules defined by base method
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Eberron.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    Eberron.alignmentRules(rules, name);
  else if(type == 'Animal Companion')
    Eberron.companionRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Armor')
    Eberron.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Class' || type.match(/^npc$/i) || type == 'Prestige') {
    Eberron.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValue(attrs, 'SkillPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Fortitude'),
      QuilvynUtils.getAttrValue(attrs, 'Reflex'),
      QuilvynUtils.getAttrValue(attrs, 'Will'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Eberron.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Eberron.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'Familiar')
    Eberron.familiarRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Feat') {
    Eberron.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    Eberron.featRulesExtra(rules, name);
  } else if(type == 'Feature')
     Eberron.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    Eberron.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'House')
    Eberron.houseRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Dragonmark'),
      QuilvynUtils.getAttrValueArray(attrs, 'Race'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Language')
    Eberron.languageRules(rules, name);
  else if(type == 'Path')
    Eberron.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
  else if(type == 'Race') {
    Eberron.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    Eberron.raceRulesExtra(rules, name);
  } else if(type == 'School') {
    Eberron.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    if(rules.basePlugin.schoolRulesExtra)
      rules.basePlugin.schoolRulesExtra(rules, name);
  } else if(type == 'Shield')
    Eberron.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    let untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    Eberron.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained != 'n' && untrained != 'N',
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergy')
    );
    if(rules.basePlugin.skillRulesExtra)
      rules.basePlugin.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    let liquids = QuilvynUtils.getAttrValueArray(attrs, 'Liquid');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let schoolAbbr = (school || 'Universal').substring(0, 4);
    for(let i = 0; i < groupLevels.length; i++) {
      let matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      let group = matchInfo[1];
      let level = matchInfo[2] * 1;
      let fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      let domainSpell =
        (rules.getChoices('selectableFeatures') != null &&
         ('Cleric - ' + group + ' Domain') in rules.getChoices('selectableFeatures')) ||
        group == 'Dragon' || // Dragon Below domain
        Eberron.CLASSES.Cleric.includes(group + ' Domain');
      Eberron.spellRules
        (rules, fullName, school, group, level, description, domainSpell,
         liquids);
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Track')
    Pathfinder.trackRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Progression')
    );
  else if(type == 'Trait') {
    Pathfinder.traitRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'Subtype')
    );
    if(Pathfinder.traitRulesExtra)
      Pathfinder.traitRulesExtra(rules, name);
  } else if(type == 'Weapon')
    Eberron.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Threat'),
      QuilvynUtils.getAttrValue(attrs, 'Crit'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
Eberron.alignmentRules = function(rules, name) {
  rules.basePlugin.alignmentRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, imposes
 * #skillPenalty# on specific skills and yields a #spellFail# percent chance of
 * arcane spell failure.
 */
Eberron.armorRules = function(
  rules, name, ac, weight, maxDex, skillPenalty, spellFail
) {
  rules.basePlugin.armorRules
    (rules, name, ac, weight, maxDex, skillPenalty, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points and #skillPoints# additional skill points with each
 * level advance. #attack# is one of '1', '1/2', or '3/4', indicating the base
 * attack progression for the class; similarly, #saveFort#, #saveRef#, and
 * #saveWill# are each one of '1/2' or '1/3', indicating the saving throw
 * progressions. #skills# indicate class skills for the class; see skillRules
 * for an alternate way these can be defined. #features# and #selectables# list
 * the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. If the class grants spell slots,
 * #spellAbility# names the ability for computing spell difficulty class, and
 * #spellSlots# lists the number of spells per level per day granted.
 */
Eberron.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots
) {
  if(rules.basePlugin == window.Pathfinder) {
    for(let i = 0; i < requires.length; i++) {
      for(let skill in Pathfinder.SRD35_SKILL_MAP) {
        requires[i] =
          requires[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
      }
    }
    for(let i = skills.length - 1; i >= 0; i--) {
      let skill = skills[i];
      if(!(skill in Pathfinder.SRD35_SKILL_MAP))
        continue;
      if(Pathfinder.SRD35_SKILL_MAP[skill] == '')
        skills.splice(i, 1);
      else
        skills[i] = Pathfinder.SRD35_SKILL_MAP[skill];
    }
  }
  rules.basePlugin.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots
  );
  if(name == 'Druid') {
    // Expand Druid's armor choices to include Darkleaf and Leafweave
    delete rules.choices.notes['validationNotes.druidClass'];
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'druidClass', 'levels.Druid',
       ["alignment =~ 'Neutral'",
        "armor =~ 'None|Hide|^Leather|Padded|Darkleaf|Leafweave'",
        'shield =~ "None|Wooden"']);
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
Eberron.classRulesExtra = function(rules, name) {

  if(name == 'Artificer') {

    let allFeats = rules.getChoices('feats');
    for(let feat in allFeats) {
      if(feat == 'Wand Mastery' || allFeats[feat].indexOf('Item Creation') >= 0)
        allFeats[feat] = allFeats[feat].replace('Type=', 'Type=Artificer,');
    }
    rules.defineRule
      ('featCount.Artificer', 'featureNotes.artificerFeatBonus', '=', null);
    rules.defineRule('featureNotes.artificerFeatBonus',
      'levels.Artificer', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('magicNotes.craftReserve',
      'levels.Artificer', '=', '[0, 20, 40, 60, 80, 100, 150, 200, 250, 300, 400, 500, 700, 900, 1200, 1500, 2000, 2500, 3000, 4000, 5000][source]'
    );
    // Artificers are neither arcane nor divine, but they are casters
    rules.defineRule('casterLevel', 'casterLevels.Artificer', '+=', null);

  } else if(name == 'Dragonmark Heir') {

    let allSkills = rules.getChoices('skills');
    for(let skill in allSkills) {
      rules.defineRule
        ('countSkillsGe7', 'skills.' + skill, '+=', 'source >= 7 ? 1 : null');
    }

  } else if(name == 'Eldeen Ranger') {

    rules.defineRule('combatNotes.favoredEnemy',
      'levels.Eldeen Ranger', '+=', 'source >= 4 ? 1 : null'
    );
    rules.defineRule
      ('combatNotes.smiteEvil', 'eldeenRangerFeatures.Smite Evil', '+=', '1');
    rules.defineRule('combatNotes.smiteEvil.1',
      'features.Smite Evil', '?', null,
      'charismaModifier', '=', 'Math.max(source, 0)'
    );
    rules.defineRule('combatNotes.smiteEvil.2',
      'features.Smite Evil', '?', null,
      'levels.Eldeen Ranger', '+=', null
    );
    rules.defineRule('damageReduction.Cold Iron',
      'combatNotes.greensingerDamageReduction', '^=', '3'
    );
    rules.defineRule('saveNotes.unearthlyGrace', 'charismaModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Eldeen Ranger',
      'levels.Eldeen Ranger', '=', '1'
    );
    rules.defineRule('skillNotes.favoredEnemy',
      'levels.' + name, '+=', 'source >= 4 ? 1 : null'
    );
    rules.defineRule
      ('spellResistance', 'saveNotes.spellResistance', '^=', '20');

  } else if(name == 'Exorcist Of The Silver Flame') {

    rules.defineRule('combatNotes.smiteEvil',
      'levels.Exorcist Of The Silver Flame', '+=', 'source>=7 ? 2 : source>=3 ? 1 : null'
    );
    rules.defineRule('combatNotes.smiteEvil.1',
      'features.Smite Evil', '?', null,
      'charismaModifier', '=', 'Math.max(source, 0)'
    );
    rules.defineRule('combatNotes.smiteEvil.2',
      'features.Smite Evil', '?', null,
      'levels.Exorcist Of The Silver Flame', '+=', null
    );
    rules.defineRule('combatNotes.weaponOfFlame',
      '', '=', '1',
      'combatNotes.weaponOfSacredFlame', '+', '1'
    );
    rules.defineRule('combatNotes.weaponOfTheExorcist.1',
      'features.Weapon Of The Exorcist', '?', null,
      '', '=', '""',
      'combatNotes.weaponOfSilver', '=', '", silver"'
    );
    rules.defineRule('combatNotes.weaponOfTheExorcist.2',
      'features.Weapon Of The Exorcist', '?', null,
      '', '=', '""',
      'combatNotes.weaponOfGood', '=', '", good"'
    );
    rules.defineRule('combatNotes.weaponOfTheExorcist.3',
      'features.Weapon Of The Exorcist', '?', null,
      '', '=', '""',
      'combatNotes.weaponOfLaw', '=', '", lawful"'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Exorcist Of The Silver Flame', '+=', 'Math.floor(source*2/3)'
    );
    rules.defineRule('saveNotes.resistPossession',
      'exorcistOfTheSilverFlameFeatures.Resist Possession', '+=', '4'
    );

  } else if(name == 'Extreme Explorer') {

    let allFeats = rules.getChoices('feats');
    for(let feat in
      {'Action Surge':'', 'Heroic Spirit':'', 'Pursue':'',
       'Spontaneous Casting':''}
    ) {
      if(feat in allFeats) {
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="Extreme Explorer",');
      } else {
        console.log('Missing Extreme Explorer feat "' + feat + '"');
      }
    }
    // Arrange for dodge bonus note to show even when wearing non-light armor
    rules.defineRule('armorClass', 'combatNotes.dodgeBonus.1', '+', null);
    rules.defineRule('combatNotes.dodgeBonus',
      'levels.Extreme Explorer', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.dodgeBonus.1',
      'armorWeight', '?', 'source <= 1',
      'combatNotes.dodgeBonus', '=', null
    );
    rules.defineRule('featCount.Extreme Explorer',
      'featureNotes.extremeExplorerFeatBonus', '+=', null
    );
    rules.defineRule('featureNotes.extremeExplorerFeatBonus',
      'levels.Extreme Explorer', '=', 'Math.floor((source - 1) / 2)'
    );
    rules.defineRule('saveNotes.trapSense',
      'levels.Extreme Explorer', '+=', 'Math.floor((source + 1) / 2)'
    );

  } else if(name == 'Heir Of Siberys') {

    let allFeats = rules.getChoices('feats');
    for(let feat in
      {'Action Boost':'', 'Action Surge':'', 'Favored In House':'', 'Pursue':'',
       'Spontaneous Casting':''}
    ) {
      if(feat in allFeats) {
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="Heir Of Siberys",');
      } else {
        console.log('Missing Heir Of Siberys feat "' + feat + '"');
      }
    }
    let allSkills = rules.getChoices('skills');
    for(let skill in allSkills) {
      rules.defineRule
        ('countSkillsGe15', 'skills.' + skill, '+=', 'source >= 15 ? 1 : null');
    }
    rules.defineRule('casterLevels.Dragonmark',
      'levels.Heir Of Siberys', '^=', 'source >= 2 ? 15 : null'
    );
    rules.defineRule('featCount.Heir Of Siberys',
      'featureNotes.heirOfSiberysFeatBonus', '=', '1'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Heir Of Siberys', '+=', 'source - 1'
    );
    rules.defineRule('magicNotes.siberysMark.1',
      'features.Siberys Mark', '=', '1',
      'magicNotes.improvedSiberysMark', '+', '1'
    );

  } else if(name == 'Master Inquisitive') {

    let allFeats = rules.getChoices('feats');
    let miFeats = 
      {'Alertness':'', 'Deceitful':'', 'Heroic Spirit':'',
       'Improved Initiative':'', 'Iron Will':'', 'Persuasive':'',
       'Recognize Impostor':'', 'Research':'', 'Toughness':'',
       'Urban Tracking':''};
    if(!Eberron.USE_PATHFINDER) {
      // Pathfinder doesn't define these feats
      miFeats.Negotiator = miFeats.Track = '';
    }
    for(let feat in miFeats) {
      if(feat in allFeats) {
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="Master Inquisitive",');
      } else {
        console.log('Missing Master Inquisitive feat "' + feat + '"');
      }
    }
    rules.defineRule('featCount.Master Inquisitive',
      'featureNotes.masterInquisitiveFeatBonus', '+=', null
    );
    rules.defineRule('featureNotes.masterInquisitiveFeatBonus',
      'levels.Master Inquisitive', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('featureNotes.contact.1',
      'levels.Master Inquisitive', '=', 'source>=4 ? " and a level 6" : ""'
    );

  } else if(name == 'Warforged Juggernaut') {

    rules.defineRule('combatNotes.greaterPowerfulCharge',
      '', '=', '"2d6"',
      'features.Large', '=', '"3d6"'
    );
    rules.defineRule('combatNotes.powerfulCharge',
      '', '=', '"1d8"',
      'features.Large', '=', '"2d6"',
      'combatNotes.greaterPowerfulCharge', '=', null
    );
    rules.defineRule
      ('skillNotes.reserved', 'levels.Warforged Juggernaut', '=', null);

  } else if(name == 'Weretouched Master') {

    rules.defineRule('clawsDamageProgression',
      'combatNotes.bear', '+=', '1',
      'combatNotes.tiger', '+=', '1'
    );
    rules.defineRule('fangsDamageProgression',
      'combatNotes.boar', '+=', '1',
      'combatNotes.rat', '+=', '1',
      'combatNotes.wolf', '+=', '1',
      'combatNotes.wolverine', '+=', '1'
    );
    rules.defineRule
      ('featCount.Shifter', 'featureNotes.weretouchedFeatBonus', '=', null);
    rules.defineRule('featureNotes.weretouchedFeatBonus',
      'levels.Weretouched Master', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('selectableFeatureCount.Weretouched Master',
      'levels.Weretouched Master', '=', '1'
    );
    rules.defineRule('skillNotes.climbSpeed',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule('skillNotes.wildEmpathy',
      'levels.Weretouched Master', '+=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule('weapons.Claws',
      'combatNotes.bear', '=', '1',
      'combatNotes.tiger', '=', '1'
    );
    rules.defineRule('weapons.Fangs',
      'combatNotes.boar', '=', '1',
      'combatNotes.rat', '=', '1',
      'combatNotes.wolf', '=', '1',
      'combatNotes.wolverine', '=', '1'
    );

  } else {

    if(name == 'Cleric') {
      // Artifice Domain
      for(let s in rules.getChoices('skills')) {
        if(s.startsWith('Craft '))
          rules.defineRule
            ('skillModifier.' + s, 'skillNotes.artificeMaster', '+', '4');
      }
    }

    if(rules.basePlugin.classRulesExtra)
      rules.basePlugin.classRulesExtra(rules, name);

  }

};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a companion.
 */
Eberron.companionRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  level
) {
  rules.basePlugin.companionRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, and #domains# and #weapons# list the associated
 * domains and favored weapons.
 */
Eberron.deityRules = function(rules, name, alignment, domains, weapons) {
  rules.basePlugin.deityRules(rules, name, alignment, domains, weapons);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with familiar #name#, which has
 * abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The familiar has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a familiar.
 */
Eberron.familiarRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  level
) {
  rules.basePlugin.familiarRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
Eberron.featRules = function(rules, name, requires, implies, types) {
  rules.basePlugin.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the abilities passed to featRules.
 */
Eberron.featRulesExtra = function(rules, name) {

  let matchInfo;

  if(name == 'Adamantine Body') {
    rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
      'features.Adamantine Body', 'v', '1'
    );
    rules.defineRule
     ('damageReduction.Adamantine', 'combatNotes.adamantineBody', '^=', '2');
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'features.Adamantine Body', '^', '35'
    );
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'features.Adamantine Body', '=', '5'
    );
    rules.defineRule('speed', 'abilityNotes.adamantineBody', 'v', '20');
  } else if(name == 'Beasthide Elite') {
    rules.defineRule
      ('combatNotes.beasthide', 'combatNotes.beasthideElite', '+', '2');
  } else if(name == 'Cliffwalk Elite') {
    rules.defineRule
      ('abilityNotes.cliffwalk', 'abilityNotes.cliffwalkElite', '+', '10');
  } else if((matchInfo = name.match(/Dragon Totem \((.*)\)/)) != null) {
    let energy =
      'BlackCopperGreen'.includes(matchInfo[1]) ? 'Acid' :
      'BlueBronze'.includes(matchInfo[1]) ? 'Electricity' :
      'BrassGoldRed'.includes(matchInfo[1]) ? 'Fire' : 'Cold';
    rules.defineRule('resistance.' + energy,
      'saveNotes.dragonTotem(' + matchInfo[1] + ')', '^=', '5'
    );
  } else if(name == 'Dragon Rage') {
    rules.defineRule(
      'saveNotes.dragonRage', '', '=', '"fire"',
      'saveNotes.dragonTotem(Black)', '=', '"acid"',
      'saveNotes.dragonTotem(Blue)', '=', '"electricity"',
      'saveNotes.dragonTotem(Bronze)', '=', '"electricity"',
      'saveNotes.dragonTotem(Copper)', '=', '"acid"',
      'saveNotes.dragonTotem(Green)', '=', '"acid"',
      'saveNotes.dragonTotem(Silver)', '=', '"cold"',
      'saveNotes.dragonTotem(White)', '=', '"cold"'
    );
  } else if(name == 'Extra Music') {
    rules.defineRule
      ('featureNotes.extraMusic', 'feats.Extra Music', '=', '4 * source');
    rules.defineRule(
      Eberron.USE_PATHFINDER ?
        'featureNotes.bardicPerformance' : 'featureNotes.bardicMusic',
      'featureNotes.extraMusic', '+', null
    );
  } else if(name == 'Extend Rage') {
    rules.defineRule('combatNotes.rage', 'combatNotes.extendRage', '+', '5');
  } else if(name == 'Extra Shifter Trait') {
    rules.defineRule('selectableFeatureCount.Shifter',
      'featureNotes.extraShifterTrait', '+', '1'
    );
  } else if(name == 'Gatekeeper Initiate') {
    rules.defineRule('casterLevels.Gatekeeper',
      'features.Gatekeeper Initiate', '?', null,
      'casterLevels.D', '=', null
    );
    rules.defineRule('spellDifficultyClass.Gatekeeper',
      'features.Gatekeeper Initiate', '?', null,
      'spellDifficultyClass.D', '=', null
    );
  } else if(name == 'Greater Dragonmark') {
    for(let s in rules.getChoices('skills'))
      rules.defineRule
        ('countSkillsGe12', 'skills.' + s, '+=', 'source >= 12 ? 1 : null');
  } else if(name == 'Greater Powerful Charge') {
    rules.defineRule('combatNotes.greaterPowerfulCharge',
      '', '=', '"2d6"',
      'features.Large', '=', '"3d6"'
    );
  } else if(name == 'Greater Shifter Defense') {
    rules.defineRule
      ('damageReduction.Silver', 'combatNotes.greaterShifterDefense', '+', '2');
  } else if(name == 'Greensinger Initiate') {
    rules.defineRule('casterLevels.Greensinger',
      'features.Greensinger Initiate', '?', null,
      'casterLevels.D', '=', null
    );
    rules.defineRule('spellDifficultyClass.Greensinger',
      'features.Greensinger Initiate', '?', null,
      'spellDifficultyClass.D', '=', null
    );
  } else if(name == 'Haunting Melody') {
    for(let s in rules.getChoices('skills'))
      if(s.startsWith('Perform'))
        rules.defineRule('sumPerformRanks', 'skills.' + s, '+=', null);
  } else if(name == 'Improved Damage Reduction') {
    rules.defineRule('damageReduction.Adamantine',
      'combatNotes.improvedDamageReduction', '+=', '1'
    );
  } else if(name == 'Improved Natural Attack (Claws)') {
    rules.defineRule('clawsDamageProgression',
      'combatNotes.improvedNaturalAttack(Claws)', '+', '1'
    );
  } else if(name == 'Improved Natural Attack (Fangs)') {
    rules.defineRule('fangsDamageProgression',
      'combatNotes.improvedNaturalAttack(Fangs)', '+', '1'
    );
  } else if(name == 'Longstride Elite') {
    rules.defineRule
      ('abilityNotes.longstride', 'abilityNotes.longstrideElite', '+', '10');
  } else if(name == 'Mithral Body') {
    rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
      'mithralBodyDexACCap', 'v', null
    );
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'features.Mithral Body', '^', '15'
    );
    rules.defineRule('mithralBodyDexACCap', 'features.Mithral Body', '=', '5');
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'features.Mithral Body', '=', '2'
    );
  } else if(name == 'Lesser Dragonmark') {
    for(let s in rules.getChoices('skills'))
      rules.defineRule
        ('countSkillsGe9', 'skills.' + s, '+=', 'source >= 9 ? 1 : null');
  } else if(name == 'Mithral Fluidity') {
    rules.defineRule
      ('mithralBodyDexACCap', 'combatNotes.mithralFluidity', '+', '1');
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.mithralFluidity', '+', '-1'
    );
  } else if(name == 'Powerful Charge') {
    rules.defineRule('combatNotes.powerfulCharge',
      '', '=', '"1d8"',
      'features.Large', '=', '"2d6"',
      'combatNotes.greaterPowerfulCharge', '=', null
    );
  } else if(name == 'Repel Aberration') {
    // Set turning level to suppress errors on, e.g., Extra Turning feat
    rules.defineRule('turningLevel', 'combatNotes.repelAberration', '=', '1');
  } else if(name == 'Shifter Defense') {
    rules.defineRule
      ('damageReduction.Silver', 'combatNotes.shifterDefense', '^=', '2');
  } else if(name == 'Warden Initiate') {
    rules.defineRule('casterLevels.Warden',
      'features.Warden Initiate', '?', null,
      'casterLevels.D', '=', null
    );
    rules.defineRule('spellDifficultyClass.Warden',
      'features.Warden Initiate', '?', null,
      'spellDifficultyClass.D', '=', null
    );
  } else if (rules.basePlugin.featRulesExtra) {
    rules.basePlugin.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Eberron.featureRules = function(rules, name, sections, notes) {
  if(rules.basePlugin == window.Pathfinder) {
    for(let i = 0; i < sections.length; i++) {
      if(sections[i] != 'skill')
        continue;
      let note = notes[i];
      for(let skill in Pathfinder.SRD35_SKILL_MAP) {
        if(note.indexOf(skill) < 0)
          continue;
        let pfSkill = Pathfinder.SRD35_SKILL_MAP[skill];
        if(pfSkill == '' || note.indexOf(pfSkill) >= 0) {
          note = note.replace(new RegExp('[,/]?[^,/:]*' + skill + '[^,/]*', 'g'), '');
        } else {
          note = note.replace(new RegExp(skill, 'g'), pfSkill);
        }
      }
      notes[i] = note;
    }
  }
  rules.basePlugin.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
Eberron.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  rules.basePlugin.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by base method
};

/*
 * Defines rules related to Eberron house #name#. #dragonmark# is the
 * dragonmark associated with the house and #races# lists its races.
 * #features# lists the features acquired by members of the house.
 */
Eberron.houseRules = function(rules, name, dragonmark, races, features) {

  if(!name) {
    console.log('Empty house name');
    return;
  }
  if(name == 'None')
    return;
  if(!dragonmark) {
    console.log('Empty dragonmark for house ' + name);
    return;
  }
  if(!Array.isArray(races)) {
    console.log('Bad race list "' + races + '" for house ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for house ' + name);
    return;
  }

  if(rules.houseStats == null) {
    rules.houseStats = {
      dragonmark:{},
      races:{},
    };
  }
  rules.houseStats.dragonmark[name] = dragonmark;
  rules.houseStats.races[name] = races.join('|');

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let houseLevel = prefix + 'Level';

  rules.defineRule(houseLevel,
    'house', '?', 'source == "' + name + '"',
    'level', '=', null
  );

  QuilvynRules.featureListRules(rules, features, name, houseLevel, false);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  rules.defineRule('casterLevels.' + name,
    'house', '?', 'source == "' + name + '"',
    'magicNotes.leastDragonmark', '=', '1',
    'magicNotes.lesserDragonmark', '+', '5',
    'magicNotes.greaterDragonmark', '+', '4',
    'magicNotes.siberysMark', '^=', '15',
    'levels.Dragonmark Heir', '+', null
  );
  rules.defineRule('dragonmark',
    'house', '=', QuilvynUtils.dictLit(rules.houseStats.dragonmark) + '[source]'
  );
  rules.defineRule('spellDifficultyClass.' + name,
    'house', '?', 'source == "' + name + '"',
    'casterLevels.' + name, '?', null,
    'charismaModifier', '=', '10 + source'
  );
  rules.defineRule('spellSlots.' + name + '1',
    'casterLevels.' + name, '?', null,
    'magicNotes.leastDragonmark', '=', '1',
    'magicNotes.improvedLeastDragonmark', '+', '1'
  );
  rules.defineRule('spellSlots.' + name + '2',
    'casterLevels.' + name, '?', null,
    'magicNotes.lesserDragonmark', '=', '1',
    'magicNotes.improvedLesserDragonmark', '+', '1'
  );
  rules.defineRule('spellSlots.' + name + '3',
    'casterLevels.' + name, '?', null,
    'magicNotes.greaterDragonmark', '=', '1',
    'magicNotes.improvedGreaterDragonmark', '+', '1'
  );
  rules.defineRule('spellSlots.' + name + '4',
    'casterLevels.' + name, '?', null,
    'magicNotes.siberysMark', '=', '1'
  );
  if(races.length == 1)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'house' + name, houseLevel,
       "race == '" + races[0] + "'");
  else
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'house' + name, houseLevel,
       "race =~ '" + races.join("|") + "'");
  if(name == 'Cannith') {
    for(let s in rules.getChoices('skills')) {
      if(s.startsWith('Craft '))
        rules.defineRule('skillModifier.' + s, 'skillNotes.maker', '+', '2');
    }
  }

};

/* Defines in #rules# the rules associated with language #name#. */
Eberron.languageRules = function(rules, name) {
  rules.basePlugin.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features listed in #features#. If the path
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
Eberron.pathRules = function(
  rules, name, group, levelAttr, features, selectables, spellAbility,
  spellSlots
) {
  if(rules.basePlugin == window.Pathfinder)
    rules.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, [], [],
      spellAbility, spellSlots
    );
  else
    rules.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, spellAbility,
      spellSlots
    );
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. If the race
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
Eberron.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spellSlots
) {
  rules.basePlugin.raceRules
    (rules, name, requires, features, selectables, languages);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
Eberron.raceRulesExtra = function(rules, name) {

  if(name == 'Kalashtar') {
    rules.defineRule('saveNotes.resistPossession', 'kalashtarLevel', '+=', '2');
  } else if(name == 'Shifter') {
    rules.defineRule('abilityNotes.cliffwalk', '', '=', '20');
    rules.defineRule('abilityNotes.longstride', '', '=', '10');
    rules.defineRule('combatNotes.beasthide', '', '=', '2');
    rules.defineRule('featureNotes.shifting',
      'constitutionModifier', '=', '3 + source',
      'sumShifterFeats', '+', null
    );
    rules.defineRule('selectableFeatureCount.Shifter',
      'race', '=', 'source == "Shifter" ? 1 : null'
    );
    Eberron.weaponRules
      (rules, 'Claws', 'Unarmed', 'Unarmed', 'd4', 20, 2, null);
    Eberron.weaponRules
      (rules, 'Fangs', 'Unarmed', 'Unarmed', 'd6', 20, 2, null);
    rules.defineRule('clawsDamageProgression',
      'combatNotes.razorclaw', '+=', '1',
      'features.Large', '+', '1'
    );
    rules.defineRule('clawsDamageDice',
      'clawsDamageProgression', '=', '["d3", "d4", "d6", "d8", "2d6", "3d6", "4d6", "6d6", "8d6", "12d6"][source]'
    );
    rules.defineRule('fangsDamageProgression',
      'combatNotes.longtooth', '+=', '1',
      'features.Large', '+', '1'
    );
    rules.defineRule('fangsDamageDice',
      'fangsDamageProgression', '=', '["d4", "d6", "d8", "2d6", "3d6", "4d6", "6d6", "8d6", "12d6"][source]'
    );
    rules.defineRule('weapons.Claws', 'combatNotes.razorclaw', '=', '1');
    rules.defineRule('weapons.Fangs', 'combatNotes.longtooth', '=', '1');
    // Extra +1 on claws + fangs damage accounts for +2 strength while shifting
    rules.defineRule('clawsDamageModifier',
      'shifterLevels', '+', 'Math.floor(source / 4) + 1'
    );
    rules.defineRule('fangsDamageModifier',
      'shifterLevels', '+', 'Math.floor(source / 4) + 1'
    );
  } else if(name == 'Warforged') {
    rules.defineRule
      ('armor', 'combatNotes.compositePlating', '=', '"None"');
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'combatNotes.compositePlating', '+=', '5'
    );
    rules.defineRule('negateLanguageBonus',
      'intelligenceModifier', '=', '-Math.max(source, 0)'
    );
    rules.defineRule('languageCount', 'negateLanguageBonus', '+', null);
    Eberron.weaponRules(rules, 'Slam', 'Unarmed', 'Unarmed', 'd4', 20, 2, null);
    rules.defineRule('weapons.Slam', 'combatNotes.slamWeapon', '=', '1');
  } else if(rules.basePlugin.raceRulesExtra) {
    rules.basePlugin.raceRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
Eberron.schoolRules = function(rules, name, features) {
  rules.basePlugin.schoolRules(rules, name, features);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, imposes #skillPenalty# on specific skills and yields a
 * #spellFail# percent chance of arcane spell failure.
 */
Eberron.shieldRules = function(
  rules, name, ac, profLevel, skillFail, spellFail
) {
  rules.basePlugin.shieldRules
    (rules, name, ac, profLevel, skillFail, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * basic ability #ability#. #untrained#, if specified, is a boolean indicating
 * whether or not the skill can be used untrained; the default is true.
 * #classes# lists the classes for which this is a class skill; a value of
 * "all" indicates that this is a class skill for all classes. #synergies#
 * lists any synergies with other skills and abilities granted by high ranks in
 * this skill.
 */
Eberron.skillRules = function(
  rules, name, ability, untrained, classes, synergies
) {
  rules.basePlugin.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a concise
 * description of the spell's effects. #liquids# lists any liquid forms via
 * which the spell can be applied.
 */
Eberron.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell, liquids
) {
  rules.basePlugin.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell,
     liquids);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #profLevel# proficiency level to use effectively and belongs to weapon
 * category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their spelled-out
 * equivalents). The weapon does #damage# HP on a successful attack and
 * threatens x#critMultiplier# (default 2) damage on a roll of #threat# (default
 * 20). If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
Eberron.weaponRules = function(
  rules, name, profLevel, category, damage, threat, critMultiplier, range
) {
  rules.basePlugin.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by base method
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
Eberron.choiceEditorElements = function(rules, type) {
  let result = [];
  if(type == 'House')
    result.push(
      ['Dragonmark', 'Dragonmark', 'text', [20]],
      ['Race', 'Race', 'select-one', 'races'],
      ['Spells', 'Spells', 'text', [80]]
    );
  else
    result = rules.basePlugin.choiceEditorElements(rules, type);
  return result;
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Eberron.createViewers = function(rules, viewers) {
  rules.basePlugin.createViewers(rules, viewers);
  // No changes needed to the return value of the base method
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Eberron.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'house') {
    let allHouses = this.getChoices('houses');
    let choices = ['None'];
    let race = attributes.race;
    for(let house in allHouses) {
      if(allHouses[house].match(race))
        choices.push(house);
    }
    attributes.house = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else {
    this.basePlugin.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};

/* Returns an array of plugins upon which this one depends. */
Eberron.getPlugins = function() {
  let base = this.basePlugin == window.SRD35 ? window.PHB35 : this.basePlugin;
  return [base].concat(base.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
Eberron.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Eberron Rule Set Notes</h2>\n' +
    'Quilvyn Eberron Rule Set Version ' + Eberron.VERSION + '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn represents the Oil of Repair magic item described in the\n' +
    '    rule book as Repair Light/Moderate/Serious Damage Oil in the\n' +
    '    Potions/Oils menu.\n' +
    '  </li><li>\n' +
    '    The Eberron rule set allows you to add homebrew choices for all\n' +
    '    of the same types discussed in the <a href="plugins/homebrew-srd35.html">SRD v3.5 Homebrew Examples document</a>.\n' +
    '    In addition, the FR rule set allows adding homebrew houses, which\n' +
    '    require specifying the region name, race, and associated dragonmark.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    "Quilvyn's Eberron rule set is unofficial Fan Content permitted under " +
    "Wizards of the Coast's " +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Eberron Campaign Setting © 2004 Wizards of ' +
    'the Coast, Inc.\n' +
    '</p><p>\n' +
    "Dungeons & Dragons Player's Handbook v3.5 © 2003 Wizards of the Coast, " +
    'Inc.\n' +
    '</p>\n';
};
