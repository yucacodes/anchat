import { useEffect, useState } from 'react'
import styles from './JoinChatForm.module.css'
import { Socket } from 'socket.io-client'


export interface JoinChatFormProps {
  onSetNickname: (userName: string) => void
  onSetNotificationText: (notificationText: string) => void
  socket: Socket
  roomId: string
  joinedOrCreatedRoom: string
}

export function JoinChatForm({ onSetNickname, onSetNotificationText, socket, roomId, joinedOrCreatedRoom }: JoinChatFormProps) {


  /*Este useState se usa para ocultar por defecto el contenido de JoinChatPage
  con la finalidad de averiguar si hay algun nickname en sessionStorage */
  const [nicknameFromChatPage, setNicknameFromChatPage] = useState(true)

  /*Se ejecuta al renderizar el componente.
  Si hay algun nickname almacenado en sessionStorage 
  lo retorna con la funcion onsetNickname, en caso que 
  no haya ningun nickname en sessionStorage (quiere decir 
  que se va a crear), muesra el contenido de JoinChatPage 
  para ingresar el nickname*/
  useEffect(() => {

    if (sessionStorage.getItem("nickname")) {
      onSetNickname(sessionStorage.getItem("nickname")!)
    }
    else {
      setNicknameFromChatPage(false)
    }
  }, [])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userNickname = event.currentTarget["nickname"].value;
    onSetNickname(userNickname);
    socket.emit("NotificationRoomJoin", { room: roomId, nickname: userNickname });
    socket.on("NotificationRoomJoinOk", (message) => {
      if (joinedOrCreatedRoom.localeCompare("joinedToRoom") == 0) {
        onSetNotificationText(message.message);
        /*En un else se le podria agregar una notificacion para
        aquellos entran al chat despues de haber creado el room */
      }
    });

  }

  return (
    <>
      {!nicknameFromChatPage && (
        <form onSubmit={onSubmit} className={styles.root}>
          <div className={styles.paragraphInfoSection}>
            <h2>Tienes nombre?</h2>
            <p className={styles.infP1}>
              Ingresa un nombre para poder iniciar <br />
              la conversación
            </p>
          </div>

          <div className={styles.inputsSection}>
            <input
              name="nickname"
              type="text"
              maxLength={40}
              minLength={4}
              className={styles.userNameInput}
              placeholder=" "
              required
            />
            <button type="submit" className={styles.submitButton}>Guardar</button>
            <div className={styles.requirements}>
              Debe tener al menos cuatro caracteres
            </div>
          </div>

          <div className={styles.randomName}>
            <a href="#">Generar nombre random</a>
          </div>

        </form>
      )}
    </>
  )
}

