import { useHistory } from 'react-router-dom';

import asideImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { useAuthContext } from '../hooks/useAuthContext';

import '../styles/auth.scss';
import { FormEvent, useState } from 'react';
import { getDatabaseRef } from '../services/firebase';
import { get } from '@firebase/database';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuthContext();
  const [ roomCode, setRoomCode] = useState('');

  async function handleCreateNewRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return false;
    }

    const roomRef = await get(getDatabaseRef(`rooms/${roomCode}`));

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={asideImg} alt="Imagem pergunta e respostas" />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Imagem logo" />
          <button className="create-room" onClick={handleCreateNewRoom}>
            <img src={googleIconImg} alt="Logo Google" />
            Crie sua sala com o google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button>
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}