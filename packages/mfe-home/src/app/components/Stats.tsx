'use cliente'

interface Stat {
  number: string;
  label: string;
}

interface StatsProps {
  stats: Stat[];
}

export default function Stats({ stats }: StatsProps) {
  return (
    <section className="stats">
      {stats.map((stat, idx) => (
        <div key={idx} className="card-stats">
          <div className="number text-color-white">{stat.number}</div>
          <div className="label text-color-white">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}