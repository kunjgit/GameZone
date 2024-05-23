const wordsWithMeanings = {
    "aberration": "a departure from what is normal, usual, or expected, typically one that is unwelcome.",
    "abrogate": "to repeal or do away with a law, right, or formal agreement.",
    "acquiesce": "to accept something reluctantly but without protest.",
    "alacrity": "brisk and cheerful readiness.",
    "anathema": "something or someone that one vehemently dislikes.",
    "antediluvian": "extremely old; antiquated.",
    "apocryphal": "of doubtful authenticity, although widely circulated as being true.",
    "approbation": "approval or praise.",
    "arrogate": "to take or claim something for oneself without justification.",
    "ascetic": "characterized by severe self-discipline and abstention from all forms of indulgence.",
    "assiduous": "showing great care and perseverance.",
    "blandishment": "a flattering or pleasing statement or action used to persuade someone gently to do something.",
    "calumny": "the making of false and defamatory statements about someone in order to damage their reputation.",
    "capitulate": "cease to resist an opponent or an unwelcome demand; surrender.",
    "chicanery": "the use of trickery to achieve a political, financial, or legal purpose.",
    "circumlocution": "the use of many words where fewer would do, especially in a deliberate attempt to be vague or evasive.",
    "circumscribe": "restrict something within limits.",
    "commensurate": "corresponding in size or degree; in proportion.",
    "conflagration": "an extensive fire that destroys a great deal of land or property.",
    "contrite": "feeling or expressing remorse or penitence; affected by guilt.",
    "convivial": "friendly, lively, and enjoyable.",
    "credulity": "a tendency to be too ready to believe that something is real or true.",
    "cursory": "hasty and therefore not thorough or detailed.",
    "decry": "publicly denounce.",
    "demagogue": "a political leader who seeks support by appealing to the desires and prejudices of ordinary people rather than by using rational argument.",
    "denigrate": "criticize unfairly; disparage.",
    "didactic": "intended to teach, particularly in having moral instruction as an ulterior motive.",
    "disparate": "essentially different in kind; not allowing comparison.",
    "dissemble": "conceal one's true motives, feelings, or beliefs.",
    "ebullient": "cheerful and full of energy.",
    "effrontery": "insolent or impertinent behavior.",
    "egregious": "outstandingly bad; shocking.",
    "enervate": "cause someone to feel drained of energy or vitality; weaken.",
    "ephemeral": "lasting for a very short time.",
    "equanimity": "mental calmness, composure, and evenness of temper, especially in a difficult situation.",
    "equivocate": "use ambiguous language so as to conceal the truth or avoid committing oneself.",
    "exacerbate": "make a problem, bad situation, or negative feeling worse.",
    "execrable": "extremely bad or unpleasant.",
    "exigent": "pressing; demanding.",
    "expunge": "erase or remove completely something unwanted or unpleasant.",
    "extant": "still in existence; surviving.",
    "fallacious": "based on a mistaken belief.",
    "fastidious": "very attentive to and concerned about accuracy and detail.",
    "fatuous": "silly and pointless.",
    "fractious": "irritable and quarrelsome.",
    "garrulous": "excessively talkative, especially on trivial matters.",
    "gregarious": "fond of company; sociable.",
    "hackneyed": "lacking significance through having been overused; unoriginal and trite.",
    "hapless": "unfortunate.",
    "harangue": "a lengthy and aggressive speech.",
    "hegemony": "leadership or dominance, especially by one state or social group over others.",
    "iconoclast": "a person who attacks or criticizes cherished beliefs or institutions.",
    "impecunious": "having little or no money.",
    "impetuous": "acting or done quickly and without thought or care.",
    "implacable": "unable to be placated; relentless; unstoppable.",
    "impugn": "dispute the truth, validity, or honesty of a statement or motive; call into question.",
    "inchoate": "just begun and so not fully formed or developed; rudimentary.",
    "indefatigable": "persisting tirelessly.",
    "inexorable": "impossible to stop or prevent.",
    "ingenuous": "innocent and unsuspecting.",
    "invective": "insulting, abusive, or highly critical language.",
    "invidious": "likely to arouse or incur resentment or anger in others.",
    "laconic": "using very few words.",
    "legerdemain": "skillful use of one's hands when performing conjuring tricks.",
    "licentious": "promiscuous and unprincipled in sexual matters.",
    "lugubrious": "looking or sounding sad and dismal.",
    "mendacious": "not telling the truth; lying.",
    "multifarious": "many and of various types.",
    "nefarious": "wicked or criminal.",
    "neophyte": "a person who is new to a subject, skill, or belief.",
    "obdurate": "stubbornly refusing to change one's opinion or course of action.",
    "obfuscate": "render obscure, unclear, or unintelligible.",
    "obstreperous": "noisy and difficult to control.",
    "officious": "assertive of authority in an annoyingly domineering way, especially with regard to petty or trivial matters.",
    "paradigm": "a typical example or pattern of something; a model.",
    "partisan": "a strong supporter of a party, cause, or person.",
    "pejorative": "expressing contempt or disapproval.",
    "perfidious": "deceitful and untrustworthy.",
    "pertinacious": "holding firmly to an opinion or a course of action.",
    "platitude": "a remark or statement, especially one with a moral content, that has been used too often to be interesting or thoughtful.",
    "plethora": "a large or excessive amount of something.",
    "precipitate": "cause an event or situation, typically one that is bad or undesirable, to happen suddenly, unexpectedly, or prematurely.",
    "propensity": "an inclination or natural tendency to behave in a particular way.",
    "propitious": "giving or indicating a good chance of success; favorable.",
    "puerile": "childishly silly and trivial.",
    "quixotic": "exceedingly idealistic; unrealistic and impractical.",
    "recalcitrant": "having an obstinately uncooperative attitude toward authority or discipline.",
    "redoubtable": "formidable, especially as an opponent.",
    "reprobate": "an unprincipled person.",
    "rescind": "revoke, cancel, or repeal a law, order, or agreement.",
    "restive": "unable to keep still or silent and becoming increasingly difficult to control.",
    "rhapsodize": "speak or write about someone or something with great enthusiasm and delight.",
    "sanctimonious": "making a show of being morally superior to other people.",
    "sanguine": "optimistic or positive, especially in an apparently bad or difficult situation.",
    "scurrilous": "making or spreading scandalous claims about someone with the intention of damaging their reputation.",
    "spurious": "not being what it purports to be; false or fake.",
    "stolid": "calm, dependable, and showing little emotion or animation.",
    "surreptitious": "kept secret, especially because it would not be approved of.",
    "sycophant": "a person who acts obsequiously toward someone important in order to gain advantage.",
    "tantamount": "equivalent in seriousness to; virtually the same as.",
    "turgid": "swollen and distended or congested.",
    "ubiquitous": "present, appearing, or found everywhere.",
    "unctuous": "excessively flattering or ingratiating; oily.",
    "usurp": "take a position of power or importance illegally or by force.",
    "vacillate": "waver between different opinions or actions; be indecisive.",
    "vapid": "offering nothing that is stimulating or challenging; bland.",
    "vicissitude": "a change of circumstances or fortune, typically one that is unwelcome or unpleasant.",
    "vilify": "speak or write about in an abusively disparaging manner.",
    "vociferous": "vehement or clamorous.",
    "wanton": "deliberate and unprovoked.",
    "winsome": "attractive or appealing in appearance or character.",
    "zealous": "having or showing zeal."
};

