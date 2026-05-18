type contentBlock = {
    type:string, 
    source:{type:string, file_id:string}
}


export interface Messages  {
    role: "user" | "assistant",
    content: string | contentBlock[]
}