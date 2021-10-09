import { FormEvent, useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuthContext } from '../hooks/useAuthContext';
import logoImg from '../assets/images/logo.svg';
import { useParams } from 'react-router-dom';

import '../styles/room.scss';
import { push, onValue, } from '@firebase/database';
import { getDatabaseRef } from '../services/firebase';

type RoomParams = {
  id: string;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean
}>

type Question = {
  id: string,
  author: {
    name: string,
    avatar: string,
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean
}

export function Room () {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  
  const { user, signInWithGoogle } = useAuthContext();
  
  const [ questions, setQuestions ] = useState<Question[]>([]);
  const [ title, setTitle ] = useState("");
  const [ newQuestion, setNewQuestion ] = useState("");

  useEffect(() => {
    const roomRef = getDatabaseRef(`rooms/${roomId}`);

    onValue(roomRef, (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return { 
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      });
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
  }, [roomId])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '')
      return;

    if (!user) {
      throw new Error("You must be logged in")
    }

    const question = {
      content: newQuestion,
      author : {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    const questionRef = getDatabaseRef(`room/${roomId}/questions`);

    await push(questionRef, question);
  }  
  
  return (    
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <RoomCode code={roomId} />
          </div>
        </header>
  
        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
          </div>
  
          <form onSubmit={handleSendQuestion}>
            <textarea
              placeholder="O que você quer perguntar?"
              onChange={event => setNewQuestion(event.target.value)}
              value={newQuestion}
            />
  
            <div className="form-footer">
              { user ? (
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span>Para enviar uma pergunta, <button onClick={() => signInWithGoogle()}>faça seu login</button>.</span>
              ) }
              <Button type="submit" disabled={!user}>Enviar pergunta</Button>
            </div>
          </form>
  
          {JSON.stringify(questions)}
        </main>
      </div>
  )
}