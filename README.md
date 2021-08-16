## Eberron plugin for the Quilvyn RPG character sheet generator

The quilvyn-eberron package bundles modules that extend Quilvyn to work with
the Eberron campaign setting, applying the rules of the
<a href="https://www.dmsguild.com/product/28474/Eberron-Campaign-Setting-3e">3rd edition campaign setting rulebook</a>.

### Requirements

quilvyn-eberron relies on the core and srd35 modules installed by the
quilvyn-core package.

### Installation

To use quilvyn-eberron, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['Eberron Campaign Setting using D&D v3.5 rules'] = {
      url:'plugins/Eberron.js',
      group:'v3.5',
      require:'D&D v3.5'
    };

### Usage

Once the quilvyn-eberron package is installed as described above, start Quilvyn
and choose 'Eberron - D&D v3.5' from the rule sets menu in the initial window.