let word='';
let meaning='';
let guessedWord='';
let attempts=7;
let initialAttempts=7;
let incorrectLetters=[];

function startGame(){
    const words=Object.keys(wordsWithMeanings);
    word=words[Math.floor(Math.random() * words.length)];
    meaning=wordsWithMeanings[word];
    guessedWord='_'.repeat(word.length);
    attempts=word.length + 2;
    initialAttempts=attempts;
    incorrectLetters=[];

    document.getElementById('word').textContent=guessedWord.split('').join(' ');
    document.getElementById('attemptsDisplay').textContent=`Attempts left: ${attempts}`;
    document.getElementById('message').textContent='';
    document.getElementById('meaning').textContent='';
    document.getElementById('incorrectWords').textContent='Incorrect letters: ';
    document.getElementById('guess').disabled=false;

    updateProgressBar();
}

function updateProgressBar(){
    const progressBar=document.getElementById('attemptsBar');
    const percentage=(attempts/initialAttempts) * 100;
    progressBar.style.width=`${percentage}%`;
}

function makeGuess(){
    const guessInput=document.getElementById('guess');
    const guess=guessInput.value.toLowerCase();
    guessInput.value='';

    if(guess.length!==1||!/^[a-z]$/.test(guess)){
        document.getElementById('message').textContent='Please enter a single letter.';
        return;
    }
    
    if(guessedWord.includes(guess)||incorrectLetters.includes(guess)){
        document.getElementById('message').textContent='You have already guessed that letter.';
        return;
    }

    if(word.includes(guess)){
        document.getElementById('correctSound').currentTime=0;
        document.getElementById('correctSound').play();

        let newGuessedWord='';
        for(let i=0;i<word.length;i++){
            newGuessedWord += word[i] === guess ? guess : guessedWord[i];
        }
        guessedWord=newGuessedWord;
        document.getElementById('word').textContent=guessedWord.split('').join(' ');
        document.getElementById('message').textContent='';
    } else{
        document.getElementById('incorrectSound').currentTime=0;
        document.getElementById('incorrectSound').play();
        attempts--;
        incorrectLetters.push(guess);
        document.getElementById('attemptsDisplay').textContent=`Attempts left: ${attempts}`;
        document.getElementById('message').textContent='Incorrect guess!';
        document.getElementById('incorrectWords').textContent=`Incorrect letters: ${incorrectLetters.join(', ')}`;
    }

    updateProgressBar();

    if(guessedWord===word){
        document.getElementById('message').textContent='Congratulations! You guessed the word!';
        document.getElementById('win').currentTime=0;
        document.getElementById('win').play();
        document.getElementById('meaning').textContent=`Meaning: ${meaning}`;
        document.getElementById('guess').disabled=true;
    } else if(attempts<=0){
        document.getElementById('message').textContent=`Game over! The word was "${word}".`;
        document.getElementById('lose').currentTime=0;
        document.getElementById('lose').play();
        document.getElementById('meaning').textContent=`Meaning: ${meaning}`;
        document.getElementById('guess').disabled=true;
    }
}

document.addEventListener('DOMContentLoaded',startGame);
