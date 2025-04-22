import { Link } from 'react-router-dom';
import Logo from "../../assets/logo.svg";

export default function FormatLogo(){
  return(
    <>
    <Link to="/" className="flex items-center gap-2">
      <img src={Logo} className="h-8" alt="Logo" />
      <span className="text-xl font-semibold tracking-wide">Novotel</span>
    </Link>
    </>
  )
}