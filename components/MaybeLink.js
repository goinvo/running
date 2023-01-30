const MaybeLink = ({ children, link }) => {
  if (link) {
    return <a href={link}>{children}</a>;
  }
  return <>{children}</>;
};

export default MaybeLink;
