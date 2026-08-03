type Props = {
  title: string;
  value: string;
};

function StatCard({ title, value }: Props) {
  return (
    <div className="stat-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default StatCard;