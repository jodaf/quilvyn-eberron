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

var EBERRON_VERSION = '1.6.1.0';

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

  // Define a new rule set w/the same editor and standard viewer as SRD35
  var rules = new QuilvynRules('Eberron', EBERRON_VERSION);
  rules.editorElements = SRD35.initialEditorElements();
  SRD35.createViewers(rules, SRD35.VIEWERS);
  // Pick up the SRD35 rules, w/minor mods for deities and weapons
  SRD35.abilityRules(rules);
  SRD35.raceRules(rules, SRD35.LANGUAGES, SRD35.RACES);
  SRD35.classRules(rules, SRD35.CLASSES);
  SRD35.companionRules(rules, SRD35.COMPANIONS);
  SRD35.skillRules(rules, SRD35.SKILLS, SRD35.SUBSKILLS, SRD35.SYNERGIES);
  SRD35.featRules(rules, SRD35.FEATS, SRD35.SUBFEATS);
  SRD35.descriptionRules
    (rules, SRD35.ALIGNMENTS, Eberron.DEITIES, SRD35.GENDERS);
  SRD35.equipmentRules(rules, SRD35.ARMORS, SRD35.SHIELDS,
                       SRD35.WEAPONS.concat(Eberron.WEAPONS));
  SRD35.combatRules(rules);
  SRD35.movementRules(rules);
  SRD35.magicRules(rules, SRD35.CLASSES, SRD35.DOMAINS, SRD35.SCHOOLS);
  // Pick up the NPC/Prestige rules, if available
  if(window.SRD35NPC != null) {
    SRD35NPC.classRules(rules, SRD35NPC.CLASSES);
  }
  if(window.SRD35Prestige != null) {
    SRD35Prestige.classRules(rules, SRD35Prestige.CLASSES);
    SRD35Prestige.companionRules(rules, SRD35Prestige.COMPANIONS);
  }
  // Add Eberron-specific rules
  Eberron.raceRules(rules, Eberron.RACES);
  Eberron.classRules(rules, Eberron.CLASSES);
  Eberron.featRules(rules, Eberron.FEATS, Eberron.SUBFEATS);
  Eberron.heroicRules(rules, Eberron.HOUSES);
  Eberron.magicRules
    (rules, SRD35.CLASSES.concat(Eberron.CLASSES), Eberron.DOMAINS);
  SRD35.spellRules
    (rules, null, Object.assign({}, SRD35.spellsDescriptions, Eberron.spellsDescriptions));
  // So far, same character creation procedures as SRD35
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', SRD35.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = SRD35.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = Eberron.ruleNotes;
  // Let Quilvyn know we're here
  Quilvyn.addRuleSet(rules);
  Eberron.rules = rules;

}

