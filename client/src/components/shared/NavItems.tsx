const NavItems = () => {
  const isActive = true;
  return (
    <ul className="flex flex-col gap-5 items-start md:items-center md:justify-between w-full md:flex-row">
      <li
        className={`${
          isActive && "text-purple-700/95"
        } flex items-center justify-center font-medium text-xl whitespace-nowrap`}
      >
        Home
      </li>
      <li>Create Event</li>
      <li>My Profile</li>
    </ul>
  );
};

export default NavItems;
