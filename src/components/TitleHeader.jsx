const TitleHeader = ({ title, sub }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm uppercase tracking-widest text-gray-500 font-medium">
        {sub}
      </p>
      <h2 className="font-semibold md:text-4xl text-2xl text-center">
        {title}
      </h2>
    </div>
  );
};

export default TitleHeader;