// Arrays of choices
Eberron.CLASSES = ['Artificer'];
Eberron.DEITIES = [
  'The Silver Flame (LG):Longbow:Exorcism/Good/Law/Protection',
  'Arawai (NG):Morningstar:Good/Life/Plant/Weather',
  'Aureon (LN):Quarterstaff:Knowledge/Law/Magic',
  'Balinor (N):Battleaxe:Air/Animal/Earth',
  'Boldrei (LG):Spear:Community/Good/Law/Protection',
  'Dol Arrah (LG):Halberd:Good/Law/Sun/War',
  'Dol Dorn (CG):Longsword:Chaos/Good/Strength/War',
  'Kol Korran (N):Heavy Mace/Light Mace:Charm/Commerce/Travel',
  'Olladra (NG):Sickle:Feast/Good/Healing/Luck',
  'Onatar (NG):Warhammer:Artifice/Fire/Good',
  'The Devourer (NE):Trident:Destruction/Evil/Water/Weather',
  'The Fury (NE):Rapier:Evil/Madness/Passion',
  'The Keeper (NE):Scythe:Death/Decay/Evil',
  'The Mockery (NE):Kama:Destruction/Evil/Trickery/War',
  'The Shadow (CE):Quarterstaff:Chaos/Evil/Magic/Shadow',
  'The Traveler (CN):Scimitar:Artifice/Chaos/Travel/Trickery',
  'The Blood Of Vol (LE):Dagger:Death/Evil/Law/Necromancer',
  'The Cults Of The Dragon Below (LN):Heavy Pick:Dragon Below/Earth/Evil/Madness',
  'The Path Of Light (LN):Unarmed:Law/Meditation/Protection',
  'The Undying Court (NG):Scimitar:Deathless/Good/Protection',
  'None:'
];
Eberron.DOMAINS = [
  'Artifice', 'Charm', 'Commerce', 'Community', 'Deathless', 'Decay',
  'Dragon Below', 'Exorcism', 'Feast', 'Life', 'Madness', 'Meditation',
  'Necromancer', 'Passion', 'Shadow', 'Weather'
];
// NOTE: Craft Construct from MM, needed for Artificer class
Eberron.FEATS = [
  'Aberrant Dragonmark:', 'Action Boost:', 'Action Surge:',
  'Adamantine Body:Warforged', 'Ashbound:', 'Attune Magic Weapon:Item Creation',
  'Beast Shape:', 'Beast Totem:', 'Beasthide Elite:Shifter',
  'Bind Elemental:Item Creation', 'Child Of Winter:', 'Cliffwalk Elite:Shifter',
  'Craft Construct:Item Creation', 'Double Steel Strike:', 'Dragon Rage:',
  'Dragon Totem:', 'Ecclesiarch:', 'Education:',
  'Exceptional Artisan:Item Creation', 'Extend Rage:', 'Extra Music:',
  'Extra Rings:Item Creation', 'Extra Shifter Trait:Shifter',
  'Extraordinary Artisan:Item Creation', 'Favored In House:',
  'Flensing Strike:', 'Gatekeeper Initiate:', 'Great Bite:Shifter',
  'Great Rend:Shifter', 'Greater Dragonmark:', 'Greater Powerful Charge:',
  'Greater Shifter Defense:Shifter', 'Greensinger Initiate:',
  'Haunting Melody:', 'Healing Factor:Shifter', 'Heroic Spirit:',
  'Improved Damage Reduction:Warforged', 'Improved Fortification:Warforged',
  'Improved Natural Attack:', 'Investigate:', 'Knight Training:',
  'Least Dragonmark:', 'Legendary Artisan:Item Creation', 'Lesser Dragonmark:',
  'Longstride Elite:Shifter', 'Mithral Body:Warforged',
  'Mithral Fluidity:Warforged', 'Monastic Training:', 'Music Of Growth:',
  'Music Of Making:', 'Powerful Charge:', 'Precise Swing:', 'Pursue:',
  'Raging Luck:', 'Recognize Impostor:', 'Repel Aberration:', 'Research:',
  'Right Of Counsel:', 'Serpent Strike:', 'Shifter Defense:Shifter',
  'Shifter Ferocity:Shifter', 'Shifter Multiattack:Shifter', 'Silver Smite:',
  'Song Of The Heart:', 'Soothe The Beast:', 'Spontaneous Casting:',
  'Strong Mind:', 'Totem Companion:', 'Undead Empathy:', 'Urban Tracking:',
  'Vermin Companion:', 'Vermin Shape:', 'Wand Mastery:', 'Warden Initiate:',
  'Whirling Steel Strike:'
];
Eberron.HOUSES = [
  'Cannith', 'Deneith', 'Ghallanda', 'Jorasco', 'Kundarak', 'Lyrandar',
  'Medani', 'None', 'Orien', 'Phiarlan', 'Sivis', 'Tharashk', 'Thuranni',
  'Vadalis'
];
Eberron.RACES = [
  'Changeling', 'Kalashtar', 'Shifter', 'Warforged'
];
Eberron.SUBFEATS = {
  'Aberrant Dragonmark':'Burning Hands',
  'Beast Totem':'Chimera',
  'Dragon Totem':'Black Dragon',
  'Knight Training':'',
  'Monastic Training':''
};
Eberron.WEAPONS = [
  'Talenta Boomerang:d4r30 Ex', 'Talenta Sharrash:d10x4@19 2h Ex',
  'Talenta Tangat:d10x2@18 2h Ex', 'Valenar Double Scimitar:d6/d6x2@18 2h Ex',
  'Xen\'drik Boomerang:d6r20 Ex'
];

