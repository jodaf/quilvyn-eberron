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
  Eberron.ARMORS = Object.assign({}, Eberron.baseRules.ARMORS);
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

Eberron.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
Eberron.ANIMAL_COMPANIONS = Object.assign({}, SRD35.ANIMAL_COMPANIONS);
Eberron.ARMORS = Object.assign({}, SRD35.ARMORS);
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
  'Artifice':'',
  'Charm':'',
  'Commerce':'',
  'Community':'',
  'Deathless':'',
  'Decay':'',
  'Dragon Below':'',
  'Exorcism':'',
  'Feast':'',
  'Life':'',
  'Madness':'',
  'Meditation':'',
  'Necromancer':'',
  'Passion':'',
  'Shadow':'',
  'Weather':''
};
Eberron.DOMAINS = Object.assign({}, SRD35.DOMAINS, Eberron.DOMAINS_ADDED);
Eberron.FAMILIARS = Object.assign({}, SRD35.FAMILIARS);
Eberron.FEATS_ADDED = {
  'Aberrant Dragonmark (Burning Hands)':'Type=General',
  'Aberrant Dragonmark (Cause Fear)':'Type=General',
  'Aberrant Dragonmark (Charm Person)':'Type=General',
  'Aberrant Dragonmark (Chill Touch)':'Type=General',
  'Aberrant Dragonmark (Detect Secret Doors)':'Type=General',
  'Aberrant Dragonmark (Feather Fall)':'Type=General',
  'Aberrant Dragonmark (Floating Disk)':'Type=General',
  'Aberrant Dragonmark (Inflict Light Wounds)':'Type=General',
  'Aberrant Dragonmark (Jump)':'Type=General',
  'Aberrant Dragonmark (Light)':'Type=General',
  'Aberrant Dragonmark (Pass Without Trace)':'Type=General',
  'Aberrant Dragonmark (produce Flame)':'Type=General',
  'Aberrant Dragonmark (Shield)':'Type=General',
  'Action Boost':'Type=General',
  'Action Surge':'Type=General',
  'Adamantine Body':'Type=Warforged',
  'Ashbound':'Type=General',
  'Attune Magic Weapon':'Type=Item Creation',
  'Beast Shape':'Type=General',
  'Beast Totem (Chimera)':'Type=General',
  'Beast Totem (Digester)':'Type=General',
  'Beast Totem (Displacer Beast)':'Type=General',
  'Beast Totem (Gorgon)':'Type=General',
  'Beast Totem (krenshar)':'Type=General',
  'Beast Totem (Unicorn)':'Type=General',
  'Beast Totem (Winter Wolf)':'Type=General',
  'Beast Totem (Yrthak)':'Type=General',
  'Beasthide Elite':'Type=Shifter',
  'Bind Elemental':'Type=Item Creation',
  'Child Of Winter':'Type=General',
  'Cliffwalk Elite':'Type=Shifter',
// Craft Construct from MM needed for Artificer class
  'Craft Construct':'Type=Item Creation',
  'Double Steel Strike':'Type=General',
  'Dragon Rage':'Type=General',
  'Dragon Totem (Black)':'Type=General',
  'Dragon Totem (Blue)':'Type=General',
  'Dragon Totem (Brass)':'Type=General',
  'Dragon Totem (Bronze)':'Type=General',
  'Dragon Totem (Copper)':'Type=General',
  'Dragon Totem (Gold)':'Type=General',
  'Dragon Totem (Green)':'Type=General',
  'Dragon Totem (Red)':'Type=General',
  'Dragon Totem (Silver)':'Type=General',
  'Dragon Totem (White)':'Type=General',
  'Ecclesiarch':'Type=General',
  'Education':'Type=General',
  'Exceptional Artisan':'Type=Item Creation',
  'Extend Rage':'Type=General',
  'Extra Music':'Type=General',
  'Extra Rings':'Type=Item Creation',
  'Extra Shifter Trait':'Type=Shifter',
  'Extraordinary Artisan':'Type=Item Creation',
  'Favored In House':'Type=General',
  'Flensing Strike':'Type=General',
  'Gatekeeper Initiate':'Type=General',
  'Great Bite':'Type=Shifter',
  'Great Rend':'Type=Shifter',
  'Greater Dragonmark':'Type=General',
  'Greater Powerful Charge':'Type=General',
  'Greater Shifter Defense':'Type=Shifter',
  'Greensinger Initiate':'Type=General',
  'Haunting Melody':'Type=General',
  'Healing Factor':'Type=Shifter',
  'Heroic Spirit':'Type=General',
  'Improved Damage Reduction':'Type=Warforged',
  'Improved Fortification':'Type=Warforged',
  'Improved Natural Attack':'Type=General',
  'Investigate':'Type=General',
  'Knight Training':'Type=General',
  'Knight Training (Cleric)':'Type=General',
  'Least Dragonmark':'Type=General',
  'Legendary Artisan':'Type=Item Creation',
  'Lesser Dragonmark':'Type=General',
  'Longstride Elite':'Type=Shifter',
  'Mithral Body':'Type=Warforged',
  'Mithral Fluidity':'Type=Warforged',
  'Monastic Training (Cleric)':'Type=General',
  'Music Of Growth':'Type=General',
  'Music Of Making':'Type=General',
  'Powerful Charge':'Type=General',
  'Precise Swing':'Type=General',
  'Pursue':'Type=General',
  'Raging Luck':'Type=General',
  'Recognize Impostor':'Type=General',
  'Repel Aberration':'Type=General',
  'Research':'Type=General',
  'Right Of Counsel':'Type=General',
  'Serpent Strike':'Type=General',
  'Shifter Defense':'Type=Shifter',
  'Shifter Ferocity':'Type=Shifter',
  'Shifter Multiattack':'Type=Shifter',
  'Silver Smite':'Type=General',
  'Song Of The Heart':'Type=General',
  'Soothe The Beast':'Type=General',
  'Spontaneous Casting':'Type=General',
  'Strong Mind':'Type=General',
  'Totem Companion':'Type=General',
  'Undead Empathy':'Type=General',
  'Urban Tracking':'Type=General',
  'Vermin Companion':'Type=General',
  'Vermin Shape':'Type=General',
  'Wand Mastery':'Type=General',
  'Warden Initiate':'Type=General',
  'Whirling Steel Strike':'Type=General'
};
Eberron.FEATS = Object.assign({}, SRD35.FEATS, Eberron.FEATS_ADDED);
Eberron.FEATURES_ADDED = {
};
Eberron.FEATURES = Object.assign({}, SRD35.FEATURES, Eberron.FEATURES_ADDED);
Eberron.GENDERS = Object.assign({}, SRD35.GENDERS);
Eberron.HOUSES = {
  'None':
    '',
  'Cannith':
    'Dragonmark=Making ' +
    'Spells=' +
      '"Make Whole",Mending,Mending,"Repair Light Damage","Minor Creation",' +
      '"Repair Serious Damage",Fabricate,"Major Creation","True Creation"',
  'Deneith':
    'Dragonmark=Sentinel ' +
    'Spells=' +
      '"Mage Armor","Protection From Arrows","Shield Of Faith",' +
      '"Shield Other","Lesser Globe Of Invulnerability",' +
      '"Protection From Energy","Globe Of Invulnerability","Mind Blank"',
  'Ghallanda':
    'Dragonmark=Hospitality ' +
    'Spells=' +
      'Prestidigitation,Prestidigitation,"Purify Food And Drink",' +
      '"Purify Food And Drink","Unseen Servant","Create Food And Water",' +
      '"Secure Shelter","Heroes\' Feast","Mage\'s Magnificent Mansion",' +
      'Refuge',
  'Jorasco':
    'Dragonmark=Healing ' +
    'Spells=' +
      '"Cure Light Wounds","Lesser Restoration","Cure Serious Wounds",' +
      '"Neutralize Poison","Remove Disease",Restoration,Heal,"Mass Heal"',
  'Kundarak':
    'Dragonmark=Warding ' +
    'Spells=' +
      'Alarm,"Arcane Lock",Misdirection,"Explosive Runes",' +
      '"Glyph Of Warding",Nondetection,"Greater Glyph Of Warding",' +
      '"Guards And Wards","Mage\'s Faithful Hound","Prismatic Wall"',
  'Lyrandar':
    'Dragonmark=Storm ' +
    'Spells=' +
      '"Endure Elements","Fog Cloud","Gust Of Wind","Sleet Storm",' +
      '"Wind Wall","Wind\'s Favor","Control Weather","Control Winds",' +
      '"Storm Of Vengeance"',
  'Medani':
    'Dragonmark=Detection ' +
    'Spells=' +
      '"Detect Magic","Detect Magic","Detect Poison","Detect Poison",' +
      '"Detect Scrying","See Invisible","True Seeing","Moment Of Prescience"',
  'Orien':
    'Dragonmark=Passage ' +
    'Spells=' +
      '"Dimension Leap","Expeditious Retreat",Mount,"Dimension Door",' +
      '"Phantom Steed","Overland Flight",Teleport,"Greater Teleport"',
  'Phiarlan':
    'Dragonmark=Shadow ' +
    'Spells=' +
      'Darkness,"Disguise Self","Minor Image",Clairaudience/Clairvoyance,' +
      'Scrying,"Shadow Conjuration",Mislead,"Prying Eyes","Shadow Walk",' +
      'Greater Prying Eyes',
  'Sivis':
    'Dragonmark=Scribing ' +
    'Spells=' +
      '"Arcane Mark","Arcane Mark","Comprehend Languages","Whispering Wind",' +
      '"Illusory Script","Secret Page",Tongues,Sending,"Symbol Of Death"',
  'Tharashk':
    'Dragonmark=Finding ' +
    'Spells=' +
      'Identify,"Know Direction","Know Direction","Locate Object",' +
      '"Helping Hand","Locate Creature","Find The Path","Discern Location"',
  'Thuranni':
    'Dragonmark=Shadow ' +
    'Spells=' +
      'Darkness,"Disguise Self","Minor Image",Clairaudience/Clairvoyance,' +
      'Scrying,"Shadow Conjuration",Mislead,"Prying Eyes","Shadow Walk",' +
      'Greater Prying Eyes',
  'Vadalis':
    'Dragonmark=Handling ' +
    'Spells=' +
      '"Calm Animals","Charm Animals","Speak With Animals","Dominate Animal",' +
      '"Greater Magic Fang","Animal Growth","Summon Nature\'s Ally V",' +
      'Awaken,"Summon Nature\'s Ally"'
};
Eberron.dragonmarksSpells = {
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
  'Changeling':'',
  'Kalashtar':'',
  'Shifter':'',
  'Warforged':''
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
  'Valenar Double Scimitar':'Level=3 Damage=d6,d6 Threat=18',
  "Xen'drik Boomerang":'Level=3 Category=R Damage=d6 Range=20'
};
Eberron.WEAPONS = Object.assign({}, SRD35.WEAPONS, Eberron.WEAPONS_ADDED);

