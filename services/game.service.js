const { getRandomIntExclusive } = require('./util.service')

const EASY_WORDS = ['sun', 'flower', 'heart', 'tree']
const MEDIUM_WORDS = ['dog', 'cat', 'umbrella', 'elephant']
const HARD_WORDS = ['view', 'face', 'lady']
const WORDS = { easy: EASY_WORDS, medium: MEDIUM_WORDS, hard: HARD_WORDS }

function getWord(level) {
    const lowerCaseLevel = level.toLowerCase()
    const randomIdx = getRandomIntExclusive(0, WORDS[lowerCaseLevel].length)
    // console.log('length', WORDS[level].length)
    // console.log('randomIdx', randomIdx)
    const chosedWord = WORDS[lowerCaseLevel][randomIdx]
    return chosedWord
}


module.exports = {
    getWord
}