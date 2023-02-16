const { getRandomIntExclusive } = require('./util.service')

function getWord(level) {
    console.log('WORDS-L', WORDS[level])
    const randomIdx = getRandomIntExclusive(0, WORDS[level].length)
    console.log('length', WORDS[level].length)
    console.log('randomIdx', randomIdx)
    return WORDS[level][randomIdx]
}

const EASY_WORDS = ['sun', 'flower', 'heart', 'tree']
const MEDIUM_WORDS = ['dog', 'cat', 'umbrella', 'elephant']
const HARD_WORDS = ['view', 'face', 'lady']
const WORDS = { easy: EASY_WORDS, medium: MEDIUM_WORDS, hard: HARD_WORDS }

module.exports = {
    getWord
}