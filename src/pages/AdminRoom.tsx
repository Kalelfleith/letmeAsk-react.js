import { useNavigate, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom';
import logoImg from '../assets/imgs/logo.svg';
import deleteImg from '../assets/imgs/delete.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import '../styles/question.scss';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useNavigate();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { title, questions } = useRoom(roomId!);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history('/');
    }

    async function handleDeleteQuestion(questionId: string) {
       if (window.confirm('Você tem certeza qeu deseja excluir essa pergunta ?')) {
           const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
       }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId!} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div> 
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author} 
                            >
                                <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover perguntas" />
                                </button>
                            </Question>
                        );
                    })};
                </div>
            </main>
        </div>
    );
}