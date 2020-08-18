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

var EBERRON_VERSION = '2.0.1.0';

/*
 * This module loads the rules from the Eberron campaign setting.  The Eberron
 * function contains methods that load rules for particular parts/chapters
 * of the rule book; raceRules for character races, magicRules for spells, etc.
 * These member methods can be called independently in order to use a subset of
 * the Eberron rules.  Similarly, the constant fields of Eberron (DOMAINS,
 * FEATS, etc.) can be thinned to limit the user's choices.
 */
function Eberron() {

  if(window.SRD35 == null) {
    alert('The Eberron module requires use of the SRD35 module');
    return;
  }

  if(window.Pathfinder == null || Pathfinder.SRD35_SKILL_MAP == null) {
    Eberron.USE_PATHFINDER = false;
  }
  Eberron.baseRules = Eberron.USE_PATHFINDER ? Pathfinder : SRD35;

  var rules = new QuilvynRules
    ('Eberron' + (Eberron.USE_PATHFINDER ? ' - PF' : ''), EBERRON_VERSION);
  Eberron.rules = rules;

  Eberron.CHOICES = Eberron.baseRules.CHOICES.concat(Eberron.CHOICES_ADDED);
  rules.defineChoice('choices', Eberron.CHOICES);
  rules.choiceEditorElements = Eberron.choiceEditorElements;
  rules.choiceRules = Eberron.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Eberron.randomizeOneAttribute;
  Eberron.RANDOMIZABLE_ATTRIBUTES =
    Eberron.baseRules.RANDOMIZABLE_ATTRIBUTES.concat
    (Eberron.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', Eberron.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Eberron.ruleNotes;

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras', 'feats', 'featCount', 'selectableFeatureCount');
  rules.defineChoice('preset', 'race', 'level', 'levels');

  Eberron.ALIGNMENTS = Object.assign({}, Eberron.baseRules.ALIGNMENTS);
  Eberron.ANIMAL_COMPANIONS =
    Object.assign( {}, Eberron.baseRules.ANIMAL_COMPANIONS);
  Eberron.ARMORS =
    Object.assign({}, Eberron.baseRules.ARMORS, Eberron.ARMORS_ADDDED);
  Eberron.DOMAINS =
    Object.assign({}, Eberron.baseRules.DOMAINS, Eberron.DOMAINS_ADDED);
  Eberron.FAMILIARS = Object.assign({}, Eberron.baseRules.FAMILIARS);
  Eberron.FEATS =
    Object.assign({}, Eberron.baseRules.FEATS, Eberron.FEATS_ADDED);
  Eberron.FEATURES =
    Object.assign({}, Eberron.baseRules.FEATURES, Eberron.FEATURES_ADDED);
  Eberron.GENDERS = Object.assign({}, Eberron.baseRules.GENDERS);
  Eberron.LANGUAGES =
    Object.assign({}, Eberron.baseRules.LANGUAGES, Eberron.LANGUAGES_ADDED);
  Eberron.RACES =
    Object.assign({}, Eberron.baseRules.RACES, Eberron.RACES_ADDED);
  Eberron.SCHOOLS = Object.assign({}, Eberron.baseRules.SCHOOLS);
  Eberron.SHIELDS = Object.assign({}, Eberron.baseRules.SHIELDS);
  Eberron.SKILLS = Object.assign({}, Eberron.baseRules.SKILLS);
  Eberron.SPELLS =
    Object.assign({}, Eberron.baseRules.SPELLS, Eberron.SPELLS_ADDED);
  Eberron.WEAPONS =
    Object.assign({}, Eberron.baseRules.WEAPONS, Eberron.WEAPONS_ADDED);
  Eberron.CLASSES =
    Object.assign({}, Eberron.baseRules.CLASSES, Eberron.CLASSES_ADDED);
  for(var clas in Eberron.CLASS_SPELLS_ADDED) {
    Eberron.CLASSES[clas] = Eberron.CLASSES[clas].replace('Spells=', 'Spells=' + Eberron.CLASS_SPELLS_ADDED[clas] + ',');
  }

  Eberron.abilityRules(rules);
  Eberron.aideRules(rules, Eberron.ANIMAL_COMPANIONS, Eberron.FAMILIARS);
  Eberron.combatRules(rules, Eberron.ARMORS, Eberron.SHIELDS, Eberron.WEAPONS);
  // Spell definition is handled by each individual class and domain. Schools
  // have to be defined before this can be done.
  Eberron.magicRules(rules, Eberron.SCHOOLS, []);
  // Feats must be defined before classes
  Eberron.talentRules
    (rules, Eberron.FEATS, Eberron.FEATURES, Eberron.LANGUAGES, Eberron.SKILLS);
  Eberron.identityRules(
    rules, Eberron.ALIGNMENTS, Eberron.CLASSES, Eberron.DEITIES,
    Eberron.DOMAINS, Eberron.GENDERS, Eberron.HOUSES, Eberron.RACES
  );
  Eberron.goodiesRules(rules);

  if(window.SRD35NPC != null) {
    SRD35NPC.identityRules(rules, SRD35NPC.CLASSES);
    SRD35NPC.talentRules(rules, SRD35NPC.FEATURES);
  }

  Quilvyn.addRuleSet(rules);

}

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
    'Alignment=LN Weapon="Heavy Pick" Domain=Dragon Below,Earth,Evil,Madness',
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
Eberron.DOMAINS_ADDED = {
  'Artifice':
    'Features="1:Empowered Creation","1:Craft Master" ' +
    'Spells=' +
      '"Animate Rope","Wood Shape","Stone Shape","Minor Creation",Fabricate,' +
      '"Major Creation",Hardening,"True Creation","Prismatic Sphere"',
  'Charm':
    'Features="1:Turn It On" ' +
    'Spells=' +
      '"Charm Person","Calm Emotions",Suggestion,Heroism,"Charm Monster",' +
      'Geas/Quest,Insanity,Demand,"Dominate Monster"',
  'Commerce':
    'Features=1:Merchant ' +
    'Spells=' +
      '"Comprehend Languages","Zone Of Truth",Tongues,Glibness,"True Seeing",' +
      '"Secret Chest",Refuge,"Analyze Dweomer","Polymorph Any Object"',
  'Community':
    'Features="1:Calming Influence","1:Community Pillar" ' +
    'Spells=' +
      'Bless,Status,Prayer,"Greater Status","Telepathic Bond",' +
      '"Heroes\' Feast",Refuge,Sympathy,"Mass Heal"',
  'Deathless':
    'Features="1:Master Deathless" ' +
    'Spells=' +
      '"Detect Undead",Consecrate,"Halt Deathless","Spirit Steed",Hallow,' +
      '"Create Deathless","Create Greater Deathless","Control Deathless",' +
      '"Hero\'s Blade"',
  'Decay':
    'Features="1:Touch Of Decay" ' +
    'Spells=' +
      'Doom,"Ray Of Enfeeblement",Contagion,Enervation,Blight,' +
      '"Antilife Shell","Withering Palm","Horrid Wilting","Energy Drain"',
  'Dragon Below':
    'Features="1:Augment Summoning" ' +
    'Spells=' +
      '"Cause Fear","Death Knell","Bestow Curse","Lesser Planar Ally",' +
      '"Slay Living","Planar Ally",Blasphemy,"Greater Planar Ally",Gate',
  'Exorcism':
    'Features=1:Exorcise ' +
    'Spells=' +
      '"Protection From Evil","Magic Circle Against Evil","Remove Curse",' +
      'Dismissal,"Dispel Evil",Banishment,"Holy Word","Holy Aura",Freedom',
  'Feast':
    'Features="1:Iron Gut" ' +
    'Spells=' +
      'Goodberry,"Delay Poison","Create Food And Water","Neutralize Poison",' +
      '"Secure Shelter","Heroes\' Feast","Mage\'s Magnificent Mansion",' +
      'Detoxify,"Feast Of Champions"',
  'Life':
    'Features="1:Add Life" ' +
    'Spells=' +
      '"Hide From Undead","Lesser Restoration","Plant Growth","Death Ward",' +
      '"Disrupting Weapon","Animate Objects",Regenerate,"Animate Plants",' +
      '"Mass Heal"',
  'Madness':
    'Features="1:Flash Of Understanding",1:Weak-Willed ' +
    'Spells=' +
      '"Lesser Confusion","Touch Of Madness",Rage,Confusion,' +
      '"Bolts Of Bedevilment","Phantasmal Killer",Insanity,' +
      '"Maddening Scream",Weird',
  'Meditation':
    'Features="1:Focused Casting" ' +
    'Spells=' +
      '"Comprehend Languages","Owl\'s Wisdom","Locate Object",Tongues,' +
      '"Spell Resistance","Find The Path","Spell Turning","Mind Blank",' +
      '"Astral Projection"',
  'Necromancer':
    'Features="1:Empowered Necromancy" ' +
    'Spells=' +
      '"Ray Of Enfeeblement","Command Undead","Vampiric Touch",Enervation,' +
      '"Waves Of Fatigue",Eyebite,"Control Undead","Horrid Wilting",' +
      '"Energy Drain"',
  'Passion':
    'Features="1:Fit Of Passion" ' +
    'Spells=' +
      '"Cause Fear","Hideous Laughter",Confusion,"Crushing Despair",' +
      '"Greater Command","Greater Heroism","Song Of Discord",' +
      '"Irresistible Dance","Dominate Monster"',
  'Shadow':
    'Features=1:Blind-Fight ' +
    'Spells=' +
      '"Obscuring Mist",Darkness,"Deeper Darkness","Shadow Conjuration",' +
      '"Shadow Evocation","Shadow Walk","Greater Shadow Conjuration",' +
      '"Greater Shadow Evocation",Shades',
  'Weather':
    'Features=1:Clear-Eyed,1:Meteorologist ' +
    'Spells=' +
      '"Obscuring Mist","Fog Cloud","Call Lightning","Sleet Storm",' +
      '"Call Lightning Storm","Control Winds","Control Weather",Whirlwind,' +
      '"Storm Of Vengeance"'
};
Eberron.DOMAINS = Object.assign({}, SRD35.DOMAINS, Eberron.DOMAINS_ADDED);
Eberron.FAMILIARS = Object.assign({}, SRD35.FAMILIARS);
Eberron.FEATS_ADDED = {
  'Aberrant Dragonmark':
    'Type=General Require="race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'"',
    // TODO Require !feats.(Greater|Least|Lesser) Dragonmark
  'Action Boost':'Type=General',
  'Action Surge':'Type=General Require="baseAttack >= 3"',
  'Adamantine Body':'Type=Warforged Require="race == \'Warforged\'"',
  'Ashbound':'Type=General Require="features.Spontaneous Druid Spell"',
  'Attune Magic Weapon':
    'Type="Item Creation" Require="casterLevel >= 5","features.Craft Magic Arms And Armor"',
  'Beast Shape':
    // TODO requires wild shape into huge creature
    'Type=General Require="Max \'^features.Beast Totem\' > 0","features.Wild Shape"',
  'Beast Totem (Chimera)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Digester)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Displacer Beast)':
    'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Gorgon)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Krenshar)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Unicorn)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Winter Wolf)':'Type=General Require="features.Wild Empathy"',
  'Beast Totem (Yrthak)':'Type=General Require="features.Wild Empathy"',
  'Beasthide Elite':'Type=Shifter Require=features.Beasthide',
  'Bind Elemental':
    'Type="Item Creation" Require="casterLevel >= 9","features.Craft Wondrous Item"',
  'Child Of Winter':
    'Type=General Require="alignment !~ \'Good\'","features.Spontaneous Druid Spell"',
  'Cliffwalk Elite':'Type=Shifter Require=features.Cliffwalk',
// Craft Construct from MM needed for Artificer class
  'Craft Construct':
    'Type="Item Creation" Require="features.Craft Magic Arms And Armor","features.Craft Wondrous Item"',
  'Double Steel Strike':'Type=General Require="Weapon Proficiency (Two-Bladed Sword)","features.Flurry Of Blows" Implies="weapons.Two-Bladed Sword"',
  'Dragon Rage':
    'Type=General Require="Max \'^features.Dragon Totem\' > 0",features.Rage,origin=Argonnessen',
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
    'Type=General Require="skills.Knowledge (Religion) >= 6" Imply=features.Leadership',
  'Education':'Type=General',
    // TODO Requires Item Creation
  'Exceptional Artisan':'Type="Item Creation"',
  'Extend Rage':'Type=General Require=features.Rage',
  'Extra Music':'Type=General Require="features.Bardic Music"',
  'Extra Rings':
    'Type="Item Creation" Require="casterLevel >= 12","feaures.Forge Ring"',
    // TODO Requires 2 Shifter
  'Extra Shifter Trait':'Type=Shifter Require="race == \'Shifter\'"',
    // TODO Requires Item Creation
  'Extraordinary Artisan':'Type="Item Creation"',
  'Favored In House':
    'Type=General Require="house != \'None\'","race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'"',
  'Flensing Strike':
    'Type=General Require="Weapon Focus (Kama)","Weapon Proficiency (Kama)"',
  'Gatekeeper Initiate':
    'Type=General Require="features.Spontaneous Druid Spell"',
  'Great Bite':'Type=Shifter Require="baseAttack >= 6",features.Longtooth',
  'Great Rend':'Type=Shifter Require="baseAttack >= 4",features.Razorclaw',
    // TODO Require any 2 skills >= 12
  'Greater Dragonmark':
    'Type=General Require="features.Least Dragonmark","features.Lesser Dragonmark","house != \'None\'","race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'"',
    // TODO Require !Small
  'Greater Powerful Charge':'Type=General Require="baseAttack >= 4","features.Powerful Charge"',
    // TODO Require 4 Shifter
  'Greater Shifter Defense':
    'Type=Shifter Require="feaures.Shifter Defense","race == \'Shifter\'"',
  'Greensinger Initiate':
    'Type=General Require="features.Spontaneous Druid Spell"',
  'Haunting Melody':
    'Type=General Require="features.Bardic Music","Sum \'^skills.Perform\' >= 9"',
  'Healing Factor':
    'Type=Shifter Require="constitution >= 13","race == \'Shifter\'"',
  'Heroic Spirit':'Type=General',
  'Improved Damage Reduction':'Type=Warforged Require="race == \'Warforged\'"',
  'Improved Fortification':
    'Type=Warforged Require="baseAttack >= 6","race == \'Warforged\'"',
  'Improved Natural Attack':'Type=General Require="baseAttack >= 4"',
  'Investigate':'Type=General',
  'Knight Training (Cleric)':'Type=General Imply="levels.Paladin > 0"',
  'Least Dragonmark':
    'Type=General Require="house != \'None\'","race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'"',
    // TODO Require Any Item Creation
  'Legendary Artisan':'Type="Item Creation"',
    // TODO Require 2 skills >= 9
  'Lesser Dragonmark':
    'Type=General Require="house != \'None\'","race =~ \'Dwarf|Elf|Gnome|Halfling|Half-Orc|Human\'","features.Least Dragonmark"',
  'Longstride Elite':'Type=Shifter Require=features.Longstride',
  'Mithral Body':'Type=Warforged Require="race == \'Warforged\'"',
  'Mithral Fluidity':
    'Type=Warforged Require="race == \'Warforged\'","feaures.Mithral Body"',
  'Monastic Training (Cleric)':'Type=General',
  'Music Of Growth':
    'Type=General Require="features.Bardic Music","Sum \'^skills.Perform\' >= 12"',
  'Music Of Making':
    'Type=General Require="features.Bardic Music","Sum \'^skills.Perform\' >= 9"',
    // TODO Require Size > S
  'Powerful Charge':'Type=General Require="baseAttack >= 1"',
  'Precise Swing':'Type=General Require="baseAttack >= 5"',
  'Pursue':'Type=General Require="features.Combat Reflexes"',
  'Raging Luck':'Type=General Require=features.Rage',
  'Recognize Imposter':'Type=General Require="skills.Sense Motive >=3","skills.Spot >= 3"',
  'Repel Aberration':'Type=General Require="features.Gatekeeper Initiate","levels.Druid >= 3"',
  'Research':'Type=General',
  'Right Of Counsel':'Type=General Require="race == \'Elf\'"',
  'Serpent Strike':'Type=General Require="Weapon Focus (Longspear)","features.Flurry Of Blows","weaponProficiencyLevel >= 1" Imply="weapons.Longspear"',
    // TODO Require any 2 Shifter
  'Shifter Defense':'Type=Shifter Require="race == \'Shifter\'"',
  'Shifter Ferocity':
    'Type=Shifter Require="wisdom >= 13","race == \'Shifter\'"',
  'Shifter Multiattack':'Type=Shifter Require="baseAttack >= 6","features.Longtooth||features.Razorclaw"',
  'Silver Smite':
    'Type=General Require="deity == \'The Silver Flame\'","features.Smite Evil"',
  'Song Of The Heart':
    'Type=General Require="features.Bardic Music","features.Inspire Competence","Sum \'^skills.Perform\' >= 6"',
  'Soothe The Beast':
    'Type=General Require="features.Bardic Music","Sum \^skills.Perform\' >= 6"',
  'Spontaneous Casting':'Type=General Require="casterLevel >= 5"',
  'Strong Mind':'Type=General Require="wisdom >= 11"',
  'Totem Companion':
    'Type=General Require="Max \'features.Beast Totem\' >= 1","features.Wild Empathy"',
  'Undead Empathy':'Type=General Require="charisma >= 13"',
  'Urban Tracking':'Type=General',
  'Vermin Companion':
    'Type=General Require="alignment !~ \'Good\'","levels.Druid >= 3"',
  'Vermin Shape':
    'Type=General Require="alignment !~ \'Good\'","features.Child Of Winter","levels.Druid >= 5"',
  'Wand Mastery':
    'Type=General Require="casterLevel >= 9","features.Craft Wand"',
  'Warden Initiate':'Type=General Require="features.Spontaneous Druid Spell"',
  'Whirling Steel Strike':
    'Type=General Require="features.Weapon Focus (Longsword)","features.Flurry Of Blows" Imply="weapons.Longsword"'
};
Eberron.FEATS = Object.assign({}, SRD35.FEATS, Eberron.FEATS_ADDED);
Eberron.FEATURES_ADDED = {
  // Class
  'Artificer Knowledge':
    'Section=skill Note="+%V DC 15 check to determine whether an item is magical"',
  'Artificer Skill Mastery':
    'Section=skill Note="Take 10 on Spellcraft/Use Magic Device when distracted"',
  'Artisan Bonus':
    'Section=skill Note="+2 Use Magic Device on items character can craft"',
  'Craft Homunculus':
    'Section=magic Note="Create homunculus"',
  'Craft Reserve':
    'Section=magic Note=%V',
  'Item Creation':
    'Section=magic Note="+2 DC 20+caster level check to create magic items"',
  'Metamagic Spell Completion':
    'Section=magic Note="Apply metamagic feat to spell from scroll"',
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
  'Master Deathless':'Section=combat Note="Use Turn Undead to command deathless 1/dy"',
  'Merchant':
    'Section=skill Note="+10 Profession (earn a living)/Appraise is a class skill"',
  'Meteorologist':
    'Section=skill Note="+2 Survival (weather)/Survival is a class skill"',
  'Touch Of Decay':
    'Section=magic Note="Touched d4 Con (living) or 2d6+%V HP (undead) 1/dy"',
  'Turn It On':'Section=ability Note="+4 charisma for 1 min 1/dy"',
  'Weak-Willed':'Section=save Note="-1 Will"',
  // Feat
  'Aberrant Dragonmark':'Section=magic Note="Cast chosen spell 1/dy"',
  'Action Boost':
    'section=ability Note="Add d8 instead of d6 when using AP on attack, skill, ability, level or saving throw"',
  'Action Surge':
    'Section=ability Note="Spend 2 AP to take extra move or standard action"',
  'Adamantine Body':
    'Section=ability,combat Note="Max 20 speed","+6 AC/DR 2/adamantine"',
  'Ashbound':
    'Section=magic Note="Dbl <i>Summon Nature\'s Ally</i> duration, summoned creatures +3 attack"',
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
  'Beasthide Elite':'Section=combat Note="+2 AC while shifting"',
  'Bind Elemental':'Section=magic Note="Bind elementals to magical objects"',
  'Child Of Winter':'Section=magic Note="Use animal Druid spells on vermin"',
  'Cliffwalker Elite':'Section=ability Note="+10 climb speed while shifting"',
  'Craft Construct':'Section=magic Note="Create enchanted construct"',
  'Detective':'Section=skill Note="+2 Spot"',
  'Double Steel Strike':
    'Section=combat Note="Flurry Of Blows w/Two-Bladed Sword"',
  'Dragon Rage':
    'Section=combat Note="+2 AC, +10 Dragon Totem resistence during Rage"',
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
    'Section=feature,skill Note="+2 Leadership","Gather Information is a class skill/Knowledge (Local) is a class skill"',
  'Education':
    'Section=skill Note="Knowledge are class skills/+2 any 2 Knowledge skills"',
  'Exceptional Artisan':
    'Section=magic Note="Reduce item creation base time by 25%"',
  'Extend Rage':'Section=combat Note="Add 5 rd to Rage duration"',
  'Extra Music':'Section=feature Note="Bardic Music 4 extra times/dy"',
  'Extra Rings':'Section=magic Note="Wear up to 4 magic rings at once"',
  'Extra Shifter Trait':
    'Section=feature Note="Extra Shifter trait w/out ability bonus"',
  'Extraordinary Artisan':
    'Section=magic Note="Reduce item creation base price by 25%"',
  'Favored In House':
    'Section=feature Note="Acquire favors from house contacts"',
  'Finder':'Section=skill Note="+2 Search"',
  'Flensing Strike':
    'Section=combat Note="Kama causes -1 pain penalty to foe attack, save, checks for 1 min (DC %V Fort neg)"',
  'Gatekeeper Initiate':
    'Section=magic,save,skill Note="Access to additional spells","+2 vs. supernatural and aberrations","Knowledge (Planes) is a class skill"',
  'Great Bite':'Section=combat Note="Fang Crit is x3"',
  'Great Rend':'Section=combat Note="+d4+%V damage on hit w/both claws"',
  'Greater Dragonmark':'section=magic Note="Choice of %V"',
  'Greater Powerful Charge':
    'Section=combat Note="Raise charge damage one size category to %V"',
  'Greater Shifter Defense':'Section=combat Note="+2 Shifter Defense DR"',
  'Greensinger Initiate':
    'Section=magic,skill Note="Access to additional spells","Bluff is a class skill/Hide is a class skill/Perform is a class skill"',
  'Handler':'Section=skill Note="+2 Handle Animal"',
  'Haunting Melody':
    'Section=magic Note="Foe afraid for %1 rd (DC %V Will neg)"',
  'Healer':'Section=skill Note="+2 Heal"',
  'Healing Factor':'Section=combat Note="Heal %V points when shifting ends"',
  'Heroic Spirit':'Section=ability Note="+3 AP"',
  'Hospitaler':'Section=skill Note="+2 Diplomacy"',
  'Improved Damage Reduction':'Section=combat Note="DR +1/adamantine"',
  'Improved Fortification':
    'Section=combat Note="Immune sneak attac, critical hit, healing"',
  'Improved Natural Attack':
    'Section=combat Note="Natural attack damage increases one size catagory"',
  'Investigate':
    'Section=skill Note="Use Search to find and analyze clues, synergy with appropriate Knowledge"',
  'Knight Training (Cleric)':
    'Section=ability Note="No restrictions on Paladin/Cleric advancement"',
  'Least Dragonmark':'Section=magic Note="Choice of %V"',
  'Legendary Artisan':
    'Section=magic Note="Reduce item creation XP price by 25%"',
  'Lesser Dragonmark':'Section=magic Note="Choice of %V"',
  'Longstride Elite':'Section=ability Note="+10 Speed while shifting"',
  'Maker':'Section=skill Note="+2 All Craft"',
  'Mithral Body':'Section=combat Note="+3 AC"',
  'Mithral Fluidity':
    'Section=combat,skill Note="Raise Mithral Body Reflex AC limit by 1","Reduce skill penalty by 1"',
  'Monastic Training (Cleric)':
    'Section=ability Note="No restrictions on Monk/Cleric level advancement"',
  'Music Of Growth':
    'Section=magic Note="R30\' +4 Str and Con to animal and plant creatures during Bardic Music"',
  'Music Of Making':
    'Section=magic,skill Note="Dbl duration of conjuration spells involving Bardic Music","+4 Craft during Bardic Music"',
  'Powerful Charge':'Section=combat Note="+%V damage from successful charge"',
  'Precise Swing':
    'Section=combat Note="Melee attack ignores less-than-total cover"',
  'Pursue':
    'Section=combat Note="Spend 1 AP to step into area vacated by opponent"',
  'Raging Luck':'Section=ability Note="Gain 1 AP during Rage"',
  'Recognize Imposter':
    'Section=skill Note="+4 Sense Motive vs. Bluff and Spot vs. Disguise"',
  'Repel Aberration':
    'Section=combat Note="Repel aberrations as cleric turns undead"',
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
  'Soothe The Beast':'Section=skill Note="Perform to change animal reaction"',
  'Spontaneous Casting':
    'Section=magic Note="Spend 2 AP to substitute any known spell for a prepared one"',
  'Storm Walker':'Section=skill Note="+2 Balance"',
  'Strong Mind':'Section=save Note="+3 vs. psionics"',
  'Totem Companion':
    'Section=companion Note="Totem magical beast as animal companion"',
  'Traveler':'Section=skill Note="+2 Survival"',
  'Undead Empathy':
    'Section=skill Note="+4 Diplomacy to influence undead reaction"',
  'Urban Tracking':
    'Section=skill Note="Gather Information to trace person w/in communities"',
  'Vermin Companion':
    'Section=companion Note="Vermin creature as animal companion"',
  'Vermin Shape':'Section=magic Note="Wild Shape into vermin"',
  'Wand Mastery':'Section=magic Note="+2 spell DC and caster level w/wands"',
  'Warden Initiate':
    'Section=combat,magic,skill Note="+2 AC (forests)","Access to additional spells","Climb is a class skill/Jump is a class skill"',
  'Warder':'Section=skill Note="+2 Search"',
  'Whirling Steel Strike':
    'Section=combat Note="Flurry Of Blows with longsword"',
  // Race
  'Beasthide':
    'Section=ability,combat Note="+2 Con while shifting","+2 AC while shifting"',
  'Cliffwalk':'Section=ability Note="+2 Dex, %V climb speed while shifting"',
  'Composite Plating':'Section=combat Note="+2 AC/Cannot wear armor"',
  'Construct Immunity':
    'Section=save Note="Immune to poison, sleep, paralysis, disease, nausea, fatigue, exhaustion, sickening, and energy drain"',
  'Construct Vulnerability':
    'Section=save Note="Affected by effects that target wood or metal"',
  'Deceptive':'Section=skill Note="+2 Bluff/+2 Intimidate"',
  'Dreamless':'Section=save Note="Immune <i>Dream</i>, <i>Sleep</i>"',
  'Humanlike':'Section=skill Note="+2 Disguise (human)"',
  'Influential':'Section=skill Note="+2 Bluff/+2 Diplomacy/+2 Intimidate"',
  'Intuitive':'Section=skill Note="+2 Sense Motive"',
  'Light Fortification':
    'Section=combat Note="25% change of negating critical hits and sneak attacks"',
  'Longstride':'Section=ability Note="+2 Dex, +10 Speed while shifting"',
  'Longtooth':
    'Section=ability,combat Note="+2 Str while shifting","d6+%V bite while shiting"',
  'Mindlink':'Section=magic Note="<i>Mindlink</i> 1/dy"',
  'Minor Shape Change':'Section=magic Note="<i>Shape Change</i> body at will"',
  'Natural Psionic':'Section=magic Note="+1 PP/level"',
  'Natural Linguist':'Section=skill Note="Speak Language is a class skill"',
  'Razorclaw':
    'Section=ability,combat Note="+2 Str while shifting","d4+%V claw attack while shifting"',
  'Resist Charm':'Section=save Note="+2 vs. charm effects"',
  'Resist Mental':'Section=save Note="+2 vs. mind-altering effects"',
  'Resist Sleep':'Section=save Note="+2 vs. <i>Sleep</i>"',
  'Shifter Ability Adjustment':
    'Section=ability Note="+2 dexterity/-2 intelligence/-2 charisma"',
  'Shifting':'Section=feature Note="Use Shifter trait for %V rd %1/day"',
  'Slam Weapon':'Section=combat Note="d4 slam attack"',
  'Stable':
    'Section=combat Note="May perform strenuous activity at 0 HP, no additional loss at negative HP"',
  'Unhealing':
    'Section=combat Note="Does not heal damage naturally, half effect from healing spells"',
  'Warforged Ability Adjustment':
    'Section=ability Note="+2 constitution/-2 wisdom/-2 charisma"',
  'Wildhunt':
    'Section=ability,feature,skill Note="+2 Con while shifting","R30\' Detect creature presence, track by smell","+2 Survival"'
};
Eberron.FEATURES = Object.assign({}, SRD35.FEATURES, Eberron.FEATURES_ADDED);
Eberron.GENDERS = Object.assign({}, SRD35.GENDERS);
Eberron.HOUSES = {
  'None':
    '',
  'Cannith':
    'Dragonmark=Making ' +
    'Features=Maker ' +
    'Spells=' +
      '"1:Make Whole",1:Mending:2,"1:Repair Light Damage","2:Minor Creation",' +
      '"2:Repair Serious Damage",3:Fabricate,"3:Major Creation",' +
      '"4:True Creation"',
  'Deneith':
    'Dragonmark=Sentinel ' +
    'Features=Sentinel ' +
    'Spells=' +
      '"1:Mage Armor","1:Protection From Arrows","1:Shield Of Faith",' +
      '"1:Shield Other","2:Lesser Globe Of Invulnerability",' +
      '"2:Protection From Energy","3:Globe Of Invulnerability","4:Mind Blank"',
  'Ghallanda':
    'Dragonmark=Hospitality ' +
    'Features=Hospitaler ' +
    'Spells=' +
      '1:Prestidigitation:2,"1:Purify Food And Drink:2",' +
      '"1:Unseen Servant","2:Create Food And Water",' +
      '"2:Secure Shelter","3:Heroes\' Feast","3:Mage\'s Magnificent Mansion",' +
      '4:Refuge',
  'Jorasco':
    'Dragonmark=Healing ' +
    'Features=Healer ' +
    'Spells=' +
      '"1:Cure Light Wounds","1:Lesser Restoration","2:Cure Serious Wounds",' +
      '"2:Neutralize Poison","2:Remove Disease",2:Restoration,3:Heal,' +
      '"4:Mass Heal"',
  'Kundarak':
    'Dragonmark=Warding ' +
    'Features=Warder ' +
    'Spells=' +
      '1:Alarm,"1:Arcane Lock","1:Fire Trap",1:Misdirection,' +
      '"2:Explosive Runes","2:Glyph Of Warding",2:Nondetection,' +
      '"3:Greater Glyph Of Warding","3:Guards And Wards",' +
      '"3:Mage\'s Faithful Hound","4:Prismatic Wall"',
  'Lyrandar':
    'Dragonmark=Storm ' +
    'Features="Storm Walker" ' +
    'Spells=' +
      '"1:Endure Elements","1:Fog Cloud","1:Gust Of Wind","2:Sleet Storm",' +
      '"2:Wind Wall","2:Wind\'s Favor","3:Control Weather","3:Control Winds",' +
      '"4:Storm Of Vengeance"',
  'Medani':
    'Dragonmark=Detection ' +
    'Features=Detective ' +
    'Spells=' +
      '"1:Detect Magic:2","1:Detect Poison:2","2:Detect Scrying",' +
      '"2:See Invisibility","3:True Seeing","4:Moment Of Prescience"',
  'Orien':
    'Dragonmark=Passage ' +
    'Features=Traveler ' +
    'Spells=' +
      '"1:Dimension Leap","1:Expeditious Retreat",1:Mount,"2:Dimension Door",' +
      '"2:Phantom Steed","3:Overland Flight",3:Teleport,"4:Greater Teleport"',
  'Phiarlan':
    'Dragonmark=Shadow ' +
    'Features=Shadower ' +
    'Spells=' +
      '1:Darkness,"1:Disguise Self","1:Minor Image",' +
      '2:Clairaudience/Clairvoyance,2:Scrying,"2:Shadow Conjuration",' +
      '3:Mislead,"3:Prying Eyes","3:Shadow Walk","4:Greater Prying Eyes"',
  'Sivis':
    'Dragonmark=Scribing ' +
    'Features=Scribe ' +
    'Spells=' +
      '"1:Arcane Mark:2","1:Comprehend Languages","1:Whispering Wind",' +
      '"2:Illusory Script","2:Secret Page",2:Tongues,3:Sending,' +
      '"4:Symbol Of Death"',
  'Tharashk':
    'Dragonmark=Finding ' +
    'Features=Finder ' +
    'Spells=' +
      '1:Identify,"1:Know Direction:2","1:Locate Object","2:Helping Hand",' +
      '"2:Locate Creature","3:Find The Path","4:Discern Location"',
  'Thuranni':
    'Dragonmark=Shadow ' +
    'Features=Shadower ' +
    'Spells=' +
      '1:Darkness,"1:Disguise Self","1:Minor Image",' +
      '2:Clairaudience/Clairvoyance,2:Scrying,"2:Shadow Conjuration",' +
      '3:Mislead,"3:Prying Eyes","3:Shadow Walk","4:Greater Prying Eyes"',
  'Vadalis':
    'Dragonmark=Handling ' +
    'Features=Handler ' +
    'Spells=' +
      '"1:Calm Animals","1:Charm Animal","1:Speak With Animals",' +
      '"2:Dominate Animal","2:Greater Magic Fang","3:Animal Growth",' +
      '"3:Summon Nature\'s Ally V",4:Awaken,"4:Summon Nature\'s Ally VI"'
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
Eberron.RACES_ADDED = {
  'Changeling':
    'Features=' +
      '1:Deceptive,1:Intuitive,"1:Minor Shape Change","1:Natural Linguist",' +
      '"1:Resist Charm","1:Resist Sleep"',
  'Kalashtar':
    'Features=' +
      '1:Dreamless,1:Humanlike,1:Influential,1:Mindlink,"1:Natural Psionic",' +
      '"1:Resist Mental","1:Resist Possession"',
  'Shifter':
    'Features=' +
      '"1:Shifter Ability Adjustment",1:Shifting ' +
    'Selectables=' +
      '1:Beasthide,1:Longtooth,1:Cliffwalk,1:Razorclaw,1:Longstride,1:Wildhunt',
  'Warforged':
    'Features=' +
      '"1:Composite Plating","1:Construct Immunity",' +
      '"1:Construct Vulnerability","1:Light Fortification","1:Slam Weapon",' +
      '1:Stable,1:Unhealing,"1:Warforged Ability Adjustment"'
};
Eberron.RACES = Object.assign({}, SRD35.RACES, Eberron.RACES_ADDED);
Eberron.SCHOOLS = Object.assign({}, SRD35.SCHOOLS);
Eberron.SHIELDS = Object.assign({}, SRD35.SHIELDS);
Eberron.SKILLS = Object.assign({}, SRD35.SKILLS);
Eberron.SPELLS_ADDED = {
  'Armor Enhancement':
    'School=Transmutation ' +
    'Description="Touched armor or shield +3, 35K GP enhancement for $L10 min"',
  'Bolts Of Bedevilment':
    'School=Enchantment ' +
    'Description="R$RM\' 3 targets (1/rd) stunned for $L2 rd (Will neg)"',
  'Construct Energy Ward':
    'School=Abjuration ' +
    'Description="Touched construct DR ${lvl>10?30:lvl>6?20:10} from chosen energy for $L10 min"',
  'Control Deathless':
    'School=Necromancy ' +
    'Description="R$RS\' Command $L2 HD deathless in 30\' area for $L min"',
  'Create Deathless':
    'School=Necromancy ' +
    'Description="R$RS\' Create deathless soldier"',
  'Create Greater Deathless':
    'School=Necromancy ' +
    'Description="R$RS\' Create undying councilor"',
  'Detect Aberration':
    'School=Divination ' +
    'Description="R60\' cone info on aberrations for conc/$L min"',
  'Detoxify':
    'School=Conjuration ' +
    'Description="R30\' Neutralize venom for $L10 min"',
  'Dimension Leap':
    'School=Conjuration ' +
    'Description="Teleport self up to $L10\'"',
  'Disable Construct':
    'School=Transmutation ' +
    'Description="Touched construct $L10 HP (Will half)"',
  'Energy Alteration':
    'School=Transmutation ' +
    'Description="Touched affects different energy type for $L10 min"',
  'Enhancement Alteration':
    'School=Transmutation ' +
    'Description="Touched shield or weapon enhancement applies to bash and defense for $L10 min"',
  'Feast Of Champions':
    'School=Conjuration ' +
    'Description="Hour-long feast cures conditions, 2d8+$L HP"',
  'Greater Armor Enhancement':
    'School=Transmutation ' +
    'Description="Touched armor or shield +5, 100K GP enhancement for $L10 min"',
  'Greater Construct Energy Ward':
    'School=Abjuration ' +
     'Description="Touched construct ignores up to $L12min120 HP from specified energy for $L10 min"',
  'Greater Status':
    'School=Divination ' +
    'Description="Monitor condition and position of, cast L0-2 touch spell on $Ldiv3 touched allies for $L hr"',
  'Greater Weapon Augmentation':
    'School=Transmutation ' +
    'Description="Touched weapon +5 and 200K GP enhancement for $L10 min"',
  'Halt Deathless':
    'School=Necromancy ' +
    'Description="R$RM\' 3 deathless in 30\' area immobilized for $L rd (Will neg)"',
  'Hardening':
    'School=Transmutation ' +
    'Description="Touched $L10\' cu item resists damage"',
  "Hero's Blade":
    'School=Necromancy ' +
    'Description="Touched blade good-aligned, dbl crit threat, +2d6 HP to evil (+2d8 outsider or undead), blind and deafen evil 1d4 rd on crit (Will neg) for $L min"',
  'Inflict Critical Damage':
    'School=Transmutation ' +
    'Description="Touched construct 4d8+$Lmin20 HP"',
  'Inflict Light Damage':
    'School=Transmutation ' +
    'Description="Touched construct 1d8+$Lmin5 HP"',
  'Inflict Moderate Damage':
    'School=Transmutation ' +
    'Description="Touched construct 2d8+$Lmin10 HP"',
  'Inflict Serious Damage':
    'School=Transmutation ' +
    'Description="Touched construct 3d8+$Lmin15 HP"',
  'Iron Construct':
    'School=Transmutation ' +
    'Description="Touched construct DR 15/adamantine, half acid and fire damage, +4 Str, -4 Dex, x5 weigh for $L min"',
  'Item Alteration':
    'School=Transmutation ' +
    'Description="Touched item grants bonus differently for $L10 min"',
  "Legion's Shield Of Faith":
    'School=Abjuration ' +
    'Description="R$RM\' Allies in 20\' area +$Ldiv6plus2min5 AC for $L min"',
  'Lesser Armor Enhancement':
    'School=Transmutation ' +
    'Description="Touched armor or shield +1 and 5K GP enhancement for $L10 min"',
  'Lesser Weapon Augmentation':
    'School=Transmutation ' +
    'Description="Touched weapon +1 and 10K GP enhancement for $L10 min"',
  'Maddening Scream':
    'School=Enchantment ' +
    'Description="Touched acts madly for 1d4+1 rd"',
  'Magecraft':
    'School=Divination ' +
    'Description="Self +5 same day Craft check"',
  'Metamagic Item':
    'School=Transmutation ' +
    'Description="Imbue touched magic item w/metamagic property for $L rd"',
  "Nature's Wrath":
    'School=Evocation ' +
    'Description="R$RM\' 20\' radius aberrations ${Lmin10}d6 HP and dazed 1 rd, other unnatural ${Ldiv2min5}d8 HP (Will half)"',
  'Personal Weapon Augmentation':
    'School=Transmutation ' +
    'Description="Touched self weapon +1 and 10K GP enhancement for $L10 min"',
  'Power Surge':
    'School=Transmutation ' +
    'Description="Touched gains $Ldiv5 charges for $L min"',
  'Repair Critical Damage':
    'School=Transmutation ' +
     'Description="Touched construct repair 4d8+$Lmin20"',
  'Repair Light Damage':
    'School=Transmutation ' +
    'Description="Touched construct repair 1d8+$Lmin5"',
  'Repair Moderate Damage':
    'School=Transmutation ' +
    'Description="Touched construct repair 2d8+$Lmin10"',
  'Repair Serious Damage':
    'School=Transmutation ' +
    'Description="Touched construct repair 3d8+$Lmin15"',
  'Resistance Item':
    'School=Abjuration ' +
    'Description="Touched grants +$Ldiv4plus1 saves for $L10 min"',
  'Return To Nature':
    'School=Transmutation ' +
    'Description="R$RS\' Target reduce Int, magic"',
  'Skill Enhancement':
    'School=Transmutation ' +
    'Description="Touched grants +$Ldiv2plus2 specified skill checks for $L10 min"',
  'Spell Storing Item':
    'School=Transmutation ' +
    'Description="Imbue touched item with spell up to $Ldiv2min4 level"',
  'Spirit Steed':
    'School=Necromancy ' +
    'Description="Touched animal speed +30/x6, no hustle damage for L$ hr"',
  'Stone Construct':
    'School=Transmutation ' +
    'Description="Touched construct DR 10/adamantine for $L10min150 HP"',
  'Suppress Requirement':
    'School=Transmutation ' +
    'Description="Remove usage requirement from touched magic item for $L10 min"',
  'Total Repair':
    'School=Transmutation ' +
    'Description="Touched construct conditions removed, $L10min150 HP repaired"',
  'Touch Of Madness':
    'School=Enchantment ' +
    'Description="Touched dazed for $L2 rd"',
  'Toughen Construct':
    'School=Transmutation ' +
    'Description="Touched construct +$Ldiv3plus1max2min5 AC"',
  'True Creation':
    'School=Conjuration ' +
    'Description="Create permanent $L\' cu plant or mineral object"',
  'Weapon Augmentation':
    'School=Transmutation ' +
    'Description="Touched weapon +3 and 70K GP enhancement for $L10 min"',
  "Wind's Favor":
    'School=Transmutation ' +
    'Description="R$RM\' 10\'x10\'x$L20plus100\' 30 MPH wind for $L hr',
  'Withering Palm':
    'School=Necromancy ' +
    'Description="Touched loses $Ldiv2 Str and Con (Fort neg)"',
  'Zone Of Natural Purity':
    'School=Evocation ' +
    'Description="R$RS\' fey and plants in 20\' radius +1 attack, damage, save, abberations -1, for $L2 hr"'
};
Eberron.SPELLS = Object.assign({}, SRD35.SPELLS, Eberron.SPELLS_ADDED);
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
      '"1:Armor Proficiency (Light)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Artificer Knowledge","1:Artisan Bonus","1:Craft Reserve",' +
      '"1:Disable Trap","1:Item Creation","1:Scribe Scroll","2:Brew Potion",' +
      '"3:Craft Wondrous Item","4:Craft Homunculus",' +
      '"5:Craft Magic Arms And Armor","5:Retain Essence",' +
      '"6:Metamagic Spell Trigger","7:Craft Wand","9:Craft Rod",' +
      '"11:Metamagic Spell Completion","12:Craft Staff",' +
      '"13:Artificer Skill Mastery","14:Forge Ring" ' +
    'Skills=' +
      'Appraise,Concentration,Craft,"Disable Device","Knowledge (Arcana)",' +
      '"Knowledge (Architecture)","Knowledge (Planes)","Open Lock",' +
      'Profession,Search,Spellcraft,"Use Magic Device" ' +
    // TODO Artificer infusions are neither arcane nor divine, but they are casters
    'CasterLevelArcane=levels.Artificer ' +
    'SpellAbility=intelligence ' +
    'SpellsPerDay=' +
      'A1:1=2;2=3;14=4,' +
      'A2:3=1;4=2;5=3;15=4,' +
      'A3:5=1;6=2;8=3;16=4,' +
      'A4:8=1;9=2;13=3;17=4,' +
      'A5:11=1;12=2;14=3;18=4,' +
      'A6:14=1;15=2;17=3;19=4 ' +
    'Spells=' +
      '"A1:Energy Alteration;Enhancement Alteration;Identify;' +
      'Inflict Light Damage;Lesser Armor Enhancement;Light;Magic Stone;' +
      'Magic Vestment;Magic Weapon;Repair Light Damage;' +
      'Personal Weapon Augmentation;Resistance Item;Shield Of Faith;' +
      'Skill Enhancement;Spell Storing Item",' +
      '"A2:Align Weapon;Armor Enhancement;Bear\'s Endurance;Bull\'s Strength;' +
      'Cat\'s Grace;Chill Metal;Eagle\'s Splendor;Fox\'s Cunning;Heat Metal;' +
      'Inflict Moderate Damage;Lesser Weapon Augmentation;Owl\'s Wisdom;' +
      'Repair Moderate Damage;Toughen Construct",' +
      '"A3:Construct Energy Ward;Greater Armor Enhancement;' +
      'Greater Magic Weapon;Inflict Serious Damage;Metamagic Item;' +
      'Power Surge;Repair Serious Damage;Stone Construct;' +
      'Suppress Requirement",' +
      '"A4:Greater Construct Energy Ward;Inflict Critical Damage;' +
      'Item Alteration;Iron Construct;Legion\'s Shield Of Faith;' +
      'Lesser Globe Of Invulnerability;Minor Creation;Repair Critical Damage;' +
      'Rusting Grasp;Weapon Augmentation",' +
      '"A5:Disrupting Weapon;Fabricate;Major Creation;Wall Of Force;' +
      'Wall Of Stone",' +
      '"A6:Blade Barrier;Disable Construct;Globe Of Invulnerability;' +
      'Hardening;Move Earth;Total Repair;Wall Of Iron;Weapon Augmentation"'
};
Eberron.CLASS_SPELLS_ADDED = {
  'Cleric':
    '"C9:Feast Of Champions"',
  'Druid':
    '"D1:Detect Aberration","D2:Zone Of Natural Purity","D4:Nature\'s Wrath",' +
    '"D7:Return To Nature"',
  'Wizard':
    '"W1:Magecraft;Repair Light Damage","W2:Repair Moderate Damage",' +
    '"W3:Repair Serious Damage","W4:Repair Critical Damage",W6:Hardening,' +
    '"W8:Maddening Scream"'
};
Eberron.CLASSES = Object.assign({}, SRD35.CLASSES, Eberron.CLASSES_ADDED);
for(var clas in Eberron.CLASS_SPELLS_ADDED) {
  Eberron.CLASSES[clas] = Eberron.CLASSES[clas].replace('Spells=', 'Spells=' + Eberron.CLASS_SPELLS_ADDED[clas] + ',');
}

Eberron.artificerCraftReserves = [
  0, 20, 40, 60, 80, 100, 150, 200, 250, 300, 400, 500, 700, 900, 1200, 1500,
  2000, 2500, 3000, 4000, 5000
];

/* Defines the rules related to character abilities. */
Eberron.abilityRules = function(rules) {
  Eberron.baseRules.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
Eberron.aideRules = function(rules, companions, familiars) {
  Eberron.baseRules.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to combat. */
Eberron.combatRules = function(rules, armors, shields, weapons) {
  Eberron.baseRules.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to goodies included in character notes. */
Eberron.goodiesRules = function(rules) {
  Eberron.baseRules.goodiesRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
Eberron.identityRules = function(
  rules, alignments, classes, deities, domains, genders, houses, races
) {
  if(Eberron.baseRules == Pathfinder)
    Pathfinder.identityRules
      (rules, alignments, Pathfinder.BLOODLINES, classes, deities, domains,
       [], genders, races, Pathfinder.TRAITS);
  else
    SRD35.identityRules
      (rules, alignments, classes, deities, domains, genders, races)
  for(var house in houses) {
    rules.choiceRules(rules, 'House', house, houses[house]);
  }
  // No changes needed to the rules defined by base method
  rules.defineRule('actionPoints', 'level', '=', '5 + Math.floor(source / 2)');
  rules.defineRule('actionDice', 'level', '=', '1 + Math.floor(source / 7)');
  rules.defineRule('casterLevels.Dragonmark',
    'features.Least Dragonmark', '=', '1',
    'features.Lesser Dragonmark', '^=', '6',
    'features.Greater Dragonmark', '^=', '10',
    'levels.Heir Of Siberys', '^=', 'source >= 2 ? 15 : null' // TODO move to EberronPrestige
  );
  rules.defineRule('spellDifficultyClass.Dragonmark',
    'casterLevels.Dragonmark', '?', null,
    'charismaModifier', '=', '10 + source'
  );
  rules.defineRule
    ('spellsPerDay.Dragonmark1', 'features.Least Dragonmark', '=', '1');
  rules.defineRule
    ('spellsPerDay.Dragonmark2', 'features.Lesser Dragonmark', '=', '1');
  rules.defineRule
    ('spellsPerDay.Dragonmark3', 'features.Greater Dragonmark', '=', '1');
  rules.defineRule
    ('spellsPerDay.Dragonmark4', 'levels.Heir Of Siberys', '=', 'source >= 2 ? 1 : null'); // TODO move
  rules.defineSheetElement('Heroics', 'Description');
  rules.defineSheetElement('House', 'Heroics/');
  rules.defineSheetElement('Dragonmark', 'Heroics/');
  rules.defineSheetElement('Action Points', 'Heroics/');
  rules.defineSheetElement('Action Dice', 'Heroics/');
  rules.defineEditorElement
    ('house', 'House', 'select-one', 'houses', 'experience');
};

/* Defines rules related to magic use. */
Eberron.magicRules = function(rules, schools, spells) {
  Eberron.baseRules.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character feats, languages, and skills. */
Eberron.talentRules = function(rules, feats, features, languages, skills) {
  Eberron.baseRules.talentRules(rules, feats, features, languages, skills);
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
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'Armor')
    Eberron.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Bloodline') {
    Pathfinder.bloodlineRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Feats'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder.SPELLS
    );
    Pathfinder.bloodlineRulesExtra(rules, name);
  } else if(type == 'Class') {
    Eberron.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsPerDay'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Eberron.SPELLS
    );
    Eberron.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Eberron.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'Domain') {
    Eberron.domainRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Eberron.SPELLS
    );
    Eberron.domainRulesExtra(rules, name);
  } else if(type == 'Familiar')
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
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'Feat') {
    Eberron.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    Eberron.featRulesExtra(rules, name, Eberron.SPELLS);
  } else if(type == 'Feature')
     Eberron.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Gender')
    Eberron.genderRules(rules, name);
  else if(type == 'House')
    Eberron.houseRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Dragonmark'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Eberron.SPELLS
    );
  else if(type == 'Language')
    Eberron.languageRules(rules, name);
  else if(type == 'Race') {
    Eberron.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Eberron.SPELLS
    );
    Eberron.raceRulesExtra(rules, name);
  } else if(type == 'School')
    Eberron.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Shield')
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
      QuilvynUtils.getAttrValueArray(attrs, 'Synergies')
    );
  } else if(type == 'Spell')
    Eberron.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Trait')
    Pathfinder.traitRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'Subtype')
    );
  else if(type == 'Weapon')
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
  if(type != 'Feature') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replace(/ /g, '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
Eberron.alignmentRules = function(rules, name) {
  Eberron.baseRules.alignmentRules(rules, name);
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
  Eberron.baseRules.armorRules
    (rules, name, ac, weight, maxDex, skillPenalty, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires# and soft prerequisites #implies#. The class
 * grants #hitDie# (format [n]'d'n) additional hit points and #skillPoints#
 * additional skill points with each level advance. #attack# is one of '1',
 * '1/2', or '3/4', indicating the base attack progression for the class;
 * similarly, #saveFort#, #saveRef#, and #saveWill# are each one of '1/2' or
 * '1/3', indicating the saving throw progressions. #skills# indicate class
 * skills for the class; see skillRules for an alternate way these can be
 * defined. #features# and #selectables# list the fixed and selectable features
 * acquired as the character advances in class level, and #languages# list any
 * automatic languages for the class. #casterLevelArcane# and
 * #casterLevelDivine#, if specified, give the Javascript expression for
 * determining the caster level for the class; these can incorporate a class
 * level attribute (e.g., 'levels.Fighter') or the character level attribute
 * 'level'. #spellAbility#, if specified, contains the ability for computing
 * spell difficulty class for cast spells. #spellsPerDay# lists the number of
 * spells per level per day that the class can cast, and #spells# lists spells
 * defined by the class.
 */
Eberron.classRules = function(
  rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
  saveRef, saveWill, skills, features, selectables, languages,
  casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay, spells,
  spellDict
) {
  if(Eberron.baseRules == Pathfinder) {
    for(var i = 0; i < requires.length; i++) {
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        requires[i] =
          requires[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
      }
    }
    for(var i = 0; i < implies.length; i++) {
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        implies[i] =
          implies[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
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
  Eberron.baseRules.classRules(
    rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
    saveRef, saveWill, skills, features, selectables, languages,
    casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay, spells,
    spellDict
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name# that are not
 * directly derived from the parmeters passed to classRules.
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
      'levels.Artificer', '=', 'Eberron.artificerCraftReserves[source]'
    );
    rules.defineRule('skillNotes.artificerKnowledge',
       'levels.Artificer', '=', null,
       'intelligenceModifier', '+', null
    );
  } else if(Eberron.baseRules.classRulesExtra) {
    Eberron.baseRules.classRulesExtra(rules, name);
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
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, level, size
) {
  Eberron.baseRules.companionRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, and #domains# and #weapons# list the associated
 * domains and favored weapons.
 */
Eberron.deityRules = function(rules, name, alignment, domains, weapons) {
  Eberron.baseRules.deityRules(rules, name, alignment, domains, weapons);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with domain #name#. #features# and
 * #spells# list the associated features and domain spells.
 */
Eberron.domainRules = function(rules, name, features, spells, spellDict) {
  Eberron.baseRules.domainRules(rules, name, features, spells, spellDict);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with domain #name# that are not
 * directly derived from the parmeters passed to domainRules.
 */
Eberron.domainRulesExtra = function(rules, name) {
  if(name == 'Decay') {
    rules.defineRule('magicNotes.touchOfDecay', 'levels.Cleric', '=', null);
  } else if(name == 'Life') {
    rules.defineRule('magicNotes.addLife', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.addLife.1', 'levels.Cleric', '=', null);
  } else if(name == 'Madness') {
    rules.defineRule
      ('featureNotes.flashOfUnderstanding', 'levels.Cleric', '=', null);
  } else if(name == 'Passion') {
    rules.defineRule('combatNotes.fitOfPassion', 'levels.Cleric', '=', null);
  } else if(Eberron.baseRules.domainRulesExtra) {
    Eberron.baseRules.domainRulesExtra(rules, name);
  }
};

/*
 * Defines in #rules# the rules associated with familiar #name#, which has
 * abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The familiar has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a familiar.
 */
Eberron.familiarRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, level, size
) {
  Eberron.baseRules.familiarRules
    (rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
Eberron.featRules = function(rules, name, requires, implies, types) {
  Eberron.baseRules.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with feat #name# that are not
 * directly derived from the parmeters passed to featRules.
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
  } else if(name == 'Cliffwalk Elite') {
    rules.defineRule
      ('abilityNotes.cliffwalk', 'abilityNotes.cliffwalkElite', '+', '10');
  } else if(name == 'Extend Rage') {
    rules.defineRule('combatNotes.rage', 'combatNotes.extendRage', '+', '5');
  } else if(name == 'Extra Music') {
    rules.defineRule
      ('featureNotes.bardicMusic', 'featureNotes.extraMusic', '+', '4');
  } else if(name == 'Extra Shifter Trait') {
    rules.defineRule('selectableFeatureCount.Shifter',
      'featureNotes.extraShifterTrait', '+', '1'
    );
  } else if(name == 'Flensing Strike') {
    rules.defineRule('combatNotes.flensingStrike',
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
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
  } else if(name == 'Shifter Defense') {
    rules.defineRule('combatNotes.shifterDefense', '', '=', '2');
  } else if (Eberron.baseRules.featRulesExtra) {
    Eberron.baseRules.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Eberron.featureRules = function(rules, name, sections, notes) {
  if(typeof sections == 'string')
    sections = [sections];
  if(typeof notes == 'string')
    notes = [notes];
  if(Eberron.baseRules == Pathfinder) {
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
  Eberron.baseRules.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with gender #name#. */
Eberron.genderRules = function(rules, name) {
  Eberron.baseRules.genderRules(rules, name);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to Eberron house characteristics. */
Eberron.houseRules = function(
  rules, name, dragonmark, features, spells, spellDict
) {

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

  if(rules.houseStats == null) {
    rules.houseStats = {
      dragonmark:{},
      spells1:{},
      spells2:{},
      spells3:{},
      spells4:{}
    };
  }
  rules.houseStats.dragonmark[name] = dragonmark;
  rules.houseStats.spells1[name] = '';
  rules.houseStats.spells2[name] = '';
  rules.houseStats.spells3[name] = '';
  rules.houseStats.spells4[name] = '';

  var houseLevel = name + 'Level';

  rules.defineRule(houseLevel,
    'house', '?', 'source == "' + name + '"',
    'level', '=', null
  );
  rules.defineRule('dragonmark',
    'house', '=', QuilvynUtils.dictLit(rules.houseStats.dragonmark) + '[source]'
  );
  SRD35.featureListRules(rules, features, name, houseLevel, false);

  for(var i = 0; i < spells.length; i++) {
    var pieces = spells[i].split(':');
    if(pieces.length < 2) {
      console.log('Bad format for spell list "' + spells[i] + '"');
      break;
    }
    var level = pieces[0];
    var spellName = pieces[1];
    if(spellDict[spellName] == null) {
      console.log('Unknown spell "' + spellName + '"');
      continue;
    }
    if(!level.match(/^[1234]$/)) {
      console.log('Bad level "' + level + '" for spell ' + spellName);
      continue;
    }
    var school = QuilvynUtils.getAttrValue(spellDict[spellName], 'School');
    if(school == null) {
      console.log('No school given for spell ' + spellName);
      continue;
    }
    var fullSpell =
      spellName + '(Dragonmark' + level + ' ' + school.substring(0, 4) + ')';
    var spellChoice =
      '<i>' + spellName + '</i> ' + (pieces.length < 3 ? '1' : pieces[2]) + '/dy';
    rules.choiceRules
      (rules, 'Spell', fullSpell,
       spellDict[spellName] + ' Group=Dragonmark Level=' + level);
    if(rules.houseStats['spells' + level][name] != '')
      rules.houseStats['spells' + level][name] += ', ';
    rules.houseStats['spells' + level][name] += spellChoice;
  }

  rules.defineRule('magicNotes.leastDragonmark',
    'house', '=', QuilvynUtils.dictLit(rules.houseStats.spells1) + '[source]'
  );
  rules.defineRule('magicNotes.lesserDragonmark',
    'house', '=', QuilvynUtils.dictLit(rules.houseStats.spells2) + '[source]'
  );
  rules.defineRule('magicNotes.greaterDragonmark',
    'house', '=', QuilvynUtils.dictLit(rules.houseStats.spells3) + '[source]'
  );
  rules.defineRule('magicNotes.heirOfSiberys',
    'levels.Heir Of Siberys', '?', null,
    'house', '=', QuilvynUtils.dictLit(rules.houseStats.spells4) + '[source]'
  );

};

/* Defines in #rules# the rules associated with language #name#. */
Eberron.languageRules = function(rules, name) {
  Eberron.baseRules.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name#. #features# and
 * #selectables# list associated features and #languages# the automatic
 * languages. #spells# lists any natural spells, for which #spellAbility# is
 * used to compute the save DC.
 */
Eberron.raceRules = function(
  rules, name, features, selectables, languages, spellAbility, spells, spellDict
) {
  Eberron.baseRules.raceRules
    (rules, name, features, selectables, languages, spellAbility, spells,
     spellDict);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to Eberron character races. */
Eberron.raceRulesExtra = function(rules, name) {

  if(name == 'Shifter') {
    rules.defineRule('abilityNotes.cliffwalk', '', '=', '20');
    rules.defineRule('combatNotes.longtooth',
      'level', '=', 'Math.floor(source / 4)',
      'strengthModifier', '+', null
    );
    rules.defineRule('combatNotes.razorclaw',
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
  } else if(Eberron.baseRules.raceRulesExtra) {
    Eberron.baseRules.raceRulesExtra(rules, name);
  }

};

/* Defines in #rules# the rules associated with magic school #name#. */
Eberron.schoolRules = function(rules, name, features) {
  Eberron.baseRules.schoolRules(rules, name, features);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, imposes #skillPenalty# on specific skills
 * and yields a #spellFail# percent chance of arcane spell failure.
 */
Eberron.shieldRules = function(
  rules, name, ac, profLevel, skillFail, spellFail
) {
  Eberron.baseRules.shieldRules
    (rules, name, ac, profLevel, skillFail, spellFail);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.). #untrained#, if
 * specified is a boolean indicating whether or not the skill can be used
 * untrained; the default is true. #classes# lists the classes for which this
 * is a class skill; a value of "all" indicates that this is a class skill for
 * all classes. #synergies#, if specified, lists synergies to other skills and
 * abilities granted by high ranks in this skill.
 */
Eberron.skillRules = function(
  rules, name, ability, untrained, classes, synergies
) {
  Eberron.baseRules.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
Eberron.spellRules = function(
  rules, name, school, casterGroup, level, description
) {
  Eberron.baseRules.spellRules
    (rules, name, school, casterGroup, level, description);
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
  Eberron.baseRules.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by base method
};

Eberron.ruleNotes = function() {
  return '' +
    '<h2>Eberron Quilvyn Module Notes</h2>\n' +
    'Eberron Quilvyn Module Version ' + EBERRON_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn uses wisdom, rather than charisma, when calculating the\n' +
    '    spell difficulty class of Dragonmark spells drawn from the Cleric\n' +
    '    spell list.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    'None, currently\n' +
    '</p>\n';
}

/* Returns an ObjectViewer loaded with the default character sheet format. */
Eberron.createViewers = function(rules, viewers) {
  Eberron.baseRules.createViewers(rules, viewers);
  // No changes needed to the return value of the base method
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
    return Eberron.baseRules.choiceEditorElements(rules, type);
  return result
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Eberron.randomizeOneAttribute = function(attributes, attribute) {
  Eberron.baseRules.randomizeOneAttribute.apply(this, [attributes, attribute]);
  // No changes needed to the return value of the base method
};