// Related information used internally by Eberron
Eberron.artificerCraftReserves = [
  0, 20, 40, 60, 80, 100, 150, 200, 250, 300, 400, 500, 700, 900, 1200, 1500,
  2000, 2500, 3000, 4000, 5000
];
Eberron.dragonmarksSpells = {
  'Detection': [
    '<i>Detect Magic</i> (x2)|<i>Detect Poison</i> (x2)',
    '<i>Detect Scrying</i>|<i>See Invisible</i>',
    '<i>True Seeing</i>',
    '<i>Moment Of Prescience</i>'
  ],
  'Finding': [
    '<i>Identify</i>|<i>Know Direction</i> (x2)|<i>Locate Object</i>',
    '<i>Helping Hand</i>|<i>Locate Creature</i>',
    '<i>Find The Path</i>',
    '<i>Discern Location</i>'
  ],
  'Handling': [
    '<i>Calm Animals</i>|<i>Charm Animals</i>|<i>Speak With Animals</i>',
    '<i>Dominate Animal</i>|<i>Greater Magic Fang</i>',
    '<i>Animal Growth</i>|<i>Summon Nature\'s Ally V</i>',
    '<i>Awaken</i>|<i>Summon Nature\'s Ally</i>'
  ],
  'Healing': [
    '<i>Cure Light Wounds</i>|<i>Lesser Restoration</i>',
    '<i>Cure Serious Wounds</i>|<i>Neutralize Poison</i>|' +
      '<i>Remove Disease</i>|<i>Restoration</i>',
    '<i>Heal</i>',
    '<i>Mass Heal</i>'
  ],
  'Hospitality': [
    '<i>Prestidigitation</i> (x2)|<i>Purify Food And Drink</i> (x2)|' +
      '<i>Unseen Servant</i>',
    '<i>Create Food And Water</i>|<i>Leomund\'s Secure Shelter</i>',
    '<i>Heroes\' Feast</i>|<i>Mordenkainen\'s Magnificent Mansion</i>',
    '<i>Refuge</i>'
  ],
  'Making': [
    '<i>Make Whole</i>|<i>Mending</i> (x2)|<i>Repair Light Damage</i>',
    '<i>Minor Creation</i>|<i>Repair Serious Damage</i>',
    '<i>Fabricate</i>|<i>Major Creation</i>',
    '<i>True Creation</i>'
  ],
  'Passage': [
    '<i>Dimension Leap</i>|<i>Expeditious Retreat</i>|<i>Mount</i>',
    '<i>Dimension Door</i>|<i>Phantom Steed</i>',
    '<i>Overland Flight</i>|<i>Teleport</i>',
    '<i>Greater Teleport</i>'
  ],
  'Scribing': [
    '<i>Arcane Mark</i> (x2)|<i>Comprehend Languages</i>|' +
      '<i>Whispering Wind</i>',
    '<i>Illusory Script</i>|<i>Secret Page</i>|<i>Tongues</i>',
    '<i>Sending</i>',
    '<i>Symbol Of Death</i>'
  ],
  'Sentinel': [
    '<i>Mage Armor</i>|<i>Protection From Arrows</i>|<i>Shield Of Faith</i>|' +
      '<i>Shield Other</i>',
    '<i>Lesser Globe Of Invulnerability</i>|<i>Protection From Energy</i>',
    '<i>Globe Of Invulnerability</i>',
    '<i>Mind Blank</i>'
  ],
  'Shadow': [
    '<i>Darkness</i>|<i>Disguise Self</i>|<i>Minor Image</i>',
    '<i>Clairaudience/Clairvoyance</i>|<i>Scrying</i>|' +
      '<i>Shadow Conjuration</i>',
    '<i>Mislead</i>|<i>Prying Eyes</i>|<i>Shadow Walk</i>',
    '<i>Greater Prying Eyes</i>'
  ],
  'Storm': [
    '<i>Endure Elements</i>|<i>Fog Cloud</i>|<i>Gust Of Wind</i>',
    '<i>Sleet Storm</i>|<i>Wind Wall</i>|<i>Wind\'s Favor</i>',
    '<i>Control Weather</i>|<i>Control Winds</i>',
    '<i>Storm Of Vengeance</i>'
  ],
  'Warding': [
    '<i>Alarm</i>|<i>Arcane Lock</i>|<i>Misdirection</i>',
    '<i>Explosive Runes</i>|<i>Glyph Of Warding</i>|<i>Nondetection</i>',
    '<i>Greater Glyph Of Warding</i>|<i>Guards And Wards</i>|' +
      '<i>Mordenkainen\'s Faithful Hound</i>',
    '<i>Prismatic Wall</i>'
  ]
};
Eberron.housesDragonmarks = {
  'Cannith':'Making', 'Deneith':'Sentinel', 'Ghallanda':'Hospitality',
  'Jorasco':'Healing', 'Kundarak':'Warding', 'Lyrandar':'Storm',
  'Medani':'Detection', 'Orien':'Passage', 'Phiarlan':'Shadow',
  'Sivis':'Scribing', 'Tharashk':'Finding', 'Thuranni':'Shadow',
  'Vadalis':'Handling'
};
Eberron.spellsDescriptions = {
  'Armor Enhancement':'Touched armor/shield +3/35K GP enhancement for $L10 min',
  'Bolts Of Bedevilment':"R$RM' 3 targets (1/rd) stunned (Will neg) for $L2 rd",
  "Construct Energy Ward": "Touched construct DR ${lvl>10?30:lvl>6?20:10} from specified energy for $L10 min",
  'Control Deathless':"R$RS' Command $L2 HD deathless in 30' area for $L min",
  'Create Deathless':"R$RS' Create deathless soldier",
  'Create Greater Deathless':"R$RS' Create undying councilor",
  "Detect Aberration": "R60' cone info on aberrations for conc/$L min",
  'Detoxify':"Neutralize venom w/in 30' for $L10 min",
  'Disable Construct':'Touched construct $L10 HP (Will half)',
  'Energy Alteration':'Touched affects different energy type for $L10 min',
  'Enhancement Alteration':'Touched shield/weapon enhancement applies to bash/defense for $L10 min',
  'Feast Of Champions':'Hour-long feast cures conditions, 2d8+$L HP',
  'Greater Armor Enhancement':'Touched armor/shield +5/100K GP enhancement for $L10 min',
  "Greater Construct Energy Ward": "Touched construct ignores up to ${Math.min(lvl*12,120)} HP from specified energy for $L10 min",
  "Greater Status": "Monitor condition/position of, cast L0-2 touch spell on $Ldiv3 touched allies for $L hr",
  'Greater Weapon Augmentation':'',
  'Weapon Augmentation':'Touched weapon +5/200K GP enhancement for $L10 min',
  'Halt Deathless':"R$RM' 3 deathless in 30' area immobilized (Will neg) for $L rd",
  'Hardening':'Touched $L10 cubic ft item resists damage',
  'Hero\'s Blade':'Touched blade good-aligned, dbl crit threat, +2d6 HP to evil (+2d8 outsider/undead), blind and deafen evil 1d4 rd on crit (Will neg) for $L min',
  'Inflict Critical Damage':'Touched construct 4d8+$Lmin20 HP',
  'Inflict Light Damage':'Touched construct 1d8+$Lmin5 HP',
  'Inflict Moderate Damage':'Touched construct 2d8+$Lmin10 HP',
  'Inflict Serious Damage':'Touched construct 3d8+$Lmin15 HP',
  'Iron Construct':'Touched construct DR 15/adamantine, half acid/fire damage, +4 Str, -4 Dex, x5 weigh for $L min',
  'Item Alteration':'Touched item grants bonus differently for $L10 min',
  "Legion\'s Shield Of Faith": "R$RM' Allies in 20' area +${Math.min(2+Math.floor(lvl/6),5)} AC for $L min",
  'Lesser Armor Enhancement':'Touched armor/shield +1/5K GP enhancement for $L10 min',
  'Lesser Weapon Augmentation':'Touched weapon +1/10K GP enhancement for $L10 min',
  'Maddening Scream':'Touched acts madly for 1d4+1 rd',
  'Magecraft':'Self +5 same day Craft check',
  'Metamagic Item':'Imbue touched magic item w/metamagic property for $L rd',
  'Nature\'s Wrath':"R$RM' 20' radius aberrations $L{min10}d6 HP and dazed 1 rd, other unnatural ${Math.min(Math.floor(lvl/2),5)}d8 HP (Will half)",
  'Personal Weapon Augmentation':'Touched self weapon +1/10K GP enhancement for $L10 min',
  'Power Surge':'Touched gains ${Math.floor(lvl/5)} charges for $L min',
  "Repair Critical Damage": "Touched construct repair 4d8+$Lmin20",
  "Repair Light Damage": "Touched construct repair 1d8+$Lmin5",
  "Repair Moderate Damage": "Touched construct repair 2d8+$Lmin10",
  "Repair Serious Damage": "Touched construct repair 3d8+$Lmin15",
  'Resistance Item':'Touched grants +${1+Math.floor(lvl/4)} saves for $L10 min',
  'Return To Nature':"R$RS' Target reduce Int, magic",
  'Skill Enhancement':'Touched grants +${2+Math.floor(lvl/2)} specified skill checks for $L10 min',
  'Spell Storing Item':'Imbue touched item with spell up to ${Math.min(Math.floor(lvl/2),4)} level',
  'Spirit Steed':'Touched animal speed +30/x6, no hustle damage for L$ hr',
  'Stone Construct':'Touched construct DR 10/adamantine for ${Math.min(lvl*10,150)} HP',
  'Suppress Requirement':'Remove usage requirement from touched magic item for $L10 min',
  'Total Repair':'Touched construct conditions removed, ${Math.min(lvl*10,150)} HP repaired',
  'Touch Of Madness':'Touched dazed for $L2 rd',
  'Toughen Construct':'Touched construct +${Math.min(2+Math.floor((lvl-3)/3),5)} AC',
  "True Creation": "Create permanent $L' cu plant/mineral object",
  'Weapon Augmentation':'Touched weapon +3/70K GP enhancement for $L10 min',
  'Withering Palm':'Touched loses $Ldiv2 Str and Con (Fort neg)',
  'Zone Of Natural Purity':"R$RS' fey/plants in 20' radius +1 attack/damage/save, abberations -1, for $L2 hr"
};
Eberron.spellsSchools = {
  'Armor Enhancement':'Transmutation',
  'Bolts Of Bedevilment':'Enchantment',
  'Construct Energy Ward':'Abjuration',
  'Control Deathless':'Necromancy',
  'Create Deathless':'Necromancy',
  'Create Greater Deathless':'Necromancy',
  'Detect Aberration':'Divination',
  'Detoxify':'Conjuration',
  'Disable Construct':'Transmutation',
  'Energy Alteration':'Transmutation',
  'Enhancement Alteration':'Transmutation',
  'Feast Of Champions':'Conjuration',
  'Greater Armor Enhancement':'Transmutation',
  'Greater Construct Energy Ward':'Abjuration',
  'Greater Status':'Divination',
  'Greater Weapon Augmentation':'Transmutation',
  'Halt Deathless':'Necromancy',
  'Hardening':'Transmutation',
  'Hero\'s Blade':'Necromancy',
  'Inflict Critical Damage':'Transmutation',
  'Inflict Light Damage':'Transmutation',
  'Inflict Moderate Damage':'Transmutation',
  'Inflict Serious Damage':'Transmutation',
  'Iron Construct':'Transmutation',
  'Item Alteration':'Transmutation',
  'Legion\'s Shield Of Faith':'Abjuration',
  'Lesser Armor Enhancement':'Transmutation',
  'Lesser Weapon Augmentation':'Transmutation',
  'Maddening Scream':'Enchantment',
  'Magecraft':'Divination',
  'Metamagic Item':'Transmutation',
  'Nature\'s Wrath':'Evocation',
  'Personal Weapon Augmentation':'Transmutation',
  'Power Surge':'Transmutation',
  'Repair Critical Damage':'Transmutation',
  'Repair Light Damage':'Transmutation',
  'Repair Moderate Damage':'Transmutation',
  'Repair Serious Damage':'Transmutation',
  'Resistance Item':'Abjuration',
  'Return To Nature':'Transmutation',
  'Skill Enhancement':'Transmutation',
  'Spell Storing Item':'Transmutation',
  'Spirit Steed':'Necromancy',
  'Stone Construct':'Transmutation',
  'Suppress Requirement':'Transmutation',
  'Total Repair':'Transmutation',
  'Touch Of Madness':'Enchantment',
  'Toughen Construct':'Transmutation',
  'True Creation':'Conjuration',
  'Weapon Augmentation':'Transmutation',
  'Withering Palm':'Necromancy',
  'Zone Of Natural Purity':'Evocation'
};
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

