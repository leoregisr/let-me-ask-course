import { Link, useHistory } from 'react-router-dom';

import asideImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { FormEvent, useState } from 'react';
import { getDatabaseRef } from '../services/firebase';
import { push } from '@firebase/database';
import { useAuthContext } from '../hooks/useAuthContext';

export function NewRoom() {
  const { user } = useAuthContext();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory()

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return false;
    }

    const roomRef = getDatabaseRef('rooms')

    const firebaseRoom = await push(roomRef, {
      title: newRoom,
      authorId: user?.id
    });

    history.push(`/rooms/${firebaseRoom.key}`)
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
          <form onSubmit={handleCreateRoom}>
            <h2>Crie uma nova sala</h2>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente?</p>
          <Link to="/">clique aqui</Link>
        </div>
      </main>

    </div>
  )
}