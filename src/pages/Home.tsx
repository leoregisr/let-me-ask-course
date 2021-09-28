import { useHistory } from 'react-router-dom';

import asideImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { userInfo } from 'os';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useContext(AuthContext);

  function handleCreateNewRoom() {
    if (!user) {
      signInWithGoogle();
    }
    history.push('/rooms/new');
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
          <br /><br /><br /><br />
          <h2>{user?.name}</h2>
          <img src={user?.profileImageUrl} />
          <button className="create-room" onClick={handleCreateNewRoom}>
            <img src={googleIconImg} alt="Logo Google" />
            Crie sua sala com o google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form>
            <input
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button >
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>

    </div>
  )
}