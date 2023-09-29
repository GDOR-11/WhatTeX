import wppconnect from "@wppconnect-team/wppconnect"

/** Ultimately how you add new behaviour (unless the new behaviour is unrelated to messages) */
type MessageListener = {
    /** Determines wether the listener should be called when the bot's number sent the message. Be careful, as setting this to true could cause an infinite self-reply chain */
    blockMessagesFromMe: boolean,
    /** Determines wether the listener should be called if the message is sent from a serious group. */
    unseriousGroupsOnly: boolean,
    /** The listener which gets called every time a message is sent */
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => void
}

export default MessageListener;
