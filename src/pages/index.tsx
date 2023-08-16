import Head from "next/head";
import { Layout, Dashboard } from "components";
import { useDashboardService } from "app/services";
import { DashboardData } from "app/models/dashboard";
import { RotaAutenticada } from "components";

interface HomeProps {
  dashboard: DashboardData;
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  return (
    <div>
      <Layout titulo="Dashboard">
        <Dashboard
          clientes={props.dashboard.clientes}
          produtos={props.dashboard.produtos}
          vendas={props.dashboard.vendas}
          vendasPorMes={props.dashboard.vendasPorMes}
        />
      </Layout>
    </div>
  );
};

export async function getStaticProps(context) {
  const service = useDashboardService();
  const dashboard: DashboardData = await service.get();

  return {
    props: {
      dashboard,
    },
    revalidate: 5,
  };
}

export default Home;
