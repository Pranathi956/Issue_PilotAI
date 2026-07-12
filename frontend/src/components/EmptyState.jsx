const EmptyState = ({ title, message }) => {
  return (
    <div className="bg-white rounded shadow p-6 text-center text-slate-500">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default EmptyState;