// Related information used internally by Eberron
Eberron.artificerCraftReserves = [
  0, 20, 40, 60, 80, 100, 150, 200, 250, 300, 400, 500, 700, 900, 1200, 1500,
  2000, 2500, 3000, 4000, 5000
];
Eberron.totemAttackForms = {
  'Black Dragon':'acid',
  'Blue Dragon':'electricity',
  'Brass Dragon':'fire',
  'Bronze Dragon':'electricity',
  'Chimera':'breath weapons',
  'Copper Dragon':'acid',
  'Digester':'acid',
  'Displacer Beast':'targeted spells',
  'Gogon':'petrification',
  'Gold Dragon':'fire',
  'Green Dragon':'acid',
  'Krenshar':'fear',
  'Red Dragon':'fire',
  'Silver Dragon':'cold',
  'Unicorn':'poison',
  'White Dragon':'cold',
  'Winter Wolf':'cold',
  'Yrthak':'sonic'
};
Eberron.CLASSES = ['Artificer'];

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
  for(var path in houses) {
    rules.choiceRules(rules, 'House', path, houses[house]);
  }
  // No changes needed to the rules defined by base method
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
      spells,
      Eberron.SPELLS
    );
    Eberron.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Eberron.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'Domain')
    Eberron.domainRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Eberron.SPELLS
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

