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
 * function contains methods that load rules for particular parts/chapters
 * of the rule book; raceRules for character races, magicRules for spells, etc.
 * These member methods can be called independently in order to use a subset of
 * the Eberron rules.  Similarly, the constant fields of Eberron (DOMAINS,
 * FEATS, etc.) can be manipulated to modify the choices.
 */
function Eberron() {

  // Define a new rule set w/the same editor and standard viewer as PH35
  var rules = new ScribeRules('Eberron');
  rules.editorElements = PH35.initialEditorElements();
  Eberron.viewer = new ObjectViewer();
  PH35.createViewer(Eberron.viewer);
  rules.defineViewer("Standard", Eberron.viewer);
  // Pick up the PH35 rules, w/minor mods for deities and weapons
  PH35.abilityRules(rules);
  PH35.raceRules(rules, PH35.LANGUAGES, PH35.RACES);
  PH35.classRules(rules, PH35.CLASSES);
  PH35.companionRules(rules, PH35.COMPANIONS);
  PH35.skillRules(rules, PH35.SKILLS, PH35.SUBSKILLS);
  PH35.featRules(rules, PH35.FEATS, PH35.SUBFEATS);
  PH35.descriptionRules(rules, PH35.ALIGNMENTS, Eberron.DEITIES, PH35.GENDERS);
  PH35.equipmentRules(rules, PH35.ARMORS, PH35.GOODIES, PH35.SHIELDS,
                      PH35.WEAPONS.concat(Eberron.WEAPONS));
  PH35.combatRules(rules);
  PH35.adventuringRules(rules);
  PH35.magicRules(rules, PH35.CLASSES, PH35.DOMAINS, PH35.SCHOOLS);
  // Pick up the DMG rules, if available
  if(window.DMG35 != null) {
    DMG35.npcClassRules(rules, DMG35.NPC_CLASSES);
    DMG35.prestigeClassRules(rules, DMG35.PRESTIGE_CLASSES);
    DMG35.companionRules(rules, DMG35.COMPANIONS);
  }
  // So far, same creation procedures as PH35
  rules.defineChoice('preset', 'race', 'levels');
  rules.defineChoice('random', PH35.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = PH35.randomizeOneAttribute;
  rules.makeValid = PH35.makeValid;
  // Add Eberron-specific rules
  Eberron.classRules(rules, Eberron.CLASSES);
  Eberron.featRules(rules, Eberron.FEATS, Eberron.SUBFEATS);
  Eberron.magicRules
    (rules, PH35.CLASSES.concat(Eberron.CLASSES), Eberron.DOMAINS);
  Eberron.prestigeClassRules(rules, Eberron.PRESTIGE_CLASSES);
  Eberron.raceRules(rules, Eberron.RACES);
  // Let Scribe know we're here
  Scribe.addRuleSet(rules);
  Eberron.rules = rules;

}

// Arrays of choices
Eberron.CLASSES = ['Artificer'];
Eberron.DEITIES = [
  'The Silver Flame (LG):Exorcism/Good/Law/Protection',
  'The Sovereign Host (NG):Air/Animal/Artifice/Chaos/Charm/Commerce/' +
    'Community/Earth/Feast/Fire/Good/Healing/Knowledge/Law/Life/Luck/Magic/' +
    'Plant/Protection/Strength/Sun/Travel/War/Weather',
  'Arawai (NG):Good/Life/Plant/Weather',
  'Aureon (LN):Knowledge/Law/Magic',
  'Balinor (N):Air/Animal/Earth',
  'Boldrei (LG):Community/Good/Law/Protection',
  'Dol Arrah (LG):Good/Law/Sun/War',
  'Dol Dorn (CG):Chaos/Good/Strength/War',
  'Kol Korran (N):Charm/Commerce/Travel',
  'Olladra (NG):Feast/Good/Healing/Luck',
  'Onatar (NG):Artifice/Fire/Good',
  'The Dark Six (NE):Artifice/Chaos/Death/Decay/Destruction/Evil/Madness/' +
     'Magic/Passion/Shadow/Travel/Trickery/War/Water/Weather',
  'The Devourer (NE):Destruction/Evil/Water/Weather',
  'The Fury (NE):Evil/Madness/Passion',
  'The Keeper (NE):Death/Decay/Evil',
  'The Mockery (NE):Destruction/Evil/Trickery/War',
  'The Shadow (CN):Artifice/Chaos/Travel/Trickery',
  'The Blood Of Vol (LE):Death/Evil/Law/Necromancer',
  'The Cults Of The Dragon Below (LN):Law/Meditation/Protection',
  'The Undying Court (NG):Deathless/Good/Protection'
];
Eberron.DOMAINS = [
  'Artifice', 'Charm', 'Commerce', 'Community', 'Deathless', 'Decay',
  'Dragon Below', 'Exorcism', 'Feast', 'Life', 'Madness', 'Meditation',
  'Necromancer', 'Passion', 'Shadow', 'Weather'
];
// NOTE: Craft Construct from MM, needed for Artificer class
Eberron.FEATS = [
  'Aberrant Dragonmark', 'Action Boost', 'Action Surge',
  'Adamantine Body:Warforged', 'Ashbound', 'Attune Magic Weapon:Item Creation',
  'Beast Shape', 'Beast Totem', 'Beasthide Elite:Shifter',
  'Bind Elemental:Item Creation', 'Child Of Winter', 'Cliffwalk Elite:Shifter',
  'Craft Construct:Item Creation', 'Double Steel Strike', 'Dragon Rage',
  'Dragon Totem', 'Ecclesiarch', 'Education',
  'Exceptional Artisan:Item Creation', 'Extend Rage', 'Extra Music',
  'Extra Rings:Item Creation', 'Extra Shifter Trait:Shifter',
  'Extraordinary Artisan:Item Creation', 'Favored In House', 'Flensing Strike',
  'Gatekeeper Initiate', 'Great Bite:Shifter', 'Great Rend:Shifter',
  'Greater Dragonmark', 'Greater Powerful Charge',
  'Greater Shifter Defense:Shifter', 'Greensinger Initiate', 'Haunting Melody',
  'Healing Factor:Shifter', 'Heroic Spirit',
  'Improved Damage Reduction:Warforged', 'Improved Fortification:Warforged',
  'Improved Natural Attack', 'Investigate', 'Knight Training',
  'Least Dragonmark', 'Legendary Artisan:Item Creation', 'Lesser Dragonmark',
  'Longstride Elite:Shifter', 'Mithral Body:Warforged',
  'Mithral Fluidity:Warforged', 'Monastic Training', 'Music Of Growth',
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
Eberron.SUBFEATS = {
  'Aberrant Dragonmark':'Burning Hands',
  'Beast Totem':'Chimera',
  'Dragon Totem':'Black Dragon',
  'Knight Training':'',
  'Monastic Training':''
};
Eberron.WEAPONS = [
  'Talenta Boomerang:d4r30', 'Talenta Sharrash:d10x4@19',
  'Talenta Tangat:d10x2@18', 'Valenar Double Scimitar:d6x2@18/d6x2@18',
  'Xen\'drik Boomerang:d6r20'
];

// Related information used internally by Eberron
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
  'Shield Of Faith':'Abjuration',
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

/* Defines the rules related to Eberron Chapter 2, Character Classes. */
Eberron.classRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Artificer') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = [
        'Attune Magic Weapon', 'Craft Construct', 'Exceptional Artisan',
        'Extra Rings', 'Extraordinary Artisan', 'Legendary Artisan',
        'Wand Mastery'
      ];
      for(var j = 0; j < PH35.FEATS.length; j++) {
        var pieces = PH35.FEATS[j].split(':');
        if(pieces[1].match(/Metamagic/)) {
          feats[feats.length] = pieces[0];
        }
      }
      features = [
        '1:Artificer Knowledge', '1:Artisan Bonus', '1:Disable Trap',
        '1:Item Creation', '1:Scribe Scroll', '2:Brew Potion',
        '3:Craft Wondrous Item', '4:Craft Homunculus',
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
          'Create magic weapon/armor/shield',
        'magicNotes.craftRodFeature:Create magic rod',
        'magicNotes.craftStaffFeature:Create magic staff',
        'magicNotes.craftWandFeature:Create wand for up to 4th level spell',
        'magicNotes.craftWondrousItemFeature:Create miscellaneous magic item',
        'magicNotes.forgeRingFeature:Create magic ring',
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
      rules.defineRule('featCount.Artificer',
        'levels.Artificer', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('skillNotes.artificerKnowledgeFeature',
         'levels.Artificer', '=', null,
         'intelligenceModifier', '+', null
        );

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

/* Defines the feat rules from Eberron Chapter 3, Heroic Characteristics. */
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
    
    if((matchInfo = feat.match(/^Aberrant Dragonmark \((.*)\)$/)) != null) {
      var dragonmark = matchInfo[1];
      var note = 'magicNotes.aberrantDragonmark(' + dragonmark + ')Feature';
      var valid = 'validationNotes.aberrantDragonmark(' + dragonmark + ')Feat';
      notes = [
        note + ':DC %V <i>' + dragonmark + '</i> as level %1 caster 1/day',
        valid + 'Features:' +
          'Requires Least Dragonmark == 0/Lesser Dragonmark == 0/' +
          'Greater Dragonmark == 0',
        valid + 'Race:' +
          'Requires Race == Dwarf|Race == Elf|Race == Gnome|Race == Halfling|' +
          'Race == Half Elf|Race == Half Orc|Race == Human'
      ];
      rules.defineRule(note, 'charismaModifier', '=', '11 + source');
      rules.defineRule(note + '.1', 'level', '=', 'Math.floor(source / 2)');
      rules.defineRule(valid + 'Features',
        'feats.' + feat, '=', '0',
        /^features.(Least|Lesser|Greater) Dragonmark/, '+', '-1'
      );
      rules.defineRule(valid + 'Race',
        'feats.' + feat, '=', '-1',
        'race', '+', 'source.match' +
          '(/^(Dwarf|Elf|Gnome|Half(ling| Elf| Orc)|Human)$/) ? 1 : null'
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
        'validationNotes.actionSurgeFeatCombat:Requires Base Attack >= 3'
      ];
      rules.defineRule('validationNotes.actionSurgeFeatCombat',
        'feats.Action Surge', '=', '-1',
        'baseAttack', '+', 'source >= 3 ? 1 : null'
      );
    } else if(feat == 'Adamantine Body') {
      notes = [
        'abilityNotes.adamantineBodyFeature:Max 20 speed',
        'combatNotes.adamantineBodyFeature:+6 AC/DR 2/adamantine',
        'validationNotes.adamantineBodyFeatRace:Requires Race == Warforged'
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
        'features.Adamantine Body', '=', '-5'
      );
      rules.defineRule
        ('speed', 'abilityNotes.adamantineBodyFeature', 'v', '20');
      rules.defineRule('validationNotes.adamantineBodyFeatRace',
        'feats.Adamantine Body', '=', '-1',
        'race', '+', 'source == "Warforged" ? 1 : null'
      );
    } else if(feat == 'Ashbound') {
      notes = [
        'magicNotes.ashboundFeature:' +
          'Double <i>Summon Nature\'s Ally</i> duration; summoned creatures ' +
          '+3 attack',
        'validationNotes.ashboundFeatFeatures:Requires Spontaneous Druid Spell'
      ];
      rules.defineRule('validationNotes.ashboundFeatFeatures',
        'feats.Ashbound', '=', '-1',
        'features.Spontaneous Druid Spell', '+', '1'
      );
    } else if(feat == 'Attune Magic Weapon') {
      notes = [
        'combatNotes.attuneMagicWeaponFeature:+1 attack/damage w/magic weapons',
        'validationNotes.attuneMagicWeaponFeatFeatures:' +
          'Requires Craft Magic Arms And Armor',
        'validationNotes.attuneMagicWeaponFeatLevels:Requires Caster Level >= 5'
      ];
      rules.defineRule('validationNotes.attuneMagicWeaponFeatFeatures',
        'feats.Attune Magic Weapon', '=', '-1',
        'features.Craft Magic Arms And Armor', '+', '1'
      );
      rules.defineRule('validationNotes.attuneMagicWeaponFeatLevels',
        'feats.Attune Magic Weapon', '=', '-1',
        'casterLevel', '+', 'source >= 5 ? 1 : null'
      );
    } else if(feat == 'Beast Shape') {
      notes = [
        'magicNotes.beastShapeFeature:Wild Shape into beast totem 1/day',
        'validationNotes.beastShapeFeatFeatures:' +
          'Requires Beast Totem/Wild Shape (huge creature)'
      ];
      rules.defineRule('validationNotes.beastShapeFeatFeatures',
        'feats.Beast Shape', '=', '-2',
        /^features\.Beast Totem/, '+', '1',
        'levels.Druid', '+', 'source >= 15 ? 1 : null'
      );
    } else if((matchInfo = feat.match(/^Beast Totem \((.*)\)$/)) != null) {
      var beast = matchInfo[1];
      var attack = Eberron.totemAttackForms[beast];
      var note = 'saveNotes.beastTotem(' + beast + ')Feature';
      var valid = 'validationNotes.beastTotem(' + beast + ')Feat';
      notes = [
        note + ':+4 vs. ' + (attack == null ? 'related' : attack),
        valid + 'Features:Requires Wild Shape'
      ];
      rules.defineRule(valid + 'Features',
        'feats.' + feat, '=', '-1',
        'features.Wild Shape', '+', '1'
      );
    } else if(feat == 'Beasthide Elite') {
      notes = [
        'combatNotes.beasthideEliteFeature:+2 AC while shifting',
        'validationNotes.beasthideEliteFeatFeatures:Requires Beasthide'
      ];
      rules.defineRule('validationNotes.beasthideEliteFeatFeatures',
        'feats.Beasthide Elite', '=', '-1',
        'features.Beasthide', '+', '1'
      );
    } else if(feat == 'Bind Elemental') {
      notes = [
        'magicNotes.bindElementalFeature:Bind elementals to magical objects',
        'validationNotes.bindElementalFeatFeatures:' +
          'Requires Craft Wondrous Item',
        'validationNotes.bindElementalFeatLevels:Requires Caster Level >= 9'
      ];
      rules.defineRule('validationNotes.bindElementalFeatFeatures',
        'feats.Bind Elemental', '=', '-1',
        'features.Craft Wondrous Item', '+', '1'
      );
      rules.defineRule('validationNotes.bindElementalFeatLevels',
        'feats.Bind Elemental', '=', '-1',
        'casterLevel', '+', 'source >= 9 ? 1 : null'
      );
    } else if(feat == 'Child Of Winter') {
      notes = [
        'magicNotes.childOfWinterFeature:Use animal Druid spells on vermin',
        'validationNotes.childOfWinterFeatAlignment:Requires Alignment != Good',
        'validationNotes.childOfWinterFeatFeatures:' +
           'Requires Spontaneous Druid Spell'
      ];
      rules.defineRule('validationNotes.childOfWinterFeatAlignment',
        'feats.Child Of Winter', '=', '-1',
        'alignment', '+', 'source.indexOf("Good") < 0 ? 1 : null'
      );
      rules.defineRule('validationNotes.childOfWinterFeatFeatures',
        'feats.Child Of Winter', '=', '-1',
        'features.Spontaneous Druid Spell', '+', '1'
      );
    } else if(feat == 'Cliffwalk Elite') {
      notes = [
        'abilityNotes.cliffwalkEliteFeature:+10 climb speed while shifting',
        'validationNotes.cliffwalkEliteFeatFeatures:Requires Cliffwalk'
      ];
      rules.defineRule('validationNotes.cliffwalkEliteFeatFeatures',
        'feats.Cliffwalk Elite', '=', '-1',
        'features.Cliffwalk', '+', '1'
      );
    } else if(feat == 'Craft Construct') {
      notes = [
        'magicNotes.craftConstructFeature:Create enchanted construct',
        'validationNotes.craftConstructFeatFeatures:' +
          'Requires Craft Magic Arms And Armor/Craft Wondrous Item'
      ];
      rules.defineRule('validationNotes.craftConstructFeatFeatures',
        'feats.Craft Construct', '=', '-2',
        'features.Craft Magic Arms And Armor', '+', '1',
        'features.Craft Wondrous Item', '+', '1'
      );
    } else if(feat == 'Double Steel Strike') {
      notes = [
        'combatNotes.doubleSteelStrikeFeature:' +
          'Flurry Of Blows w/Two-Bladed Sword',
        'validationNotes.doubleSteelStrikeFeatFeatures:' +
          'Requires Flurry Of Blows/Weapon Proficiency (Two-Bladed Sword)'
      ];
      rules.defineRule('validationNotes.doubleSteelStrikeFeatFeatures',
        'feats.Double Steel Strike', '=', '-2',
        'features.Flurry Of Blows', '+', '1',
        'features.Weapon Proficiency (Two-Bladed Sword)', '+', '1'
      );
    } else if(feat == 'Dragon Rage') {
      notes = [
        'combatNotes.dragonRageFeature:' +
          '+2 AC/+10 Dragon Totem resistence during frenzy/rage',
        'validationNotes.dragonRageFeatFeatures:' +
          'Requires Dragon Totem/Frenzy|Rage'
        // TODO Requires Origin == Argonnessen
      ];
      rules.defineRule('validationNotes.dragonRageFeatFeatures',
        'feats.Dragon Rage', '=', '-101',
        /^features\.Dragon Totem/, '+', '100',
        'features.Frenzy', '+', '1',
        'features.Rage', '+', '1',
        '', 'v', '0'
      );
    } else if((matchInfo = feat.match(/^Dragon Totem \((.*)\)$/)) != null) {
      var dragon = matchInfo[1];
      var attack = Eberron.totemAttackForms[dragon];
      var note = 'saveNotes.dragonTotem(' + dragon + ')Feature';
      var valid = 'validationNotes.dragonTotem(' + dragon + ')Feat';
      notes = [
        note + ':+5 vs. ' + (attack == null ? 'related' : attack),
        valid + 'Combat:Requires Base Attack >= 1'
        // TODO Requires Origin == Argonnessen | Origin == Seren
      ];
      rules.defineRule(valid + 'Combat',
        'feats.' + feat, '=', '-1',
        'baseAttack', '+', 'source >= 1 ? 1 : null'
      );
    } else if(feat == 'Ecclesiarch') {
      notes = [
        'featureNotes.ecclesiarchFeature:+2 Leadership',
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
      rules.defineRule('validationNotes.ecclesiarchFeatSkills',
        'feats.Ecclesiarch', '=', '-1',
        'skillModifier.Knowledge (Religion)', '+', 'source >= 6 ? 1 : null'
      );
    } else if(feat == 'Education') {
      notes = [
        'skillNotes.educationFeature:' +
          'All Knowledge skills class skills/+2 two Knowledge Skills'
      ];
      rules.defineRule
        (/^classSkills\.Knowledge/, 'skillNotes.educationFeature', '=', '1');
    } else if(feat == 'Exceptional Artisan') {
      notes = [
        'magicNotes.exceptionalArtisanFeature:' +
          'Reduce item creation base time by 25%',
        'validationNotes.exceptionalArtisanFeatFeatures:' +
          'Requires any Item Creation'
      ];
      rules.defineRule('validationNotes.exceptionalArtisanFeatFeatures',
        'feats.Exceptional Artisan', '=', '0', // TODO any Item Creation
        '', 'v', '0'
      );
    } else if(feat == 'Extend Rage') {
      notes = [
        'combatNotes.extendRageFeature:Add 5 rounds to Frenzy/Rage duration',
        'validationNotes.extendRageFeatFeatures:Requires Frenzy|Rage'
      ];
      rules.defineRule
        ('combatNotes.rageFeature', 'combatNotes.extendRageFeature', '+', '5');
      rules.defineRule(
        'combatNotes.frenzyFeature', 'combatNotes.extendRageFeature', '+', '5'
      );
      rules.defineRule('validationNotes.extendRageFeatFeatures',
        'feats.Extend Rage', '=', '-1',
        'features.Frenzy', '+', '1',
        'features.Rage', '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Extra Music') {
      notes = [
        'featureNotes.extraMusicFeature:Bardic Music 4 extra times/day',
        'validationNotes.extraMusicFeatFeatures:Requires Bardic Music'
      ];
      rules.defineRule('featureNotes.bardicMusicFeature',
        'featureNotes.extraMusicFeature', '+', '4'
      );
      rules.defineRule('validationNotes.extraMusicFeatFeatures',
        'feats.Extra Music', '=', '-1',
        'features.Bardic Music', '+', '1'
      );
    } else if(feat == 'Extra Rings') {
      notes = [
        'magicNotes.extraRingsFeature:Wear up to 4 magic rings at once',
        'validationNotes.extraRingsFeatFeatures:Requires Forge Ring',
        'validationNotes.extraRingsFeatLevels:Requires Caster Level >= 12'
      ];
      rules.defineRule('validationNotes.extraRingsFeatFeatures',
        'feats.Extra Rings', '=', '-1',
        'features.Forge Ring', '+', '1'
      );
      rules.defineRule('validationNotes.extraRingsFeatLevels',
        'feats.Extra Rings', '=', '-1',
        'casterLevel', '+', 'source >= 12 ? 1 : null'
      );
    } else if(feat == 'Extra Shifter Trait') {
      notes = [
        'featureNotes.extraShifterTraitFeature:' +
          'Extra Shifter trait w/out ability bonus',
        'validationNotes.extraShifterFeatFeatures:Requires 2 Shifter',
        'validationNotes.extraShifterFeatRace:Requires Race == Shifter'
      ];
      rules.defineRule('selectableFeatureCount.Shifter',
        'featureNotes.extraShifterTraitFeature', '+', '1'
      );
      rules.defineRule('validationNotes.extraShifterFeatFeatures',
        'feats.Extra Shifter Trait', '=', '0', // TODO any 2 Shifter
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.extraShifterFeatRace',
        'feats.Extra Shifter Trait', '=', '-1',
        'race', '+', 'source == "Shifter" ? 1 : null'
      );
    } else if(feat == 'Extraordinary Artisan') {
      notes = [
        'magicNotes.extraordinaryArtisanFeature:' +
          'Reduce item creation base price by 25%',
        'validationNotes.extraordinaryArtisanFeatFeatures:' +
          'Requires any Item Creation'
      ];
      rules.defineRule('validationNotes.extraordinaryArtisanFeatFeatures',
        'feats.Extraordinary Artisan', '=', '0', // TODO any Item Creation
        '', 'v', '0'
      );
    } else if(feat == 'Favored In House') {
      notes = [
        'featureNotes.favoredInHouseFeature:Acquire favors from house contacts',
        // TODO Dragonmarked house membership
        'validationNotes.favoredInHouseFeatRace:' +
          'Requires Race == Dwarf|Race == Elf|Race == Gnome|Race == Halfling|' +
          'Race == Half Elf|Race == Half Orc|Race == Human'
      ];
      rules.defineRule('validationNotes.favoredInHouseFeatRace',
        'feats.Favored In House', '=', '-1',
        'race', '+', 'source.match' +
          '(/^(Dwarf|Elf|Gnome|Half(ling| Elf| Orc)|Human)$/) ? 1 : null'
      );
    } else if(feat == 'Flensing Strike') {
      notes = [
        'combatNotes.flensingStrikeFeature:' +
          'Foe DC %V Fortitude save on kama strike or suffer -1 pain penalty ' +
          'attack/save/check rolls for 1 minute',
        'validationNotes.flensingStrikeFeatFeatures:' +
          'Requires Weapon Focus (Kama)/Weapon Proficiency (Kama)'
      ];
      rules.defineRule('combatNotes.flensingStrikeFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('validationNotes.flensingStrikeFeatFeatures',
        'feats.Flensing Strike', '=', '-2',
        'features.Weapon Focus (Kama)', '+', '1',
        'features.Weapon Proficiency (Kama)', '+', '1'
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
      rules.defineRule('validationNotes.gatekeeperInitiateFeatFeatures',
        'feats.Gatekeeper Initiate', '=', '-1',
        'features.Spontaneous Druid Spell', '+', '1'
      );
    } else if(feat == 'Great Bite') {
      notes = [
        'combatNotes.greatBiteFeature:x3 critical on Fang attacks',
        'validationNotes.greatBiteFeatCombat:Requires Base Attack >= 6',
        'validationNotes.greatBiteFeatFeatures:Requires Longtooth'
      ];
      rules.defineRule('validationNotes.greatBiteFeatCombat',
        'feats.Great Bite', '=', '-1',
        'baseAttack', '+', 'source >= 6 ? 1 : null'
      );
      rules.defineRule('validationNotes.greatBiteFeatFeatures',
        'feats.Great Bite', '=', '-1',
        'features.Longtooth', '+', '1'
      );
    } else if(feat == 'Great Rend') {
      notes = [
        'combatNotes.greatRendFeature:+d4+%V damage from hit w/both claws',
        'validationNotes.greatRendFeatCombat:Requires Base Attack >= 4',
        'validationNotes.greatRendFeatFeatures:Requires Razorclaw'
      ];
      rules.defineRule('combatNotes.greatRendFeature',
        'level', '=', 'Math.floor(source / 4)',
        'strengthModifier', '+', 'Math.floor(source / 2)'
      );
      rules.defineRule('validationNotes.greatRendFeatCombat',
        'feats.Great Rend', '=', '-1',
        'baseAttack', '+', 'source >= 4 ? 1 : null'
      );
      rules.defineRule('validationNotes.greatRendFeatFeatures',
        'feats.Great Rend', '=', '-1',
        'features.Razorclaw', '+', '1'
      );
    } else if(feat == 'Greater Dragonmark') {
      notes = [
        'magicNotes.greaterDragonmarkFeature:' +
          'DC %V+spell level greater dragonmark ability at caster level 10/' +
          'least/lesser dragonmark ability +1/day',
        // TODO Dragonmarked house membership
        'validationNotes.greaterDragonmarkFeatFeatures:' +
          'Requires Least Dragonmark/Lesser Dragonmark',
        'validationNotes.greaterDragonmarkFeatRace:' +
          'Requires Race == Dwarf|Race == Elf|Race == Gnome|Race == Halfling|' +
          'Race == Half Elf|Race == Half Orc|Race == Human',
        'validationNotes.greaterDragonmarkFeatSkills:' +
          'Requires 12 ranks in two skills'
      ];
      rules.defineRule('magicNotes.greaterDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('validationNotes.greaterDragonmarkFeatFeatures',
        'feats.Greater Dragonmark', '=', '-2',
        'features.Least Dragonmark', '+', '1',
        'features.Lesser Dragonmark', '+', '1'
      );
      rules.defineRule('validationNotes.greaterDragonmarkFeatRace',
        'feats.Greater Dragonmark', '=', '-1',
        'race', '+', 'source.match' +
          '(/^(Dwarf|Elf|Gnome|Half(ling| Elf| Orc)|Human)$/) ? 1 : null'
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
        'validationNotes.greaterPowerfulChargeFeatCombat:' +
          'Requires Base Attack >= 4',
        'validationNotes.greaterPowerfulChargeFeatFeatures:' +
          'Requires Powerful Charge/Small == 0'
      ];
      rules.defineRule('combatNotes.greaterPowerfulChargeFeature',
        '', '=', '"2d6"',
        'features.Large', '=', '"3d6"'
      );
      rules.defineRule('combatNotes.powerfulChargeFeature',
        'combatNotes.greaterPowerfulChargeFeature', '=', null
      );
      rules.defineRule('validationNotes.greaterPowerfulChargeFeatCombat',
        'feats.Greater Powerful Charge', '=', '-1',
        'baseAttack', '+', 'source >= 4 ? 1 : null'
      );
      rules.defineRule('validationNotes.greaterPowerfulChargeFeatFeatures',
        'feats.Greater Powerful Charge', '=', '-1',
        'features.Powerful Charge', '+', '1',
        'features.Small', '+', '-1'
      );
    } else if(feat == 'Greater Shifter Defense') {
      notes = [
        'combatNotes.greaterShifterDefenseFeature:+2 Shifter Defense DR',
        'validationNotes.greaterShifterDefenseFeatFeatures:' +
          'Requires Shifter Defense/3 other Shifter',
        'validationNotes.greaterShifterDefenseFeatRace:Requires Race == Shifter'
      ];
      rules.defineRule('combatNotes.shifterDefenseFeature',
        'combatNotes.greaterShifterDefenseFeature', '+', '2'
      );
      rules.defineRule('validationNotes.greaterShifterDefenseFeatFeatures',
        'feats.Greater Shifter Defense', '=', '-1', // TODO Any 4 Shifter
        'features.Shifter Defense', '+', '1',
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.greaterShifterDefenseFeatRace',
        'feats.Greater Shifter Defense', '=', '-1',
        'race', '+', 'source == "Shifter" ? 1 : null'
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
      rules.defineRule(/^classSkills.Perform/,
        'skillNotes.greensingerInitiateFeature', '=', '1'
      );
      rules.defineRule('validationNotes.greensingerInitiateFeatFeatures',
        'feats.Greensinger Initiate', '=', '-1',
        'features.Spontaneous Druid Spell', '+', '1'
      );
    } else if(feat == 'Haunting Melody') {
      notes = [
        'magicNotes.hauntingMelodyFeature:' +
          'Foe DC %V Will save or afraid for %1 rounds',
        'validationNotes.hauntingMelodyFeatures:Requires Bardic Music',
        'validationNotes.hauntingMelodySkills:Requires Perform >= 9'
      ];
      rules.defineRule('magicNotes.hauntingMelodyFeature',
        'levels.Bard', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('validationNotes.hauntingMelodyFeatFeatures',
        'feats.Haunting Melody', '=', '-1',
        'features.Bardic Music', '+', '1'
      );
      rules.defineRule('validationNotes.hauntingMelodyFeatSkills',
        'feats.Haunting Melody', '=', '-1',
        'subskillTotal.Perform', '+', 'source >= 9 ? 1 : null'
      );
    } else if(feat == 'Healing Factor') {
      notes = [
        'featureNotes.healingFactorFeature:Heal %V points when shifting ends',
        'validationNotes.healingFactorFeatAbilities:' +
          'Requires Constitution >= 13',
        'validationNotes.healingFactorFeatRace:Requires Race == Shifter'
      ];
      rules.defineRule('featureNotes.healingFactorFeature', 'level', '=', null);
      rules.defineRule('validationNotes.healingFactorFeatAbilities',
        'feats.Healing Factor', '=', '-1',
        'constitution', '+', 'source >= 13 ? 1 : null'
      );
      rules.defineRule('validationNotes.healingFactorFeatRace',
        'feats.' + feat, '=', '-1',
        'race', '+', 'source == "Shifter" ? 1 : null'
      );
    } else if(feat == 'Heroic Spirit') {
      notes = [
        'featureNotes.heroicSpiritFeature:+3 AP/level'
      ];
    } else if(feat == 'Improved Damage Reduction') {
      notes = [
        'combatNotes.improvedDamageReduction:DR +1/adamantine',
        'validationNotes.improvedDamageReductionFeatRace:' +
          'Requires Race == Warforged'
      ];
      rules.defineRule('validationNotes.improvedDamageReductionFeatRace',
        'feats.Improved Damage Reduction', '=', '-1',
        'race', '+', 'source == "Warforged" ? 1 : null'
      );
    } else if(feat == 'Improved Fortification') {
      notes = [
        'combatNotes.improvedFortificationFeature:' +
          'Immune sneak attack/critical hit/healing',
        'validationNotes.improvedFortificationFeatCombat:' +
          'Requires Base Attack >= 6',
        'validationNotes.improvedFortificationFeatRace:' +
          'Requires Race == Warforged'
      ];
      rules.defineRule('validationNotes.improvedFortificationFeatCombat',
        'feats.Improved Fortification', '=', '-1',
        'baseAttack', '+', 'source >= 6 ? 1 : null'
      );
      rules.defineRule('validationNotes.improvedFortificationFeatRace',
        'feats.Improved Fortification', '=', '-1',
        'race', '+', 'source == "Warforged" ? 1 : null'
      );
    } else if(feat == 'Improved Natural Attack') {
      notes = [
        'combatNotes.improvedNaturalAttack:' +
          'Natural attack damage increases one size catagory',
        // TODO Requires natural attack
        'validationNotes.improvedNaturalAttackFeatCombat:' +
          'Requires Base Attack >= 4'
      ];
      rules.defineRule('validationNotes.improvedNaturaAttackFeatCombat',
        'feats.Improved Natural Attack', '=', '-1',
        'baseAttack', '+', 'source >= 4 ? 1 : null'
      );
    } else if(feat == 'Investigate') {
      notes = [
        'skillNotes.investigateFeature:Use Search to find/analyze clues'
      ];
      // TODO Synergy with "appropriate Knowledge skill"
    } else if((matchInfo=feat.match(/^Knight Training \((.*)\)$/)) != null) {
      var klass = matchInfo[1];
      notes = [
        'featureNotes.knightTraining(' + klass + ')Feature:' +
          'No restrictions on Paladin/' + klass + ' level advancement'
      ];
    } else if(feat == 'Least Dragonmark') {
      notes = [
        'magicNotes.leastDragonmarkFeature:' +
          'DC %V+spell level least dragonmark ability at caster level 1',
        // TODO Requires Dragonmarked house membership
        'validationNotes.leastDragonmarkFeatRace:' +
          'Requires Race == Dwarf|Race == Elf|Race == Gnome|Race == Halfling|' +
          'Race == Half Elf|Race == Half Orc|Race == Human'
      ];
      rules.defineRule('magicNotes.leastDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('validationNotes.leastDragonmarkFeatRace',
        'feats.Least Dragonmark', '=', '-1',
        'race', '+', 'source.match' +
          '(/^(Dwarf|Elf|Gnome|Half(ling| Elf| Orc)|Human)$/) ? 1 : null'
      );
    } else if(feat == 'Legendary Artisan') {
      notes = [
        'magicNotes.legendaryArtisanFeature:' +
          'Reduce item creation XP price by 25%',
        'validationNotes.legendaryArtisanFeatFeatures:' +
          'Requires any Item Creation'
      ];
      rules.defineRule('validationNotes.legendaryArtisanFeatFeatures',
        'feats.Legendary Artisan', '=', '0', // TODO any Item Creation
        '', 'v', '0'
      );
    } else if(feat == 'Lesser Dragonmark') {
      notes = [
        'magicNotes.lesserDragonmarkFeature:' +
          'DC %V+spell level lesser dragonmark ability at caster level 6/' +
          'least dragonmark ability +1/day',
        // TODO Requires Dragonmarked house membership
        'validationNotes.lesserDragonmarkFeatFeatures:' +
          'Requires Least Dragonmark',
        'validationNotes.lesserDragonmarkFeatRace:' +
          'Requires Race == Dwarf|Race == Elf|Race == Gnome|Race == Halfling|' +
          'Race == Half Elf|Race == Half Orc|Race == Human',
        'validationNotes.lesserDragonmarkFeatSkills:' +
          'Requires 9 ranks in two skills'
      ];
      rules.defineRule('magicNotes.lesserDragonmarkFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('validationNotes.lesserDragonmarkFeatFeatures',
        'feats.Lesser Dragonmark', '=', '-1',
        'features.Least Dragonmark', '+', '1'
      );
      rules.defineRule('validationNotes.lesserDragonmarkFeatRace',
        'feats.Lesser Dragonmark', '=', '-1',
        'race', '+', 'source.match' +
          '(/^(Dwarf|Elf|Gnome|Half(ling| Elf| Orc)|Human)$/) ? 1 : null'
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
      rules.defineRule('validationNotes.longstrideEliteFeatFeatures',
        'feats.Longstride Elite', '=', '-1',
        'features.Longstride', '+', '1'
      );
    } else if(feat == 'Mithral Body') {
      notes = [
        'combatNotes.mithralBodyFeature:+3 AC',
        'validationNotes.mithralBodyFeatRace:Requires Race == Warforged'
      ];
      rules.defineRule
        ('armorClass', 'combatNotes.mithralBodyFeature', '+', '3');
      rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
        'features.Mithral Body', 'v', '5'
      );
      rules.defineRule('magicNotes.arcaneSpellFailure',
        'features.Mithral Body', '^', '15'
      );
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'features.Mithral Body', '=', '-2'
      );
      rules.defineRule('validationNotes.mithralBodyFeatRace',
        'feats.Mithral Body', '=', '-1',
        'race', '+', 'source == "Warforged" ? 1 : null'
      );
    } else if(feat == 'Mithral Fluidity') {
      notes = [
        'validationNotes.mithralFluidityFeatFeatures:Requires Mithral Body',
        'validationNotes.mithralFluidityFeatRace:Requires Race == Warforged'
      ];
      rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
        'features.Mithril Fluidity', '+', '1'
      );
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'features.Mithril Fluidity', '+', '1'
      );
      rules.defineRule('validationNotes.mithralFluidityFeatFeatures',
        'feats.Mithral Fluidity', '=', '-1',
        'features.Mithral Body', '+', '1'
      );
      rules.defineRule('validationNotes.mithralFluidityFeatRace',
        'feats.Mithral Fluidity', '=', '-1',
        'race', '+', 'source == "Warforged" ? 1 : null'
      );
    } else if((matchInfo=feat.match(/^Monastic Training \((.*)\)$/)) != null) {
      var klass = matchInfo[1];
      notes = [
        'featureNotes.monasticTraining(' + klass + ')Feature:' +
          'No restrictions on Monk/' + klass + ' level advancement'
      ];
    } else if(feat == 'Music Of Growth') {
      notes = [
        'featureNotes.musicOfGrowthFeature:' +
          '+4 strength/constitution to animal/plant creatures w/in 30 ft ' +
          'during Bardic Music',
        'validationNotes.musicOfGrowthFeatFeatures:Requires Bardic Music',
        'validationNotes.musicOfGrowthFeatSkills:Requires Perform >= 12'
      ];
      rules.defineRule('validationNotes.musicOfGrowthFeatFeatures',
        'feats.Music Of Growth', '=', '-1',
        'features.Bardic Music', '+', '1'
      );
      rules.defineRule('validationNotes.musicOfGrowthFeatSkills',
        'feats.Music Of Growth', '=', '-1',
        'subskillTotal.Perform', '+', 'source >= 12 ? 1 : null'
      );
    } else if(feat == 'Music Of Making') {
      notes = [
        'magicNotes.musicOfMakingFeature:' +
          'Double duration of conjuration spells involving Bardic Music',
        'skillNotes.musicOfMakingFeature:+4 Craft during Bardic Music',
        'validationNotes.musicOfGrowthFeatFeatures:Requires Bardic Music',
        'validationNotes.musicOfGrowthFeatSkills:Requires Perform >= 12'
      ];
      rules.defineRule('validationNotes.musicOfMakingFeatFeatures',
        'feats.Music Of Making', '=', '-1',
        'features.Bardic Music', '+', '1'
      );
      rules.defineRule('validationNotes.musicOfMakingFeatSkills',
        'feats.Music Of Making', '=', '-1',
        'subskillTotal.Perform', '+', 'source >= 9 ? 1 : null'
      );
    } else if(feat == 'Powerful Charge') {
      notes = [
        'combatNotes.powerfulChargeFeature:+%V damage from successful charge',
        'validationNotes.powerfulChargeFeatCombat:Requires Base Attack >= 1',
        'validationNotes.powerfulChargeFeatFeatures:Requires Small == 0'
      ];
      rules.defineRule('combatNotes.powerfulChargeFeature',
        '', '=', '"d8"',
        'features.Large', '=', '"2d6"'
      );
      rules.defineRule('validationNotes.powerfulChargeFeatCombat',
        'feats.Powerful Charge', '=', '-1',
        'baseAttack', '+', 'source >= 1 ? 1 : null'
      );
      rules.defineRule('validationNotes.powerfulChargeFeatFeatures',
        'feats.Powerful Charge', '=', '0',
        'features.Small', '+', '-1'
      );
    } else if(feat == 'Precise Swing') {
      notes = [
        'combatNotes.preciseSwingFeature:' +
          'Ignore less-than-total cover w/melee attack',
        'validationNotes.preciseSwingFeatCombat:Requires Base Attack >= 5'
      ];
      rules.defineRule('validationNotes.preciseSwingFeatCombat',
        'feats.Precise Swing', '=', '-1',
        'baseAttack', '+', 'source >= 5 ? 1 : null'
      );
    } else if(feat == 'Pursue') {
      notes = [
        'combatNotes.pursueFeature:' +
          'Spend 1 AP to step into area vacated by opponent',
        'validationNotes.pursueFeatFeatures:Requires Combat Reflexes'
      ];
      rules.defineRule('validationNotes.pursueFeatFeatures',
        'feats.Persue', '=', '-1',
        'features.Combat Reflexes', '+', '1'
      );
    } else if(feat == 'Raging Luck') {
      notes = [
        'featureNotes.ragingLuckFeature:Gain 1 AP during Frenzy/Rage',
        'validationNotes.ragingLuckFeatFeatures:Requires Frenzy|Rage'
      ];
      rules.defineRule('validationNotes.ragingLuckFeatFeatures',
        'feats.Raging Luck', '=', '-1',
        'features.Frenzy', '+', '1',
        'features.Rage', '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Recognize Impostor') {
      notes = [
        'skillNotes.recognizeImposterFeature:' +
          '+4 Sense Motive vs. Bluff/Spot vs. Disguise',
        'validationNotes.recognizeImpostorFeatSkills:' +
          'Requires Sense Motive >= 3/Spot >= 3'
      ];
      rules.defineRule('validationNotes.recognizeImpostorFeatSkills',
        'feats.Recognize Impostor', '=', '-2',
        'skillModifier.Sense Motive', '+', 'source >= 3 ? 1 : null',
        'skillModifier.Spot', '+', 'source >= 3 ? 1 : null'
      );
    } else if(feat == 'Repel Aberration') {
      notes = [
        'combatNotes.repelAberrationFeature:' +
          'Repel aberrations as cleric turns undead',
        'validationNotes.repelAberrationFeatFeatures:' +
          'Requires Gatekeeper Initiate',
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
      rules.defineRule('validationNotes.repelAberrationFeatFeatures',
        'feats.Repel Aberration', '=', '-1',
         'features.Gatekeeper Initiate', '+', '1'
      );
      rules.defineRule('validationNotes.repelAberrationFeatLevels',
        'feats.Repel Aberration', '=', '-1',
         'levels.Druid', '+', 'source >= 3 ? 1 : null'
      );
      rules.defineSheetElement('Turn Aberration', 'Turn Undead', null, ' * ');
    } else if(feat == 'Research') {
      notes = [
        'skillNotes.researchFeature:Use Knowledge skill on library/records'
      ];
    } else if(feat == 'Right Of Counsel') {
      notes = [
        'featureNotes.rightOfCounselFeature:' +
          'Seek advice from deathless ancestor',
        'validationNotes.rightOfCounselFeatRace:Requires Race == Elf'
      ];
      rules.defineRule('validationNotes.rightOfCounselFeatRace',
        'feats.Right Of Counsel', '=', '-1',
        'race', '+', 'source == "Elf" ? 1 : null'
      );
    } else if(feat == 'Serpent Strike') {
      notes = [
        'combatNotes.serpentStrikeFeature:Flurry Of Blows w/Longspear',
        'validationNotes.serpentStrikeFeatFeatures:' +
           'Requires Simple Weapon Proficiency/Weapon Focus (Longspear)/' +
           'Flurry Of Blows'
      ];
      rules.defineRule('validationNotes.serpentStrikeFeatFeatures',
        'feats.Serpent Strike', '=', '-201',
        'features.Flurry Of Blows', '+', '100',
        'features.Weapon Focus (Longspear)', '+', '100',
        'features.Simple Weapon Proficiency', '+', '1',
        'weaponProficiencyLevel', '+',
          'source >= ' + PH35.PROFICIENCY_LIGHT + ' ? 1 : null',
        '', 'v', '0'
      );
    } else if(feat == 'Shifter Defense') {
      notes = [
        'combatNotes.shifterDefenseFeature:DR %V/silver',
        'validationNotes.shifterDefenseFeatFeatures:Requires 2 Shifter',
        'validationNotes.shifterDefenseFeatRace:Requires Race == Shifter'
      ];
      rules.defineRule('combatNotes.shifterDefenseFeature', '', '=', '2');
      rules.defineRule('validationNotes.shifterDefenseFeatFeatures',
        'feats.Shifter Ferocity', '=', '0', // TODO Any 2 Shifter
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.shifterDefenseFeatRace',
        'feats.Shifter Defense', '=', '-1',
        'race', '+', 'source == "Shifter" ? 1 : null'
      );
    } else if(feat == 'Shifter Ferocity') {
      notes = [
        'combatNotes.shifterFerocityFeature:' +
          'Continue fighting below 0 HP while shifting',
        'validationNotes.shifterFerocityFeatAbilities:Requires Wisdom >= 13',
        'validationNotes.shifterFerocityFeatRace:Requires Race == Shifter'
      ];
      rules.defineRule('validationNotes.shifterFerocityFeatAbilities',
        'feats.Shifter Ferocity', '=', '-1',
        'wisdom', '+', 'source >= 13 ? 1 : null'
      );
      rules.defineRule('validationNotes.shifterFerocityFeatRace',
        'feats.Shifter Ferocity', '=', '-1',
        'race', '+', 'source == "Shifter" ? 1 : null'
      );
    } else if(feat == 'Shifter Multiattack') {
      notes = [
        'combatNotes.shifterMultiattackFeature:' +
          'Reduce additional natural attack penalty to -2',
        'validationNotes.shifterMultiattackFeatCombat:' +
          'Requires Base Attack >= 6',
        'validationNotes.shifterMultiattackFeatFeature:' +
          'Requires Longtooth|Razorclaw'
      ];
      rules.defineRule('validationNotes.shifterMultiattackFeatCombat',
        'feats.Shifter Multiattack', '=', '-1',
        'baseAttack', '+', 'source >= 6 ? 1 : null'
      );
      rules.defineRule('validationNotes.shifterMultiattackFeatFeatures',
        'feats.Shifter Multiattack', '=', '-1',
        'features.Longtooth', '+', '1',
        'features.Razorclaw', '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Silver Smite') {
      notes = [
        'combatNotes.silverSmiteFeature:+d6 Smite Evil',
        'validationNotes.silverSmiteFeatDeity:' +
          'Requires Deity == The Silver Flame',
        'validationNotes.silverSmiteFeatFeatures:Requires Smite Evil'
      ];
      rules.defineRule('validationNotes.silverSmiteFeatDeity',
        'feats.Silver Smite', '=', '-1',
        'deity', '+', 'source == "The Silver Flame" ? 1 : null'
      );
    } else if(feat == 'Song Of The Heart') {
      notes = [
        'featureNotes.songOfTheHeartFeature:+1 Bardic Music effects',
        'validationNotes.songOfTheHeartFeatFeatures:' +
          'Requires Bardic Music/Inspire Competence',
        'validationNotes.songOfTheHeartFeatSkills:Requires Perform >= 6'
      ];
      rules.defineRule('validationNotes.songOfTheHeartFeatFeatures',
        'feats.Song Of The Heart', '=', '-2',
        'features.Bardic Music', '+', '1',
        'features.Inspire Competence', '+', '1'
      );
      rules.defineRule('validationNotes.songOfTheHeartFeatSkills',
        'feats.Song Of The Heart', '=', '-1',
        'subskillTotal.Perform', '+', 'source >= 6 ? 1 : null'
      );
    } else if(feat == 'Soothe The Beast') {
      notes = [
        'skillNotes.sootheTheBeastFeature:Perform to change animal reaction',
        'validationNotes.sootheTheBeastFeatFeatures:Requires Bardic Music',
        'validationNotes.sootheTheBeastFeatSkills:Requires Perform >= 6'
      ];
      rules.defineRule('validationNotes.sootheTheBeastFeatFeatures',
        'feats.Soothe The Beast', '=', '-1',
        'features.Bardic Music', '+', '1'
      );
      rules.defineRule('validationNotes.sootheTheBeastFeatSkills',
        'feats.Soothe The Beast', '=', '-1',
        'subskillTotal.Perform', '+', 'source >= 6 ? 1 : null'
      );
    } else if(feat == 'Spontaneous Casting') {
      notes = [
        'magicNotes.spontaneousCastingFeature:' +
          'Spend 2 AP to substitute any known spell for a prepared one',
        'validationNotes.spontaneousCastingFeatLevels:' +
          'Requires Caster Level >= 5'
      ];
      rules.defineRule('validationNotes.spontaneousCastingFeatLevels',
        'feats.Spontaneous Casting', '=', '-1',
        'casterLevel', '+', 'source >= 5 ? 1 : null'
      );
    } else if(feat == 'Strong Mind') {
      notes = [
        'saveNotes.strongMindFeature:+3 vs. psionics',
        'validationNotes.strongMindFeatAbilities:Requires Wisdom >= 11'
      ];
      rules.defineRule('validationNotes.strongMindFeatAbilities',
        'feats.Strong Mind', '=', '-1',
        'wisdom', '+', 'source >= 11 ? 1 : null'
      );
    } else if(feat == 'Totem Companion') {
      notes = [
        'companionNotes.totemCompanionFeature:' +
          'Totem magical beast as animal companion',
        'validationNotes.totemCompanionFeatFeatures:' +
          'Requires Beast Totem/Wild Empathy'
      ];
      rules.defineRule('validationNotes.totemCompanionFeatFeatures',
        'feats.Totem Companion', '=', '-2',
        'features.Beast Totem', '+', '1',
        'features.Wild Empathy', '+', '1'
      );
    } else if(feat == 'Undead Empathy') {
      notes = [
        'skillNotes.undeadEmpathyFeature:' +
          '+4 Diplomacy to influence undead reaction',
        'validationNotes.undeadEmpathyFeatAbilities:Requires Charisma >= 13'
      ];
      rules.defineRule('validationNotes.undeadEmpathyFeatAbilities',
        'feats.Undead Empathy', '=', '-1',
        'charisma', '+', 'source >= 13 ? 1 : null'
      );
    } else if(feat == 'Urban Tracking') {
      notes = [
        'skillNotes.urbanTrackingFeature:' +
          'Gather Information to trace person w/in communities'
      ];
    } else if(feat == 'Vermin Companion') {
      notes = [
        'featureNotes.verminCompanionFeature:' +
          'Vermin creature as animal companion',
        'validationNotes.verminCompanionFeatAlignment:' +
          'Requires Alignment != Good',
        'validationNotes.verminCompanionFeatFeatures:Requires Child Of Winter',
        'validationNotes.verminCompanionFeatLevels:Requires Druid >= 3'
      ];
      rules.defineRule('validationNotes.verminCompanionFeatAlignment',
        'feats.Vermin Companion', '=', '-1',
        'alignment', '+', 'source.indexOf("Good") < 0 ? 1 : null'
      );
      rules.defineRule('validationNotes.verminCompanionFeatFeatures',
        'feats.Vermin Companion', '=', '-1',
        'features.Child Of Winter', '+', '1'
      );
      rules.defineRule('validationNotes.verminCompanionFeatLevels',
        'feats.Vermin Companion', '=', '-1',
        'levels.Druid', '+', 'source >= 3 ? 1 : null'
      );
    } else if(feat == 'Vermin Shape') {
      notes = [
        'magicNotes.verminShapeFeature:Wild Shape into vermin',
        'validationNotes.verminShapeFeatAlignment:Requires Alignment != Good',
        'validationNotes.verminShapeFeatFeatures:Requires Child Of Winter',
        'validationNotes.verminShapeFeatLevels:Requires Druid >= 5'
      ];
      rules.defineRule('validationNotes.verminShapeFeatAlignment',
        'feats.Vermin Shape', '=', '-1',
        'alignment', '+', 'source.indexOf("Good") < 0 ? 1 : null'
      );
      rules.defineRule('validationNotes.verminShapeFeatFeatures',
        'feats.Vermin Shape', '=', '-1',
        'features.Child Of Winter', '+', '1'
      );
      rules.defineRule('validationNotes.verminShapeFeatLevels',
        'feats.Vermin Shape', '=', '-1',
        'levels.Druid', '+', 'source >= 5 ? 1 : null'
      );
    } else if(feat == 'Wand Mastery') {
      notes = [
        'magicNotes.wandMasteryFeature:+2 spell DC/caster level w/wands',
        'validationNotes.wandMasteryFeatFeatures:Requires Craft Wand',
        'validationNotes.wandMasteryFeatLevels:Requires Caster Level >= 9'
      ];
      rules.defineRule('validationNotes.wandMasteryFeatFeatures',
        'feats.Wand Mastery', '=', '-1',
        'features.Craft Wand', '+', '1'
      );
      rules.defineRule('validationNotes.wandMasteryFeatLevels',
        'feats.Wand Mastery', '=', '-1',
        'casterLevel', '+', 'source >= 9 ? 1 : null'
      );
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
      rules.defineRule('validationNotes.wardenInitiateFeatFeatures',
        'feats.Warden Initiate', '=', '-1',
        'features.Spontaneous Druid Spell', '+', '1'
      );
    } else if(feat == 'Whirling Steel Strike') {
      notes = [
        'combatNotes.whirlingSteelStrikeFeature:Flurry Of Blows with Longsword',
        'validationNotes.whirlingSteelStrikeFeatFeatures:' +
          'Requires Flurry Of Blows/Weapon Focus (Longsword)'
      ];
      rules.defineRule('validationNotes.whirlingSteelStrikeFeatFeatures',
        'feats.Whirling Steel Strike', '=', '-2',
        'features.Flurry Of Blows', '+', '1',
        'features.Weapon Focus (Longsword)', '+', '1'
      );
    } else
      continue;
    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);
  }

};

/* Defines the rules related to Eberron Chapter 5, Magic. */
Eberron.magicRules = function(rules, classes, domains) {

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
            school = PH35.spellsSchools[spell];
          }
          if(school == null) {
            continue;
          }
          spell += '(' + pieces[0] + ' ' + school.substring(0, 4) + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }
  }

  for(var i = 0; i < domains.length; i++) {
    var domain = domains[i];
    var notes;
    var spells;
    var turn;
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
          '+10 Profession (earn a living)/Appraise is a class skill'
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
        'magicNotes.meditationDomain:' +
          'x1.5 designated spell variable effects 1/day'
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
        'combatNotes.passionDomain:Rage %V rounds/day'
      ];
      spells = [
        'Cause Fear', 'Tasha\'s Hideous Laughter', 'Confusion',
        'Crushing Despair', 'Greater Command', 'Greater Heroism',
        'Song Of Discord', 'Otto\'s Irresistible Dance', 'Dominate Monster'
      ];
      rules.defineRule('combatNotes.passionDomain', 'levels.Cleric', '=', null);
    } else if(domain == 'Shadow') {
      notes = [
        'featureNotes.shadowDomain:Blind Fight bonus feat'
      ];
      spells = [
        'Obscuring Mist', 'Darkness', 'Deeper Darkness', 'Shadow Conjuration',
        'Shadow Evocation', 'Shadow Walk', 'Greater Shadow Conjuration',
        'Greater Shadow Evocation', 'Shades'
      ];
      rules.defineRule
        ('features.Blind Fight', 'featureNotes.shadowDomain', '=', '1');
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
        if(school == null) {
          school = PH35.spellsSchools[spell];
        }
        if(school == null) {
          continue;
        }
        spell += '(' + domain + (j + 1) + ' ' + school.substring(0, 4) + ')';
        rules.defineChoice('spells', spell);
      }
    }
    if(turn != null) {
      var domainLevel = 'domainLevel.' + domain;
      var prefix = 'turn' + turn;
      rules.defineRule(domainLevel,
        'domains.' + domain, '?', null,
        'levels.Cleric', '=', null
      );
      rules.defineRule(prefix + '.level', domainLevel, '+=', null);
      rules.defineRule(prefix + '.damageModifier',
        prefix + '.level', '=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule(prefix + '.frequency',
        prefix + '.level', '=', '3',
        'charismaModifier', '+', null
      );
      rules.defineRule(prefix + '.maxHitDice',
        prefix + '.level', '=', 'source * 3 - 10',
        'charismaModifier', '+', null
      );
      rules.defineNote([
        prefix + '.damageModifier:2d6+%V',
        prefix + '.frequency:%V/day',
        prefix + '.maxHitDice:(d20+%V)/3'
      ]);
    }
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
        'abilityNotes.cliffwalkFeature:' +
          '+2 Dexterity/20 climb speed while shifting',
        'abilityNotes.longstrideFeature:+2 Dexterity/+10 speed while shifting',
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
