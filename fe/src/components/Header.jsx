function Header(){
  return (
  <div className="p-10 flex justify-between">
    <input type="text" placeholder="Search for rooms and offers" className="w-100 h-10 bg-amber-200 placeholder-right border p-2 "></input>
    <div>
      <div>Noti</div>
      <div>Avatar</div>
    </div>
    
  </div>
  );
};

export default Header;