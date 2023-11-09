const letters= document.querySelectorAll('.scoreboard-letter'); //this gives us a node-list. It is array-like not an array though. 
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6; 

const WORDLE_URL = " ";


async function init(){

    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");

    //xhr = all ajax request. 

    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    let done = false;
    
    setLoading(false);
    isLoading = false;

    //Destructuring. 

    


    function addLetter(letter)
        {
            if(currentGuess.length < ANSWER_LENGTH)
            {
                currentGuess += letter; 
            }
            else
            {
                currentGuess = currentGuess.substring(0, currentGuess.length - 1); 
            }
            letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter; 
        }
        async function commit(){
            if (currentGuess.length != ANSWER_LENGTH)
            {
                //do nothing;  
                return; 
            }
           
            isLoading = true; 
            setLoading(true);
            const res = await fetch("https://words.dev-apis.com/validate-word",{
                method: "POST",
                body: JSON.stringify({word: currentGuess})
            });

            isLoading = false;
            setLoading(false); 
            const { validWord } = await res.json();

            if(!validWord){

                markInvalidWord();
                return;
            }


            //const resObj = await res.json();
            
            
            //const {validWord} = resObj; 

            //1. Validate the words
            //2. Do all the marking, correct, close, wrong
            const guessParts = currentGuess.split("");
            const map = makeMap(wordParts);
         

            for(let i = 0; i< ANSWER_LENGTH; i++)
            {
                //mark as Correct 
                if(guessParts[i] === wordParts[i])
                {
                    letters[currentRow * ANSWER_LENGTH + i].classList.add("correct"); 
                    map[guessParts[i]]--;
                    
                }
            }
            for(let i = 0; i < ANSWER_LENGTH; i++ )
            {
                if(guessParts[i] === wordParts[i])
                {
                    //do nothing, we have already handled it.
                }
                else if(wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0)
                {
                    //mark as close
                    letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
                    map[guessParts[i]]--;
                }
                else{
                    letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
                }
            }
            currentRow++; 
            

            if(currentGuess === word){
                //win
                alert("Victory Yay");
                document.querySelector('.brand').classList.add("winner");
                done = true;
                return; 
            }
            
            else if(currentRow === ROUNDS)
            {
                alert(`You Lose. The word was ${word}`);
                done = true; 
            }
            currentGuess = '';
        }

        function backspace(){
            currentGuess = currentGuess.substring(0, currentGuess.length-1);
            letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
        }

        function markInvalidWord(){
            alert(`Invalid word`);
            for (let i = 0; i < ANSWER_LENGTH; i++)
            {
                
                letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

                setTimeout(function () {
                    letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
                }, 10);
            }
        }
        
        
    document.addEventListener('keydown', function handleKeyPress(event){
        //Listening for keydown, since we are listening for backspace and return. 
        if(done || isLoading)
        {
            //do nothing
            return; 
        }

        const action = event.key; 

        if(action === 'Enter'){
            commit();
        }
        else if(action === 'Backspace'){
            backspace();
        }
        else if(isLetter(action)){
            addLetter(action.toUpperCase());
        }
        else{
            //Do Nothing
        }

       // implicit here return undefined;
    });
}


function isLetter(letter)
    {
        return /^[a-zA-Z]$/.test(letter);
    }
function setLoading(isLoading){
    loadingDiv.classList.toggle('hidden', !isLoading);

    //if loading == True add it, else hidden 

}

function makeMap(array){
    const obj = {};
    for(let i = 0; i < array.length; i++)
    {
        const letter = array[i];
        if(obj[letter])
        {
            obj[letter]++;
        }
        else{
            obj[letter] = 1;
        }
        return obj; 
    }
}
      
init();