/* Defines the rules related to Eberron character classes. */
Eberron.classRules = function(rules, classes) {

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

/* Defines the rules related to Eberron character feats. */
Eberron.featRules = function(rules, feats, subfeats) {

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
      var dragonmark = matchInfo[1];
      var note = 'magicNotes.aberrantDragonmark(' + dragonmark + ')Feature';
      notes = [
        note + ':DC %V <i>' + dragonmark + '</i> as level %1 caster 1/day',
        'validationNotes.aberrantDragonmark(' + dragonmark + ')FeatFeats:' +
          'Requires no Dragonmark feats',
        'validationNotes.aberrantDragonmark(' + dragonmark + ')FeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human'
      ];
      rules.defineRule(note, 'charismaModifier', '=', '11 + source');
      rules.defineRule(note + '.1', 'level', '=', 'Math.floor(source / 2)');
      rules.defineRule(
        'validationNotes.aberrantDragonmark(' + dragonmark + ')FeatFeats',
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
          'Double <i>Summon Nature\'s Ally</i> duration; summoned creatures ' +
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
        'magicNotes.greaterDragonmarkFeature:' +
          'DC %V+spell level choice of %1 daily at caster level 10/' +
          'least/lesser dragonmark ability +1/day',
        'validationNotes.greaterDragonmarkFeatFeats:' +
          'Requires Least Dragonmark/Lesser Dragonmark',
        'validationNotes.greaterDragonmarkFeatHouse:Requires House != "None"',
        'validationNotes.greaterDragonmarkFeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human',
        'validationNotes.greaterDragonmarkFeatSkills:Requires any 2 >= 12'
      ];
      rules.defineRule('magicNotes.greaterDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('magicNotes.greaterDragonmarkFeature.1',
        'dragonmark', '=',
        'Eberron.dragonmarksSpells[source] == null ? "spells" : ' +
        'Eberron.dragonmarksSpells[source][2]'
      );
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
          'Foe DC %V Will save or afraid for %1 rounds',
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
        'magicNotes.leastDragonmarkFeature:' +
          'DC %V+spell level choice of %1 daily at caster level 1',
        'validationNotes.leastDragonmarkFeatHouse:Requires House != "None"',
        'validationNotes.leastDragonmarkFeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human'
      ];
      rules.defineRule('magicNotes.leastDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('magicNotes.leastDragonmarkFeature.1',
        'dragonmark', '=',
        'Eberron.dragonmarksSpells[source] == null ? "spells" : ' +
        'Eberron.dragonmarksSpells[source][0]'
      );
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
        'magicNotes.lesserDragonmarkFeature:' +
          'DC %V+spell level choice of %1 daily at caster level 6/' +
          'least dragonmark ability +1/day',
        'validationNotes.lesserDragonmarkFeatHouse:Requires House != "None"',
        'validationNotes.lesserDragonmarkFeatFeats:Requires Least Dragonmark',
        'validationNotes.lesserDragonmarkFeatRace:' +
          'Requires Race =~ Dwarf|Elf|Gnome|Halfling|Half Orc|Human',
        'validationNotes.lesserDragonmarkFeatSkills:Requires any 2 >= 9'
      ];
      rules.defineRule('magicNotes.lesserDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('magicNotes.lesserDragonmarkFeature.1',
        'dragonmark', '=',
        'Eberron.dragonmarksSpells[source] == null ? "spells" : ' +
        'Eberron.dragonmarksSpells[source][1]'
      );
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
          '+4 strength/constitution to animal/plant creatures w/in 30 ft ' +
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

