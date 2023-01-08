import { useState, useEffect } from "react";
import styled from "styled-components";
import { dangerouslySetInnerHTML } from "react";
import axios from "axios";
import styleApp from "../App.css";

//============================= Speech Recognition ==========================
var SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
const assistName = "OpenAi";
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "fr-FR";

function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  const allVoices = speechSynthesis.getVoices();
  speech.voice = allVoices[5];
  speech.text = message;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
}

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const [AIResponse, setAIResponse] = useState("");
  const [vocalPrompt, setVocalPrompt] = useState("");
  const [requestLoader, setRequestLoader] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const fetchOpenAi = async () => {
    const testWhiteSpace = userPrompt.trim();
    if (userPrompt.length < 3 || testWhiteSpace.length === 0) {
      alert("invalid request (too small)");
      return;
    } else {
      setRequestLoader(true);
      axios
        .post("https://sannier-renaud.fr/portfolio/js-assist/OPEN-AI-API", {
          prompt: userPrompt,
        })
        .then((response) => {
          console.log(response.data);
          setAIResponse(response.data);
          setRequestLoader(false);
          setUserPrompt("");
        })
        .catch((err) => {
          console.log(err);
        });

      const requestLoaderDiv = document.getElementById("request-loader");
      let dots = ".";
      const interval = setInterval(() => {
        if (dots.length === 10) {
          dots = ".";
        } else {
          dots += ".";
        }
        requestLoaderDiv.innerHTML = dots;
      }, 100);
      if (setRequestLoader === true) {
      }
      setAIResponse("");
    }
  };

  const startListening = async () => {
    if (isListening) recognition.stop();
    recognition.start();
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onresult = async (event) => {
      let current = event.resultIndex;
      if (event.results[current].isFinal) {
        let transcript = event.results[current][0].transcript;
        setUserPrompt(transcript);

        recognition.stop();
        const testWhiteSpace = transcript.trim();
        if (transcript.length < 3 || testWhiteSpace.length === 0) {
          alert("invalid request (too small)");
          return;
        } else {
          axios
            .post("https://sannier-renaud.fr/portfolio/js-assist/OPEN-AI-API", {
              prompt: transcript,
            })
            .then((response) => {
              setAIResponse(response.data);
              setRequestLoader(false);
              setUserPrompt("");
              const text = response.data;
              const resultToSpeech = text.replace(/<[^>]*>/g, "");
              const readyToSpeech = resultToSpeech.replace("&#129302", "");
              readOut(readyToSpeech);
            })
            .catch((err) => {
              console.log(err);
            });
          setRequestLoader(true);
          const requestLoaderDiv = document.getElementById("request-loader");
          let dots = ".";
          const interval = setInterval(() => {
            if (dots.length === 10) {
              dots = ".";
            } else {
              dots += ".";
            }
            requestLoaderDiv.innerHTML = dots;
          }, 100);
          if (setRequestLoader === true) {
          }
          setAIResponse("");
        }
      }
    };
  };

  return (
    <Container>
      <div className="form">
        <div id="input-mic">
          <input
            value={userPrompt}
            type="text"
            name="query"
            id="input-query"
            placeholder="Ask something..."
            onChange={(event) => setUserPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                fetchOpenAi();
              }
            }}
          />
          <i
            onClick={startListening}
            className={
              isListening === true
                ? "fa-solid fa-circle listen"
                : "fa-solid fa-microphone mic"
            }
          ></i>
        </div>

        <button
          className={requestLoader === true ? "hidden" : "btn-send"}
          type="submit"
          onClick={fetchOpenAi}
        >
          Send
        </button>
        <div
          className={requestLoader === true ? "" : "hidden"}
          id="request-loader-design"
        >
          <p
            className={requestLoader === true ? "" : "hidden"}
            id="request-loader"
          ></p>
        </div>
        <div className="ia-response">
          <div
            className="response-design"
            dangerouslySetInnerHTML={{ __html: AIResponse }}
          ></div>
        </div>
        <br />
      </div>
    </Container>
  );
}

const Container = styled.div`
  #input-mic {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .listen {
    position: relative;
    left: -40px;
    animation: listening 1s infinite;

    color: #e45959;
    font-size: 1.5rem;
    &:hover {
      cursor: pointer;
    }
  }
  @keyframes listening {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  .mic {
    padding-left: 5px;
    padding-right: 2px;
    position: relative;
    left: -40px;
    color: white;
    font-size: 1.5rem;
    &:hover {
      cursor: pointer;
    }
  }
  .hidden {
    display: none;
  }
  #request-loader-design {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    color: #eabefc;
    font-size: 4rem;
  }
  #request-loader {
    margin: 0;
    position: relative;
    top: -2rem;
  }
  .ia-response {
    p {
      font-weight: 600;
      font-size: 1.1rem;
      text-align: center;
    }
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .response-design {
    width: 80vw;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 2em;
  }
  .ai-response {
    text-align: center;
    margin-left: auto;
    margin-right: auto;

    font-size: 1.5rem;
  }
  .form {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    justify-content: center;
  }
  #input-query {
    color: white;
    border: none;
    background-image: repeating-linear-gradient(
        45deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        112.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        22.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        67.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        45deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        157.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        112.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        135deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        67.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        135deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      linear-gradient(90deg, rgb(0, 0, 0), rgb(0, 0, 0));
    width: 80vw;
    height: 30px;
    border-radius: 0.5rem;
    padding: 10px 20px;
    font-size: 1.3rem;
  }
  .btn-send {
    user-select: none;
    background-image: repeating-linear-gradient(
        45deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        112.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        22.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        67.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        45deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        157.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        112.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        135deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        67.5deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        135deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(90, 90, 90, 0.03) 0px,
        rgba(90, 90, 90, 0.03) 1px,
        transparent 1px,
        transparent 12px
      ),
      linear-gradient(90deg, rgb(0, 0, 0), rgb(0, 0, 0));
    color: white;
    width: 200px;
    height: 50px;
    border-radius: 0.5rem;
    font-size: 1.3rem;
    transition: 0.2s;

    &:hover {
      cursor: pointer;
      box-shadow: 2px 2px 10px rgba(5, 5, 5, 0.726);
      transition: 0.2s;
    }
  }
`;