/* Defines the rules related to Eberron character classes. */
Eberron.classRulesExtra = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, skillPoints, skills,
        spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Artificer') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = [
        'Attune Magic Weapon', 'Craft Construct', 'Exceptional Artisan',
        'Extra Rings', 'Extraordinary Artisan', 'Legendary Artisan',
        'Wand Mastery'
      ];
      for(var j = 0; j < SRD35.FEATS.length; j++) {
        var pieces = SRD35.FEATS[j].split(':');
        if(pieces[1].match(/Metamagic/)) {
          feats[feats.length] = pieces[0];
        }
      }
      features = [
        '1:Artificer Knowledge', '1:Artisan Bonus', '1:Craft Reserve',
        '1:Disable Trap', '1:Item Creation', '1:Scribe Scroll',
        '2:Brew Potion', '3:Craft Wondrous Item', '4:Craft Homunculus',
        '5:Craft Magic Arms And Armor', '5:Retain Essence',
        '6:Metamagic Spell Trigger', '7:Craft Wand',
        '9:Craft Rod', '11:Metamagic Spell Completion', '12:Craft Staff',
        '13:Artificer Skill Mastery', '14:Forge Ring'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.brewPotionFeature:Create potion for up to 3rd level spell',
        'magicNotes.craftHomunculusFeature:Create homunculus',
        'magicNotes.craftMagicArmsAndArmorFeature:' +
          'Create/mend magic weapon/armor/shield',
        'magicNotes.craftReserveFeature:%V',
        'magicNotes.craftRodFeature:Create magic rod',
        'magicNotes.craftStaffFeature:Create magic staff',
        'magicNotes.craftWandFeature:Create wand for up to 4th level spell',
        'magicNotes.craftWondrousItemFeature:' +
          'Create/mend miscellaneous magic item',
        'magicNotes.forgeRingFeature:Create/mend magic ring',
        'magicNotes.itemCreationFeature:' +
          '+2 DC 20+caster level check to create magic items',
        'magicNotes.metamagicSpellCompletionFeature:' +
          'Apply metamagic feat to spell from scroll',
        'magicNotes.metamagicSpellTriggerFeature:' +
          'Apply metamagic feat to spell from wand',
        'magicNotes.retainEssenceFeature:' +
          'Drain magic item XP into craft reserve',
        'magicNotes.scribeScrollFeature:Create scroll of any known spell',
        'skillNotes.artificerKnowledgeFeature:' +
          '+%V DC 15 check to determine whether an item is magical',
        'skillNotes.artificerSkillMasteryFeature:' +
          'Take 10 on Spellcraft/Use Magic Device when distracted',
        'skillNotes.artisanBonusFeature:' +
          '+2 Use Magic Device on items character can craft',
        'skillNotes.disableTrapFeature:' +
          'Use Search/Disable Device to find/remove DC 20+ traps'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Appraise', 'Concentration', 'Craft', 'Disable Device',
        'Knowledge (Arcana)', 'Knowledge (Architecture)', 'Knowledge (Planes)',
        'Open Lock', 'Profession', 'Search', 'Spellcraft', 'Use Magic Device'
      ];
      spellAbility = 'intelligence';
      spellsKnown = [
        'I1:1:"all"', 'I2:3:"all"', 'I3:5:"all"', 'I4:8:"all"', 'I5:11:"all"',
        'I6:14:"all"'
      ];
      spellsPerDay = [
        'I1:1:2/2:3/14:4',
        'I2:3:1/4:2/5:3/15:4',
        'I3:5:1/6:2/8:3/16:4',
        'I4:8:1/9:2/13:3/17:4',
        'I5:11:1/12:2/14:3/18:4',
        'I6:14:1/15:2/17:3/19:4'
      ];
      rules.defineRule('casterLevels.I',
        'levels.Artificer', '=', null,
         'magicNotes.casterLevelBonusFeature', '+', null
      );
      // Artificer infusions are neither arcane nor divine, but they are casters
      rules.defineRule('casterLevel', 'levels.Artificer', '+=', null);
      rules.defineRule('featCount.Artificer',
        'levels.Artificer', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('magicNotes.craftReserveFeature',
        'levels.Artificer', '=', 'Eberron.artificerCraftReserves[source]'
      );
      rules.defineRule('skillNotes.artificerKnowledgeFeature',
         'levels.Artificer', '=', null,
         'intelligenceModifier', '+', null
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

/* Defines the rules related to Eberron character feats. */
Eberron.featRulesExtra = function(rules, feats, subfeats) {

  var allFeats = [];
  for(var i = 0; i < feats.length; i++) {
    var pieces = feats[i].split(':');
    var feat = pieces[0];
    var featSubfeats = subfeats[feat];
    if(featSubfeats == null) {
      allFeats[allFeats.length] = feat + ':' + pieces[1];
    } else if(featSubfeats != '') {
      featSubfeats = featSubfeats.split('/');
      for(var j = 0; j < featSubfeats.length; j++) {
        allFeats[allFeats.length] =
          feat + ' (' + featSubfeats[j] + '):' + pieces[1];
      }
    }
  }

  for(var i = 0; i < allFeats.length; i++) {
    var pieces = allFeats[i].split(':');
    var feat = pieces[0];
    var matchInfo;
    var notes;
    
    if((matchInfo = feat.match(/^Aberrant Dragonmark \((.*)\)$/)) != null) {
      var spell = matchInfo[1];
      var note = 'magicNotes.aberrantDragonmark(' + spell + ')Feature';
      notes = [
        note + ':<i>' + spell + '</i> 1/day',
        'validationNotes.aberrantDragonmark(' + spell + ')FeatFeats:' +
          'Requires no Dragonmark feats',
        'validationNotes.aberrantDragonmark(' + spell + ')FeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human'
      ];
      rules.defineRule('casterLevels.Aberrant Dragonmark ' + spell,
        'features.Aberrant Dragonmark (' + spell + ')', '?', null,
        'level', '=', null
      );
      rules.defineRule('casterLevels.' + spell,
        'casterLevels.Aberrant Dragonmark' + spell, '^=', null
      );
      rules.defineRule('casterLevels.S',
        'casterLevels.Aberrant Dragonmark ' + spell, '^=', null
      );
      rules.defineRule(
        'validationNotes.aberrantDragonmark(' + spell + ')FeatFeats',
        'feats.' + feat, '=', '0',
        /^feats.(Greater|Least|Lesser) Dragonmark/, '+', '-1'
      );
    } else if(feat == 'Action Boost') {
      notes = [
        'featureNotes.actionBoostFeature:' +
          'Add d8 instead of d6 when using AP on attack, skill, ability, ' +
          'level or saving throw'
      ];
    } else if(feat == 'Action Surge') {
      notes = [
        'featureNotes.actionSurgeFeature:' +
          'Spend 2 AP to take extra move or standard action',
        'validationNotes.actionSurgeFeatBaseAttack:Requires Base Attack >= 3'
      ];
    } else if(feat == 'Adamantine Body') {
      notes = [
        'abilityNotes.adamantineBodyFeature:Max 20 speed',
        'combatNotes.adamantineBodyFeature:+6 AC/DR 2/adamantine',
        'validationNotes.adamantineBodyFeatRace:Requires Race == "Warforged"'
      ];
      rules.defineRule
        ('armorClass', 'combatNotes.adamantineBodyFeature', '+', '6');
      rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
        'features.Adamantine Body', 'v', '1'
      );
      rules.defineRule('magicNotes.arcaneSpellFailure',
        'features.Adamantine Body', '^', '35'
      );
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'features.Adamantine Body', '=', '5'
      );
      rules.defineRule
        ('speed', 'abilityNotes.adamantineBodyFeature', 'v', '20');
    } else if(feat == 'Ashbound') {
      notes = [
        'magicNotes.ashboundFeature:' +
          "Double <i>Summon Nature's Ally</i> duration; summoned creatures " +
          '+3 attack',
        'validationNotes.ashboundFeatFeatures:Requires Spontaneous Druid Spell'
      ];
    } else if(feat == 'Attune Magic Weapon') {
      notes = [
        'combatNotes.attuneMagicWeaponFeature:+1 attack/damage w/magic weapons',
        'validationNotes.attuneMagicWeaponFeatCasterLevel:' +
          'Requires Caster Level >= 5',
        'validationNotes.attuneMagicWeaponFeatFeats:' +
          'Requires Craft Magic Arms And Armor'
      ];
    } else if(feat == 'Beast Shape') {
      notes = [
        'magicNotes.beastShapeFeature:Wild Shape into beast totem 1/day',
        'validationNotes.beastShapeFeatFeats:Requires Max Beast Totem >= 1',
        'validationNotes.beastShapeFeatFeatures:' +
          'Requires Wild Shape (huge creature)'
      ];
      rules.defineRule('validationNotes.beastShapeFeatFeatures',
        'feats.Beast Shape', '=', '-1',
        'levels.Druid', '+', 'source >= 15 ? 1 : null'
      );
    } else if((matchInfo = feat.match(/^Beast Totem \((.*)\)$/)) != null) {
      var beast = matchInfo[1];
      var attack = Eberron.totemAttackForms[beast];
      var note = 'saveNotes.beastTotem(' + beast + ')Feature';
      notes = [
        note + ':+4 vs. ' + (attack == null ? 'related' : attack),
        'validationNotes.beastTotem(' + beast + ')FeatFeatures:' +
          'Requires Wild Empathy'
      ];
    } else if(feat == 'Beasthide Elite') {
      notes = [
        'combatNotes.beasthideEliteFeature:+2 AC while shifting',
        'validationNotes.beasthideEliteFeatFeatures:Requires Beasthide'
      ];
    } else if(feat == 'Bind Elemental') {
      notes = [
        'magicNotes.bindElementalFeature:Bind elementals to magical objects',
        'validationNotes.bindElementalFeatCasterLevel:' +
          'Requires Caster Level >= 9',
        'validationNotes.bindElementalFeatFeats:Requires Craft Wondrous Item'
      ];
    } else if(feat == 'Child Of Winter') {
      notes = [
        'magicNotes.childOfWinterFeature:Use animal Druid spells on vermin',
        'validationNotes.childOfWinterFeatAlignment:Requires Alignment !~ Good',
        'validationNotes.childOfWinterFeatFeatures:' +
          'Requires Spontaneous Druid Spell'
      ];
    } else if(feat == 'Cliffwalk Elite') {
      notes = [
        'abilityNotes.cliffwalkEliteFeature:+10 climb speed while shifting',
        'validationNotes.cliffwalkEliteFeatFeatures:Requires Cliffwalk'
      ];
      rules.defineRule('abilityNotes.cliffwalkFeature',
        'abilityNotes.cliffwalkEliteFeature', '+', '10'
      );
    } else if(feat == 'Craft Construct') {
      notes = [
        'magicNotes.craftConstructFeature:Create enchanted construct',
        'validationNotes.craftConstructFeatFeats:' +
          'Requires Craft Magic Arms And Armor/Craft Wondrous Item'
      ];
    } else if(feat == 'Double Steel Strike') {
      notes = [
        'combatNotes.doubleSteelStrikeFeature:' +
          'Flurry Of Blows w/Two-Bladed Sword',
        'sanityNotes.doubleSteelStrikeFeatWeapons:Requires Two-Bladed Sword',
        'validationNotes.doubleSteelStrikeFeatFeats:' +
          'Requires Weapon Proficiency (Two-Bladed Sword)',
        'validationNotes.doubleSteelStrikeFeatFeatures:Requires Flurry Of Blows'
      ];
    } else if(feat == 'Dragon Rage') {
      notes = [
        'combatNotes.dragonRageFeature:' +
          '+2 AC/+10 Dragon Totem resistence during Rage',
        'validationNotes.dragonRageFeatFeats:Requires Max Dragon Totem >= 1',
        'validationNotes.dragonRageFeatFeatures:Requires Rage',
        'validationNotes.dragonRageFeatOrigin:Requires Origin == "Argonnessen"'
      ];
    } else if((matchInfo = feat.match(/^Dragon Totem \((.*)\)$/)) != null) {
      var dragon = matchInfo[1];
      var attack = Eberron.totemAttackForms[dragon];
      var note = 'saveNotes.dragonTotem(' + dragon + ')Feature';
      notes = [
        note + ':+5 vs. ' + (attack == null ? 'related' : attack),
        'validationNotes.dragonTotem(' + dragon + ')FeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.dragonTotem(' + dragon + ')FeatOrigin:' +
          'Requires Origin =~ Argonnessen|Seren'
      ];
    } else if(feat == 'Ecclesiarch') {
      notes = [
        'featureNotes.ecclesiarchFeature:+2 Leadership',
        'sanityNotes..ecclesiarchFeatFeats:Requires Leadership',
        'skillNotes.ecclesiarchFeature:' +
          'Gather Information/Knowledge (Local) class skills',
        'validationNotes.ecclesiarchFeatSkills:' +
          'Requires Knowledge (Religion) >= 6'
      ];
      rules.defineRule('classSkills.Gather Information',
        'skillNotes.ecclesiarchFeature', '=', '1'
      );
      rules.defineRule('classSkills.Knowledge (Local)',
        'skillNotes.ecclesiarchFeature', '=', '1'
      );
    } else if(feat == 'Education') {
      notes = [
        'skillNotes.educationFeature:' +
          'All Knowledge skills class skills/+2 any 2 Knowledge skills'
      ];
      rules.defineRule
        (/^classSkills\.Knowledge/, 'skillNotes.educationFeature', '=', '1');
    } else if(feat == 'Exceptional Artisan') {
      notes = [
        'magicNotes.exceptionalArtisanFeature:' +
          'Reduce item creation base time by 25%',
        'validationNotes.exceptionalArtisanFeatFeats:Requires any Item Creation'
      ];
      rules.defineRule('validationNotes.exceptionalArtisanFeatFeats',
        'feats.Exceptional Artisan', '=', '-1',
        /feats.(Brew Potion|Craft (Magic Arms And Armor|Staff|Wand|Wondrous Item)|Forge Ring|Scribe Scroll|Attune Magical Weapon|Bind Elemental|(Extraordinary|Legendary) Artisan|Extra Rings|Wand Mastery)/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Extend Rage') {
      notes = [
        'combatNotes.extendRageFeature:Add 5 rounds to Rage duration',
        'validationNotes.extendRageFeatFeatures:Requires Rage'
      ];
      rules.defineRule
        ('combatNotes.rageFeature', 'combatNotes.extendRageFeature', '+', '5');
    } else if(feat == 'Extra Music') {
      notes = [
        'featureNotes.extraMusicFeature:Bardic Music 4 extra times/day',
        'validationNotes.extraMusicFeatFeatures:Requires Bardic Music'
      ];
      rules.defineRule('featureNotes.bardicMusicFeature',
        'featureNotes.extraMusicFeature', '+', '4'
      );
    } else if(feat == 'Extra Rings') {
      notes = [
        'magicNotes.extraRingsFeature:Wear up to 4 magic rings at once',
        'validationNotes.extraRingsFeatCasterLevel:Requires Caster Level >= 12',
        'validationNotes.extraRingsFeatFeats:Requires Forge Ring'
      ];
    } else if(feat == 'Extra Shifter Trait') {
      notes = [
        'featureNotes.extraShifterTraitFeature:' +
          'Extra Shifter trait w/out ability bonus',
        'validationNotes.extraShifterTraitFeatFeats:Requires any 2 Shifter',
        'validationNotes.extraShifterTraitFeatRace:Requires Race == "Shifter"'
      ];
      rules.defineRule('selectableFeatureCount.Shifter',
        'featureNotes.extraShifterTraitFeature', '+', '1'
      );
      rules.defineRule('validationNotes.extraShifterTraitFeatFeats',
        'feats.Extra Shifter Trait', '=', '-2',
        /feats.((Beasthide|Cliffwalk|Longstride) Elite|Great (Bite|Rend)|Greater Shifter Defense|Healing Factor|Improved Natural Attack|Shifter (Defense|Ferocity|Multiattack))/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Extraordinary Artisan') {
      notes = [
        'magicNotes.extraordinaryArtisanFeature:' +
          'Reduce item creation base price by 25%',
        'validationNotes.extraordinaryArtisanFeatFeats:' +
          'Requires any Item Creation'
      ];
      rules.defineRule('validationNotes.extraordinaryArtisanFeatFeats',
        'feats.Extraordinary Artisan', '=', '-1',
        /feats.(Brew Potion|Craft (Magic Arms And Armor|Staff|Wand|Wondrous Item)|Forge Ring|Scribe Scroll|Attune Magical Weapon|Bind Elemental|(Exceptional|Legendary) Artisan|Extra Rings|Wand Mastery)/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Favored In House') {
      notes = [
        'featureNotes.favoredInHouseFeature:Acquire favors from house contacts',
        'validationNotes.favoredInHouseFeatHouse:Requires House != "None"',
        'validationNotes.favoredInHouseFeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human'
      ];
    } else if(feat == 'Flensing Strike') {
      notes = [
        'combatNotes.flensingStrikeFeature:' +
          'Foe DC %V Fortitude save on kama strike or suffer -1 pain penalty ' +
          'attack/save/check rolls for 1 minute',
        'validationNotes.flensingStrikeFeatFeats:' +
          'Requires Weapon Focus (Kama)/Weapon Proficiency (Kama)'
      ];
      rules.defineRule('combatNotes.flensingStrikeFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
    } else if(feat == 'Gatekeeper Initiate') {
      notes = [
        'magicNotes.gatekeeperInitiateFeature:Access to additional spells',
        'saveNotes.gatekeeperInitiateFeature:+2 vs. supernatural/aberrations',
        'skillNotes.gatekeeperInitiateFeature:Knowledge (Planes) class skill',
        'validationNotes.gatekeeperInitiateFeatFeatures:' +
          'Requires Spontaneous Druid Spell'
      ];
      rules.defineRule('classSkills.Knowledge (Planes)',
        'skillNotes.gatekeeperInitiateFeature', '=', '1'
      );
    } else if(feat == 'Great Bite') {
      notes = [
        'combatNotes.greatBiteFeature:x3 critical on Fang attacks',
        'validationNotes.greatBiteFeatBaseAttack:Requires Base Attack >= 6',
        'validationNotes.greatBiteFeatFeatures:Requires Longtooth'
      ];
    } else if(feat == 'Great Rend') {
      notes = [
        'combatNotes.greatRendFeature:+d4+%V damage on hit w/both claws',
        'validationNotes.greatRendFeatBaseAttack:Requires Base Attack >= 4',
        'validationNotes.greatRendFeatFeatures:Requires Razorclaw'
      ];
      rules.defineRule('combatNotes.greatRendFeature',
        'level', '=', 'Math.floor(source / 4)',
        'strengthModifier', '+', 'Math.floor(source / 2)'
      );
    } else if(feat == 'Greater Dragonmark') {
      notes = [
        'magicNotes.greaterDragonmarkFeature:Choice of %V',
        'validationNotes.greaterDragonmarkFeatFeats:' +
          'Requires Least Dragonmark/Lesser Dragonmark',
        'validationNotes.greaterDragonmarkFeatHouse:Requires House != "None"',
        'validationNotes.greaterDragonmarkFeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human',
        'validationNotes.greaterDragonmarkFeatSkills:Requires any 2 >= 12'
      ];
      rules.defineRule('casterLevels.Greater Dragonmark',
        'features.Least Dragonmark', '=', '10'
      );
      rules.defineRule
        ('magicNotes.greaterDragonmarkFeature', '', '=', '"spells %1/day"');
      rules.defineRule('magicNotes.greaterDragonmarkFeature.1',
        'features.Greater Dragonmark', '=', '1'
      );
      rules.defineRule('magicNotes.leastDragonmarkFeature.1',
        'features.Greater Dragonmark', '+', '1'
      );
      rules.defineRule('magicNotes.leastDragonmarkFeature.2',
        'features.Greater Dragonmark', '+', '1'
      );
      rules.defineRule('magicNotes.lesserDragonmarkFeature.1',
        'features.Greater Dragonmark', '+', '1'
      );
      for(var dragonmark in Eberron.dragonmarksSpells) {
        var spells = Eberron.dragonmarksSpells[dragonmark][2].split(/,\s*/);
        for(var j = 0; j < spells.length; j++) {
          var spell = spells[j];
          rules.defineRule('casterLevels.' + spell,
            'casterLevels.Greater Dragonmark', '^=', null
          );
          spells[j] = '<i>' + spell + '</i> %1/day';
        }
        rules.defineRule('magicNotes.greaterDragonmarkFeature',
          'isDragonmark.' + dragonmark, '=', '"' + spells.join(', ') + '"'
        );
      };
      rules.defineRule('validationNotes.greaterDragonmarkFeatSkills',
        'feats.Greater Dragonmark', '=', '-2',
        /^skillModifier\./, '+', 'source >= 12 ? 1 : null',
        '', 'v', '0'
      );
    } else if(feat == 'Greater Powerful Charge') {
      notes = [
        'combatNotes.greaterPowerfulChargeFeature:' +
          'Raise charge damage one size category to %V',
        'validationNotes.greaterPowerfulChargeFeatBaseAttack:' +
          'Requires Base Attack >= 4',
        'validationNotes.greaterPowerfulChargeFeatFeats:' +
          'Requires Powerful Charge',
        'validationNotes.greaterPowerfulChargeFeatFeatures:' +
          'Requires not Small'
      ];
      rules.defineRule('combatNotes.greaterPowerfulChargeFeature',
        '', '=', '"2d6"',
        'features.Large', '=', '"3d6"'
      );
      rules.defineRule('combatNotes.powerfulChargeFeature',
        'combatNotes.greaterPowerfulChargeFeature', '=', null
      );
      rules.defineRule('validationNotes.greaterPowerfulChargeFeatFeatures',
        'feats.Greater Powerful Charge', '=', '0',
        'features.Small', '+', '-1'
      );
    } else if(feat == 'Greater Shifter Defense') {
      notes = [
        'combatNotes.greaterShifterDefenseFeature:+2 Shifter Defense DR',
        'validationNotes.greaterShifterDefenseFeatFeats:' +
          'Requires Shifter Defense/any 3 other Shifter',
        'validationNotes.greaterShifterDefenseFeatRace:' +
          'Requires Race == "Shifter"'
      ];
      rules.defineRule('combatNotes.shifterDefenseFeature',
        'combatNotes.greaterShifterDefenseFeature', '+', '2'
      );
      rules.defineRule('validationNotes.greaterShifterDefenseFeatFeats',
        'feats.Greater Shifter Defense', '=', '-13',
        'feats.Shifter Defense', '+', '10',
        /feats.((Beasthide|Cliffwalk|Longstride) Elite|Extra Shifter Trait|Great (Bite|Rend)|Healing Factor|Improved Natural Attack|Shifter (Ferocity|Multiattack))/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Greensinger Initiate') {
      notes = [
        'magicNotes.greensingerInitiateFeature:Access to additional spells',
        'skillNotes.greensingerInitiateFeature:' +
          'Bluff/Hide/Perform are class skills',
        'validationNotes.greensingerInitiateFeatFeatures:' +
          'Requires Spontaneous Druid Spell'
      ];
      rules.defineRule('classSkills.Bluff',
        'skillNotes.greensingerInitiateFeature', '=', '1'
      );
      rules.defineRule('classSkills.Hide',
        'skillNotes.greensingerInitiateFeature', '=', '1'
      );
      rules.defineRule('classSkills.Perform',
        'skillNotes.greensingerInitiateFeature', '=', '1'
      );
    } else if(feat == 'Haunting Melody') {
      notes = [
        'magicNotes.hauntingMelodyFeature:' +
          'Foe afraid for %1 rounds (DC %V Will neg)',
        'validationNotes.hauntingMelodyFeatFeatures:Requires Bardic Music',
        'validationNotes.hauntingMelodyFeatSkills:Requires Sum Perform >= 9'
      ];
      rules.defineRule('magicNotes.hauntingMelodyFeature',
        'levels.Bard', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('magicNotes.hauntingMelodyFeature.1',
        /^skillModifier.Perform/, '+=', null
      );
    } else if(feat == 'Healing Factor') {
      notes = [
        'featureNotes.healingFactorFeature:Heal %V points when shifting ends',
        'validationNotes.healingFactorFeatAbility:Requires Constitution >= 13',
        'validationNotes.healingFactorFeatRace:Requires Race == "Shifter"'
      ];
      rules.defineRule('featureNotes.healingFactorFeature', 'level', '=', null);
    } else if(feat == 'Heroic Spirit') {
      notes = [
        'abilityNotes.heroicSpiritFeature:+3 AP'
      ];
      rules.defineRule
       ('actionPoints', 'abilityNotes.heroicSpiritFeature', '+', '3');
    } else if(feat == 'Improved Damage Reduction') {
      notes = [
        'combatNotes.improvedDamageReductionFeature:DR +1/adamantine',
        'validationNotes.improvedDamageReductionFeatRace:' +
          'Requires Race == "Warforged"'
      ];
    } else if(feat == 'Improved Fortification') {
      notes = [
        'combatNotes.improvedFortificationFeature:' +
          'Immune sneak attack/critical hit/healing',
        'validationNotes.improvedFortificationFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.improvedFortificationFeatRace:' +
          'Requires Race == "Warforged"'
      ];
    } else if(feat == 'Improved Natural Attack') {
      notes = [
        'combatNotes.improvedNaturalAttackFeature:' +
          'Natural attack damage increases one size catagory',
        'validationNotes.improvedNaturalAttackFeatBaseAttack:' +
          'Requires Base Attack >= 4'
      ];
    } else if(feat == 'Investigate') {
      notes = [
        'skillNotes.investigateFeature:Use Search to find/analyze clues, synergy with appropriate Knowledge'
      ];
    } else if((matchInfo=feat.match(/^Knight Training \((.*)\)$/)) != null) {
      var klass = matchInfo[1];
      notes = [
        'featureNotes.knightTraining(' + klass + ')Feature:' +
          'No restrictions on Paladin/' + klass + ' level advancement'
      ];
    } else if(feat == 'Least Dragonmark') {
      notes = [
        'magicNotes.leastDragonmarkFeature:Choice of %V',
        'validationNotes.leastDragonmarkFeatHouse:Requires House != "None"',
        'validationNotes.leastDragonmarkFeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human'
      ];
      rules.defineRule('casterLevels.Least Dragonmark',
        'features.Least Dragonmark', '=', '1'
      );
      rules.defineRule
        ('magicNotes.leastDragonmarkFeature', '', '=', '"spells %1/day"');
      rules.defineRule('magicNotes.leastDragonmarkFeature.1',
        'features.Least Dragonmark', '=', '1'
      );
      rules.defineRule('magicNotes.leastDragonmarkFeature.2',
        'features.Least Dragonmark', '=', '2'
      );
      // Set casterLevels.[CS] to a minimal value so that spell DC will be
      // calcuated even for non-caster characters.
      rules.defineRule
        ('casterLevels.C', 'casterLevels.Least Dragonmark', '^=', '1');
      rules.defineRule
        ('casterLevels.S', 'casterLevels.Least Dragonmark', '^=', '1');
      for(var dragonmark in Eberron.dragonmarksSpells) {
        var spells = Eberron.dragonmarksSpells[dragonmark][0].split(/,\s*/);
        for(var j = 0; j < spells.length; j++) {
          var spell = spells[j];
          var spellNoX2 = spell.replace(/\s+x2$/, '');
          rules.defineRule('casterLevels.' + spellNoX2,
            'casterLevels.Least Dragonmark', '^=', null
          );
          spells[j] =
            '<i>' + spellNoX2 + '</i> %' + (spell==spellNoX2?'1':'2') + '/day';
        }
        rules.defineRule('magicNotes.leastDragonmarkFeature',
          'isDragonmark.' + dragonmark, '=', '"' + spells.join(', ') + '"'
        );
      };
    } else if(feat == 'Legendary Artisan') {
      notes = [
        'magicNotes.legendaryArtisanFeature:' +
          'Reduce item creation XP price by 25%',
        'validationNotes.legendaryArtisanFeatFeats:Requires any Item Creation'
      ];
      rules.defineRule('validationNotes.legendaryArtisanFeatFeats',
        'feats.Legendary Artisan', '=', '-1',
        /feats.(Brew Potion|Craft (Magic Arms And Armor|Staff|Wand|Wondrous Item)|Forge Ring|Scribe Scroll|Attune Magical Weapon|Bind Elemental|(Exceptional|Extraordinary) Artisan|Extra Rings|Wand Mastery)/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Lesser Dragonmark') {
      notes = [
        'magicNotes.lesserDragonmarkFeature:Choice of %V',
        'validationNotes.lesserDragonmarkFeatHouse:Requires House != "None"',
        'validationNotes.lesserDragonmarkFeatFeats:Requires Least Dragonmark',
        'validationNotes.lesserDragonmarkFeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human',
        'validationNotes.lesserDragonmarkFeatSkills:Requires any 2 >= 9'
      ];
      rules.defineRule('casterLevels.Lesser Dragonmark',
        'features.Least Dragonmark', '=', '6'
      );
      rules.defineRule
        ('magicNotes.lesserDragonmarkFeature', '', '=', '"spells %1/day"');
      rules.defineRule('magicNotes.lesserDragonmarkFeature.1',
        'features.Lesser Dragonmark', '=', '1'
      );
      rules.defineRule('magicNotes.leastDragonmarkFeature.1',
        'features.Lesser Dragonmark', '+', '1'
      );
      rules.defineRule('magicNotes.leastDragonmarkFeature.2',
        'features.Lesser Dragonmark', '+', '1'
      );
      for(var dragonmark in Eberron.dragonmarksSpells) {
        var spells = Eberron.dragonmarksSpells[dragonmark][1].split(/,\s*/);
        for(var j = 0; j < spells.length; j++) {
          var spell = spells[j];
          rules.defineRule('casterLevels.' + spell,
            'casterLevels.Lesser Dragonmark', '^=', null
          );
          spells[j] = '<i>' + spell + '</i> %1/day';
        }
        rules.defineRule('magicNotes.lesserDragonmarkFeature',
          'isDragonmark.' + dragonmark, '=', '"' + spells.join(', ') + '"'
        );
      };
      rules.defineRule('validationNotes.lesserDragonmarkFeatSkills',
        'feats.Lesser Dragonmark', '=', '-2',
        /^skillModifier\./, '+', 'source >= 9 ? 1 : null',
        '', 'v', '0'
      );
    } else if(feat == 'Longstride Elite') {
      notes = [
        'abilityNotes.longstrideEliteFeature:+10 speed while shifting',
        'validationNotes.longstrideEliteFeatFeatures:Requires Longstride'
      ];
    } else if(feat == 'Mithral Body') {
      notes = [
        'combatNotes.mithralBodyFeature:+3 AC',
        'validationNotes.mithralBodyFeatRace:Requires Race == "Warforged"'
      ];
      rules.defineRule
        ('armorClass', 'combatNotes.mithralBodyFeature', '+', '3');
      rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
        'mithralBodyDexACCap', 'v', null
      );
      rules.defineRule('magicNotes.arcaneSpellFailure',
        'features.Mithral Body', '^', '15'
      );
      rules.defineRule
        ('mithralBodyDexACCap', 'features.Mithral Body', '=', '5');
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'features.Mithral Body', '=', '2'
      );
    } else if(feat == 'Mithral Fluidity') {
      notes = [
        'combatNotes.mithralFluidityFeature:' +
          'Raise Mithral Body Reflex AC limit by 1',
        'skillNotes.mithralFluidityFeature:Reduce skill penalty by 1',
        'validationNotes.mithralFluidityFeatFeats:Requires Mithral Body',
        'validationNotes.mithralFluidityFeatRace:Requires Race == "Warforged"'
      ];
      rules.defineRule
        ('mithralBodyDexACCap', 'combatNotes.mithralFluidityFeature', '+', '1');
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'skillNotes.mithralFluidityFeature', '+', '-1'
      );
    } else if((matchInfo=feat.match(/^Monastic Training \((.*)\)$/)) != null) {
      var klass = matchInfo[1];
      notes = [
        'featureNotes.monasticTraining(' + klass + ')Feature:' +
          'No restrictions on Monk/' + klass + ' level advancement'
      ];
    } else if(feat == 'Music Of Growth') {
      notes = [
        'magicNotes.musicOfGrowthFeature:' +
          "+4 strength/constitution to animal/plant creatures w/in 30' " +
          'during Bardic Music',
        'validationNotes.musicOfGrowthFeatFeatures:Requires Bardic Music',
        'validationNotes.musicOfGrowthFeatSkills:Requires Sum Perform >= 12'
      ];
    } else if(feat == 'Music Of Making') {
      notes = [
        'magicNotes.musicOfMakingFeature:' +
          'Double duration of conjuration spells involving Bardic Music',
        'skillNotes.musicOfMakingFeature:+4 Craft during Bardic Music',
        'validationNotes.musicOfMakingFeatFeatures:Requires Bardic Music',
        'validationNotes.musicOfMakingFeatSkills:Requires Sum Perform >= 9'
      ];
    } else if(feat == 'Powerful Charge') {
      notes = [
        'combatNotes.powerfulChargeFeature:+%V damage from successful charge',
        'validationNotes.powerfulChargeFeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.powerfulChargeFeatFeatures:Requires not Small'
      ];
      rules.defineRule('combatNotes.powerfulChargeFeature',
        '', '=', '"d8"',
        'features.Large', '=', '"2d6"'
      );
      rules.defineRule('validationNotes.powerfulChargeFeatFeatures',
        'feats.Powerful Charge', '=', '0',
        'features.Small', '+', '-1'
      );
    } else if(feat == 'Precise Swing') {
      notes = [
        'combatNotes.preciseSwingFeature:' +
          'Ignore less-than-total cover w/melee attack',
        'validationNotes.preciseSwingFeatBaseAttack:Requires Base Attack >= 5'
      ];
    } else if(feat == 'Pursue') {
      notes = [
        'combatNotes.pursueFeature:' +
          'Spend 1 AP to step into area vacated by opponent',
        'validationNotes.pursueFeatFeats:Requires Combat Reflexes'
      ];
    } else if(feat == 'Raging Luck') {
      notes = [
        'featureNotes.ragingLuckFeature:Gain 1 AP during Rage',
        'validationNotes.ragingLuckFeatFeatures:Requires Rage'
      ];
    } else if(feat == 'Recognize Impostor') {
      notes = [
        'skillNotes.recognizeImpostorFeature:' +
          '+4 Sense Motive vs. Bluff/Spot vs. Disguise',
        'validationNotes.recognizeImpostorFeatSkills:' +
          'Requires Sense Motive >= 3/Spot >= 3'
      ];
    } else if(feat == 'Repel Aberration') {
      notes = [
        'combatNotes.repelAberrationFeature:' +
          'Repel aberrations as cleric turns undead',
        'validationNotes.repelAberrationFeatFeats:Requires Gatekeeper Initiate',
        'validationNotes.repelAberrationFeatLevels:Requires Druid >= 3'
      ];
      rules.defineRule('turnAberration.level',
        'features.Repel Aberration', '?', null,
        'levels.Druid', '+=', null
      );
      rules.defineRule('turnAberration.damageModifier',
        'turnAberration.level', '+=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule('turnAberration.frequency',
        'turnAberration.level', '=', '3',
        'charismaModifier', '+', null
      );
      rules.defineRule('turnAberration.maxHitDice',
        'turnAberration.level', '=', 'source * 3 - 10',
        'charismaModifier', '+', null
      );
      rules.defineNote([
        'turnAberration.damageModifier:2d6+%V',
        'turnAberration.frequency:%V/day',
        'turnAberration.maxHitDice:(d20+%V)/3'
      ]);
      rules.defineSheetElement('Turn Aberration', 'Turn Undead', null, ' * ');
    } else if(feat == 'Research') {
      notes = [
        'skillNotes.researchFeature:Use Knowledge skill on library/records'
      ];
    } else if(feat == 'Right Of Counsel') {
      notes = [
        'featureNotes.rightOfCounselFeature:' +
          'Seek advice from deathless ancestor',
        'validationNotes.rightOfCounselFeatRace:Requires Race == "Elf"'
      ];
    } else if(feat == 'Serpent Strike') {
      notes = [
        'combatNotes.serpentStrikeFeature:Flurry Of Blows w/Longspear',
        'sanityNotes.serpentStrikeFeatWeapons:Requires Longspear',
        'validationNotes.serpentStrikeFeatFeats:Weapon Focus (Longspear)',
        'validationNotes.serpentStrikeFeatFeatures:Requires Flurry Of Blows',
        'validationNotes.serpentStrikeFeatWeaponProficiencyLevel:' +
          'Requires Weapon Proficiency Level >= ' + SRD35.PROFICIENCY_LIGHT
      ];
    } else if(feat == 'Shifter Defense') {
      notes = [
        'combatNotes.shifterDefenseFeature:DR %V/silver',
        'validationNotes.shifterDefenseFeatFeats:Requires any 2 Shifter',
        'validationNotes.shifterDefenseFeatRace:Requires Race == "Shifter"'
      ];
      rules.defineRule('combatNotes.shifterDefenseFeature', '', '=', '2');
      rules.defineRule('validationNotes.shifterDefenseFeatFeats',
        'feats.Shifter Defense', '=', '-2',
        /feats.((Beasthide|Cliffwalk|Longstride) Elite|Extra Shifter Trait|Great (Bite|Rend)|Greater Shifter Defense|Healing Factor|Improved Natural Attack|Shifter (Ferocity|Multiattack))/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Shifter Ferocity') {
      notes = [
        'combatNotes.shifterFerocityFeature:' +
          'Continue fighting below 0 HP while shifting',
        'validationNotes.shifterFerocityFeatAbility:Requires Wisdom >= 13',
        'validationNotes.shifterFerocityFeatRace:Requires Race == "Shifter"'
      ];
    } else if(feat == 'Shifter Multiattack') {
      notes = [
        'combatNotes.shifterMultiattackFeature:' +
          'Reduce additional natural attack penalty to -2',
        'validationNotes.shifterMultiattackFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.shifterMultiattackFeatFeatures:' +
          'Requires Longtooth||Razorclaw'
      ];
    } else if(feat == 'Silver Smite') {
      notes = [
        'combatNotes.silverSmiteFeature:+d6 Smite Evil',
        'validationNotes.silverSmiteFeatDeity:' +
          'Requires Deity =~ The Silver Flame',
        'validationNotes.silverSmiteFeatFeatures:Requires Smite Evil'
      ];
    } else if(feat == 'Song Of The Heart') {
      notes = [
        'featureNotes.songOfTheHeartFeature:+1 Bardic Music effects',
        'validationNotes.songOfTheHeartFeatFeatures:' +
          'Requires Bardic Music/Inspire Competence',
        'validationNotes.songOfTheHeartFeatSkills:Requires Sum Perform >= 6'
      ];
    } else if(feat == 'Soothe The Beast') {
      notes = [
        'skillNotes.sootheTheBeastFeature:Perform to change animal reaction',
        'validationNotes.sootheTheBeastFeatFeatures:Requires Bardic Music',
        'validationNotes.sootheTheBeastFeatSkills:Requires Sum Perform >= 6'
      ];
    } else if(feat == 'Spontaneous Casting') {
      notes = [
        'magicNotes.spontaneousCastingFeature:' +
          'Spend 2 AP to substitute any known spell for a prepared one',
        'validationNotes.spontaneousCastingFeatCasterLevel:' +
          'Requires Caster Level >= 5'
      ];
    } else if(feat == 'Strong Mind') {
      notes = [
        'saveNotes.strongMindFeature:+3 vs. psionics',
        'validationNotes.strongMindFeatAbility:Requires Wisdom >= 11'
      ];
    } else if(feat == 'Totem Companion') {
      notes = [
        'companionNotes.totemCompanionFeature:' +
          'Totem magical beast as animal companion',
        'validationNotes.totemCompanionFeatFeats:Requires Max Beast Totem >= 1',
        'validationNotes.totemCompanionFeatFeatures:Requires Wild Empathy'
      ];
    } else if(feat == 'Undead Empathy') {
      notes = [
        'skillNotes.undeadEmpathyFeature:' +
          '+4 Diplomacy to influence undead reaction',
        'validationNotes.undeadEmpathyFeatAbility:Requires Charisma >= 13'
      ];
    } else if(feat == 'Urban Tracking') {
      notes = [
        'skillNotes.urbanTrackingFeature:' +
          'Gather Information to trace person w/in communities'
      ];
    } else if(feat == 'Vermin Companion') {
      notes = [
        'companionNotes.verminCompanionFeature:' +
          'Vermin creature as animal companion',
        'validationNotes.verminCompanionFeatAlignment:' +
          'Requires Alignment !~ Good',
        'validationNotes.verminCompanionFeatFeats:Requires Child Of Winter',
        'validationNotes.verminCompanionFeatLevels:Requires Druid >= 3'
      ];
    } else if(feat == 'Vermin Shape') {
      notes = [
        'magicNotes.verminShapeFeature:Wild Shape into vermin',
        'validationNotes.verminShapeFeatAlignment:Requires Alignment !~ Good',
        'validationNotes.verminShapeFeatFeats:Requires Child Of Winter',
        'validationNotes.verminShapeFeatLevels:Requires Druid >= 5'
      ];
    } else if(feat == 'Wand Mastery') {
      notes = [
        'magicNotes.wandMasteryFeature:+2 spell DC/caster level w/wands',
        'validationNotes.wandMasteryFeatCasterLevel:Requires Caster Level >= 9',
        'validationNotes.wandMasteryFeatFeats:Requires Craft Wand'
      ];
    } else if(feat == 'Warden Initiate') {
      notes = [
        'combatNotes.wardenInitiateFeature:+2 AC in forests',
        'magicNotes.wardenInitiateFeature:Access to additional spells',
        'skillNotes.wardenInitiateFeature:Climb/Jump are class skills',
        'validationNotes.wardenInitiateFeatFeatures:' +
          'Requires Spontaneous Druid Spell'
      ];
      rules.defineRule
        ('classSkills.Climb', 'skillNotes.wardenInitiateFeature', '=', '1');
      rules.defineRule
        ('classSkills.Jump', 'skillNotes.wardenInitiateFeature', '=', '1');
     } else if(feat == 'Whirling Steel Strike') {
      notes = [
        'combatNotes.whirlingSteelStrikeFeature:Flurry Of Blows with Longsword',
        'sanityNotes.whirlingSteelStrikeFeatWeapons:Requires Longsword',
        'validationNotes.whirlingSteelStrikeFeatFeats:' +
          'Requires Weapon Focus (Longsword)',
        'validationNotes.whirlingSteelStrikeFeatFeatures:' +
          'Requires Flurry Of Blows'
      ];
    } else
      continue;
    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);
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
Eberron.houseRules = function(rules, houses) {
  rules.defineChoice('houses', houses);
  rules.defineRule('actionPoints', 'level', '=', '5 + Math.floor(source / 2)');
  rules.defineRule('actionDice', 'level', '=', '1 + Math.floor(source / 7)');
  rules.defineRule
    ('dragonmark', 'house', '=', 'Eberron.housesDragonmarks[source]');
  rules.defineChoice('random', 'house');
  rules.defineEditorElement
    ('house', 'House', 'select-one', 'houses', 'experience');
  for(var i = 0; i < houses.length; i++) {
    var dragonmark = Eberron.housesDragonmarks[houses[i]];
    rules.defineRule('isDragonmark.' + dragonmark,
      'dragonmark', '=', 'source == "' + dragonmark + '" ? 1 : null'
    );
  }
  rules.defineSheetElement('Heroics', 'Description');
  rules.defineSheetElement('House', 'Heroics/');
  rules.defineSheetElement('Dragonmark', 'Heroics/');
  rules.defineSheetElement('Action Points', 'Heroics/');
  rules.defineSheetElement('Action Dice', 'Heroics/');
};

/* Defines in #rules# the rules associated with language #name#. */
Eberron.languageRules = function(rules, name) {
  Eberron.baseRules.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to Eberron spells and domains. */
Eberron.magicRules = function(rules, classes, domains) {

  var schools = rules.getChoices('schools');

  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass == 'Artificer') {
      spells = [
        'I1:Energy Alteration:Enhancement Alteration:Identify:' +
        'Inflict Light Damage:Lesser Armor Enhancement:Light:Magic Stone:' +
        'Magic Vestment:Magic Weapon:Personal Weapon Augmentation:' +
        'Repair Light Damage:Resistance Item:Shield Of Faith:' +
        'Skill Enhancement:Spell Storing Item',
        "I2:Align Weapon:Armor Enhancement:Bear's Endurance:Bull's Strength:" +
        "Cat's Grace:Chill Metal:Eagle's Splendor:Fox's Cunning:Heat Metal:" +
        "Inflict Moderate Damage:Lesser Weapon Augmentation:Owl's Wisdom:" +
        'Repair Moderate Damage:Toughen Construct',
        'I3:Construct Energy Ward:Greater Armor Enhancement:' +
        'Greater Magic Weapon:Inflict Serious Damage:Metamagic Item:' +
        'Power Surge:Repair Serious Damage:Stone Construct:' +
        'Suppress Requirement',
        'I4:Greater Construct Energy Ward:Inflict Critical Damage:' +
        "Item Alteration:Iron Construct:Legion's Shield Of Faith:" +
        'Lesser Globe Of Invulnerability:Minor Creation:' +
        'Repair Critical Damage:Rusting Grasp:Weapon Augmentation',
        'I5:Disrupting Weapon:Fabricate:Major Creation:Wall Of Force:' +
        'Wall Of Stone',
        'I6:Blade Barrier:Disable Construct:Globe Of Invulnerability:' +
        'Greater Weapon Augmentation:Hardening:Move Earth:Total Repair:' +
        'Wall Of Iron'
      ];
    } else if(klass == 'Cleric') {
      spells = [
        'C9:Feast Of Champions'
      ];
    } else if(klass == 'Druid') {
      spells = [
        'D1:Detect Aberration',
        'D2:Zone Of Natural Purity',
        "D4:Nature's Wrath",
        'D7:Return To Nature'
      ];
    } else if(klass == 'Sorcerer' || klass == 'Wizard') {
      // Identical spell lists
      spells = [
        'W1:Magecraft:Repair Light Damage',
        'W2:Repair Moderate Damage',
        'W3:Repair Serious Damage',
        'W4:Repair Critical Damage',
        'W6:Hardening',
        'W8:Maddening Scream'
      ];
    } else
      continue;
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = Eberron.spellsSchools[spell];
          if(school == null) {
            school = SRD35.spellsSchools[spell];
          }
          if(school == null) {
            continue;
          }
          spell += '(' + pieces[0] + ' ' +
                    (school == 'Universal' ? 'Univ' : schools[school]) + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }
  }

  for(var i = 0; i < domains.length; i++) {
    var domain = domains[i];
    var notes;
    var spells;
    if(domain == 'Artifice') {
      notes = [
        'magicNotes.artificeDomain:+1 caster level for creation spells',
        'skillNotes.artificeDomain:+4 Craft'
      ];
      spells = [
        'Animate Rope', 'Wood Shape', 'Stone Shape', 'Minor Creation',
        'Fabricate', 'Major Creation', 'Hardening', 'True Creation',
        'Prismatic Sphere'
      ];
      rules.defineRule
        (/^skillModifier.Craft/, 'skillNotes.artificeDomain', '+', '4');
    } else if(domain == 'Charm') {
      notes = [
        'abilityNotes.charmDomain:+4 charisma for 1 minute 1/day'
      ];
      spells = [
        'Charm Person', 'Calm Emotions', 'Suggestion', 'Heroism',
        'Charm Monster', 'Geas/Quest', 'Insanity', 'Demand', 'Dominate Monster'
      ];
    } else if(domain == 'Commerce') {
      notes = [
        'skillNotes.commerceDomain:' +
          '+10 Profession (earn a living), Appraise is a class skill'
      ];
      spells = [
        'Comprehend Languages', 'Zone Of Truth', 'Tongues', 'Glibness',
        'True Seeing', 'Secret Chest', 'Refuge', 'Analyze Dweomer',
        'Polymorph Any Object'
      ];
      rules.defineRule('classSkills.Appraise', 'domains.Commerce', '=', '1');
    } else if(domain == 'Community') {
      notes = [
        'magicNotes.communityDomain:<i>Calm Emotions</i> 1/day',
        'skillNotes.communityDomain:+2 Diplomacy'
      ];
      spells = [
        'Bless', 'Status', 'Prayer', 'Greater Status', 'Telepathic Bond',
        "Heroes' Feast", 'Refuge', 'Sympathy', 'Mass Heal'
      ];
    } else if(domain == 'Deathless') {
      notes = [
        'combatNotes.deathlessDomain:' +
          'Command deathless instead of turn undead 1/day'
      ];
      spells = [
        'Detect Undead', 'Consecrate', 'Halt Deathless', 'Spirit Steed',
        'Hallow', 'Create Deathless', 'Create Greater Deathless',
        'Control Deathless', "Hero's Blade"
      ];
    } else if(domain == 'Decay') {
      notes = [
        'combatNotes.decayDomain:' +
          'Touch Of Decay d4 constitution (living)/2d6+%V hp (undead) 1/day'
      ];
      spells = [
        'Doom', 'Ray Of Enfeeblement', 'Contagion', 'Enervation', 'Blight',
        'Antilife Shell', 'Withering Palm', 'Horrid Wilting', 'Energy Drain'
      ];
      rules.defineRule('combatNotes.decayDomain', 'levels.Cleric', '=', null);
    } else if(domain == 'Dragon Below') {
      notes = [
        'featureNotes.dragonBelowDomain:Augment Summoning bonus feat'
      ];
      spells = [
        'Cause Fear', 'Death Knell', 'Bestow Curse', 'Lesser Planar Ally',
        'Slay Living', 'Planar Ally', 'Blasphemy', 'Greater Planar Ally',
        'Gate'
      ];
      rules.defineRule('features.Augment Summoning',
        'featureNotes.dragonBelowDomain', '=', '1'
      );
    } else if(domain == 'Exorcism') {
      notes = [
        'combatNotes.exorcismDomain:Turn Undead check to exorcise spirit'
      ];
      spells = [
        'Protection From Evil', 'Magic Circle Against Evil', 'Remove Curse',
        'Dismissal', 'Dispel Evil', 'Banishment', 'Holy Word', 'Holy Aura',
        'Freedom'
      ];
    } else if(domain == 'Feast') {
      notes = [
        'saveNotes.feastDomain:Immune to ingested poison/disease'
      ];
      spells = [
        'Goodberry', 'Delay Poison', 'Create Food And Water',
        'Neutralize Poison', 'Secure Shelter', "Heroes' Feast",
        "Mage's Magnificent Mansion", 'Detoxify', 'Feast Of Champions'
      ];
    } else if(domain == 'Life') {
      notes = [
        'magicNotes.lifeDomain:' +
          'Touch for d6+%V temporary hit points lasting %1 hours'
      ];
      rules.defineRule('magicNotes.lifeDomain', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.lifeDomain.1', 'levels.Cleric', '=', null);
    } else if(domain == 'Madness') {
      notes = [
        'featureNotes.madnessDomain:' +
           'Add %V to wisdom-based skill check or Will save 1/day',
        'saveNotes.madnessDomain:-1 Will',
        'skillNotes.madnessDomain:-1 wisdom-based skill checks'
      ]
      spells = [
        'Lesser Confusion', 'Touch Of Madness', 'Rage', 'Confusion',
        'Bolts Of Bedevilment', 'Phantasmal Killer', 'Insanity',
        'Maddening Scream', 'Weird'
      ];
      rules.defineRule
        ('featureNotes.madnessDomain', 'levels.Cleric', '=', null);
      rules.defineRule('saves.Will', 'saveNotes.madnessDomain', '+', '-1');
    } else if(domain == 'Meditation') {
      notes = [
        'magicNotes.meditationDomain:x1.5 chosen spell variable effects 1/day'
      ];
      spells = [
        'Comprehend Languages', "Owl's Wisdom", 'Locate Object', 'Tongues',
        'Spell Resistance', 'Find The Path', 'Spell Turning', 'Mind Blank',
        'Astral Projection'
      ];
    } else if(domain == 'Necromancer') {
      notes = [
        'magicNotes.necromancyDomain:+1 caster level necromancy spells'
      ];
      spells = [
        'Ray Of Enfeeblement', 'Command Undead', 'Vampiric Touch',
        'Enervation', 'Waves Of Fatigue', 'Eyebite', 'Control Undead',
        'Horrid Wilting', 'Energy Drain'
      ];
    } else if(domain == 'Passion') {
      notes = [
        'combatNotes.passionDomain:' +
          '+4 strength/constitution/+2 Will save/-2 AC for %V rounds 1/day'
      ];
      spells = [
        'Cause Fear', 'Hideous Laughter', 'Confusion', 'Crushing Despair',
        'Greater Command', 'Greater Heroism', 'Song Of Discord',
        'Irresistible Dance', 'Dominate Monster'
      ];
      rules.defineRule('combatNotes.passionDomain', 'levels.Cleric', '=', null);
    } else if(domain == 'Shadow') {
      notes = [
        'featureNotes.shadowDomain:Blind-Fight bonus feat'
      ];
      spells = [
        'Obscuring Mist', 'Darkness', 'Deeper Darkness', 'Shadow Conjuration',
        'Shadow Evocation', 'Shadow Walk', 'Greater Shadow Conjuration',
        'Greater Shadow Evocation', 'Shades'
      ];
      rules.defineRule
        ('features.Blind-Fight', 'featureNotes.shadowDomain', '=', '1');
    } else if(domain == 'Weather') {
      notes = [
        'featureNotes.weatherDomain:Vision unobstructed by weather',
        'skillNotes.weatherDomain:' +
          '+2 Survival (weather)/Survival is a class skill'
      ];
      spells = [
        'Obscuring Mist', 'Fog Cloud', 'Call Lightning', 'Sleet Storm',
        'Call Lightning Storm', 'Control Winds', 'Control Weather',
        'Whirlwind', 'Storm Of Vengeance'
      ];
      rules.defineRule
        ('classSkills.Survival', 'skillNotes.weatherDomain', '=', '1');
    } else
      continue;
    rules.defineChoice('domains', domain);
    if(notes != null) {
      rules.defineNote(notes);
    }
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var spell = spells[j];
        var school = Eberron.spellsSchools[spell];
        if(school == null && (school = SRD35.spellsSchools[spell]) == null) {
          continue;
        }
        spell += '(' + domain + (j + 1) + ' ' +
                  (school == 'Universal' ? 'Univ' : schools[school]) + ')';
        rules.defineChoice('spells', spell);
      }
    }
  }

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
Eberron.raceRulesExtra = function(rules, races) {

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, notes, selectableFeatures;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Changeling') {

      adjustment = null;
      features = [
        'Deceptive', 'Intuitive', 'Minor Shape Change', 'Natural Linguist',
        'Resist Charm', 'Resist Sleep'
      ];
      notes = [
        'magicNotes.minorShapeChange:<i>Shape Change</i> body at will',
        'saveNotes.resistCharmFeature:+2 vs. charm effects',
        'saveNotes.resistSleepFeature:+2 vs. sleep effects',
        'skillNotes.deceptiveFeature:+2 Bluff/Intimidate',
        'skillNotes.intuitiveFeature:+2 Sense Motive',
        'skillNotes.naturalLinguistFeature:Speak Language is a class skill'
      ];
      selectableFeatures = null;
      rules.defineRule('casterLevels.Changeling',
        'changelingFeatures.Minor Shape Change', '?', null,
        'level', '=', null
      );
      rules.defineRule
        ('casterLevels.Shape Change', 'casterLevels.Changeling', '^=', null);
      // Set casterLevels.W to a minimal value so that spell DC will be
      // calcuated even for non-Wizard Changelings.
      rules.defineRule('casterLevels.W', 'casterLevels.Changeling', '^=', '1');
      rules.defineRule('classSkills.Speak Language',
        'skillNotes.naturalLinguistFeature', '=', '1'
      );
      rules.defineRule
        ('resistance.Charm', 'saveNotes.resistCharmFeature', '+=', '2');
      rules.defineRule
        ('resistance.Sleep', 'saveNotes.resistSleepFeature', '+=', '2');

    } else if(race == 'Kalashtar') {

      adjustment = null;
      features = [
        'Dreamless', 'Humanlike', 'Influential', 'Mindlink', 'Natural Psionic',
        'Resist Mental', 'Resist Possession'
      ];
      notes = [
        'magicNotes.mindlinkFeature:<i>Mindlink</i> 1/day',
        'magicNotes.naturalPsionicFeature:+1 power point/level',
        'saveNotes.dreamlessFeature:Immune <i>Dream</i>, <i>Nightmare</i>',
        'saveNotes.resistMentalFeature:+2 vs. mind-altering effects',
        'saveNotes.resistPossessionFeature:+%V vs. possession',
        'skillNotes.humanlikeFeature:+2 Disguise (human)',
        'skillNotes.influentialFeature:+2 Bluff/Diplomacy/Intimidate'
      ];
      selectableFeatures = null;
      rules.defineRule('casterLevels.Kalashtar',
        'kalashtarFeatures.Kalashtar', '?', null,
        'level', '=', 'Math.max(Math.floor(source / 2), 1)'
      );
      rules.defineRule
        ('casterLevels.Mindlink', 'casterLevels.Kalashtar', '^=', null);
      // Set casterLevels.W to a minimal value so that spell DC will be
      // calcuated even for non-Wizard Kalashtars.
      rules.defineRule('casterLevels.W', 'casterLevels.Kalashtar', '^=', '1');
      rules.defineRule('resistance.Mind-Altering',
        'saveNotes.resistMentalFeature', '+=', '2'
      );
      rules.defineRule('resistance.Possession',
        'saveNotes.resistPossessionFeature', '+=', null
      );
      rules.defineRule('saveNotes.resistPossessionFeature',
        'kalashtarFeatures.Resist Possession', '+=', '2'
      );

    } else if(race == 'Shifter') {

      adjustment = '+2 dexterity/-2 intelligence/-2 charisma';
      features = ['Shifting'];
      notes = [
        'abilityNotes.beasthideFeature:+2 constitution while shifting',
        'abilityNotes.cliffwalkFeature:' +
          '+2 Dexterity, %V climb speed while shifting',
        'abilityNotes.longstrideFeature:+2 dexterity/+10 speed while shifting',
        'abilityNotes.longtoothFeature:+2 strength while shifting',
        'abilityNotes.razorclawFeature:+2 strength while shifting',
        'abilityNotes.wildhuntFeature:+2 constitution while shifting',
        'combatNotes.beasthideFeature:+2 AC while shifting',
        'combatNotes.longtoothFeature:d6+%V bite attack while shifting',
        'combatNotes.razorclawFeature:d4+%V claw attack while shifting',
        'featureNotes.shiftingFeature:Use Shifter trait for %V rounds %1/day',
        'featureNotes.wildhuntFeature:' +
          "Detect creatures' presence w/in 30', track by smell",
        'skillNotes.wildhuntFeature:+2 Survival'
      ];
      selectableFeatures = [
        'Beasthide', 'Longtooth', 'Cliffwalk', 'Razorclaw', 'Longstride',
        'Wildhunt'
      ];
      rules.defineRule('abilityNotes.cliffwalkFeature', '', '=', '20');
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

    SRD35.defineRace(rules, race, adjustment, features);
    if(notes != null) {
      rules.defineNote(notes);
    }
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        var choice = race + ' - ' + selectable;
        rules.defineChoice('selectableFeatures', choice + ':' + race);
        rules.defineRule(raceNoSpace + 'Features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
      }
    }

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