/* Defines rules related to Eberron heroic characteristics. */
Eberron.heroicRules = function(rules, houses) {
  rules.defineChoice('houses', houses);
  rules.defineRule('actionPoints', 'level', '=', '5 + Math.floor(source / 2)');
  rules.defineRule('actionDice', 'level', '=', '1 + Math.floor(source / 7)');
  rules.defineRule
    ('dragonmark', 'house', '=', 'Eberron.housesDragonmarks[source]');
  rules.defineChoice('random', 'house');
  rules.defineEditorElement
    ('house', 'House', 'select-one', 'houses', 'experience');
  rules.defineSheetElement('Heroics', 'Description');
  rules.defineSheetElement('House', 'Heroics/');
  rules.defineSheetElement('Dragonmark', 'Heroics/');
  rules.defineSheetElement('Action Points', 'Heroics/');
  rules.defineSheetElement('Action Dice', 'Heroics/');
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
        'I2:Align Weapon:Armor Enhancement:Bear\'s Endurance:' +
        'Bull\'s Strength:Cat\'s Grace:Chill Metal:Eagle\'s Splendor:' +
        'Fox\'s Cunning:Heat Metal:Inflict Moderate Damage:' +
        'Lesser Weapon Augmentation:Owl\'s Wisdom:Repair Moderate Damage:' +
        'Toughen Construct',
        'I3:Construct Energy Ward:Greater Armor Enhancement:' +
        'Greater Magic Weapon:Inflict Serious Damage:Metamagic Item:' +
        'Power Surge:Repair Serious Damage:Stone Construct:' +
        'Suppress Requirement',
        'I4:Greater Construct Energy Ward:Inflict Critical Damage:' +
        'Item Alteration:Iron Construct:Legion\'s Shield Of Faith:' +
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
        'D4:Nature\'s Wrath',
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
        'True Seeing', 'Leomund\'s Secret Chest', 'Refuge', 'Analyze Dweomer',
        'Polymorph Any Object'
      ];
      rules.defineRule('classSkills.Appraise', 'domains.Commerce', '=', '1');
    } else if(domain == 'Community') {
      notes = [
        'magicNotes.communityDomain:<i>Calm Emotions</i> 1/day',
        'skillNotes.communityDomain:+2 Diplomacy'
      ];
      spells = [
        'Bless', 'Status', 'Prayer', 'Greater Status',
        'Rary\'s Telepathic Bond', 'Heroes\' Feast', 'Refuge', 'Sympathy',
        'Mass Heal'
      ];
    } else if(domain == 'Deathless') {
      notes = [
        'combatNotes.deathlessDomain:' +
          'Command deathless instead of turn undead 1/day'
      ];
      spells = [
        'Detect Undead', 'Consecrate', 'Halt Deathless', 'Spirit Steed',
        'Hallow', 'Create Deathless', 'Create Deathless', 'Control Deathless',
        'Hero\'s Blade'
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
        'Neutralize Poison', 'Leomund\'s Secure Shelter', 'Heroes\' Feast',
        'Mordenkainen\'s Magnificent Mansion', 'Detoxify',
        'Feast Of Champions'
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
        'Comprehend Languages', 'Owl\'s Wisdom', 'Locate Object', 'Tongues',
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
        'Cause Fear', 'Tasha\'s Hideous Laughter', 'Confusion',
        'Crushing Despair', 'Greater Command', 'Greater Heroism',
        'Song Of Discord', 'Otto\'s Irresistible Dance', 'Dominate Monster'
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

/* Defines the rules related to Eberron character races. */
Eberron.raceRules = function(rules, races) {

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, notes, selectableFeatures;
    var race = races[i];

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
        'magicNotes.mindlinkFeature:<i>Mindlink</i> as level %V wilder 1/day',
        'magicNotes.naturalPsionicFeature:+1 power point/level',
        'saveNotes.dreamlessFeature:Immune <i>Dream</i>, <i>Nightmare</i>',
        'saveNotes.resistMentalFeature:+2 vs. mind-altering effects',
        'saveNotes.resistPossessionFeature:+%V vs. possession',
        'skillNotes.humanlikeFeature:+2 Disguise (human)',
        'skillNotes.influentialFeature:+2 Bluff/Diplomacy/Intimidate'
      ];
      selectableFeatures = null;
      rules.defineRule('magicNotes.mindlinkFeature',
        'level', 'source < 2 ? 1 : Math.floor(source / 2)'
      );
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
          'Detect creatures\' presence w/in 30 ft/track by smell',
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
        rules.defineRule(race + 'Features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
      }
    }

  }

};

Eberron.ruleNotes = function() {
  return '' +
    '<h2>Eberron Quilvyn Module Notes</h2>\n' +
    'Eberron Quilvyn Module Version ' + EBERRON_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    'None, currently\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    'None, currently\n' +
    '</p>\n';
}
