var createCFguide = require('./create-cf-machine.js')

/**
 * @typedef {string} PitchString - a string consisting of a music Letter [A-G], optional accidental,
 *                                 and optional octave number
 * @example
 * 'C4'     // middle C on a piano, the fourth octave
 * 'Eb3'    // Eb in octave 3
 * 'F#'     // no octave number provided, a pitch class
 * 'F##'    // F double sharp
 * 'Dbb'    // D double flat
 */

/**
 * @typedef {string} KeyString - a string consisting of a {@link PitchString} and a mode name
 *                               seperated by whitespace
 * @example
 * 'Eb major'
 * 'C minor'
 * 'F# dorian'
 */

/**
 * create a CantusFirmus that follows the rules of species counterpoint
 *
 * @constructor
 *
 * @param {KeyString} key - the key of this cf
 * @param {number} [maxRange=10] - the max range this machine will allow
 * @param {number} [maxLength=16] - the maxLength of this machine
 */
var CantusFirmus = function (key, maxRange, maxLength) {
  var guide = createCFguide(key, maxRange || 10, maxLength || 16)

  /**
   * the current cf
   * @returns {string[]} an array of pitch strings
   */
  this.cf = function () {
    return guide.construction()
  }

  /**
   * adds the given pitch to the cantus firmus
   * @param {PitchString} pitch - a pitch string in the current set of {@link CantusFirmus#nextNoteChoices}
   * @throws throws an error if given pitch is not in the
   *      current set of {@link CantusFirmus#nextNoteChoices}
   */
  this.addNote = function (pitch) {
    guide.choose(pitch)
  }

  /**
   * pop the last note choice off the cantus firmus
   * @throws throws an error if called when cantus firmus is empty
   * @returns {PitchString} the last pitch string of the cantus firmus
   * submitted through {@link CantusFirmus#addNote}
   */
  this.pop = function () {
    return guide.pop()
  }

  /**
   * @typedef {object} TreeNode
   * @property {PitchString} val - a pitch string
   * @property {TreeNode[]} next - a list of TreeNodes this node links to
   */

  /**
   * returns an array of all possible next pitches, or an array of
   * nDeep [TreeNodes]{@link TreeNode}.
   *
   * @param {number} [nDeep=1] - will search for nDeep possible choices
   * @returns {string[]|TreeNode[]} if nDeep=1, an array of pitch strings, else
   * an array of nDeep {@link TreeNodes}
   */
  this.nextNoteChoices = function (nDeep) {
    return guide.choices(nDeep || 1)
  }
}

module.exports = CantusFirmus