import { Link } from 'react-router-dom';

import asideImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';

export function NewRoom() {
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
          <form>
            <h2>Crie uma nova sala</h2>
            <input
              type="text"
              placeholder="Nome da sala"
            />
            <Button >
              Entrar na sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente?</p>
          <Link to="/">clique aqui</Link>
        </div>
      </main>

    </div>
  )
}