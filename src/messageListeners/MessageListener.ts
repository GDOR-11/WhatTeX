import wppconnect from "@wppconnect-team/wppconnect"

/** Ultimately how you add new behaviour (unless the new behaviour is unrelated to messages) */
type MessageListener = {
    /** Determines wether the listener should be called if the message is sent from a serious group. */
    unseriousGroupsOnly: boolean,
    /** The type of message this listens to */
    type: wppconnect.MessageType,
    /** Determines wether the caller should activate the listener or not */
    callerHasPermission: (caller: wppconnect.Contact) => boolean,
    /** The listener which gets called every time a message is sent */
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => void,
    /** help message, in portuguese */
    helpMessage: string
}

export default MessageListener;
