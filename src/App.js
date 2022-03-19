import React,{useState,useEffect,useRef} from 'react';
import randomWords from 'random-words';


const NUMBER_OF_WORDS = 200;
const SECONDS = 60;
const App = () => {
    const [words,setWords] = useState([]);
    const [countDown,setCountDown] = useState(SECONDS);
    const [currentInput,SetCurrentInput] = useState("");
    const [currWordIndex,setCurrWordIndex] = useState(0);
    const [currCharIndex,setCurrCharIndex] = useState(-1);
    const [currChar,setCurrChar] = useState("");
    const [correct,setCorrect] = useState(0);
    const [incorrect,setIncorrect] = useState(0);
    const [status,setStatus] = useState("waiting");
    const textInput = useRef(null)

    useEffect(() => {
            setWords(generateWords())
    },[])
    
    useEffect(() => {
        if(status === 'started'){
            textInput.current.focus()   
        }
    },[status])

    function generateWords(){
        return new Array(NUMBER_OF_WORDS).fill(null).map(() =>randomWords())
    }
    function start(){
        if(status === 'finished'){
            setWords(generateWords())
            setCurrWordIndex(0)
            setCorrect(0)
            setIncorrect(0)
            setCurrCharIndex(-1)
            setCurrChar("")

        }
        if(status !== 'started'){
            setStatus('started')
            let interval = setInterval(() =>{
                setCountDown((prevCountdown) => {
                    if (prevCountdown === 0){
                        clearInterval(interval)
                        setStatus('finished')
                        SetCurrentInput("")
                        return SECONDS
                    }
                    else{
                    return prevCountdown - 1
                }
                })
            },1000)
        }
    }
    function handleKeyDown({keyCode,key}){
        if(keyCode === 32){
            checkMatch()
            SetCurrentInput("")
            setCurrWordIndex(currWordIndex + 1)
            setCurrCharIndex(-1)
        }else if(keyCode === 8){
            setCurrCharIndex(currCharIndex - 1)
            setCurrChar("")

        }
        else{
            setCurrCharIndex(currCharIndex + 1)
            setCurrChar(key)
        }
    }
    function checkMatch(){
        const wordToCompare = words[currWordIndex]
        const doesItMatch = wordToCompare === currentInput.trim()
        if (doesItMatch) {
            setCorrect(correct + 1)
          } else {
            setIncorrect(incorrect + 1)
          }
    }
    function getCharClass(wordIdx, charIdx, char) {
        if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
          if (char === currChar) {
            return 'has-background-success'
          } else {
            return 'has-background-danger'
          }
        } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
          return 'has-background-danger'
        } else {
          return ''
        }
      }
    
      const myStyle={
        backgroundImage: `url(./img/keyboard.jpg)`,
        height:'112vmin',
        backgroundSize:'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment:'fixed'
    };
    //document.body.style.backgroundColor = "hsl(0, 0%, 5%)";
return (
    <div className="App" style={myStyle}>
        <div className="sections ">
            <div className="is-size-1 has-text-centered has-text-primary" >
            <h2 style={{fontWeight:600}}>{countDown}</h2>
            </div>
        </div>
        <div className="control is-expanded section">
            <input ref={textInput} disabled={status !== "started"} type="text" className="input" onKeyDown={handleKeyDown} value={currentInput} onChange={(e) =>SetCurrentInput(e.target.value)}/>
        </div>
        <div className="section">
            <button className="button is-info is-fullwidth" onClick={start}>
                Start
            </button>
        </div>
        {status === "started" && (
            <div className="section">
                <div className="card">
                    <div className="card-content">
                        <div className="content">
                        {words.map((word,i)=>(
                            <span key={i}>
                            <span>
                                {word.split("").map((char,idx) =>(
                                    <span className={getCharClass(i,idx,char)} key={idx}>{char}</span>
                                ))}
                            </span>
                            <span> </span>
                            </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
    
        )}
        {status === "finished" && (
            <div className="section">
                <div className="columns">
                    <div className="column has-text-centered">
                        <p className="is-size-5 has-text-white">Words per minute:</p>
                        <p className="has-text-success is-size-1" style={{fontWeight:600}}>
                        {correct+incorrect}
                        </p>
                    </div>
                    <div className="column has-text-centered">
                        <p className="is-size-5 has-text-white">Mistakes:</p>
                        <p className="has-text-danger is-size-1" style={{fontWeight:600}}>
                        {incorrect}
                        </p>
                    </div>
                    <div className="column has-text-centered">
                        <div className="is-size-5 has-text-white">Accuracy:</div>
                        {correct !== 0 ? (
                            <p className="has-text-info is-size-1" style={{fontWeight:600}}>
                            {Math.round((correct / (correct + incorrect)) * 100)}%
                            </p>
                            ) : (
                            <p className="has-text-info is-size-1" style={{fontWeight:600}}>0%</p>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default App;