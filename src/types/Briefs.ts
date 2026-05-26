export interface Brief {
    conversation_id: number
    content: string
    summary: string,
    created_at: string
    title: string,
    status: string,
    conversations: {
        clients: {
            first_name: string
            last_name: string
            organisation: string
        }
    }
}