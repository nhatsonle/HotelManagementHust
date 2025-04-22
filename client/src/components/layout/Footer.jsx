import { Link } from 'react-router-dom';
import FormatLogo from "../ui/Logo";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

function Footer(){
  return(
    <footer className='flex justify-between items-center px-10 py-20 bg-black text-white font-body flex-col md:flex-row lg:flex-row gap-6'>
      <FormatLogo />
        
        <div className='flex gap-4 '>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className='hover:text-blue-600'>
            <FaFacebook size={24} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className='hover:text-blue-600'>
            <FaInstagram size={24} />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className='hover:text-blue-600'>
            <FaTwitter size={24} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className='hover:text-blue-600'>
            <FaYoutube size={24} />
          </a>
        </div>

        <div className='text-sm '>
          <p>&copy; 2025 Novotel. All rights reserved.</p>
        </div>

    </footer>
  )
}

export default Footer;