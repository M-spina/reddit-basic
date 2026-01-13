import '../styles/Loader.css';

export default function Loader({message = "Loading..."}) {
    return (
        <div className='loader'>
            <div className='loader__spinner'></div>
            <p className='loader__message'>{message}</p>
        </div>
    )
}