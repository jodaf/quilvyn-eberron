/*
Copyright 2021, James J. Hayes

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
  Eberron.basePlugin = Eberron.USE_PATHFINDER ? Pathfinder : SRD35;

  var rules = new QuilvynRules
    ('Eberron' + (Eberron.USE_PATHFINDER ? ' - PF' : ''), Eberron.VERSION);
  Eberron.rules = rules;

  Eberron.CHOICES = Eberron.basePlugin.CHOICES.concat(Eberron.CHOICES_ADDED);
  rules.defineChoice('choices', Eberron.CHOICES);
  rules.choiceEditorElements = Eberron.choiceEditorElements;
  rules.choiceRules = Eberron.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.getPlugins = Eberron.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Eberron.randomizeOneAttribute;
  Eberron.RANDOMIZABLE_ATTRIBUTES =
    Eberron.basePlugin.RANDOMIZABLE_ATTRIBUTES.concat
    (Eberron.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', Eberron.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Eberron.ruleNotes;

  if(Eberron.basePlugin == window.Pathfinder) {
    SRD35.ABBREVIATIONS['CMB'] = 'Combat Maneuver Bonus';
    SRD35.ABBREVIATIONS['CMD'] = 'Combat Maneuver Defense';
  }

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras', 'feats', 'featCount', 'selectableFeatureCount');
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels',
    'prestige:Prestige Levels,bag,prestiges', 'npc:NPC Levels,bag,npcs');

  Eberron.ALIGNMENTS = Object.assign({}, Eberron.basePlugin.ALIGNMENTS);
  Eberron.ANIMAL_COMPANIONS =
    Object.assign( {}, Eberron.basePlugin.ANIMAL_COMPANIONS);
  Eberron.ARMORS =
    Object.assign({}, Eberron.basePlugin.ARMORS, Eberron.ARMORS_ADDED);
  Eberron.FAMILIARS = Object.assign({}, Eberron.basePlugin.FAMILIARS);
  Eberron.FEATS =
    Object.assign({}, Eberron.basePlugin.FEATS, Eberron.FEATS_ADDED);
  Eberron.FEATURES =
    Object.assign({}, Eberron.basePlugin.FEATURES, Eberron.FEATURES_ADDED);
  Eberron.GOODIES = Object.assign({}, Eberron.basePlugin.GOODIES);
  Eberron.LANGUAGES =
    Object.assign({}, Eberron.basePlugin.LANGUAGES, Eberron.LANGUAGES_ADDED);
  Eberron.PATHS =
    Object.assign({}, Eberron.basePlugin.PATHS, Eberron.PATHS_ADDED);
  Eberron.RACES =
    Object.assign({}, Eberron.basePlugin.RACES, Eberron.RACES_ADDED);
  Eberron.SCHOOLS = Object.assign({}, Eberron.basePlugin.SCHOOLS);
  Eberron.SHIELDS = Object.assign({}, Eberron.basePlugin.SHIELDS);
  Eberron.SKILLS = Object.assign({}, Eberron.basePlugin.SKILLS);
  Eberron.SPELLS =
    Object.assign({}, Eberron.basePlugin.SPELLS, Eberron.SPELLS_ADDED);
  for(var s in Eberron.SPELLS_LEVELS) {
    Eberron.SPELLS[s] =
      Eberron.SPELLS[s].replace('Level=', 'Level=' + Eberron.SPELLS_LEVELS[s] + ',');
  }
  Eberron.WEAPONS =
    Object.assign({}, Eberron.basePlugin.WEAPONS, Eberron.WEAPONS_ADDED);
  Eberron.CLASSES =
    Object.assign({}, Eberron.basePlugin.CLASSES, Eberron.CLASSES_ADDED);
  Eberron.NPC_CLASSES = Object.assign({}, Eberron.basePlugin.NPC_CLASSES);

  Eberron.abilityRules(rules);
  Eberron.aideRules(rules, Eberron.ANIMAL_COMPANIONS, Eberron.FAMILIARS);
  Eberron.combatRules(rules, Eberron.ARMORS, Eberron.SHIELDS, Eberron.WEAPONS);
  Eberron.magicRules(rules, Eberron.SCHOOLS, Eberron.SPELLS);
  // Feats must be defined before classes
  Eberron.talentRules
    (rules, Eberron.FEATS, Eberron.FEATURES, Eberron.GOODIES,
     Eberron.LANGUAGES, Eberron.SKILLS);
  Eberron.identityRules(
    rules, Eberron.ALIGNMENTS, Eberron.CLASSES, Eberron.DEITIES,
    Eberron.HOUSES, Eberron.PATHS, Eberron.RACES, Eberron.PRESTIGE_CLASSES,
    Eberron.NPC_CLASSES
  );

  Quilvyn.addRuleSet(rules);

}

Eberron.VERSION = '2.2.2.7';

// Eberron uses SRD35 as its default base ruleset. If USE_PATHFINDER is true,
// the Eberron function will instead use rules taken from the Pathfinder plugin.
Eberron.USE_PATHFINDER = false;

Eberron.CHOICES_ADDED = ['House'];
Eberron.CHOICES = SRD35.CHOICES.concat(Eberron.CHOICES_ADDED);
Eberron.RANDOMIZABLE_ATTRIBUTES_ADDED = ['house'];
Eberron.RANDOMIZABLE_ATTRIBUTES =
  SRD35.RANDOMIZABLE_ATTRIBUTES.concat(Eberron.RANDOMIZABLE_ATTRIBUTES_ADDED);

SRD35.ABBREVIATIONS['AP'] = 'Action Points';

Eberron.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
Eberron.ANIMAL_COMPANIONS = Object.assign({}, SRD35.ANIMAL_COMPANIONS);
Eberron.ARMORS_ADDED = {
  'Darkleaf Banded':'AC=6 Weight=2 Dex=2 Skill=4 Spell=30',
  'Darkleaf Breastplate':'AC=5 Weight=1 Dex=4 Skill=2 Spell=20',
  'Leafweave':'AC=2 Weight=1 Dex=7 Skill=0 Spell=5'
};
Eberron.ARMORS = Object.assign({}, SRD35.ARMORS, Eberron.ARMORS_ADDED);
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
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'"',
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
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'"',
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
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'",' +
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
            '"Sum \'^skills.Perform\' >= 9"',
  'Healing Factor':
    'Type=General,Shifter Require="constitution >= 13","race == \'Shifter\'"',
  'Heroic Spirit':'Type=General',
  'Improved Damage Reduction':'Type=General Require="race == \'Warforged\'"',
  'Improved Fortification':
    'Type=General Require="baseAttack >= 6","race == \'Warforged\'"',
  'Improved Natural Attack':'Type=General Require="baseAttack >= 4"',
  'Investigate':'Type=General',
  'Knight Training':'Type=General Imply="levels.Paladin > 0"',
  'Least Dragonmark':
    'Type=General ' +
    'Require="house != \'None\'",' +
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'"',
  'Legendary Artisan':
    'Type="Item Creation" Require="sumItemCreationFeats >= 2"',
  'Lesser Dragonmark':
    'Type=General ' +
    'Require="house != \'None\'",' +
            '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'",' +
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
  'Artificer Knowledge':
    'Section=skill ' +
    'Note="+%V DC 15 check to determine whether an item is magical"',
  'Artificer Skill Mastery':
    'Section=skill ' +
    'Note="Take 10 on Spellcraft or Use Magic Device when distracted"',
  'Artisan Bonus':
    'Section=skill Note="+2 Use Magic Device on items character can craft"',
  'Craft Homunculus':
    'Section=magic Note="Create homunculus"',
  'Craft Reserve':
    'Section=magic Note=%V',
  'Disable Trap':
    'Section=skill ' +
    'Note="Use Search and Disable Device to find and remove DC 20+ traps"',
  'Item Creation':
    'Section=magic Note="+2 DC 20+caster level check to create magic items"',
  'Metamagic Spell Completion':
    'Section=skill ' +
    'Note="DC 20 + 3x modified spell level Use Magic Device to apply metamagic feat to spell from scroll %V/dy"',
  'Metamagic Spell Trigger':
    'Section=magic Note="Apply metamagic feat to spell from wand"',
  'Retain Essence':
    'Section=magic Note="Drain magic item XP into craft reserve"',

  // Domain
  'Add Life':'Section=magic Note="Touched d6+%V temporary HP for %1 hr"',
  'Calming Influence':'Section=magic Note="<i>Calm Emotions</i> 1/dy"',
  'Clear-Eyed':'Section=feature Note="Vision unobstructed by weather"',
  'Community Pillar':'Section=skill Note="+2 Diplomacy"',
  'Craft Master':'Section=skill Note="+4 Craft"',
  'Empowered Creation':
    'Section=magic Note="+1 caster level for Item Creation spells"',
  'Empowered Necromancy':
    'Section=magic Note="+1 caster level necromancy spells"',
  'Exorcise':
    'Section=combat Note="Turn Undead check to exorcise spirit"',
  'Fit Of Passion':
    'Section=combat Note="+4 Str, +4 Con, +2 Will save, -2 AC for %V rd 1/dy"',
  'Flash Of Understanding':
    'Section=feature Note="+%V Wis skill check or Will save 1/dy"',
  'Focused Casting':
    'Section=magic Note="x1.5 chosen spell variable effects 1/dy"',
  'Iron Gut':'Section=save Note="Immune to ingested poison and disease"',
  'Master Deathless':
    'Section=combat Note="Use Turn Undead to command deathless 1/dy"',
  'Merchant':
    'Section=skill ' +
    'Note="+10 Profession (earn a living)/Appraise is a class skill"',
  'Meteorologist':
    'Section=skill Note="+2 Survival (weather)/Survival is a class skill"',
  'Touch Of Decay':
    'Section=magic Note="Touched d4 Con (living) or 2d6+%V HP (undead) 1/dy"',
  'Turn It On':'Section=ability Note="+4 charisma for 1 min 1/dy"',
  'Weak-Willed':'Section=save Note="-1 Will"',

  // Feat
  'Aberrant Dragonmark':'Section=magic Note="Cast chosen spell 1/dy"',
  'Action Boost':
    'section=ability ' +
    'Note="Add d8 instead of d6 when using AP on attack, skill, ability, level or saving throw"',
  'Action Surge':
    'Section=combat Note="Spend 2 AP to take extra move or standard action"',
  'Adamantine Body':
    'Section=ability,combat Note="Max 20 speed","+6 AC/DR 2/adamantine"',
  'Ashbound':
    'Section=magic ' +
    'Note="Dbl <i>Summon Nature\'s Ally</i> duration, summoned creatures +3 attack"',
  'Attune Magic Weapon':
    'Section=combat Note="+1 attack and damage w/magic weapons"',
  'Beast Shape':'Section=magic Note="Wild Shape into beast totem 1/dy"',
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
    'Section=magic Note="Incorporate elementals into wondrous items"',
  'Child Of Winter':
    'Section=magic Note="Use animal Druid spells on vermin, summon vermin"',
  'Cliffwalk Elite':'Section=ability Note="+10 Cliffwalk climb speed"',
  'Craft Construct':'Section=magic Note="Create enchanted construct"',
  'Detective':'Section=skill Note="+2 Spot"',
  'Double Steel Strike':
    'Section=combat Note="Flurry Of Blows w/Two-Bladed Sword"',
  'Dragon Rage':
    'Section=combat Note="+2 AC, +10 Dragon Totem resistance during Rage"',
  'Dragon Totem (Black)':'Section=save Note="Resistance 5 vs. acid"',
  'Dragon Totem (Blue)':'Section=save Note="Resistance 5 vs. electricity"',
  'Dragon Totem (Brass)':'Section=save Note="Resistance 5 vs. fire"',
  'Dragon Totem (Bronze)':'Section=save Note="Resistance 5 vs. electricity"',
  'Dragon Totem (Copper)':'Section=save Note="Resistance 5 vs. acid"',
  'Dragon Totem (Gold)':'Section=save Note="Resistance 5 vs. fire"',
  'Dragon Totem (Green)':'Section=save Note="Resistance 5 vs. acid"',
  'Dragon Totem (Red)':'Section=save Note="Resistance 5 vs. fire"',
  'Dragon Totem (Silver)':'Section=save Note="Resistance 5 vs. cold"',
  'Dragon Totem (White)':'Section=save Note="Resistance 5 vs. cold"',
  'Ecclesiarch':
    'Section=feature,skill ' +
    'Note="+2 Leadership",' +
         '"Gather Information is a class skill/Knowledge (Local) is a class skill"',
  'Education':
    'Section=skill ' +
    'Note="All Knowledge is a class skill/+2 any 2 Knowledge skills"',
  'Exceptional Artisan':
    'Section=magic Note="Reduce item creation base time by 25%"',
  'Extend Rage':'Section=combat Note="Add 5 rd to Rage duration"',
  'Extra Music':'Section=feature Note="Bardic Music %V extra times/dy"',
  'Extra Rings':'Section=magic Note="Wear up to 4 magic rings at once"',
  'Extra Shifter Trait':
    'Section=feature Note="Extra Shifter trait w/out ability bonus"',
  'Extraordinary Artisan':
    'Section=magic Note="Reduce item creation base price by 25%"',
  'Favored In House':
    'Section=feature ' +
    'Note="+%V roll to acquire favors from house contacts %1/wk"',
  'Finder':'Section=skill Note="+2 Search"',
  'Flensing Strike':
    'Section=combat ' +
    'Note="Kama causes -4 pain penalty to foe attack, save, checks for 1 min (DC %V Fort neg)"',
  'Gatekeeper Initiate':
    'Section=magic,save,skill ' +
    'Note="Access to additional spells",' +
         '"+2 vs. supernatural and aberrations",' +
         '"Knowledge (Planes) is a class skill"',
  'Great Bite':'Section=combat Note="Fang Crit is x3"',
  'Great Rend':'Section=combat Note="+d4+%V damage on hit w/both claws"',
  'Greater Dragonmark':
    'Section=magic Note="Choice of house dragonmark spell 1/dy"',
  'Greater Powerful Charge':
    'Section=combat Note="Raise charge damage one size category to %V"',
  'Greater Shifter Defense':'Section=combat Note="+2 Shifter Defense DR"',
  'Greensinger Initiate':
    'Section=magic,skill ' +
    'Note="Access to additional spells",' +
         '"Bluff is a class skill/Hide is a class skill/Perform is a class skill"',
  'Handler':'Section=skill Note="+2 Handle Animal"',
  'Haunting Melody':
    'Section=magic Note="R30\' Foes afraid for %1 rd (DC %V Will neg)"',
  'Healer':'Section=skill Note="+2 Heal"',
  'Healing Factor':'Section=combat Note="Heal %V points when shifting ends"',
  'Heroic Spirit':'Section=ability Note="+%V AP"',
  'Hospitaler':'Section=skill Note="+2 Diplomacy"',
  'Improved Damage Reduction':'Section=combat Note="DR +1/adamantine"',
  'Improved Fortification':
    'Section=combat Note="Immune sneak attack, critical hit, healing"',
  'Improved Natural Attack':
    'Section=combat Note="Natural attack damage increases one size category"',
  'Investigate':
    'Section=skill ' +
    'Note="Use Search to find and analyze clues, synergy with appropriate Knowledge"',
  'Knight Training':
    'Section=ability ' +
    'Note="No restrictions on combining Paladin and chosen class levels"',
  'Least Dragonmark':
    'Section=magic Note="Choice of house dragonmark spell 1/dy"',
  'Legendary Artisan':
    'Section=magic Note="Reduce item creation XP price by 25%"',
  'Lesser Dragonmark':
    'Section=magic Note="Choice of house dragonmark spell 1/dy"',
  'Longstride Elite':'Section=ability Note="+10 Longstride Speed"',
  'Maker':'Section=skill Note="+2 All Craft"',
  'Mithral Body':'Section=combat Note="+3 AC"',
  'Mithral Fluidity':
    'Section=combat,skill ' +
    'Note="Raise Mithral Body dexterity AC limit by 1",' +
         '"Reduce skill penalty by 1"',
  'Monastic Training':
    'Section=ability ' +
    'Note="No restrictions on combining Monk and chosen class levels"',
  'Music Of Growth':
    'Section=magic ' +
    'Note="R30\' +4 Str and Con to animal and plant creatures during Bardic Music"',
  'Music Of Making':
    'Section=magic,skill ' +
    'Note="Dbl duration of conjuration spells involving Bardic Music",' +
         '"+4 Craft during Bardic Music"',
  'Powerful Charge':'Section=combat Note="+%V damage from successful charge"',
  'Precise Swing':
    'Section=combat Note="Melee attack ignores less-than-total cover"',
  'Pursue':
    'Section=combat Note="Spend 1 AP to step into area vacated by opponent"',
  'Raging Luck':'Section=ability Note="Gain 1 AP during Rage"',
  'Recognize Impostor':
    'Section=skill Note="+4 Sense Motive vs. Bluff and Spot vs. Disguise"',
  'Repel Aberration':
    'Section=combat Note="Repel aberrations as level %V cleric turns undead"',
  'Research':'Section=skill Note="Use Knowledge skill on library and records"',
  'Right Of Counsel':
    'Section=feature Note="Seek advice from deathless ancestor"',
  'Scribe':'Section=skill Note="+2 Decipher Script"',
  'Shadower':'Section=skill Note="+2 Gather Information"',
  'Shifter Defense':'Section=combat Note="DR %V/silver"',
  'Shifter Ferocity':
    'Section=combat Note="Continue fighting below 0 HP while shifting"',
  'Sentinel':'Section=skill Note="+2 Sense Motive"',
  'Serpent Strike':'Section=combat Note="Flurry Of Blows w/longspear"',
  'Shifter Multiattack':
    'Section=combat Note="Reduce additional natural attack penalty to -2"',
  'Silver Smite':'Section=combat Note="Smite Evil +d6"',
  'Song Of The Heart':'Section=magic Note="+1 Bardic Music effects"',
  'Soothe The Beast':
    'Section=skill Note="R30\' Perform to change animal reaction"',
  'Spontaneous Casting':
    'Section=magic ' +
    'Note="Spend 2 AP to substitute any known spell for a prepared one"',
  'Storm Walker':'Section=skill Note="+2 Balance"',
  'Strong Mind':'Section=save Note="+3 vs. psionics and mind attacks"',
  'Totem Companion':
    'Section=companion Note="Totem magical beast as animal companion"',
  'Traveler':'Section=skill Note="+2 Survival"',
  'Undead Empathy':
    'Section=skill ' +
    'Note="+4 Diplomacy to influence intelligent undead reaction, use Diplomacy w/mindless undead"',
  'Urban Tracking':
    'Section=skill Note="Gather Information to trace person w/in communities"',
  'Vermin Companion':
    'Section=companion Note="Vermin creature as animal companion"',
  'Vermin Shape':'Section=magic Note="Wild Shape into vermin"',
  'Wand Mastery':'Section=magic Note="+2 spell DC and caster level w/wands"',
  'Warden Initiate':
    'Section=combat,magic,skill ' +
    'Note="+2 AC (forests)",' +
         '"Access to additional spells",' +
         '"Climb is a class skill/Jump is a class skill"',
  'Warder':'Section=skill Note="+2 Search"',
  'Whirling Steel Strike':
    'Section=combat Note="Flurry Of Blows with longsword"',

  // Race
  'Beasthide':
    'Section=ability,combat ' +
    'Note="+2 Constitution while shifting",' +
         '"+%V AC while shifting"',
  'Cliffwalk':
    'Section=ability Note="+2 Dexterity, %V climb speed while shifting"',
  'Composite Plating':'Section=combat Note="+2 AC/Cannot wear armor"',
  'Construct Immunity':
    'Section=save ' +
    'Note="Immune to poison, sleep, paralysis, disease, nausea, fatigue, exhaustion, sickening, and energy drain"',
  'Construct Vulnerability':
    'Section=save Note="Affected by effects that target wood or metal"',
  'Deceptive':'Section=skill Note="+2 Bluff/+2 Intimidate"',
  'Dreamless':'Section=save Note="Immune <i>Dream</i>, <i>Nightmare</i>"',
  'Humanlike':'Section=skill Note="+2 Disguise (human)"',
  'Influential':'Section=skill Note="+2 Bluff/+2 Diplomacy/+2 Intimidate"',
  'Intuitive':'Section=skill Note="+2 Sense Motive"',
  'Light Fortification':
    'Section=combat ' +
    'Note="25% change of negating critical hits and sneak attacks"',
  'Longstride':'Section=ability Note="+2 Dexterity, +%V Speed while shifting"',
  'Longtooth':
    'Section=ability,combat ' +
    'Note="+2 Strength while shifting",' +
         '"d6+%1 bite while shifting"',
  'Mindlink':
    'Section=magic Note="R30\' Telepathy with willing target for %V rd 1/dy"',
  'Minor Shape Change':'Section=magic Note="<i>Shape Change</i> body at will"',
  'Natural Psionic':'Section=magic Note="+1 PP/level"',
  'Natural Linguist':'Section=skill Note="Speak Language is a class skill"',
  'Razorclaw':
    'Section=ability,combat ' +
    'Note="+2 Strength while shifting",' +
         '"d4+%1 claw attack while shifting"',
  'Resist Charm':'Section=save Note="+2 vs. charm effects"',
  'Resist Mental':'Section=save Note="+2 vs. mind-altering effects"',
  'Resist Sleep':'Section=save Note="+2 vs. <i>Sleep</i>"',
  'Shifter Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Intelligence/-2 Charisma"',
  'Shifting':'Section=feature Note="Use Shifter trait for %V rd %1/day"',
  'Slam Weapon':'Section=combat Note="d4 slam attack"',
  'Stable':
    'Section=combat ' +
    'Note="May perform strenuous activity at 0 HP, no additional loss at negative HP"',
  'Unhealing':
    'Section=combat ' +
    'Note="Does not heal damage naturally, half effect from healing spells"',
  'Warforged Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Wisdom/-2 Charisma"',
  'Wildhunt':
    'Section=ability,feature,skill ' +
    'Note="+2 Constitution while shifting",' +
         '"R30\' Detect creature presence, track by smell",' +
         '"+2 Survival"',

  // Prestige classes
  'Ability Immunity':'Section=save Note="Immune to ability damage and drain"',
  'Action Point Bonus':'Section=ability Note="+2 AP"',
  'Alternate Bear Form':
    'Section=ability ' +
    'Note="Shift to animal (+16 Str/+2 Dex/+8 Con) or bipedal hybrid"',
  'Alternate Boar Form':
    'Section=ability Note="Shift to animal (+4 Str/+6 Con) or bipedal hybrid"',
  'Alternate Rat Form':
    'Section=ability Note="Shift to animal (+6 Dex/+2 Con) or bipedal hybrid"',
  'Alternate Tiger Form':
    'Section=ability ' +
    'Note="Shift to animal (+12 Str/+4 Dex/+6 Con) or bipedal hybrid"',
  'Alternate Wolf Form':
    'Section=ability ' +
    'Note="Shift to animal (+2 Str/+4 Dex/+4 Con) or bipedal hybrid"',
  'Alternate Wolverine Form':
    'Section=ability ' +
    'Note="Shift to animal (+4 Str/+4 Dex/+8 Con) or bipedal hybrid"',
  'Animalistic Heritage':'Section=skill Note="+2 Balance/+2 Climb/+2 Jump"',
  'Armor Spikes':'Section=combat Note="Grapple attack for %V damage"',
  'Caster Level Bonus':
    'Section=magic Note="+%V base class level for spells known and spells/dy"',
  'Charge Bonus':'Section=combat Note="+%V attack when charging"',
  'Climb Speed':
    'Section=ability ' +
    'Note="20\' climb speed (+10 for Cliffwalker) while shifting"',
  'Construct Perfection':
    'Section=combat Note="Immune nonlethal damage and critical hits"',
  'Contact':'Section=feature Note="Level 3 associate or informant"',
  'Death Immunity':'Section=save Note="Immune to death and necromancy effects"',
  'Detect Thoughts':'Section=magic Note="<i>Detect Thoughts</i> at will"',
  'Discern Lies':
    'Section=magic ' +
    'Note="R%1\' Reveals lies from %V creatures for %V rd or conc (DC %2 Will neg) 1/dy, 2 AP for 2/dy"',
  'Dodge Bonus':'Section=combat Note="+%V AC when unencumbered"',
  'Expert Bull Rush':'Section=combat Note="+%V bull rush and door breakage"',
  'Extended Charge':'Section=ability Note="+5 speed when charging"',
  'Extreme Action':
    'Section=ability Note="Retain AP on successful AP roll of 8"',
  'Extreme Hustle':'Section=combat Note="Spend 1 AP to gain a move action"',
  'Ferocity':'Section=combat Note="Continue fighting below 0 HP"',
  'Fierce Will':'Section=save Note="+4 Will while shifting"',
  'Flame Of Censure':
    'Section=combat Note="Stun or banish Outsiders w/turning check"',
  'Frightful Shifting':
    'Section=combat ' +
    'Note="R30\' Foes w/fewer than %V hit dice shaken for 5d6 rounds (DC %1 Will neg)"',
  'Hated Foe':
    'Section=combat Note="Spend 1 AP for double damage against favored enemy"',
  'Healing Immunity':'Section=save Note="No effect from healing spells"',
  'House Status':
    'Section=skill Note="+%V charisma-based skills w/house members"',
  'Improved Contact':'Section=feature Note="Level 6 associate or informant"',
  'Improved Grab':'Section=combat Note="Grapple w/out AOO after claw hit"',
  'Improved Greater Dragonmark':
    'Section=magic Note="2nd Greater Dragonmark spell or +1/day"',
  'Improved Least Dragonmark':
    'Section=magic Note="2nd Least Dragonmark spell or +1/day"',
  'Improved Lesser Dragonmark':
    'Section=magic Note="2nd Lesser Dragonmark spell or +1/day"',
  'Improved Critical':
    'Section=feature Note="Improved Critical feat for choice of weapon"',
  'Iron Damage Reduction':'Section=combat Note="DR 3/cold iron"',
  'Metal Immunity':'Section=save Note="Immune to mind-altering effects"',
  'Pounce':'Section=combat Note="Full attack when charging"',
  'Reserved':
    'Section=skill ' +
    'Note="-%V Bluff/-%V Diplomacy/-%V Gather Information/-%V Sense Motive"',
  'Resist Aberrations':'Section=save Note="+2 vs. aberration abilities"',
  'Resist Corruption':
    'Section=save Note="Immune disease, +2 vs. mind-altering"',
  'Resist Possession':'Section=save Note="+%V vs. possession"',
  'Resist The Arcane':'Section=save Note="+2 vs. arcane spells"',
  'Resist Unnatural':
    'Section=save Note="+2 vs. effects of outsiders and undead"',
  'Siberys Mark':
    'Section=magic Note="Choice of house dragonmark spell 1/dy"',
  'Silver Exorcism':'Section=combat Note="+2 exorcism checks"',
  'Spell Resistance':'Section=save Note="DC 20 spell resistance"',
  'Superior Bull Rush':'Section=combat Note="+%V+%1 damage from bull rush"',
  'Touch Of Contagion':'Section=magic Note="<i>Contagion</i> 3/day"',
  'Trip':'Section=combat Note="Trip w/out AOO after bite hit"',
  'True Seeing':
    'Section=magic ' +
    'Note="See through 120\' darkness, illusion, and invisible for %V min 1/dy, 2 AP for 2/dy"',
  'Unearthly Grace':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Warding Flame':
    'Section=combat ' +
    'Note="Warding glow for +2 AC, struck evil foe  blinded (DC %V Fort neg)"',
  'Weapon Of The Exorcist':
    'Section=combat Note="+1 damage w/sacred weapon treated as %V"',
  'Weapon Of The Flame':
    'Section=combat Note="+%Vd6 flame damage w/sacred weapon"',
  'Weretouched Claws':
    'Section=ability,combat ' +
    'Note="+2 Strength while shifting",' +
         '"d4+%V claw attack (next size for Razorclaw) while shifting"',
  'Weretouched Fangs':
    'Section=ability,combat ' +
    'Note="+2 Dexterity while shifting",' +
         '"d6+%V fang attack (next size for Longtooth) while shifting"',
  'Weretouched Rage':
    'Section=combat Note="+2 Str, +2 Con, -2 AC for 1 rd after taking damage"',
  'Weretouched Tusks':
    'Section=ability,combat ' +
    'Note="+2 Constitution while shifting",' +
         '"d6+%V tusk attack (next size for Longtooth) while shifting"',
  'Zone Of Truth':
    'Section=magic ' +
    'Note="R%1\' Creatures w/in 20\' radius cannot lie for %V min (DC %2 Will neg) 1/dy, 2 AP for 2/dy"'

};
Eberron.FEATURES = Object.assign({}, SRD35.FEATURES, Eberron.FEATURES_ADDED);
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
Eberron.GOODIES = Object.assign({}, SRD35.GOODIES);
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
Eberron.PATHS_ADDED = {
  'Artifice Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Empowered Creation","1:Craft Master"',
  'Charm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn It On"',
  'Commerce Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '1:Merchant',
  'Community Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Calming Influence","1:Community Pillar"',
  'Deathless Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Master Deathless"',
  'Decay Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Decay"',
  'Dragon Below Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Augment Summoning"',
  'Exorcism Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '1:Exorcise',
  'Feast Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Iron Gut"',
  'Life Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Add Life"',
  'Madness Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Flash Of Understanding",1:Weak-Willed',
  'Meditation Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Focused Casting"',
  'Necromancer Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Empowered Necromancy"',
  'Passion Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Fit Of Passion"',
  'Shadow Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '1:Blind-Fight',
  'Weather Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '1:Clear-Eyed,1:Meteorologist'
};
Eberron.PATHS = Object.assign({}, SRD35.PATHS, Eberron.PATHS_ADDED);
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
      '"1:Composite Plating","1:Construct Immunity",' +
      '"1:Construct Vulnerability","1:Light Fortification","1:Slam Weapon",' +
      '1:Stable,1:Unhealing,"1:Warforged Ability Adjustment" ' +
    'Languages=Common'
};
Eberron.RACES = Object.assign({}, SRD35.RACES, Eberron.RACES_ADDED);
Eberron.SCHOOLS = Object.assign({}, SRD35.SCHOOLS);
Eberron.SHIELDS = Object.assign({}, SRD35.SHIELDS);
Eberron.SKILLS = Object.assign({}, SRD35.SKILLS);
Eberron.SPELLS_ADDED = {
  'Armor Enhancement':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched armor or shield +3, 35K GP enhancement for $L10 min"',
  'Bolts Of Bedevilment':
    'School=Enchantment ' +
    'Level=Madness5 ' +
    'Description="R$RM\' 3 targets (1/rd) stunned for $L2 rd (Will neg)"',
  'Construct Energy Ward':
    'School=Abjuration ' +
    'Level=A3 ' +
    'Description="Touched construct DR ${lvl>10?30:lvl>6?20:10} from chosen energy for $L10 min"',
  'Control Deathless':
    'School=Necromancy ' +
    'Level=Deathless8 ' +
    'Description="R$RS\' Command $L2 HD deathless in 30\' area for $L min"',
  'Create Deathless':
    'School=Necromancy ' +
    'Level=Deathless6 ' +
    'Description="R$RS\' Create deathless soldier"',
  'Create Greater Deathless':
    'School=Necromancy ' +
    'Level=Deathless7 ' +
    'Description="R$RS\' Create undying councilor"',
  'Detect Aberration':
    'School=Divination ' +
    'Level=D1 ' +
    'Description="R60\' cone info on aberrations for conc/$L min"',
  'Detoxify':
    'School=Conjuration ' +
    'Level=Feast9 ' +
    'Description="R30\' Neutralize venom for $L10 min"',
  'Dimension Leap':
    'School=Conjuration ' +
    'Level=Orien1 ' +
    'Description="Teleport self up to $L10\'"',
  'Disable Construct':
    'School=Transmutation ' +
    'Level=A6 ' +
    'Description="Touched construct $L10 HP (Will half)"',
  'Energy Alteration':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched affects different energy type for $L10 min"',
  'Enhancement Alteration':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched shield or weapon enhancement applies to bash and defense for $L10 min"',
  'Feast Of Champions':
    'School=Conjuration ' +
    'Level=C9,Feast9 ' +
    'Description="Hour-long feast cures conditions, 2d8+$L HP"',
  'Greater Armor Enhancement':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched armor or shield +5, 100K GP enhancement for $L10 min"',
  'Greater Construct Energy Ward':
    'School=Abjuration ' +
    'Level=A4 ' +
    'Description="Touched construct ignores up to $L12min120 HP from specified energy for $L10 min"',
  'Greater Status':
    'School=Divination ' +
    'Level=Community4 ' +
    'Description="Monitor condition and position of, cast L0-2 touch spell on $Ldiv3 touched allies for $L hr"',
  'Greater Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A6 ' +
    'Description="Touched weapon +5 and 200K GP enhancement for $L10 min"',
  'Halt Deathless':
    'School=Necromancy ' +
    'Level=Deathless3 ' +
    'Description="R$RM\' 3 deathless in 30\' area immobilized for $L rd (Will neg)"',
  'Hardening':
    'School=Transmutation ' +
    'Level=A6,Artifice7,W6 ' +
    'Description="Touched $L10\' cu item resists damage"',
  "Hero's Blade":
    'School=Necromancy ' +
    'Level=Deathless9 ' +
    'Description="Touched blade good-aligned, dbl crit threat, +2d6 HP to evil (+2d8 outsider or undead), blind and deafen evil 1d4 rd on crit (Will neg) for $L min"',
  'Inflict Critical Damage':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched construct 4d8+$Lmin20 HP"',
  'Inflict Light Damage':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched construct 1d8+$Lmin5 HP"',
  'Inflict Moderate Damage':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched construct 2d8+$Lmin10 HP"',
  'Inflict Serious Damage':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched construct 3d8+$Lmin15 HP"',
  'Iron Construct':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched construct DR 15/adamantine, half acid and fire damage, +4 Str, -4 Dex, x5 weigh for $L min"',
  'Item Alteration':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched item grants bonus differently for $L10 min"',
  "Legion's Shield Of Faith":
    'School=Abjuration ' +
    'Level=A4 ' +
    'Description="R$RM\' Allies in 20\' area +$Ldiv6plus2min5 AC for $L min"',
  'Lesser Armor Enhancement':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched armor or shield +1 and 5K GP enhancement for $L10 min"',
  'Lesser Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched weapon +1 and 10K GP enhancement for $L10 min"',
  'Maddening Scream':
    'School=Enchantment ' +
    'Level=Madness8,W8 ' +
    'Description="Touched acts madly for 1d4+1 rd"',
  'Magecraft':
    'School=Divination ' +
    'Level=W1 ' +
    'Description="Self +5 same day Craft check"',
  'Metamagic Item':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Imbue touched magic item w/metamagic property for $L rd"',
  "Nature's Wrath":
    'School=Evocation ' +
    'Level=Gatekeeper4 ' +
    'Description="R$RM\' 20\' radius aberrations ${Lmin10}d6 HP and dazed 1 rd, other unnatural ${Ldiv2min5}d8 HP (Will half)"',
  'Personal Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched self weapon +1 and 10K GP enhancement for $L10 min"',
  'Power Surge':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched gains $Ldiv5 charges for $L min"',
  'Repair Critical Damage':
    'School=Transmutation ' +
    'Level=A4,W4 ' +
    'Description="Touched construct repair 4d8+$Lmin20"',
  'Repair Light Damage':
    'School=Transmutation ' +
    'Level=A1,Cannith1,W1 ' +
    'Description="Touched construct repair 1d8+$Lmin5"',
  'Repair Moderate Damage':
    'School=Transmutation ' +
    'Level=A2,W2 ' +
    'Description="Touched construct repair 2d8+$Lmin10"',
  'Repair Serious Damage':
    'School=Transmutation ' +
    'Level=A3,Cannith2,W3 ' +
    'Description="Touched construct repair 3d8+$Lmin15"',
  'Resistance Item':
    'School=Abjuration ' +
    'Level=A1 ' +
    'Description="Touched grants +$Ldiv4plus1 saves for $L10 min"',
  'Return To Nature':
    'School=Transmutation ' +
    'Level=Gatekeeper7 ' +
    'Description="R$RS\' Target reduce Int, magic"',
  'Skill Enhancement':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Touched grants +$Ldiv2plus2 specified skill checks for $L10 min"',
  'Spell Storing Item':
    'School=Transmutation ' +
    'Level=A1 ' +
    'Description="Imbue touched item with spell up to $Ldiv2min4 level"',
  'Spirit Steed':
    'School=Necromancy ' +
    'Level=Deathless4 ' +
    'Description="Touched animal speed +30/x6, no hustle damage for L$ hr"',
  'Stone Construct':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Touched construct DR 10/adamantine for $L10min150 HP"',
  'Suppress Requirement':
    'School=Transmutation ' +
    'Level=A3 ' +
    'Description="Remove usage requirement from touched magic item for $L10 min"',
  'Total Repair':
    'School=Transmutation ' +
    'Level=A6 ' +
    'Description="Touched construct conditions removed, $L10min150 HP repaired"',
  'Touch Of Madness':
    'School=Enchantment ' +
    'Level=Madness2 ' +
    'Description="Touched dazed for $L2 rd"',
  'Toughen Construct':
    'School=Transmutation ' +
    'Level=A2 ' +
    'Description="Touched construct +$Ldiv3plus1max2min5 AC"',
  'True Creation':
    'School=Conjuration ' +
    'Level=Artifice8,Cannith4 ' +
    'Description="Create permanent $L\' cu plant or mineral object"',
  'Weapon Augmentation':
    'School=Transmutation ' +
    'Level=A4 ' +
    'Description="Touched weapon +3 and 70K GP enhancement for $L10 min"',
  "Wind's Favor":
    'School=Transmutation ' +
    'Level=Lyrandar2 ' +
    'Description="R$RM\' 10\'x10\'x$L20plus100\' 30 MPH wind for $L hr"',
  'Withering Palm':
    'School=Necromancy ' +
    'Level=Decay7 ' +
    'Description="Touched loses $Ldiv2 Str and Con (Fort neg)"',
  'Zone Of Natural Purity':
    'School=Evocation ' +
    'Level=Gatekeeper2 ' +
    'Description="R$RS\' fey and plants in 20\' radius +1 attack, damage, save, abberations -1, for $L2 hr"'
};
Eberron.SPELLS = Object.assign({}, SRD35.SPELLS, Eberron.SPELLS_ADDED);
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
  'Bear\'s Endurance':'A2',
  'Bestow Curse':'Dragon3',
  'Blade Barrier':'A6',
  'Blasphemy':'Dragon7',
  'Bless':'Community1',
  'Blight':'Decay5',
  'Bull\'s Strength':'A2',
  'Call Lightning':'Weather3',
  'Call Lightning Storm':'Weather5',
  'Calm Animals':'Vadalis1',
  'Calm Emotions':'Charm2',
  'Cat\'s Grace':'A2',
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
  'Eagle\'s Splendor':'A2',
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
  'Fox\'s Cunning':'A2',
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
  'Heroes\' Feast':'Community6,Feast6,Ghallanda3',
  'Heroism':'Charm4',
  'Hide From Undead':'Life1',
  'Hideous Laughter':'Passion2',
  'Hold Monster':'Greensinger5,Warden5',
  'Holy Aura':'Exorcism8',
  'Holy Word':'Exorcism7',
  'Horrid Wilting':'Decay8,Necromancer8',
  'Identify':'A1,Tharashk1',
  'Imprisonment':'Gatekeeper9',
  'Illusory Script':'Sivis2',
  'Insanity':'Charm7,Madness7',
  'Irresistible Dance':'Passion8',
  'Know Direction':'Tharashk1',
  'Lesser Confusion':'Madness1',
  'Lesser Globe Of Invulnerability':'A4,Deneith2',
  'Lesser Planar Ally':'Dragon4',
  'Lesser Restoration':'Jorasco1,Life2',
  'Light':'A1',
  'Locate Creature':'Tharashk2,Warden4',
  'Locate Object':'Meditation3,Tharashk1',
  'Mage Armor':'Deneith1',
  'Mage\'s Faithful Hound':'Kundarak3',
  'Mage\'s Magnificent Mansion':'Feast7,Ghallanda3',
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
  'Mount':'Orien1',
  'Move Earth':'A6',
  'Neutralize Poison':'Feast4,Jorasco2',
  'Nondetection':'Kundarak2',
  'Obscuring Mist':'Shadow1,Weather1',
  'Overland Flight':'Orien3',
  'Owl\'s Wisdom':'A2,Meditation2',
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
  'Secret Chest':'Commerce6',
  'Secret Page':'Sivis2',
  'Secure Shelter':'Feast5,Ghallanda2',
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
  'Summon Nature\'s Ally V':'Vadalis3',
  'Summon Nature\'s Ally VI':'Vadalis4',
  'Symbol Of Death':'Sivis4',
  'Sympathy':'Community8',
  'Telepathic Bond':'Community5',
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
Eberron.WEAPONS_ADDED = {
  'Talenta Boomerang':'Level=3 Category=R Damage=d4 Range=30',
  'Talenta Sharrash':'Level=3 Category=2h Damage=d10 Crit=4 Threat=19',
  'Talenta Tangat':'Level=3 Category=2h Damage=d10 Threat=18',
  'Valenar Double Scimitar':'Level=3 Category=2h Damage=d6,d6 Threat=18',
  "Xen'drik Boomerang":'Level=3 Category=R Damage=d6 Range=20'
};
Eberron.WEAPONS = Object.assign({}, SRD35.WEAPONS, Eberron.WEAPONS_ADDED);
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
      '"3:Craft Wondrous Item","4:Craft Homunculus",' +
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
Eberron.CLASSES = Object.assign({}, SRD35.CLASSES, Eberron.CLASSES_ADDED);
Eberron.PRESTIGE_CLASSES = {
  'Dragonmark Heir':
    'Require=' +
      '"features.Favored In House","features.Least Dragonmark",' +
      '"house != \'None\'",' +
      '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'",' +
      '"countSkillsGe7 >= 2" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Diplomacy,"Gather Information",Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Nobility)",Perform,Ride,' +
      '"Sense Motive","Speak Language",Spellcraft ' +
    'Features=' +
      '"1:House Status","1:Lesser Dragonmark","2:Action Point Bonus",' +
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
      '"1:Armor Proficiency (Light)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"features.Ashbound ? 1:Resist The Arcane",' +
      '"features.Children Of Winter ? 1:Resist Poison",' +
      '"features.Gatekeepers ? 1:Resist Aberrations",' +
      '"features.Greensingers ? 1:Resist Nature\'s Lure",' +
      '"features.Wardens Of The Wood ? 1:Nature Sense",' +
      '"2:Hated Foe",' +
      '"features.Ashbound ? 3:Ferocity",' +
      '"features.Children Of Winter ? 3:Resist Corruption",' +
      '"features.Gatekeepers ? 3:Darkvision",' +
      '"features.Greensingers ? 3:Unearthly Grace",' +
      '"features.Wardens Of The Wood ? 3:Improved Critical",' +
      '"4:Favored Enemy",' +
      '"features.Ashbound ? 5:Spell Resistance",' +
      '"features.Children Of Winter ? 5:Touch Of Contagion",' +
      '"features.Gatekeepers ? 5:Slippery Mind",' +
      '"features.Greensingers ? 5:Damage Reduction",' +
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
      '"2:Caster Level Bonus",3:Darkvision,"3:Resist Charm",' +
      '"3:Resist Possession","3:Resist Unnatural","3:Smite Evil",' +
      '"4:Detect Thoughts","5:Silver Exorcism","6:Weapon Of Flame",' +
      '"10:Warding Flame"',
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
      '"1:Action Point Bonus","1:Trap Sense","2:Dodge Bonus",2:Evasion,' +
      '"2:Extreme Hustle","4:Extreme Action"',
  'Heir Of Siberys':
    'Require=' +
      '"features.Aberrant Dragonmark == 0","features.Heroic Spirit",' +
      '"features.Least Dragonmark == 0",' +
      '"race =~ \'Dwarf|Elf|Gnome|Halfling|Half Orc|Human\'",' +
      '"countSkillsGe15 >= 2" ' +
    'HitDie=d6 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Features=' +
      '"1:Action Point Bonus","2:Siberys Mark",' +
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
      '"1:Zone Of Truth",2:Contact,"3:Discern Lies","4:Improved Contact",' +
      '"5:True Seeing"',
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
      '"2:Charge Bonus","2:Construct Perfection","2:Extended Charge",' +
      '"3:Healing Immunity","3:Mental Immunity","3:Superior Bull Rush",' +
      '"4:Death Immunity","5:Ability Immunity","5:Greater Powerful Charge"',
  'Weretouched Master':
    'Require=' +
      '"baseAttack >= 4","sumShifterFeats >= 1","race == \'Shifter\'",' +
      '"skills.Knowledge (Nature) >= 5","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,"Handle Animal",Hide,Intimidate,Jump,' +
      '"Knowledge (Nature)",Listen,"Move Silently",Spot,Survival,Swim ' +
    'Features=' +
      '"features.Bear || features.Tiger ? 1:Weretouched Claws",' +
      '"features.Boar || features.Wolverine ? 1:Weretouched Tusks",' +
      '"features.Rat || features.Wolf ? 1:Weretouched Fangs",' +
      '"2:Wild Empathy",' +
      '"features.Bear ? 3:Improved Grab",' +
      '"features.Boar ? 3:Fierce Will",' +
      '"features.Rat ? 3:Climb Speed",' +
      '"features.Tiger ? 3:Pounce",' +
      '"features.Wolf ? 3:Trip",' +
      '"features.Wolverine ? 3:Weretouched Rage",' +
      '"4:Frightful Shifting",' +
      '"features.Bear ? 5:Alternate Bear Form",' +
      '"features.Boar ? 5:Alternate Boar Form",' +
      '"features.Rat ? 5:Alternate Rat Form",' +
      '"features.Tiger ? 5:Alternate Tiger Form",' +
      '"features.Wolf ? 5:Alternate Wolf Form",' +
      '"features.Wolverine ? 5:Alternate Wolverine Form" ' +
    'Selectables=' +
      '1:Bear,1:Boar,1:Rat,1:Tiger,1:Wolf,1:Wolverine'
};
Eberron.NPC_CLASSES = Object.assign({}, SRD35.NPC_CLASSES);

/* Defines the rules related to character abilities. */
Eberron.abilityRules = function(rules) {
  Eberron.basePlugin.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
Eberron.aideRules = function(rules, companions, familiars) {
  Eberron.basePlugin.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to combat. */
Eberron.combatRules = function(rules, armors, shields, weapons) {
  Eberron.basePlugin.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
Eberron.identityRules = function(
  rules, alignments, classes, deities, houses, paths, races, prestigeClasses,
  npcClasses
) {

  QuilvynUtils.checkAttrTable
    (houses, ['Dragonmark', 'Race', 'Features', 'Spells']);

  if(Eberron.basePlugin == window.Pathfinder)
    Pathfinder.identityRules(
      rules, alignments, classes, deities, {}, paths, races, Pathfinder.TRACKS,
      Pathfinder.TRAITS, Eberron.PRESTIGE_CLASSES, Eberron.NPC_CLASSES
    );
  else
    SRD35.identityRules(
      rules, alignments, classes, deities, paths, races,
      Eberron.PRESTIGE_CLASSES, Eberron.NPC_CLASSES
    );
  // No changes needed to the rules defined by base method

  for(var house in houses) {
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
  Eberron.basePlugin.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
Eberron.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  Eberron.basePlugin.talentRules
    (rules, feats, features, goodies, languages, skills);
  // No changes needed to the rules defined by base method
  for(var skill in skills) {
    rules.defineRule
      ('countSkillsGe9', 'skills.' + skill, '+=', 'source >= 9 ? 1 : null');
    rules.defineRule
      ('countSkillsGe12', 'skills.' + skill, '+=', 'source >= 12 ? 1 : null');
  }
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
  else if(type == 'Class' || type == 'Npc' || type == 'Prestige') {
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
  else if(type == 'Path') {
    Eberron.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Eberron.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    Eberron.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Eberron.raceRulesExtra(rules, name);
  } else if(type == 'School') {
    Eberron.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    if(Eberron.basePlugin.schoolRulesExtra)
      Eberron.basePlugin.schoolRulesExtra(rules, name);
  } else if(type == 'Shield')
    Eberron.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    var untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    Eberron.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained != 'n' && untrained != 'N',
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergy')
    );
    if(Eberron.basePlugin.skillRulesExtra)
      Eberron.basePlugin.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = (school || 'Universal').substring(0, 4);
    for(var i = 0; i < groupLevels.length; i++) {
      var matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      var group = matchInfo[1];
      var level = matchInfo[2] * 1;
      var fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      // TODO indicate domain spells in attributes?
      var domainSpell = Eberron.PATHS[group + ' Domain'] != null;
      Eberron.spellRules
        (rules, fullName, school, group, level, description, domainSpell);
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
  if(type != 'Feature' && type != 'Path' && type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
Eberron.alignmentRules = function(rules, name) {
  Eberron.basePlugin.alignmentRules(rules, name);
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
  Eberron.basePlugin.armorRules
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
  if(Eberron.basePlugin == window.Pathfinder) {
    for(var i = 0; i < requires.length; i++) {
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        requires[i] =
          requires[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
      }
    }
    for(var i = skills.length - 1; i >= 0; i--) {
      var skill = skills[i];
      if(!(skill in Pathfinder.SRD35_SKILL_MAP))
        continue;
      if(Pathfinder.SRD35_SKILL_MAP[skill] == '')
        skills.splice(i, 1);
      else
        skills[i] = Pathfinder.SRD35_SKILL_MAP[skill];
    }
  }
  Eberron.basePlugin.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots
  );
  if(name == 'Druid') {
    // Expand Druid's armor choices to include Darkleaf and Leafweave
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

    var allFeats = rules.getChoices('feats');
    for(var feat in allFeats) {
      if(feat == 'Wand Mastery' || allFeats[feat].indexOf('Item Creation') >= 0)
        allFeats[feat] = allFeats[feat].replace('Type=', 'Type=Artificer,');
    }
    rules.defineRule('featCount.Artificer',
      'levels.Artificer', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('magicNotes.craftReserve',
      'levels.Artificer', '=', '[0, 20, 40, 60, 80, 100, 150, 200, 250, 300, 400, 500, 700, 900, 1200, 1500, 2000, 2500, 3000, 4000, 5000][source]'
    );
    rules.defineRule('skillNotes.artificerKnowledge',
       'levels.Artificer', '=', null,
       'intelligenceModifier', '+', null
    );
    rules.defineRule('skillNotes.metamagicSpellCompletion',
      'intelligenceModifier', '=', '3 + source'
    );
    // Artificers are neither arcane nor divine, but they are casters
    rules.defineRule('casterLevel', 'casterLevels.Artificer', '+=', null);

  } else if(name == 'Dragonmark Heir') {

    var allSkills = rules.getChoices('skills');
    for(var skill in allSkills) {
      rules.defineRule
        ('countSkillsGe7', 'skills.' + skill, '+=', 'source >= 7 ? 1 : null');
    }
    rules.defineRule
      ('skillNotes.houseStatus', 'levels.Dragonmark Heir', '=', null);

  } else if(name == 'Eldeen Ranger') {

    rules.defineRule('combatNotes.favoredEnemy',
      'levels.Eldeen Ranger', '+=', 'source >= 4 ? 1 : null'
    );
    rules.defineRule
      ('combatNotes.smiteEvil', 'levels.Eldeen Ranger', '+=', '1');
    rules.defineRule('combatNotes.smiteEvil.1',
      'features.Smite Evil', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule('combatNotes.smiteEvil.2',
      'features.Smite Evil', '?', null,
      'levels.Eldeen Ranger', '=', null
    );
    rules.defineRule
      ('featCount.Fighter', 'featureNotes.improvedCritical', '+=', '1');
    rules.defineRule('saveNotes.unearthlyGrace', 'charismaModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Eldeen Ranger',
      'levels.Eldeen Ranger', '=', '1'
    );
    rules.defineRule('skillNotes.favoredEnemy',
      'levels.' + name, '+=', 'source >= 4 ? 1 : null'
    );

  } else if(name == 'Exorcist Of The Silver Flame') {

    rules.defineRule('combatNotes.smiteEvil',
      'levels.Exorcist Of The Silver Flame', '+=',
      'source >= 7 ? 2 : source >= 3 ? 1 : null'
    );
    rules.defineRule('combatNotes.smiteEvil.1',
      'features.Smite Evil', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule('combatNotes.smiteEvil.2',
      'features.Smite Evil', '?', null,
      'levels.Exorcist Of The Silver Flame', '=', 'source>=3 ? source : null'
    );
    rules.defineRule('combatNotes.wardingFlame',
      'charismaModifier', '=', '20 + source'
    );
    rules.defineRule('combatNotes.weaponOfFlame',
      'levels.Exorcist Of The Silver Flame', '=',
      'source >= 9 ? 2 : source >= 6 ? 1 : null'
    );
    rules.defineRule('combatNotes.weaponOfTheExorcist',
      'levels.Exorcist Of The Silver Flame', '=',
      '["magic"]' +
      '.concat(source >= 2 ? ["silver"] : [])' +
      '.concat(source >= 4 ? ["good"] : [])' +
      '.concat(source >= 8 ? ["lawful"] : []).sort().join("/")'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Exorcist Of The Silver Flame', '+=', 'Math.floor(source*2/3)'
    );
    rules.defineRule('saveNotes.resistPossession',
      'exorcistOfTheSilverFlameFeatures.Resist Possession', '+=', '4'
    );

  } else if(name == 'Extreme Explorer') {

    var allFeats = rules.getChoices('feats');
    for(var feat in
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
    rules.defineRule('combatNotes.dodgeBonus',
      'levels.Extreme Explorer', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('featCount.Extreme Explorer',
      'levels.Extreme Explorer', '=',
      'source < 3 ? null : Math.floor((source - 1) / 2)'
    );
    rules.defineRule('saveNotes.trapSense',
      'levels.Extreme Explorer', '+=', 'Math.floor((source + 1) / 2)'
    );

  } else if(name == 'Heir Of Siberys') {

    var allFeats = rules.getChoices('feats');
    for(var feat in
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
    var allSkills = rules.getChoices('skills');
    for(var skill in allSkills) {
      rules.defineRule
        ('countSkillsGe15', 'skills.' + skill, '+=', 'source >= 15 ? 1 : null');
    }
    rules.defineRule('casterLevels.Dragonmark',
      'levels.Heir Of Siberys', '^=', 'source >= 2 ? 15 : null'
    );
    rules.defineRule
      ('featCount.Heir Of Siberys', 'levels.Heir Of Siberys', '=', '1');
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Heir Of Siberys', '+=', 'source - 1'
    );
    rules.defineRule('magicNotes.siberysMark.1',
      'features.Siberys Mark', '?', null,
      'levels.Heir Of Siberys', '=', 'source >= 3 ? 2 : 1'
    );
    rules.defineRule('spellSlots.Dragonmark4',
      'levels.Heir Of Siberys', '=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Master Inquisitive') {

    var allFeats = rules.getChoices('feats');
    var miFeats = 
      {'Alertness':'', 'Deceitful':'', 'Heroic Spirit':'',
       'Improved Initiative':'', 'Iron Will':'', 'Persuasive':'',
       'Recognize Impostor':'', 'Research':'', 'Toughness':'',
       'Urban Tracking':''};
    if(!Eberron.USE_PATHFINDER) {
      // Pathfinder doesn't define these feats
      miFeats['Negotiator'] = miFeats['Track'] = '';
    }
    for(var feat in miFeats) {
      if(feat in allFeats) {
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="Master Inquisitive",');
      } else {
        console.log('Missing Master Inquisitive feat "' + feat + '"');
      }
    }
    rules.defineRule('featCount.Master Inquisitive',
      'levels.Master Inquisitive', '=',
      'source < 2 ? null : Math.floor(source / 2)'
    );
    rules.defineRule
      ('magicNotes.discernLies', 'levels.Master Inquisitive', '=', null);
    rules.defineRule('magicNotes.discernLies.1',
      'levels.Master Inquisitive', '=', 'source>=3 ? Math.floor(source / 2) * 5 + 25 : null'
    );
    rules.defineRule('magicNotes.discernLies.2',
      'levels.Master Inquisitive', '?', 'source >= 3',
      'wisdomModifier', '=', '14 + source'
    );
    rules.defineRule
      ('magicNotes.trueSeeing', 'levels.Master Inquisitive', '=', null);
    rules.defineRule
      ('magicNotes.zoneOfTruth', 'levels.Master Inquisitive', '=', null);
    rules.defineRule('magicNotes.zoneOfTruth.1',
      'levels.Master Inquisitive', '=', 'Math.floor(source / 2) * 5 + 25'
    );
    rules.defineRule('magicNotes.zoneOfTruth.2',
      'levels.Master Inquisitive', '?', null,
      'wisdomModifier', '=', '12 + source'
    );

  } else if(name == 'Warforged Juggernaut') {

    rules.defineRule('combatNotes.armorSpikes',
      'levels.Warforged Juggernaut', '=', 'source >= 4 ? "1d8" : "1d6"'
    );
    rules.defineRule('combatNotes.chargeBonus',
      'levels.Warforged Juggernaut', '=',
      'source < 2 ? null : Math.floor(source / 2)'
    );
    rules.defineRule
      ('combatNotes.expertBullRush', 'levels.Warforged Juggernaut', '=', null);
    rules.defineRule('combatNotes.greaterPowerfulCharge',
      '', '=', '"2d6"',
      'features.Large', '=', '"3d6"'
    );
    rules.defineRule('combatNotes.powerfulCharge',
      '', '=', '"d8"',
      'features.Large', '=', '"2d6"'
    );
    rules.defineRule('combatNotes.superiorBullRush',
      'levels.Warforged Juggernaut', '=', 'source >= 4 ? "1d8" : "1d6"'
    );
    rules.defineRule('combatNotes.superiorBullRush.1',
      'features.Superior Bull Rush', '?', null,
      'strengthModifier', '=', null
    );
    rules.defineRule
      ('skillNotes.reserved', 'levels.Warforged Juggernaut', '=', null);

  } else if(name == 'Weretouched Master') {

    var allFeats = rules.getChoices('feats');
    rules.defineRule('combatNotes.frightfulShifting', 'level', '=', null);
    rules.defineRule('combatNotes.frightfulShifting.1',
      'levels.Weretouched Master', '=', 'source + 10',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.weretouchedClaws',
      'level', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.weretouchedFangs',
      'level', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.weretouchedTusks',
      'level', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('featCount.Shifter',
      'levels.Weretouched Master', '+=',
      'source < 2 ? null : Math.floor(source / 2)'
    );
    rules.defineRule('selectableFeatureCount.Weretouched Master',
      'levels.Weretouched Master', '=', '1'
    );
    rules.defineRule('skillNotes.wildEmpathy',
      'levels.Weretouched Master', '+=', null,
      'charismaModifier', '+', null
    );

  } else if(Eberron.basePlugin.classRulesExtra) {

    Eberron.basePlugin.classRulesExtra(rules, name);

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
  Eberron.basePlugin.companionRules(
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
  Eberron.basePlugin.deityRules(rules, name, alignment, domains, weapons);
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
  Eberron.basePlugin.familiarRules(
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
  Eberron.basePlugin.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the abilities passed to featRules.
 */
Eberron.featRulesExtra = function(rules, name) {

  if(name == 'Adamantine Body') {
    rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
      'features.Adamantine Body', 'v', '1'
    );
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
  } else if(name == 'Extra Music') {
    rules.defineRule
      ('featureNotes.extraMusic', 'feats.Extra Music', '=', '4 * source');
    rules.defineRule
      ('featureNotes.bardicMusic', 'featureNotes.extraMusic', '+', null);
  } else if(name == 'Extend Rage') {
    rules.defineRule('combatNotes.rage', 'combatNotes.extendRage', '+', '5');
  } else if(name == 'Extra Shifter Trait') {
    rules.defineRule('selectableFeatureCount.Shifter',
      'featureNotes.extraShifterTrait', '+', '1'
    );
  } else if(name == 'Favored In House') {
    rules.defineRule('featureNotes.favoredInHouse',
      'level', '=', 'source>=16 ? 5 : source>=12 ? 4 : source>=7 ? 3 : source>=3 ? 2 : 1'
    );
    rules.defineRule('featureNotes.favoredInHouse.1',
      'features.Favored In House', '?', null,
      'level', '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Flensing Strike') {
    rules.defineRule('combatNotes.flensingStrike',
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
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
  } else if(name == 'Great Rend') {
    rules.defineRule('combatNotes.greatRend',
      'level', '=', 'Math.floor(source / 4)',
      'strengthModifier', '+', 'Math.floor(source / 2)'
    );
  } else if(name == 'Greater Powerful Charge') {
    rules.defineRule('combatNotes.greaterPowerfulCharge',
      '', '=', '"2d6"',
      'features.Large', '=', '"3d6"'
    );
    rules.defineRule('combatNotes.powerfulCharge',
      'combatNotes.greaterPowerfulCharge', '=', null
    );
  } else if(name == 'Greater Shifter Defense') {
    rules.defineRule('combatNotes.shifterDefense',
      'combatNotes.greaterShifterDefense', '+', '2'
    );
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
    rules.defineRule('magicNotes.hauntingMelody',
      'levels.Bard', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.hauntingMelody.1',
      /^skillModifier.Perform/, '+=', null
    );
  } else if(name == 'Healing Factor') {
    rules.defineRule('combatNotes.healingFactor', 'level', '=', null);
  } else if(name == 'Heroic Spirit') {
    rules.defineRule('abilityNotes.heroicSpirit', 'level', '=', '3 * source');
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
  } else if(name == 'Mithral Fluidity') {
    rules.defineRule
      ('mithralBodyDexACCap', 'combatNotes.mithralFluidity', '+', '1');
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.mithralFluidity', '+', '-1'
    );
  } else if(name == 'Powerful Charge') {
    rules.defineRule('combatNotes.powerfulCharge',
      '', '=', '"d8"',
      'features.Large', '=', '"2d6"'
    );
  } else if(name == 'Repel Aberration') {
    rules.defineRule('combatNotes.repelAberration', 'levels.Druid', '=', null);
    rules.defineRule('turingLevel', 'combatNotes.repelAberration', '^=', null);
  } else if(name == 'Shifter Defense') {
    rules.defineRule('combatNotes.shifterDefense', '', '=', '2');
  } else if(name == 'Warden Initiate') {
    rules.defineRule('casterLevels.Warden',
      'features.Warden Initiate', '?', null,
      'casterLevels.D', '=', null
    );
    rules.defineRule('spellDifficultyClass.Warden',
      'features.Warden Initiate', '?', null,
      'spellDifficultyClass.D', '=', null
    );
  } else if (Eberron.basePlugin.featRulesExtra) {
    Eberron.basePlugin.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Eberron.featureRules = function(rules, name, sections, notes) {
  if(Eberron.basePlugin == window.Pathfinder) {
    for(var i = 0; i < sections.length; i++) {
      if(sections[i] != 'skill')
        continue;
      var note = notes[i];
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        if(note.indexOf(skill) < 0)
          continue;
        var pfSkill = Pathfinder.SRD35_SKILL_MAP[skill];
        if(pfSkill == '' || note.indexOf(pfSkill) >= 0) {
          note = note.replace(new RegExp('[,/]?[^,/:]*' + skill + '[^,/]*', 'g'), '');
        } else {
          note = note.replace(new RegExp(skill, 'g'), pfSkill);
        }
      }
      notes[i] = note;
    }
  }
  Eberron.basePlugin.featureRules(rules, name, sections, notes);
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

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var houseLevel = prefix + 'Level';

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
    'magicNotes.leastDragonmark', '=', '1'
  );
  rules.defineRule('spellSlots.' + name + '2',
    'casterLevels.' + name, '?', null,
    'magicNotes.lesserDragonmark', '=', '1'
  );
  rules.defineRule('spellSlots.' + name + '3',
    'casterLevels.' + name, '?', null,
    'magicNotes.greaterDragonmark', '=', '1'
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
  Eberron.basePlugin.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
Eberron.languageRules = function(rules, name) {
  Eberron.basePlugin.languageRules(rules, name);
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
  if(Eberron.basePlugin == window.Pathfinder)
    Eberron.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, [], [],
      spellAbility, spellSlots
    );
  else
    Eberron.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, spellAbility,
      spellSlots
    );
  // Add new domains to Cleric selections
  if(name.match(/Domain$/))
    QuilvynRules.featureListRules
      (rules, ["deityDomains =~ '" + name.replace(' Domain', '') + "' ? 1:" + name], 'Cleric', 'levels.Cleric', true);
}

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the abilities passed to pathRules.
 */
Eberron.pathRulesExtra = function(rules, name) {
  if(name == 'Decay Domain') {
    rules.defineRule('magicNotes.touchOfDecay', 'levels.Cleric', '=', null);
  } else if(name == 'Life Domain') {
    rules.defineRule('magicNotes.addLife', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.addLife.1', 'levels.Cleric', '=', null);
  } else if(name == 'Madness Domain') {
    rules.defineRule
      ('featureNotes.flashOfUnderstanding', 'levels.Cleric', '=', null);
  } else if(name == 'Passion Domain') {
    rules.defineRule('combatNotes.fitOfPassion', 'levels.Cleric', '=', null);
  } else if(Eberron.basePlugin.pathRulesExtra) {
    Eberron.basePlugin.pathRulesExtra(rules, name);
  }
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
  Eberron.basePlugin.raceRules
    (rules, name, requires, features, selectables, languages, spellAbility,
     spellSlots);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
Eberron.raceRulesExtra = function(rules, name) {

  if(name == 'Kalashtar') {
    rules.defineRule('magicNotes.mindlink',
      'kalashtarLevel', '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('saveNotes.resistPossession', 'kalashtarLevel', '+=', '2');
  } else if(name == 'Shifter') {
    rules.defineRule('abilityNotes.cliffwalk', '', '=', '20');
    rules.defineRule('abilityNotes.longstride', '', '=', '10');
    rules.defineRule('combatNotes.beasthide', '', '=', '2');
    rules.defineRule('combatNotes.longtooth.1',
      'features.Longtooth', '?', null,
      'level', '=', 'Math.floor(source / 4)',
      'strengthModifier', '+', null
    );
    rules.defineRule('combatNotes.razorclaw.1',
      'features.Razorclaw', '?', null,
      'level', '=', 'Math.floor(source / 4)',
      'strengthModifier', '+', null
    );
    rules.defineRule
      ('featureNotes.shifting', 'constitutionModifier', '=', '3 + source');
    rules.defineRule('featureNotes.shifting.1', '', '=', '1');
    rules.defineRule('selectableFeatureCount.Shifter',
      'race', '=', 'source == "Shifter" ? 1 : null'
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
  } else if(Eberron.basePlugin.raceRulesExtra) {
    Eberron.basePlugin.raceRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
Eberron.schoolRules = function(rules, name, features) {
  Eberron.basePlugin.schoolRules(rules, name, features);
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
  Eberron.basePlugin.shieldRules
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
  Eberron.basePlugin.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a concise
 * description of the spell's effects.
 */
Eberron.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell
) {
  Eberron.basePlugin.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell);
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
  Eberron.basePlugin.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by base method
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
Eberron.choiceEditorElements = function(rules, type) {
  var result = [];
  if(type == 'House')
    result.push(
      ['Dragonmark', 'Dragonmark', 'text', [20]],
      ['Features', 'Features', 'text', [40]]
      ['Spells', 'Spells', 'text', [80]]
    );
  else
    result = Eberron.basePlugin.choiceEditorElements(rules, type);
  return result
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Eberron.createViewers = function(rules, viewers) {
  Eberron.basePlugin.createViewers(rules, viewers);
  // No changes needed to the return value of the base method
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Eberron.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'house') {
    var allHouses = this.getChoices('houses');
    var choices = ['None'];
    var race = attributes.race;
    for(var house in allHouses) {
      if(allHouses[house].match(race))
        choices.push(house);
    }
    attributes.house = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else {
    Eberron.basePlugin.randomizeOneAttribute.apply
      (this, [attributes, attribute]);
  }
};

/* Returns an array of plugins upon which this one depends. */
Eberron.getPlugins = function() {
  return [Eberron.basePlugin].concat(Eberron.basePlugin.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
Eberron.ruleNotes = function() {
  return '' +
    '<h2>Eberron Quilvyn Plugin Notes</h2>\n' +
    'Eberron Quilvyn Plugin Version ' + Eberron.VERSION + '\n' +
    '\n' +
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the Eberron plugin\n' +
    '</p>\n';
}
