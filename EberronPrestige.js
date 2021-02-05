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

/*jshint esversion: 6 */
"use strict";

/*
 * This module loads the prestige class rules from the Eberron 3E rule book.
 * Member methods can be called independently in order to use a subset of the
 * rules. Similarly, the constant fields of LastAgePrestige (CLASSES,
 * FEATURES) can be manipulated to modify the choices.
 */
function EberronPrestige() {
  if(window.SRD35 == null || window.Eberron == null) {
    alert
     ('The EberronPrestige module requires use of the SRD35 and Eberron modules');
    return;
  }
  EberronPrestige.identityRules(Eberron.rules, EberronPrestige.CLASSES);
  EberronPrestige.magicRules(Eberron.rules, EberronPrestige.SPELLS);
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
      '"CountSkillGe15 >= 2" ' +
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
      '"1:Inquisitive Spells",2:Contact,"4:Improved Contact" ' +
    'CasterLevelDivine="levels.Master Inquisitive" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'MI2:1=1,' +
      'MI4:3=1,' +
      'MI5:5=1',
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
      '"baseAttack >= 4","CountShifterFeats >= 1","race == \'Shifter\'",' +
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
      '"features.Wolf ? 3:Trip,"' +
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
EberronPrestige.FEATURES = {
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
  'Armor Spikes':'Section=combat Note="Grapple attack for %V damage"',
  'Caster Level Bonus':
    'Section=magic Note="+%V base class level for spells known/per day"',
  'Charge Bonus':'Section=combat Note="+%V attack when charging"',
  'Climb Speed':
    'Section=ability ' +
    'Note="20\' climb speed (+10 for Cliffwalker) while shifting"',
  'Construct Perfection':
    'Section=combat Note="Immune nonlethal damage and critical hits"',
  'Contact':'Section=feature Note="Level 3 associate or informant"',
  'Death Immunity':'Section=save Note="Immune to death and necromancy effects"',
  'Detect Thoughts':'Section=magic Note="<i>Detect Thoughts</i> at will"',
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
    'Note="R30\' Foes lt %V hit dice shaken for 5d6 rounds (DC %1 Will neg)"',
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
  'Improved Critical':'Section=feature Note="+1 Combat Feat"',
  'Inqisitive Spells':'Section=magic Note="1/dy, spend 2 AP for 2nd"',
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
    'Note="+2 Str while shifting",' +
         '"d4+%V claw attack (next size for Razorclaw) while shifting"',
  'Weretouched Fangs':
    'Section=ability,combat ' +
    'Note="+2 Dex while shifting",' +
         '"d6+%V fang attack (next size for Longtooth) while shifting"',
  'Weretouched Rage':
    'Section=combat Note="+2 Str, +2 Con, -2 AC for 1 rd after taking damage"',
  'Weretouched Tusks':
    'Section=ability,combat ' +
    'Note="+2 Con while shifting",' +
         '"d6+%V tusk attack (next size for Longtooth) while shifting"'
};
EberronPrestige.SPELLS = {
  'Discern Lies':'Level=MI4',
  'True Seeing':'Level=MI5',
  'Zone Of Truth':'Level=MI2'
};

/* Defines rules related to basic character identity. */
EberronPrestige.identityRules = function(rules, classes) {
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
    EberronPrestige.classRulesExtra(rules, clas);
  }
};

/* Defines rules related to magic use. */
EberronPrestige.magicRules = function(rules, spells) {
  QuilvynUtils.checkAttrTable(spells, ['School', 'Level', 'Description']);
  for(var s in spells) {
    rules.choiceRules(rules, 'Spell', s, Eberron.SPELLS[s] + ' ' + spells[s]);
  }
};

/* Defines rules related to character aptitudes. */
EberronPrestige.talentRules = function(rules, features) {
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
EberronPrestige.classRulesExtra = function(rules, name) {

  var prefix =
    name.substring(0,1).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(name == 'Dragonmark Heir') {

    var allSkills = rules.getChoices('skills');
    for(var skill in allSkills) {
      rules.defineRule
        ('CountSkillGe7', 'skills.' + skill, '+=', 'source >= 7 ? 1 : null');
    }
    rules.defineRule
      ('skillNotes.houseStatus', 'levels.Dragonmark Heir', '=', null);

  } else if(name == 'Eldeen Ranger') {

    rules.defineRule('combatNotes.favoredEnemy',
      'levels.Eldeed Ranger', '+=', 'source >= 4 ? 1 : null'
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
        ('CountSkillGe15', 'skills.' + skill, '+=', 'source >= 15 ? 1 : null');
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
    for(var feat in
      {'Alertness':'', 'Deceitful':'', 'Heroic Spirit':'',
       'Improved Initiative':'', 'Iron Will':'', 'Negotiator':'',
       'Persuasive':'', 'Recognize Imposter':'', 'Research':'', 'Toughness':'',
       'Track':'', 'Urban Tracking':''}
    ) {
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
    for(var feat in allFeats) {
      if(allFeats[feat].indexOf('Shifter') >= 0)
        rules.defineRule('CountShifterFeats', 'feats.' + feat, '+=', '1');
    }
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

  }

};
