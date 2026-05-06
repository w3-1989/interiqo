import { Link } from "react-router-dom";

export default function NotFoundPage (){
    return (
        <>
        <h1>You lost fool!</h1>
        <Link to ={"/"}>
            <button>
                Go home!
            </button>
        </Link>
        
        </>
    )
}